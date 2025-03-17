import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  ValidationPipe,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { successCode } from '../middlewares/error.middleware';
import { AuthService } from '../auth/auth.service';
import { addMinutes, differenceInSeconds, isAfter, isBefore } from 'date-fns';
import { sendAuthCode } from '../utils/sensAuth';
import { AuthRequest } from '../type/request.type';
import { appConfig, authConfig } from 'src/config/env.config';
import { UserSendCodeDto, UserVerifyCodeDto } from './dto/auth.dto';
import {
  sendAuthCode as Discord,
  sendUserAuthCodeDiscord,
} from 'src/utils/discord';

@ApiTags('로그인')
@Controller('api/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '인증번호 전송 요청',
  })
  @ApiOkResponse({
    description: '로그인할 수 있도록 인증번호 요청 api',
    schema: {
      example: {
        '유효한 인증번호가 없을 시': {
          message:
            '인증번호가 발송되었습니다. 유효시간은 ${timeLeft} 남았습니다.',
        },
        '유효한 인증번호가 이미 있을 시': {
          message:
            '이미 요청하신 인증번호가 있습니다. 유효시간은 ${timeLeft} 남았습니다.',
        },
      },
    },
  })
  @Post('/send')
  async sendAuthCode(
    @Body(ValidationPipe) authInfo: UserSendCodeDto,
    @Req()
    req: AuthRequest,
    @Res()
    res: Response,
  ) {
    try {
      if (authInfo.code === '000000') {
        // 인증 요청 된 mobile_nubmer 로 auth_sens 테이블 조회
        const authCodeData = await this.authService.getAuthCode(
          authInfo.mobileNumber,
        );

        if (authCodeData.user && authCodeData.user.dateAuthBlock) {
          throw new ForbiddenException('AUTH_BLOCKED');
        }

        const expiresInMinutes = authConfig().CODE_EXPIRATION;
        const expirationTime = addMinutes(
          authCodeData.authSens.succeedAt,
          expiresInMinutes,
        );
        const timeLeftInSeconds = differenceInSeconds(
          expirationTime,
          new Date(),
        );

        // **** 회원인 경우에만 발송 ****
        if (authCodeData.user && process.env.NODE_ENV === 'deployment') {
          const res = await sendAuthCode(
            authCodeData.authSens.mobileNumber,
            authCodeData.authSens.code,
          );
          sendUserAuthCodeDiscord(
            authCodeData.authSens.mobileNumber,
            authCodeData.authSens.code,
          );
          if (!(res.status >= 200 && res.status < 300)) {
            await this.authService.deleteAuthSens(authInfo.mobileNumber);
            throw new InternalServerErrorException('문자발송 실패');
          }
        } else if (
          authCodeData.user &&
          process.env.NODE_ENV === 'development'
        ) {
          Discord(
            authCodeData.authSens.mobileNumber,
            authCodeData.authSens.code,
          );
        }

        const message = `인증번호가 발송되었습니다. 유효시간은 ${Math.floor(
          timeLeftInSeconds < 0 ? 180 : timeLeftInSeconds,
        )}초 남았습니다.`;
        return res.status(successCode.OK).json({
          statusCode: 200,
          message: message,
          expiryTimestamp: expirationTime,
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({
    summary: '인증번호 확인 요청 및 자격증명 인가',
  })
  @ApiOkResponse({
    description: '로그인 성공여부, 5회 code불일치시 AUTH_BLOCKED',
    schema: {
      example: { message: 'AUTH_SUCCESS' },
    },
  })
  @Post('/verify')
  async verifyAuthCode(
    @Body(ValidationPipe) authInfo: UserVerifyCodeDto,
    @Req()
    req: AuthRequest,
    @Res()
    res: Response,
  ) {
    try {
      // auth_sens 테이블 조회, 인증번호 조회되지 않을 경우 서비스단에서 에러
      const authCodeData = await this.authService.getAuthBlock(
        authInfo.mobileNumber,
      );
      if (authCodeData.user.dateAuthBlock) {
        throw new ForbiddenException('AUTH_BLOCKED');
      }

      //client의 인증번호 일치 확인 요청
      // 인증 실패 5회 이상시 차단
      // TODO: 우선은 유저가 인증번호를 많이 틀렸더라도 차단하지 않는다.
      // if (authCodeData.authSens.count >= 5) {
      //   await this.authService.authBlock(
      //     authInfo.mobileNumber,
      //     authCodeData.authSens.count,
      //     'block',
      //   );
      // }
      const now = new Date();
      // succeedAt 이후 유효기간
      const expirationTime = addMinutes(
        authCodeData.authSens.succeedAt,
        authConfig().CODE_EXPIRATION,
      );
      // 입력한 인증번호가 db의 인증번호와 일치, 인증번호 유효기간 이내인 경우 토큰 생성
      if (
        authInfo.code === authCodeData.authSens.code &&
        // 토큰 생성 시간이 만료시간 이전
        isBefore(authCodeData.authSens.succeedAt, expirationTime) &&
        // 성공시간 이후
        isAfter(now, authCodeData.authSens.succeedAt) &&
        // 현재 만료시간 이전 (현재 유효기간 만료된 후면 재발급 필요)
        isBefore(now, expirationTime)
      ) {
        const ip = req.ip;
        const userAgent = req.get('User-Agent');

        const token = await this.authService.createTokens(
          authCodeData.user.id,
          authCodeData.user.gender,
          authCodeData.user.mobileNumber,
          ip,
          userAgent,
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
          const originUrl = req.headers.origin;
          const ipUrlRegex = new RegExp(
            `^http:\\/\\/\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}`,
          );
          if (
            !ipUrlRegex.test(originUrl) &&
            !originUrl.startsWith('http://localhost')
          ) {
            // 개발 배포 테스트 환경을 위한 처리
            accessOptions.domain = appConfig().DOMAIN;
            refreshOptions.domain = appConfig().DOMAIN;
          }
        }

        res
          .cookie('access', token.accessToken, accessOptions)
          .cookie('refresh', token.refreshToken, refreshOptions)
          .status(successCode.OK)
          .json({ token });
      } else {
        // 인증번호 불일치하는 경우
        const userAuthBlockResult = await this.authService.authBlock(
          authInfo.mobileNumber,
          authCodeData.authSens.count + 1,
          'count',
        );
        // 인증 실패시 count++ 후 전달
        res.status(successCode.OK).json(userAuthBlockResult);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({
    summary: '로그아웃',
  })
  @ApiOkResponse({
    description: '로그아웃 성공여부',
    schema: {
      example: { message: 'LOGOUT_SUCCESS' },
    },
  })
  @Post('/logout')
  async logout(@Res() res: Response) {
    const accessOptions: {
      expires: Date;
      httpOnly: boolean;
      domain?: string | undefined;
      secure?: boolean | undefined;
    } = {
      expires: new Date(0),
      httpOnly: true,
    };
    const refreshOptions: {
      expires: Date;
      httpOnly: boolean;
      domain?: string | undefined;
      secure?: boolean | undefined;
    } = {
      expires: new Date(0),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === 'deployment') {
      accessOptions.domain = appConfig().DOMAIN;
      refreshOptions.domain = appConfig().DOMAIN;
      accessOptions.secure = true;
      refreshOptions.secure = true;
    } else {
      // 개발 환경에서는 localhost혹은 ip로 시작하는 도메인을 제외하고 쿠키 도메인 설정
      const ipUrlRegex = new RegExp(
        `^http:\\/\\/\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}`,
      );
      const originUrl = res.req.headers.origin;
      if (
        !ipUrlRegex.test(originUrl) &&
        !originUrl.startsWith('http://localhost')
      ) {
        // 개발 배포 테스트 환경을 위한 처리
        accessOptions.domain = appConfig().DOMAIN;
        refreshOptions.domain = appConfig().DOMAIN;
      }
    }
    res
      .cookie('access', '', accessOptions)
      .cookie('refresh', '', refreshOptions);

    return res.status(successCode.OK).json({ message: 'LOGOUT_SUCCESS' });
  }
}
