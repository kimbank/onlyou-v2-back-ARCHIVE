import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { format } from 'date-fns';
import { Request, Response } from 'express';
import { AuthRequest } from './type/request.type';
import { AuthGuard } from './auth/auth.guard';
import {
  SuccessData,
  successCode,
  successMessage,
} from './middlewares/error.middleware';
import { AppService } from './app.service';

@ApiTags('테스트')
@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: '헬스 체크 (정상 작동 확인)',
  })
  async health(@Req() req: Request, @Res() res: Response) {
    const currentTime = new Date();
    const formattedTime = format(currentTime, 'yyyy.MM.dd HH:mm:ss');

    console.log(req.ip);

    res.status(successCode.OK).send(`Notification API (UTC: ${formattedTime})`);
  }
  @Get('token')
  @ApiOperation({
    summary: '토큰 검증 테스트',
  })
  @UseGuards(AuthGuard)
  async verifyToken(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const token = req.user;
      res
        .status(successCode.OK)
        .send(
          SuccessData(successCode.OK, successMessage.READ_POST_SUCCESS, token),
        );
    } catch (error) {
      throw error;
    }
  }

  @Get('code/:gender')
  @ApiOperation({
    summary: '테스트 계정 인증번호 조회',
  })
  @ApiParam({
    name: 'gender',
    description: '성별',
    enum: ['male', 'female'],
  })
  // @UseGuards(AuthGuard)
  async getCode(
    @Res() res: Response,
    @Param('gender') gender: 'male' | 'female',
  ) {
    try {
      const code = await this.appService.getCode(gender);
      res
        .status(successCode.OK)
        .send(
          SuccessData(successCode.OK, successMessage.READ_POST_SUCCESS, code),
        );
    } catch (error) {
      throw error;
    }
  }
}
