import {
  Controller,
  Post,
  Param,
  Res,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CronService } from './cron.service';
import * as script from '../utils/messageScript';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SuccessData, successCode } from 'src/middlewares/error.middleware';
import axios from 'axios';
import { appConfig } from 'src/config/env.config';
import { StateRequest } from 'src/type/request.type';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Cron Jobs')
@Controller('api/cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post('/matching/promptDecision/:type')
  @ApiOperation({
    summary: '매칭 미선택 유저 선택 독려 문자알림 api',
  })
  @ApiParam({
    name: 'type',
    description:
      '"common", "mnfr", "mnfa", "fnmr", "fnma", "dormant" 중에 입력 가능합니다.',
    examples: {
      common: {
        summary: '[기간 내]남성 미선택 / 여성 미선택',
        value: 'common',
      },
      mnfr: {
        summary: '[기간 내]남성 미선택 / 여성 거절',
        value: 'mnfr',
      },
      mnfa: {
        summary: '[기간 내]남성 미선택 / 여성 수락',
        value: 'mnfa',
      },
      fnmr: {
        summary: '[기간 내]여성 미선택 / 남성 거절',
        value: 'fnmr',
      },
      fnma: {
        summary: '[기간 내]여성 미선택 / 남성 수락',
        value: 'fnma',
      },

      md: { summary: '[기간 외] 남성 미선택 (휴면)', value: 'md' },
      fd: { summary: '[기간 외] 여성 미선택 (휴면)', value: 'fd' },
    },
  })
  @UseGuards(AuthGuard)
  async sendMessage(
    @Param('type')
    type: 'common' | 'mnfr' | 'mnfa' | 'md' | 'fnmr' | 'fnma' | 'fd',

    @Req()
    req: StateRequest,
    @Res() res: Response,
  ) {
    try {
      let sendCount = 0;
      if (
        type !== 'common' &&
        type !== 'mnfr' &&
        type !== 'mnfa' &&
        type !== 'md' &&
        type !== 'fnmr' &&
        type !== 'fnma' &&
        type !== 'fd'
      ) {
        throw new BadRequestException('정확한 구분으로만 입력이 가능합니다.');
      }
      const phase = req.state.phase;
      const mobileNumbers = await this.cronService.getUserMobileNumbersByType(
        phase,
        type,
      );
      let message: string;
      let title: string;
      if (type === 'common') {
        message = script.NonSelectScript.commonMessage();
        title = '[본인 미선택 / 이성 미선택]';
      } else if (type === 'mnfr') {
        message = script.NonSelectScript.commonMessage();
        title = '[남성 미선택 / 이성 거절]';
      } else if (type === 'mnfa') {
        message = script.NonSelectScript.targetAlreadyOkMessage();
        title = '[남성 미선택 / 이성 수락]';
      } else if (type === 'md') {
        message = script.NonSelectScript.getDormantMessage();
        title = '[남성 미선택 휴면]';
      } else if (type === 'fnmr') {
        message = script.NonSelectScript.commonMessage();
        title = '[여성 미선택 / 남성 거절]';
      } else if (type === 'fnma') {
        message = script.NonSelectScript.targetAlreadyOkMessage();
        title = '[여성 미선택 / 남성 수락]';
      } else if (type === 'fd') {
        message = script.NonSelectScript.getDormantMessage();
        title = '[여성 미선택 휴면]';
      }
      // TODO 디스코드 ******
      await axios.post(appConfig().DISCORD_WEBHOOK_URL, {
        content: `${title}`,
      });
      for (const mobileNumber of mobileNumbers) {
        try {
          await this.cronService.sendMessage(mobileNumber, message);
          sendCount++;
          // TODO 디스코드 ******
          await axios.post(appConfig().DISCORD_WEBHOOK_URL, {
            content: `번호: ${mobileNumber} ${sendCount}명 발송완료`,
          });
        } catch (err) {
          console.error(`에러 발생: ${err.message}, ${sendCount}명 전송 완료`);
        }
      }
      // TODO 디스코드 ******
      await axios.post(appConfig().DISCORD_WEBHOOK_URL, {
        content: `결과 : ${title} 전체 ${sendCount}명 발송완료`,
      });
      return res
        .status(successCode.OK)
        .json(SuccessData(successCode.OK, `${title} ${sendCount}명 전송 완료`));
    } catch (err) {
      throw err;
    }
  }

  @Post('/user/wakeDormant')
  @ApiOperation({
    summary: '휴면 유저 깨우기 문자알림 api (미구현)',
  })
  async sendAllMessage(@Res() res: Response) {
    try {
      return res
        .status(successCode.OK)
        .json(SuccessData(successCode.OK, `구현이 필요합니다.`));
    } catch (err) {
      throw err;
    }
  }
}
