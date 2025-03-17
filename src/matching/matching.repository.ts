import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackDto } from './dto/feedback.dto';
import { th } from 'date-fns/locale';

@Injectable()
export class MatchingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getMatchingByUserId(id: string, gender: boolean, phase: number) {
    try {
      const query =
        gender === false
          ? { femaleId: id, phase: phase, status: true }
          : { maleId: id, phase: phase, status: true };
      const matchingData = await this.prismaService.matching.findFirst({
        where: query,
      });

      if (!matchingData) {
        throw new NotFoundException('조회된 매칭 데이터가 없습니다.');
      }

      return matchingData;
    } catch (err) {
      throw err;
    }
  }

  async getActiveUniqueMatchingByUserIdAndGender(matchingId: string) {
    try {
      const matchingData = await this.prismaService.matching.findUnique({
        where: {
          id: matchingId,
          status: Boolean(true),
          deadline: {
            gt: new Date(),
          },
        },
      });
      return matchingData;
    } catch (err) {
      throw err;
    }
  }

  async getActiveMatchingsByUserIdAndGender(
    userId: string,
    userGender: boolean,
  ) {
    const genderWhereQuery =
      userGender === false ? { femaleId: userId } : { maleId: userId };
    const userSelectQuery = {
      nickname: true,
      birthYear: true,
      residence: true,
      photo: true,
      kakaoId: true,
      promotion: {
        select: {
          jobGroup: true,
          jobName: true,
        },
      },
      badge: true,
    };

    try {
      const matchings = this.prismaService.matching.findMany({
        where: {
          ...genderWhereQuery,
          status: Boolean(true),
          deadline: {
            gt: new Date(),
          },
        },
        select: {
          id: true,
          status: true,
          deadline: true,
          phase: true,
          mChoice: true,
          fChoice: true,
          user_female: {
            select: userSelectQuery,
          },
          user_male: {
            select: userSelectQuery,
          },
        },
        orderBy: {
          deadline: 'asc',
        },
      });
      return matchings;
    } catch (err) {
      throw err;
    }
  }

  async getUserTargeting(userId: string) {
    try {
      const userData = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          targeting: true,
        },
      });
      if (!userData) {
        throw new NotFoundException('조회된 id가 없습니다.');
      }
      return userData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateMatchingChoiceByMatchingIdAndGender(
    matchingId: string,
    choice: number,
    userGender: boolean,
  ) {
    try {
      const choiceQuery =
        userGender === false ? { fChoice: choice } : { mChoice: choice };
      const matchingData = await this.prismaService.matching.update({
        where: { id: matchingId },
        data: choiceQuery,
      });
      return matchingData;
    } catch (err) {
      throw err;
    }
  }
}
