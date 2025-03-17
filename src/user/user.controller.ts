import {
  Controller,
  Get,
  Body,
  Param,
  Res,
  Put,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  SuccessData,
  successCode,
  successMessage,
} from '../middlewares/error.middleware';
import { AuthGuard } from '../auth/auth.guard';
import {
  AuthRequest,
  StateRequest,
  UserInfoRequest,
} from '../type/request.type';
import { MatchingService } from '../matching/matching.service';
import { getDtoByType } from './dto/getDtoByType.dto';
import {
  DynamicUserDto,
  UserAppearanceDto,
  UserDatingstyleDto,
  UserEtcDto,
  UserLetterDto,
  UserLetterListDto,
  UserLifestyleDto,
  UserPersonalityDto,
  UserPhotosDto,
  UserValuesDto,
} from './dto/user.dto';

@ApiTags('유저')
@ApiSecurity('access')
@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly matchingService: MatchingService,
  ) {}

  @Get('/matching')
  @ApiOperation({
    summary: '유저 매칭',
  })
  @UseGuards(AuthGuard)
  async getUserMatching(
    @Req()
    req: AuthRequest & StateRequest,
    @Res()
    res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const gender = req.user.gender;
      const phase = req.state.phase;

      const matchingData = await this.matchingService.getMatchingByUserId(
        userId,
        gender,
        phase,
      );

      const userData = await this.userService.getUserMe(userId);
      let resultData;
      if (gender === false) {
        resultData = {
          nickname: userData.nickname,
          matching_feedback: matchingData.mFeedback,
        };
      } else {
        resultData = {
          nickname: userData.nickname,
          matching_feedback: matchingData.fFeedback,
        };
      }

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

  @Get('/me/:type')
  @ApiOperation({
    summary: '회원 내정보(매칭신청서) 조회',
  })
  @ApiParam({
    name: 'type',
    description:
      '"lifestyle","personality","values","appearance","datingstyle","etc","letter", "photo" 중에 입력 가능합니다.',
    examples: {
      lifestyle: { summary: '생활 조회', value: 'lifestyle' },
      personality: { summary: '성격 조회', value: 'personality' },
      value: { summary: '가치관 조회', value: 'values' },
      appearance: { summary: '외모 조회', value: 'appearance' },
      datingstyle: { summary: '연애스타일 조회', value: 'datingstyle' },
      // letter: { summary: '편지 조회', value: 'letter' },
      // photo: { summary: '사진 조회', value: 'photo' },
      etc: { summary: '기타 조회', value: 'etc' },
      all: { summary: '전체 조회', value: 'all' },
    },
  })
  @UseGuards(AuthGuard)
  async getUserData(
    @Param('type')
    type:
      | 'lifestyle'
      | 'personality'
      | 'values'
      | 'appearance'
      | 'datingstyle'
      // | 'letter'
      // | 'photo'
      | 'etc'
      | 'all',
    @Req() req: AuthRequest & StateRequest,
    @Res() res: Response,
  ) {
    try {
      if (
        type !== 'lifestyle' &&
        type !== 'personality' &&
        type !== 'values' &&
        type !== 'appearance' &&
        type !== 'datingstyle' &&
        // type !== 'letter' &&
        // type !== 'photo' &&
        type !== 'etc' &&
        type !== 'all'
      ) {
        throw new BadRequestException(
          'lifestyle / personality / values / appearance / datingstyle / letter / photo / etc 조회가 가능합니다.',
        );
      }

      const userId = req.user.userId;
      const gender = req.user.gender;
      const phase = req.state.phase;

      // const matchingData = await this.matchingService.getMatchingByUserId(
      //   userId,
      //   gender,
      //   phase,
      // );
      // const selectable = await this.userService.isSelectable(
      //   userId,
      //   phase,
      //   gender,
      // );
      // let targetId;
      // let whoData;

      let whoData = await this.userService.getUserMe(userId);

      let resultData = {
        nickname: whoData.nickname,
        // selectable: selectable,
      };

      const dynamicFields = {
        lifestyle: 'lifestyle',
        personality: 'personality',
        values: 'values',
        appearance: 'appearance',
        datingstyle: 'datingstyle',
        // letter: 'letter',
        // photo: 'photos',
        etc: 'etc', // ['informationBeforeMeeting', 'kakaoId'],
      };

      const dynamicField = dynamicFields[type];

      if (type === 'all') {
        resultData['lifestyle'] = whoData['lifestyle'];
        resultData['personality'] = whoData['personality'];
        resultData['values'] = whoData['values'];
        resultData['appearance'] = whoData['appearance'];
        resultData['datingstyle'] = whoData['datingstyle'];
        resultData['etc'] = {
          informationBeforeMeeting: whoData['informationBeforeMeeting'],
          kakaoId: whoData['kakaoId'],
        };
      } else if (dynamicField) {
        if (type === 'etc') {
          resultData['informationBeforeMeeting'] =
            whoData['informationBeforeMeeting'];
          resultData['kakaoId'] = whoData['kakaoId'];
        } else {
          resultData[dynamicField] = whoData[dynamicField];
        }
      } else {
        throw new BadRequestException('지원하지 않는 타입입니다.');
      }
      return res
        .status(successCode.OK)
        .json(
          SuccessData(
            successCode.OK,
            successMessage.READ_POST_SUCCESS,
            resultData,
          ),
        );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Put('/me/:type')
  @ApiOperation({
    summary: '회원 내정보(매칭신청서) 수정',
  })
  @ApiParam({
    name: 'type',
    description:
      '"lifestyle","personality","values","appearance","datingstyle","etc","letter", "photo" 중에 입력 가능합니다.',
    examples: {
      lifestyle: { summary: '생활 수정', value: 'lifestyle' },
      personality: { summary: '성격 수정', value: 'personality' },
      values: { summary: '가치관 수정', value: 'values' },
      appearance: { summary: '외모 수정', value: 'appearance' },
      datingstyle: { summary: '연애스타일 수정', value: 'datingstyle' },
      // letter: { summary: '편지 수정', value: 'letter' },
      // photo: { summary: '이미지 수정', value: 'photo' },
      etc: { summary: '기타 수정', value: 'etc' },
    },
  })
  @ApiBody({
    type: DynamicUserDto,
    description: `body는 스웨거에서 동적으로의 변경을 지원하지 않아 아래에서 변경 원하는 type의 value 제외하고 지우고 수정 부탁드립니다.
    \n example) {
        "fillStatus": 1,
        "workType": 1,
        "smoking": 1,
        "drinking": 1,
        "interest": [
          1,
          2,
          3
        ],
        "numberDating": 1,
        "athleticLife": 1,
        "religion": 1
      } `,
  })
  @UseGuards(AuthGuard)
  async updateUserData(
    @Param('type')
    type: UserInfoRequest,
    @Body()
    dto:
      | UserLifestyleDto
      | UserPersonalityDto
      | UserValuesDto
      | UserAppearanceDto
      | UserDatingstyleDto
      // | UserLetterDto
      // | UserPhotosDto
      | UserEtcDto,
    @Req() req: AuthRequest & StateRequest,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const resultDto = await getDtoByType(type, dto);

      await this.userService.updateUserMe(type, userId, resultDto);

      return res
        .status(successCode.OK)
        .json(
          SuccessData(
            successCode.OK,
            successMessage.UPDATE_POST_SUCCESS,
            resultDto,
          ),
        );
    } catch (error) {
      throw error;
    }
  }

  @Get('letter')
  @ApiOperation({
    summary: '편지 조회',
  })
  @UseGuards(AuthGuard)
  async getUserLetter(
    @Req() req: AuthRequest & StateRequest,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const { letter: userLetter } = await this.userService.getUserMe(userId);

      return res
        .status(successCode.OK)
        .json(
          SuccessData(
            successCode.OK,
            successMessage.READ_POST_SUCCESS,
            userLetter,
          ),
        );
    } catch (error) {
      throw error;
    }
  }

  @Put('letter')
  @ApiOperation({
    summary: '편지 수정',
  })
  @UseGuards(AuthGuard)
  async updateUserLetter(
    @Req() req: AuthRequest & StateRequest,
    @Res() res: Response,
    @Body() dto: UserLetterListDto,
  ) {
    try {
      const userId = req.user.userId;
      const resultDto = await getDtoByType('letter', dto);
      const { letter: existLetter } = await this.userService.getUserMe(userId);

      // 기존에 있던 편지는 status를 0으로 변경
      let newLetter = [
        ...existLetter.map((letter) => {
          return { ...letter, status: 0 };
        }),
      ] as UserLetterDto[];
      // 새로운 편지는 status를 1로 변경 및 업데이트
      for (const letter of resultDto as UserLetterDto[]) {
        const collisionIndex = newLetter.findIndex(
          (existLetter) => existLetter.index === letter.index,
        );
        if (collisionIndex > -1) {
          // 기존 편지에 새로운 편지가 있으면
          newLetter[collisionIndex].status = 1;
          newLetter[collisionIndex].content = letter.content;
          newLetter[collisionIndex].updatedAt = new Date();
        } else {
          // 기존 편지에 새로운 편지가 없으면
          newLetter.push({
            ...letter,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 1,
          });
        }
      }

      const updateResult = await this.userService.updateUserLetter(
        userId,
        newLetter,
      );

      return res
        .status(successCode.OK)
        .json(
          SuccessData(
            successCode.OK,
            successMessage.UPDATE_POST_SUCCESS,
            updateResult,
          ),
        );
    } catch (error) {
      throw error;
    }
  }
}
