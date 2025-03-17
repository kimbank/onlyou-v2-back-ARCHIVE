import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  Put,
} from '@nestjs/common';
import { TargetingService } from './targeting.service';
import { UpdateTargetDto } from './dto/updateTargetDto';
import {
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest, StateRequest } from '../type/request.type';
import { Response } from 'express';
import {
  SuccessData,
  successCode,
  successMessage,
} from '../middlewares/error.middleware';
import { myTargetingDataExample } from './targeting.swagger';
import { TargetingValidationPipe } from './targeting.pipe';

@ApiTags('타겟팅')
@ApiSecurity('access')
@Controller('api/targeting')
export class TargetingController {
  constructor(private readonly targetingService: TargetingService) {}

  @Get()
  @ApiOperation({
    summary: '매칭 신청서 타겟 정보 조회',
  })
  @ApiOkResponse({
    description: '내 정보',
    schema: {
      example: myTargetingDataExample,
    },
  })
  @UseGuards(AuthGuard)
  async getValues(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
  ) {
    try {
      const userId = req.user.userId;

      const resultData =
        await this.targetingService.getTargetingByUserId(userId);

      return res
        .status(successCode.OK)
        .json(
          SuccessData(
            successCode.OK,
            successMessage.READ_POST_SUCCESS,
            resultData,
          ),
        );
    } catch (err) {
      throw err;
    }
  }

  @Put()
  @ApiOperation({
    summary: '매칭 신청서 타겟 정보 업데이트',
  })
  @UseGuards(AuthGuard)
  async patchAllTargets(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
    @Body(new TargetingValidationPipe())
    values: UpdateTargetDto,
  ) {
    try {
      const userId = req.user.userId;
      const result = await this.targetingService.patchAllTargets(
        userId,
        values,
      );

      return res
        .status(successCode.OK)
        .json(
          SuccessData(
            successCode.OK,
            successMessage.UPDATE_POST_SUCCESS,
            result,
          ),
        );
    } catch (err) {
      throw err;
    }
  }
}
