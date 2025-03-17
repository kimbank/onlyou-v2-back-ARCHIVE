import {
  Controller,
  Get,
  Patch,
  Put,
  Param,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { MyInfoService } from './my-info.service';
import { UserService } from '../user/user.service';
import { MatchingService } from '../matching/matching.service';
import { AuthRequest, StateRequest } from '../type/request.type';
import { MyinfoDefaultDto } from './dto/myinfoDefault.dto';
import {
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import {
  SuccessData,
  successCode,
  successMessage,
} from '../middlewares/error.middleware';

@ApiTags('유저')
@ApiSecurity('access')
@Controller('api/user')
export class MyInfoController {
  constructor(
    private readonly myInfoService: MyInfoService,
    private readonly userService: UserService,
    private readonly matchingService: MatchingService,
  ) {}

  @Get('myinfo')
  @ApiOperation({
    summary: '회원 내정보(내정보 탭 - 프로필 카드) 조회',
  })
  @ApiOkResponse({
    description: '내 정보',
    schema: {
      example: {
        statusCode: 200,
        message: 'Find Success',
        data: {
          nickname: 'test',
          jobType: 'Test',
          residence: '인천',
          dateBirth: 1998,
          education: '전문대',
          dormant: null,
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  async getUserInfo(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const userData = await this.userService.getUserMe(userId);

      let photo = null;
      if (userData.photo.length > 0) {
        photo = userData.photo[0].url;
      }

      const resultData = {
        nickname: userData.nickname,
        jobGroup: userData.promotion.jobGroup, // 직업
        residence: userData.residence,
        birthYear: userData.birthYear,
        education: userData.promotion?.education || null, // 최종 학력
        dormant: userData.dateDormancy,
        photo: photo,

        jobType: userData.promotion.jobType, // 직장 유형
        jobName: userData.promotion.jobName, // 직장 명
        universityName: userData.promotion.universityName, // 대학 명
        divorce: userData.promotion.divorce, // 결혼 경력
        salary: userData.promotion.salary, // 연봉
        height: userData.promotion.height, // 키

        badge: userData.badge,
        integration: userData.integration,
        ticket: userData.ticket,
        manner: userData.manner,
      };
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

  @Get('myinfo/details')
  @ApiOperation({
    summary: '회원 내정보(내정보 탭 - 상세정보) 조회',
  })
  @UseGuards(AuthGuard)
  async getUserDetails(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const filteredUserData =
        await this.myInfoService.getTargetUserDataBySelectedTargetingOption(
          userId,
          userId,
        );
        // await this.matchingService.getTargetUserDataBySelectedTargetingOption(
        //   userId,
        //   userId,
        // );
      return res.status(successCode.OK).json({
        userId: userId,
        ...filteredUserData,
      });
    } catch (err) {
      throw err;
    }
  }

  @Put('myinfo/default')
  @ApiOperation({
    summary: '회원 내정보(내 정보 수정하기 - 기본 탭) 수정',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        residence: {
          type: 'number',
          example: 7,
        },
        salary: {
          type: 'number',
          example: 2,
        },
        visibilityUniversityName: {
          type: 'boolean',
          example: false,
        },
        visibilityJobName: {
          type: 'boolean',
          example: false,
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  async updateUserDetails(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
    @Body(ValidationPipe) myinfoDefaultBody: MyinfoDefaultDto,
  ) {
    try {
      const userId = req.user.userId;
      const { promotion /*, visibility*/ } =
        await this.userService.getUserMe(userId);
      const newPromotion = {
        ...promotion,
        salary: myinfoDefaultBody.salary,
      };

      const updateUserMyinfoDefault =
        await this.myInfoService.updateMyinfoDefault(
          userId,
          myinfoDefaultBody.residence,
          newPromotion,
          // newVisibility,
        );

      return res.status(successCode.OK).json({
        userId: userId,
        successCode: updateUserMyinfoDefault ? '200' : '400',
      });
    } catch (err) {
      throw err;
    }
  }

  // TODO 추후 admin 서버 생길경우 분리?
  @Patch('/dormant/:status')
  @ApiOperation({
    summary: '유저 휴면 처리/해제',
  })
  @ApiOkResponse({
    description: '내 정보',
    schema: {
      example: {
        'status : true': {
          statusCode: 201,
          message: '휴면 처리 완료되었습니다.',
          data: 'Sun Dec 17 2023 22:26:33 GMT+0900 (대한민국 표준시)',
        },
        'status : false': {
          statusCode: 201,
          message: '휴면 해제 완료되었습니다.',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  async getUserDormantInfo(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
    @Param('status')
    status: boolean,
  ) {
    try {
      const userId = req.user.userId;
      const userDormantDate = await this.myInfoService.updateUserToDormant(
        userId,
        status,
      );

      if (!userDormantDate) {
        return res
          .status(successCode.CREATED)
          .json(SuccessData(successCode.CREATED, '휴면 해제 완료되었습니다.'));
      } else {
        return res
          .status(successCode.CREATED)
          .json(
            SuccessData(
              successCode.CREATED,
              '휴면 처리 완료되었습니다.',
              userDormantDate.toLocaleString(),
            ),
          );
      }
    } catch (err) {
      throw err;
    }
  }
}
