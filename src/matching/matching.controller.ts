import {
  Controller,
  Get,
  Post,
  Put,
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
import { AuthRequest, StateRequest, UserLetter } from '../type/request.type';
import { MatchingService } from './matching.service';
import { UserService } from '../user/user.service';
import { MyInfoService } from 'src/my-info/my-info.service';
import { isAfter } from 'date-fns';
import { FeedbackDto } from './dto/feedback.dto';
import { TargetingService } from 'src/targeting/targeting.service';
import { isWithinInterval, subDays, format, isBefore } from 'date-fns';
import { getTargetDataSample } from './response_example/getTargetData';
import { sendSensSms } from '../utils/sensAuth';
import { sendMessage as Discord } from '../utils/discord';
import { sendLMS } from 'src/utils/NCPSens';

@ApiTags('매칭')
@ApiSecurity('access')
@Controller('api/matching')
export class MatchingController {
  constructor(
    private readonly targetingService: TargetingService,
    private readonly matchingService: MatchingService,
    private readonly userService: UserService,
    private readonly myInfoService: MyInfoService,
  ) {}

  @Get('/status')
  @ApiOperation({
    summary: '매칭 상태 조회',
  })
  @ApiOkResponse({
    description:
      '본인 정보 입력여부 확인 및 본인 / 상대방 선택여부에 따른 매칭 상태 조회',
    schema: {
      example: {
        statusCode: 200,
        message: {
          '본인 미선택 / 상대방 미선택': {
            message: 'matching_selection',
          },
          '본인 선택 / 상대방 미선택': {
            message: 'matching_success',
          },
          '본인 선택 / 상대방 선택': {
            message: 'matching_waiting',
          },
          '그 외': {
            message: 'matching_failure',
          },
        },
        data: {
          '유저 상태 0: 최초가입 1: 심사반려 (영구) 2: 반려수정 3: 통과수정 4: 가입완료':
            {
              verificationStatus: 4,
            },
          '유저 입력 상태 0: 미충족 1: 수정 필요 2: 입력 완료': {
            userInput: {
              lifestyle: 0,
              personality: 1,
              values: 2,
              appearance: 1,
              datingstyle: 1,
            },
          },
          '타겟 입력 상태 (입력하지 않을 경우 null, 입력할 경우 해당 형태로 반환)':
            {
              targetInput: {
                jobType: null,
                salary: {
                  data: [1, 2, 3],
                  priority: 1,
                },
              },
            },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '매칭 대기',
    schema: {
      example: {
        statusCode: 404,
        message: '조회된 매칭 데이터가 없습니다.',
        error: '조회된 매칭 데이터가 없습니다.',
      },
    },
  })
  @UseGuards(AuthGuard)
  async getMatchingByUserId(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const gender = req.user.gender;

      let msg = 'ERROR';

      /** *****************************************************
       *                   승급심사 확인 로직
       ********************************************************
       */
      const userData = await this.userService.getUserMe(userId);
      // 0: 승급미신청, 1:승급대기중, 2:승급반려, 3:승급영구반려, 4:승급완료
      switch (userData.verification?.status) {
        case 4:
          // 승급 완이므로 다음 로직으로 넘어감
          break;
        case 3:
          // 승급 영구 반려자
          msg = 'PROMOTION_REJECTED_PERMANENT';
          break;
        case 2:
          // 승급 반려자
          msg = 'PROMOTION_REJECTED';
          break;
        case 1:
          // 승급 대기자
          msg = 'PROMOTION_WAITING';
          break;
        case 0:
          // 승급 미신청자
          msg = 'PROMOTION_NEED';
          break;
        default:
          // TODO: 에러처리 필요
          msg = 'ERROR';
          break;
      }
      if (msg !== 'ERROR') {
        // 승급 미신청자, 승급 대기자, 승급 반려자, 승급 영구 반려자의 경우 다음 로직으로 넘어가지 않음
        return res.status(successCode.OK).json({
          statusCode: successCode.OK,
          message: msg,
        });
      }

      /** *****************************************************
       *                    휴면 확인 로직
       ********************************************************
       */
      if (userData.dateDormancy) {
        // 휴면 상태
        return res.status(successCode.OK).json({
          statusCode: successCode.OK,
          message: 'DORMANCY',
        });
      }

      /** *****************************************************
       *                    매칭신청서 확인 로직
       ********************************************************
       */
      const meFillStatus = {
        lifestyle: userData.lifestyle?.fillStatus,
        personality: userData.personality?.fillStatus,
        values: userData.values?.fillStatus,
        appearance: userData.appearance?.fillStatus,
        datingstyle: userData.datingstyle?.fillStatus,
      };
      const targetingFillStatus =
        await this.targetingService.getTargetingFillStatusByUserId(userId);

      const isMeNeeded = Object.keys(meFillStatus).some((key) => {
        return meFillStatus[key] < 1 || meFillStatus[key] === undefined;
      });
      // TODO user.letter << prisma.JsonValue 라는 특수한 타입으로 되어 있어 강제 형변환
      const userLetter: UserLetter[] =
        userData.letter as unknown as UserLetter[];

      const isTargetingNeeded = targetingFillStatus < 1;
      const activeLetter = userLetter.filter((item) => {
        return item?.status > 0;
      });
      const isLetterNeeded = activeLetter.length < 1;
      const isMeComplete = Object.keys(meFillStatus).every((key) => {
        return meFillStatus[key] >= 2;
      });
      const fillStatusData = {
        me: !isMeNeeded,
        meComplete: isMeComplete,
        targeting: !isTargetingNeeded,
        letter: !isLetterNeeded,
        letterComplete: activeLetter.length >= 3,
        salary: userData.promotion.salary ? true : false,
      };
      // 매칭신청서 미제출
      if (isMeNeeded || isTargetingNeeded || isLetterNeeded) {
        return res.status(successCode.OK).json({
          statusCode: successCode.OK,
          message: 'APPLICATION_NEED',
          ...fillStatusData,
        });
      }

      /** *****************************************************
       *                    매칭 확인 로직
       ********************************************************
       */
      const userActiveMatchings =
        await this.matchingService.getUserActiveMatchings(userId, gender);
      if (userActiveMatchings.length <= 0) {
        // 매칭 대기 중
        return res.status(successCode.OK).json({
          statusCode: successCode.OK,
          message: 'MATCHING_WAITING',
          ...fillStatusData,
        });
      }
      // console.log(userActiveMatchings);
      // TODO: 현재는 하나의 매칭만을 기준으로 함, 추후에는 여러개의 매칭을 기준으로 해야함
      let meChoice: number;
      let targetChoice: number;
      if (gender === false) {
        meChoice = userActiveMatchings[0].fChoice;
        targetChoice = userActiveMatchings[0].mChoice;
      } else {
        meChoice = userActiveMatchings[0].mChoice;
        targetChoice = userActiveMatchings[0].fChoice;
      }
      console.log(meChoice, targetChoice)
      switch (meChoice) {
        case 0:
          // 매칭 미선택
          msg = 'MATCHING_CHOICE';
          break;
        case -1:
          // 매칭 미성사
          msg = 'MATCHING_FAILURE';
          break;
        case 1:
          if (targetChoice > 0) {
            // 매칭 성사
            msg = 'MATCHING_SUCCESS';
            break;
          }
          if (targetChoice < 0) {
            msg = 'MATCHING_FAILURE';
            break;
          }
          // 매칭 대기
          msg = 'MATCHING_TARGET_WAITING';
          break;
        default:
          // TODO: 에러처리 필요
          msg = 'ERROR';
          break;
      }

      return res.status(successCode.OK).json({
        statusCode: successCode.OK,
        message: msg,
        ...fillStatusData,
      });
    } catch (err) {
      throw err;
    }
  }

  @Get('/list')
  @ApiOperation({
    summary: '모든 횔상화 매칭 조회',
  })
  @ApiOkResponse({
    description: '타겟 정보 조회',
    schema: {
      example: {
        statusCode: 200,
        message: 'Find Success',
        data: [
          {
            gender: false,
            nickname: '우진진진진',
            birthYear: 1999,
            residence: '인천',
            job_type: 'Test',
            deadline: new Date(),
          },
        ],
      },
    },
  })
  @UseGuards(AuthGuard)
  async getTargetInfo(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const gender = req.user.gender;
      const phase = req.state.phase;

      const matchingData = await this.matchingService.getUserActiveMatchings(
        userId,
        gender,
        true,
      );
      const resultData = [...matchingData];
      res
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

  @Get('/details/:matchingId')
  @ApiOperation({
    summary: '상대 유저 상세정보 조회 (매칭 or 성사 프로필 상세보기)',
  })
  @ApiParam({
    name: 'matchingId',
    description: '매칭 id',
    required: true,
    schema: {
      type: 'string',
      example: '65b4eebfd46a86fb606ab50e',
    },
  })
  @ApiOkResponse(getTargetDataSample)
  @UseGuards(AuthGuard)
  async getTargetData(
    @Req() req: AuthRequest & StateRequest,
    @Res() res: Response,
    @Param('matchingId') matchingId: string,
  ) {
    try {
      const userId = req.user.userId;
      const userGender = req.user.gender;
      if (
        matchingId === undefined ||
        matchingId === null ||
        matchingId === ''
      ) {
        throw new BadRequestException('matching-id 헤더를 입력해주세요.');
      } else {
        matchingId = String(matchingId);
      }
      const { targetId, targetChoice, meChoice, deadline } =
        await this.matchingService.getMatchingDataByMatchingId(
          matchingId,
          userGender,
        );
      if (!deadline || !isBefore(new Date(), deadline)) {
        throw new ForbiddenException('조회 가능한 매칭이 아닙니다.');
      }

      // 선택된 기본 반영 조건, 1순위, 2순위, 3순위 조건만 필터링 해서 보여줌
      const fillteredTargetUserData =
        await this.matchingService.getTargetUserDataBySelectedTargetingOption(
          userId,
          targetId,
        );

      const isMatchingSuccess = meChoice > 0 && targetChoice > 0;
      if (!isMatchingSuccess) {
        fillteredTargetUserData['kakaoId'] = null;
      }

      return res.status(successCode.OK).json({
        userId: userId,
        matchingId: matchingId,
        ...fillteredTargetUserData,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Put(':choice/:matchingId')
  @ApiOperation({
    summary: '매칭 선택',
  })
  @ApiParam({
    name: 'choice',
    description: '매칭 선택 여부',
    required: true,
    schema: {
      type: 'boolean',
      example: true,
    },
  })
  @ApiParam({
    name: 'matchingId',
    description: '매칭 id',
    required: true,
    schema: {
      type: 'string',
      example: '65b4eebfd46a86fb606ab50e',
    },
  })
  @ApiOkResponse({
    description: '매칭 선택',
    schema: {
      example: {
        statusCode: 200,
        message: 'Update Success',
      },
    },
  })
  @UseGuards(AuthGuard)
  async patchMatchingChoice(
    @Req() req: AuthRequest & StateRequest,
    @Res() res: Response,
    @Param('choice') choice: boolean,
    @Param('matchingId') matchingId: string,
  ) {
    try {
      const userId = req.user.userId;
      const userGender = req.user.gender;
      if (
        typeof choice !== 'boolean' ||
        matchingId === undefined ||
        matchingId === null ||
        matchingId === ''
      ) {
        throw new BadRequestException('올바른 파라미터를 입력해주세요.');
      } else {
        matchingId = String(matchingId);
        choice = Boolean(choice);
      }

      const { targetChoice, meChoice } =
        await this.matchingService.getMatchingDataByMatchingId(
          matchingId,
          userGender,
        );
      // 이미 선택된 경우
      if (meChoice !== 0) {
        return res.status(successCode.OK).json({});
      }

      const matchingData =
        await this.matchingService.updateMatchingChoiceByMatchingIdAndGender(
          matchingId,
          choice ? 1 : -1,
          userGender,
        );
      const { fChoice, mChoice, femaleId, maleId } = matchingData;

      if (fChoice > 0 && mChoice > 0 && process.env.NODE_ENV === 'deployment') {
        // 성사 로직
        try {
          await this.userService.decreaseTicket(femaleId);
          await this.userService.decreaseTicket(maleId);

          await this.myInfoService.updateUserToDormant(femaleId, true);
          await this.myInfoService.updateUserToDormant(maleId, true);
        } catch (err) {}
        const { mobileNumber: fMobileNumber } =
          await this.userService.getUserMe(femaleId);
        const { mobileNumber: mMobileNumber } =
          await this.userService.getUserMe(maleId);
        const res = await sendSensSms(fMobileNumber, mMobileNumber);
        if (!(res.status >= 200 && res.status < 300)) {
          console.error('성사 문자 전송 실패');
        }
      }

      return res.status(successCode.OK).json({
        statusCode: successCode.OK,
        message: successMessage.UPDATE_POST_SUCCESS,
      });
    } catch (err) {
      throw err;
    }
  }

  @Get(':type')
  @ApiOperation({
    summary: '매칭 신청서 완성 관측',
  })
  @ApiParam({
    name: 'type',
    description: '매칭 시작 or 종료',
    required: true,
    examples: {
      start: {
        value: 'start',
      },
      end: {
        value: 'end',
      },
    },
  })
  @UseGuards(AuthGuard)
  async getMatching(
    @Req() req: AuthRequest & StateRequest,
    @Res() res: Response,
    @Param('type') type: 'start' | 'end',
  ) {
    try {
      const userId = req.user.userId;
      const gender = req.user.gender;


      const { mobileNumber, integration } =
        await this.userService.getUserMe(userId);

      // 신청서 작성 완료시 문자 보내는 로직
      if (type === 'end' && process.env.NODE_ENV === 'deployment') {
        const nonFripMsg = `매칭신청서가 정상적으로 제출되었습니다. 정성스런 편지 프로필 감사드려요:)

이제 정말 마지막 단계에요!

안전한 매칭을 위해서는 최소한의 검증이 필요합니다. 아래 링크에서 직장/직업과 신분을 인증해주세요. (제출해주신 자료는 모두 확인 즉시, 삭제됩니다.)

[사전 검증 링크]
https://...

사전 검증 완료 이후 횟수권까지 구매해주시면, “영업일 1일 이내” 순차적으로 매칭이 시작되어요! 

[횟수권 구매 링크]
https://...

[ONLYou 가이드]
https://...`;
        const fripMsg = `매칭신청서가 정상적으로 제출되었습니다. 정성스런 편지 프로필 감사드려요:)

이제 정말 마지막 단계에요!

안전한 매칭을 위해서는 최소한의 검증이 필요합니다. 아래 링크에서 직장/직업과 신분을 인증해주세요. (제출해주신 자료는 모두 확인 즉시, 삭제됩니다.)

[사전 검증 링크]
https://...

사전 검증이 완료되면 “영업일 1일 이내” 순차적으로 매칭이 시작되어요! 
조금만 기다려주세요 ㅎㅎ

[ONLYou 가이드]
https://... 
        `;

        const res = await sendLMS(
          mobileNumber,
          integration === 'frip' ? fripMsg : nonFripMsg,
        );
        if (!(res.status >= 200 && res.status < 300)) {
          console.error('매칭신청서 문자 전송 실패');
        }
      }
      await Discord(
        `[${type === 'start' ? '시작' : '종료'}] - ${userId} (${
          gender ? '남' : '여'
        })\n${new Date().toLocaleString()}`,
        process.env.DISCORD_APPLICATION_COMPLETE_WEBHOOK_URL,
      );
    } catch (err) {}
    res.status(successCode.OK).json({});
  }
}