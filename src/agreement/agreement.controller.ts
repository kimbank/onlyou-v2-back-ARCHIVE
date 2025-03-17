import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Res,
  Req,
  UseGuards,
  NotAcceptableException,
  BadRequestException,
  ForbiddenException,
  Param,
  Headers,
} from '@nestjs/common';
import {
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  CommonError,
  SuccessData,
  errorCode,
  errorMessage,
  successCode,
  successMessage,
} from '../middlewares/error.middleware';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest, StateRequest } from '../type/request.type';
import { AgreementService } from './agreement.service';
import { UserService } from '../user/user.service';
import { MatchingService } from '../matching/matching.service';

@ApiTags('성사')
@ApiSecurity('access')
@Controller('api/agreement')
export class AgreementController {
  constructor(
    private readonly agreementService: AgreementService,
    private readonly userService: UserService,
    private readonly matchingService: MatchingService,
  ) {}

  @Get('/list')
  @ApiOperation({ summary: '성사 리스트' })
  @ApiOkResponse({
    description: '성사 리스트',
  })
  @UseGuards(AuthGuard)
  async getAgreementsByUserId(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const userGender = req.user.gender;
      const agreements =
        await this.agreementService.getAgreementsByUserIdAndGender(
          userId,
          userGender,
        );

      return res.status(200).json({
        statusCode: successCode.OK,
        agreementList: agreements,
      });
    } catch (err) {
      throw err;
    }
  }

  @Get('/details/:matchingId')
  @ApiParam({
    name: 'matchingId',
    description: '매칭 아이디',
    required: true,
    schema: {
      type: 'string',
      example: '65b4eebfd46a86fb606ab50e',
    },
  })
  @ApiOperation({ summary: '성사' })
  @ApiOkResponse({
    description: '성사 상세',
  })
  @ApiOkResponse({
    description: '성사 - 상대 정보 상세 보기',
  })
  @UseGuards(AuthGuard)
  async getAgreementTargetDetails(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
    @Param('matchingId')
    matchingId: string,
  ) {
    try {
      const userId = req.user.userId;
      const userGender = req.user.gender;

      const { targetId, targetChoice, meChoice, deadline } =
        await this.agreementService.getActiveAgreementsByUserIdAndGender(
          matchingId,
          userGender,
        );
      if (targetChoice < 0 || meChoice < 0) {
        throw new CommonError(
          errorCode.BAD_REQUEST,
          errorMessage.BAD_REQUEST,
          'no matching',
        );
      }

      const { kakaoId, ...fillteredTargetUserData } =
        await this.matchingService.getTargetUserDataBySelectedTargetingOption(
          userId,
          targetId,
        );
      return res.status(200).json({
        statusCode: successCode.OK,
        matchingId: matchingId,
        ...fillteredTargetUserData,
      });
    } catch (err) {
      throw err;
    }
  }
}
