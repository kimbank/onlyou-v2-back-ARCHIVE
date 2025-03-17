import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { authConfig } from '../config/env.config';
import { user, PrismaClient } from '@prisma/client';
import { addMinutes, differenceInSeconds, isAfter, isBefore } from 'date-fns';
import {
  CommonError,
  SensError,
  errorCode,
  errorMessage,
} from '../middlewares/error.middleware';
import { generateVerificationCode, sendAuthCode } from '../utils/sensAuth';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async getAuthCode(phone: string) {
    try {
      const user = await this.authRepository.getUserByPhone(phone);
      // TODO: 우선은 없는 유저에 대해서는 에러를 던지도록 하였으나, 추후에는 보내는 것으로 변경해야 함 (인증 후에 가입해야함을 알리기)
      if (!user) {
        throw new NotFoundException('관리자에게 문의하세요.');
      }
      let authSens = await this.authRepository.getAuthSensByPhone(phone);
      const now = new Date();
      //   기존 인증번호 내역 없는 경우
      if (!authSens) {
        const newCode = generateVerificationCode();
        authSens = await this.authRepository.createAuthSens(
          phone,
          newCode,
          now,
        );
        // 첫 로그인 시도
        return { authSens, user };
      } else {
        const expirationTime = addMinutes(
          authSens.succeedAt,
          authConfig().CODE_EXPIRATION,
        );
        // 인증번호 생성시각이 expirationTime이 지난 경우
        if (isBefore(expirationTime, now)) {
          const newCode = generateVerificationCode();

          // 인증번호 업데이트
          authSens = await this.authRepository.updateAuthCode(
            phone,
            newCode,
            now,
          );
        } else if (
          // 인증번호 생성 시각이 expirationTime 이전,
          // 현재 시간이 인증번호 생성 시각과 expirationTime 사이
          isBefore(authSens.succeedAt, expirationTime) &&
          isAfter(now, authSens.succeedAt)
        ) {
          const timeLeftInSeconds = differenceInSeconds(
            expirationTime,
            new Date(),
          );
          throw new SensError(
            errorCode.CONFLICT,
            `이미 요청하신 인증번호가 있습니다. 인증번호 유효시간은 ${Math.floor(
              timeLeftInSeconds,
            )}초 남았습니다.`,
            expirationTime,
          );
        }
      }
      if (isAfter(authSens.succeedAt, new Date())) {
        throw new CommonError(
          errorCode.FORBIDDEN,
          errorMessage.FORBIDDEN,
          'Auth code is not available.',
        );
      }
      return { authSens, user };
    } catch (error) {
      throw error;
    }
  }

  async deleteAuthSens(phone: string) {
    try {
      const authSens = await this.authRepository.deleteAuthSens(phone);
      return authSens;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createTokens(
    userId: string,
    gender: boolean,
    phone: string,
    ip: string,
    userAgent: string,
  ) {
    try {
      const accessTokenPayload = { id: userId.toString(), gender };
      const refreshTokenPayload = { gender };
      const accessToken = jwt.sign(
        accessTokenPayload,
        authConfig().ACCESS_JWT_SECRET,
        {
          expiresIn: authConfig().ACCESS_JWT_EXPIRATION,
          audience: 'onlyou',
          issuer: 'test',
        },
      );
      const refreshToken = jwt.sign(
        refreshTokenPayload,
        authConfig().REFRESH_JWT_SECRET,
        {
          expiresIn: authConfig().REFRESH_JWT_EXPIRATION,
          audience: 'onlyou',
          issuer: 'test',
        },
      );
      await this.authRepository.upsertSession(
        userId,
        refreshToken,
        ip,
        userAgent,
        phone,
      );
      return { accessToken, refreshToken };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateTokens(
    id: string,
    gender: boolean,
    ip: string,
    userAgent: string,
  ) {
    try {
      const accessTokenPayload = { id: id.toString(), gender };
      const refreshTokenPayload = { gender };
      const newAccessToken = jwt.sign(
        accessTokenPayload,
        authConfig().ACCESS_JWT_SECRET,
        {
          expiresIn: authConfig().ACCESS_JWT_EXPIRATION,
          audience: 'onlyou',
          issuer: 'test',
        },
      );
      const newRefreshToken = jwt.sign(
        refreshTokenPayload,
        authConfig().REFRESH_JWT_SECRET,
        {
          expiresIn: authConfig().REFRESH_JWT_EXPIRATION,
          audience: 'onlyou',
          issuer: 'test',
        },
      );
      await this.authRepository.upsertSession(
        id,
        newRefreshToken,
        ip,
        userAgent,
      );

      return { newAccessToken, newRefreshToken };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getAuthBlock(phone: string) {
    try {
      const authSens = await this.authRepository.getAuthSensByPhone(phone);
      const user = await this.authRepository.getUserByPhone(phone);
      if (!user) {
        return { authSens };
      } else return { authSens, user };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async authBlock(phone: string, count: number, type: string) {
    try {
      const user = await this.authRepository.getUserByPhone(phone);
      if (!user) {
        throw new NotFoundException('회원정보가 없습니다.');
      }
      if (type === 'count') {
        await this.authRepository.updateAuthCount(phone, count);
        return { message: `TRY_LEFT ${5 - count}` };
      } else if (type === 'block') {
        await this.authRepository.updateAuthBlock(phone, new Date());
        throw new ForbiddenException('AUTH_BLOCKED');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async verify(jwtString: string, secret: string, type: string) {
    try {
      if (type === 'refresh') {
        const sessionData = await this.authRepository.getSession(jwtString);
        if (!sessionData) {
          throw new UnauthorizedException('인증 정보가 없습니다.');
        }

        const payload = jwt.verify(jwtString, secret, {
          algorithms: ['HS256'],
        }) as jwt.JwtPayload & user;
        const { gender } = payload;
        return {
          userId: sessionData.userId,
          gender,
        };
      } else {
        const payload = jwt.verify(jwtString, secret, {
          algorithms: ['HS256'],
        }) as jwt.JwtPayload & user;
        const { id, gender } = payload;
        return {
          userId: id,
          gender,
        };
      }
    } catch (err) {
      console.error(err);
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Token invalid');
      } else {
        throw new InternalServerErrorException('UnExpected');
      }
    }
  }
}
