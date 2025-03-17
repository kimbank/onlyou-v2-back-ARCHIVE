import { Injectable } from '@nestjs/common';
import {
  CommonError,
  errorCode,
  errorMessage,
} from '../middlewares/error.middleware';
import { isWithinInterval, subDays, format } from 'date-fns';
import { AgreementRepository } from './agreement.repository';
import { UserRepository } from '../user/user.repository';
import { MatchingRepository } from '../matching/matching.repository';

@Injectable()
export class AgreementService {
  constructor(
    private readonly agreementRepository: AgreementRepository,
    private readonly userRepository: UserRepository,
    private readonly matchingRepository: MatchingRepository,
  ) {}

  async getAgreementsByUserIdAndGender(userId: string, userGender: boolean) {
    try {
      const agreements =
        await this.agreementRepository.getAgreementsByUserIdAndGender(
          userId,
          userGender,
        );
      // // TODO: 일단 성사자 안보이게
      // return [];
      if (!agreements || agreements.length < 1) {
        return [];
      }

      let resultAgreements = [];
      for (const a of agreements) {
        if (!a.user_female || !a.user_male) continue;

        let aData = {};
        if (userGender === false) {
          // 여성에게 보여질 남성의 정보들
          aData = {
            matchingId: a.id,
            verification: true,
            jobVerification: a.user_male.promotion.jobName ? true : false,
            nickname: a.user_male.nickname,
            deadline: a.deadline,
            jobGroup: a.user_male.promotion.jobGroup,
            residence: a.user_male.residence,
            birthYear: a.user_male.birthYear,
            photo:
              a.user_male.photo.length < 1 ? null : a.user_male.photo[0].url,
            createdAt: format(a.createdAt, 'yyyy-MM-dd'),
            kakaoId: a.user_male.kakaoId,
            badge: a.user_male.badge,
          };
        } else {
          // 남성에게 보여질 여성의 정보들
          aData = {
            matchingId: a.id,
            verification: true,
            jobVerification: a.user_female.promotion.jobName ? true : false,
            nickname: a.user_female.nickname,
            deadline: a.deadline,
            jobGroup: a.user_female.promotion.jobGroup,
            residence: a.user_female.residence,
            birthYear: a.user_female.birthYear,
            photo:
              a.user_female.photo.length < 1
                ? null
                : a.user_female.photo[0].url,
            createdAt: format(a.createdAt, 'yyyy-MM-dd'),
            kakaoId: a.user_female.kakaoId,
            badge: a.user_female.badge,
          };
        }
        const dateNow = new Date();
        const sevenDaysAgo = subDays(dateNow, 7);
        const isKakaoIdAvailable = isWithinInterval(a.createdAt, {
          start: sevenDaysAgo,
          end: dateNow,
        });
        if (!isKakaoIdAvailable) {
          aData['kakaoId'] = null;
        }
        resultAgreements.push(aData);
      }
      return resultAgreements;
    } catch (err) {
      throw err;
    }
  }

  async getActiveAgreementsByUserIdAndGender(
    matchingId: string,
    userGender: boolean,
  ) {
    try {
      const matchingData =
        await this.agreementRepository.getActiveUniqueAgreementByUserIdAndGender(
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
}
