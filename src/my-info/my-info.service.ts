import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  CommonError,
  errorCode,
  errorMessage,
} from '../middlewares/error.middleware';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from 'src/user/user.repository';
import { MatchingRepository } from '../matching/matching.repository';

@Injectable()
export class MyInfoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly matchingRepository: MatchingRepository,
  ) {}

  async updateUserToDormant(userId: string, status: boolean) {
    try {
      if (status) {
        const now = new Date();
        const updateToDormant = await this.prismaService.user.update({
          where: { id: userId },
          data: { dateDormancy: now },
        });
        if (!updateToDormant) {
          throw new UnprocessableEntityException(
            '휴면 업데이트에 실패했습니다.',
          );
        }
        return updateToDormant.dateDormancy;
      } else {
        const updateToDormant = await this.prismaService.user.update({
          where: { id: userId },
          data: { dateDormancy: null },
        });
        if (!updateToDormant) {
          throw new UnprocessableEntityException('휴면 해제에 실패했습니다.');
        }
        return updateToDormant.dateDormancy;
      }
    } catch (err) {
      throw err;
    }
  }

  async updateMyinfoDefault(
    userId: string,
    residence: number,
    promotion: any,
    // visibility: any,
  ) {
    try {
      const updateUserMyinfoDefault = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          residence: residence,
          promotion: promotion,
          // visibility: visibility,
        },
      });
      if (!updateUserMyinfoDefault) {
        throw new UnprocessableEntityException('정보 업데이트에 실패했습니다.');
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async getTargetUserDataBySelectedTargetingOption(
    userId: string,
    targetId: string,
  ) {
    try {
      const { targeting: userTargeting } =
        await this.matchingRepository.getUserTargeting(userId);
      let options = {};

      for (const key in userTargeting) {
        if (key === 'fillStatus' || key === 'id' || key === 'userId') {
          continue;
        }
        if (userTargeting[key] !== null) {
          const { priority } = userTargeting[key];
          options[key] = { priority: priority };
        } else {
          options[key] = { priority: -1 };
        }
      }

      if (Object.keys(options).length === 0) {
        throw new CommonError(
          errorCode.BAD_REQUEST,
          errorMessage.BAD_REQUEST,
          'no targeting',
        );
      }

      const targetUserData =
        await this.userRepository.getUserTargetById(targetId);
      const flattenTargetUserData = {
        ...targetUserData.lifestyle,
        ...targetUserData.personality,
        ...targetUserData.values,
        ...targetUserData.appearance,
        ...targetUserData.datingstyle,
        ...targetUserData.promotion,
      };

      for (const key in options) {
        if (options[key]) {
          options[key] = {
            ...options[key],
            data: flattenTargetUserData[key],
          };
        }
        if (options[key]?.data === undefined) {
          options[key] = {
            ...options[key],
            data: null,
          };
        }
      }

      // 기본 노출 정보 [정책]
      options = {
        ...options,
        // 거주지
        residence: targetUserData.residence,
        // 직업 명
        jobGroup: targetUserData.promotion.jobGroup,
        // 생년
        birthYear: targetUserData.birthYear,
        // 관심사
        interest: targetUserData.lifestyle.interest,
        // 내적 매력
        personalityCharm: targetUserData.personality.personalityCharm,
        // 외적 매력
        externalCharm: targetUserData.appearance.externalCharm,
        // 만나기 전 정보
        informationBeforeMeeting: targetUserData.informationBeforeMeeting,

        // 연봉
        salary: {
          data: targetUserData.promotion.salary,
          priority: -1,
        },
      };

      // const letters = targetUserData.letter.filter(
      //   (letter) => letter?.status > 0,
      // );

      return {
        nickname: targetUserData.nickname,
        kakaoId: targetUserData.kakaoId,
        details: { ...options },
        photos: targetUserData.photo,
        letters: targetUserData.letter,
      };
    } catch (err) {
      throw err;
    }
  }
}
