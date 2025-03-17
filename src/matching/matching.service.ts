import { Injectable } from '@nestjs/common';
import {
  CommonError,
  errorCode,
  errorMessage,
} from '../middlewares/error.middleware';
import { MatchingRepository } from './matching.repository';
import { FeedbackDto } from './dto/feedback.dto';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class MatchingService {
  constructor(
    private readonly matchingRepository: MatchingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getMatchingByUserId(id: string, gender: boolean, phase: number) {
    try {
      const matchingData = await this.matchingRepository.getMatchingByUserId(
        id,
        gender,
        phase,
      );
      return matchingData;
    } catch (err) {
      throw err;
    }
  }

  async getUserActiveMatchings(
    userId: string,
    userGender: boolean,
    target: boolean = false,
  ) {
    try {
      const matchings =
        await this.matchingRepository.getActiveMatchingsByUserIdAndGender(
          userId,
          userGender,
        );
      if (!target) {
        return matchings;
      }

      let resultMatchings = [];
      for (const m of matchings) {
        if (!m.user_female || !m.user_male) continue;

        let mData = {};
        if (userGender === false) {
          // 여성에게 보여질 남성의 정보들
          mData = {
            matchingId: m.id,
            verification: true,
            jobVerification: m.user_male.promotion.jobName ? true : false,
            nickname: m.user_male.nickname,
            deadline: m.deadline,
            jobGroup: m.user_male.promotion.jobGroup,
            residence: m.user_male.residence,
            birthYear: m.user_male.birthYear,
            photo:
              m.user_male.photo.length < 1 ? null : m.user_male.photo[0].url,
            kakaoId:
              m.fChoice > 0 && m.mChoice > 0 ? m.user_male.kakaoId : null,
            badge: m.user_male.badge,
          };
        } else {
          // 남성에게 보여질 여성의 정보들
          mData = {
            matchingId: m.id,
            verification: true,
            jobVerification: m.user_female.promotion.jobName ? true : false,
            nickname: m.user_female.nickname,
            deadline: m.deadline,
            jobGroup: m.user_female.promotion.jobGroup,
            residence: m.user_female.residence,
            birthYear: m.user_female.birthYear,
            photo:
              m.user_female.photo.length < 1
                ? null
                : m.user_female.photo[0].url,
            kakaoId:
              m.fChoice > 0 && m.mChoice > 0 ? m.user_female.kakaoId : null,
            badge: m.user_female.badge,
          };
        }
        resultMatchings.push(mData);
      }
      return resultMatchings;
    } catch (err) {
      throw err;
    }
  }

  async getMatchingDataByMatchingId(matchingId: string, userGender: boolean) {
    try {
      const matchingData =
        await this.matchingRepository.getActiveUniqueMatchingByUserIdAndGender(
          matchingId,
        );
      if (!matchingData) {
        throw new CommonError(
          errorCode.BAD_REQUEST,
          errorMessage.BAD_REQUEST,
          'no matching',
        );
      }
      if (userGender === false) {
        return {
          targetId: matchingData.maleId,
          targetChoice: matchingData.mChoice,
          meChoice: matchingData.fChoice,
          deadline: matchingData.deadline,
        };
      } else {
        return {
          targetId: matchingData.femaleId,
          targetChoice: matchingData.fChoice,
          meChoice: matchingData.mChoice,
          deadline: matchingData.deadline,
        };
      }
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
        if (
          userTargeting[key] !== null &&
          userTargeting[key]?.priority >= 0 &&
          userTargeting[key]?.priority <= 3
        ) {
          const { priority } = userTargeting[key];
          options[key] = { priority: priority };
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
      };

      const letters = targetUserData.letter.filter(
        (letter) => letter?.status > 0,
      );

      return {
        userId: userId,
        nickname: targetUserData.nickname,
        kakaoId: targetUserData.kakaoId,
        details: { ...options },
        photos: targetUserData.photo,
        letters: letters,
      };
    } catch (err) {
      throw err;
    }
  }

  async updateMatchingChoiceByMatchingIdAndGender(
    matchingId: string,
    choice: number,
    userGender: boolean,
  ) {
    try {
      const matchingData =
        await this.matchingRepository.updateMatchingChoiceByMatchingIdAndGender(
          matchingId,
          choice,
          userGender,
        );
      if (!matchingData) {
        throw new CommonError(
          errorCode.BAD_REQUEST,
          errorMessage.BAD_REQUEST,
          'no matching',
        );
      }
      return matchingData;
    } catch (err) {
      throw err;
    }
  }

  async getFeedback(userId: string, gender: boolean, phase: number) {
    try {
      const matchingData = await this.matchingRepository.getMatchingByUserId(
        userId,
        gender,
        phase,
      );
      const feedbackData = matchingData.status
        ? gender
          ? matchingData.fFeedback
          : matchingData.mFeedback
        : null;

      return feedbackData;
    } catch (err) {
      throw err;
    }
  }

  async getAgreement(userId: string, gender: boolean, phase: number) {
    try {
      const matchingData = await this.matchingRepository.getMatchingByUserId(
        userId,
        gender,
        phase,
      );

      return matchingData.agreement;
    } catch (err) {
      throw err;
    }
  }
}
