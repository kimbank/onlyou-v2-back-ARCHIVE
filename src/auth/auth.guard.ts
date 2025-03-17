import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from '../type/request.type';

import { appConfig, authConfig } from '../config/env.config';
import { NextFunction, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const response = context.switchToHttp().getResponse();
    const nextFunction = () => {
      return true;
    };

    try {
      await this.validateRequest(request, response, nextFunction);
      return true;
    } catch (err) {
      throw err;
    }
  }

  private async validateRequest(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.headers.cookie) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    let accessToken;
    let refreshToken;

    if (req.headers?.cookie) {
      const cookies = req.headers.cookie.split('; ');
      for (const cookie of cookies) {
        if (cookie.startsWith('access=')) {
          accessToken = cookie.substring(7);
        } else if (cookie.startsWith('refresh=')) {
          refreshToken = cookie.substring(8);
        }
      }
    }
    try {
      if (!accessToken) {
        throw new UnauthorizedException('access 토큰이 존재하지 않습니다.');
      }

      const accessSecret = authConfig().ACCESS_JWT_SECRET;
      const { userId, gender } = await this.authService.verify(
        accessToken,
        accessSecret,
        'access',
      );
      req.user = {
        userId: userId,
        gender: gender,
      } as AuthRequest;
      next();
    } catch (err) {
      if (err.message === 'Token expired') {
        throw new UnauthorizedException('만료된 access 토큰입니다.');
      }
      if (err.message === 'access 토큰이 존재하지 않습니다.') {
        try {
          if (!refreshToken) {
            throw new UnauthorizedException(
              'refresh 토큰이 존재하지 않습니다.',
            );
          }
          const refreshSecret = authConfig().REFRESH_JWT_SECRET;
          const { userId, gender } = await this.authService.verify(
            refreshToken,
            refreshSecret,
            'refresh',
          );
          const accessEnv = authConfig().ACCESS_JWT_EXPIRATION;
          const refreshEnv = authConfig().REFRESH_JWT_EXPIRATION;

          const now = new Date();
          const accessExp = new Date(now.getTime() + accessEnv * 1000);
          const refreshExp = new Date(now.getTime() + refreshEnv * 1000);

          const accessOptions: {
            expires: Date;
            httpOnly: boolean;
            domain?: string | undefined;
            secure?: boolean | undefined;
          } = {
            expires: accessExp,
            httpOnly: true,
          };

          const refreshOptions: {
            expires: Date;
            httpOnly: boolean;
            domain?: string | undefined;
            secure?: boolean | undefined;
          } = {
            expires: refreshExp,
            httpOnly: true,
          };

          if (process.env.NODE_ENV === 'deployment') {
            accessOptions.domain = appConfig().DOMAIN;
            refreshOptions.domain = appConfig().DOMAIN;
            accessOptions.secure = true;
            refreshOptions.secure = true;
          } else {
            // TODO: 재사용이 예상되면 분리할 필요가 있어보입니다.
            // 개발 환경에서는 localhost혹은 ip로 시작하는 도메인을 제외하고 쿠키 도메인 설정
            const originUrl = req.headers.host;
            const ipUrlRegex = new RegExp(
              `^http:\\/\\/\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}`,
            );
            if (
              !ipUrlRegex.test(originUrl) &&
              !originUrl.includes('localhost')
            ) {
              // 개발 배포 테스트 환경을 위한 처리
              accessOptions.domain = appConfig().DOMAIN;
              refreshOptions.domain = appConfig().DOMAIN;
            }
          }
          const ip = req.ip;
          const userAgent = req.get('User-Agent');
          const token = await this.authService.updateTokens(
            userId,
            gender,
            ip,
            userAgent,
          );
          req.user = {
            userId: userId,
            gender: gender,
          } as AuthRequest;
          res
            .cookie('access', token.newAccessToken, accessOptions)
            .cookie('refresh', token.newRefreshToken, refreshOptions)
            .status(401);
        } catch (err) {
          console.error(err);
          throw new UnauthorizedException('유효하지 않은 refresh 토큰입니다.');
        }
      } else throw new InternalServerErrorException('접근 거부');
    }
  }
}
