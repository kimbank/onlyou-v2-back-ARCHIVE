import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays } from 'date-fns';

@Injectable()
export class AgreementRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAgreementsByUserIdAndGender(userId: string, userGender: boolean) {
    const sevenDaysAgo = subDays(new Date(), 7);
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
      const agreements = await this.prismaService.matching.findMany({
        where: {
          ...genderWhereQuery,
          status: Boolean(true),
          mChoice: { gt: 0 },
          fChoice: { gt: 0 },
          // deadline: {
          //   gte: sevenDaysAgo,
          // },
        },
        select: {
          id: true,
          status: true,
          deadline: true,
          phase: true,
          createdAt: true,
          user_female: {
            select: userSelectQuery,
          },
          user_male: {
            select: userSelectQuery,
          },
        },
        orderBy: {
          deadline: 'desc',
          // phase: 'desc',
        },
      });
      return agreements;
    } catch (err) {
      throw err;
    }
  }

  async getActiveUniqueAgreementByUserIdAndGender(matchingId: string) {
    try {
      const matchingData = await this.prismaService.matching.findUnique({
        where: {
          id: matchingId,
          status: Boolean(true),
          fChoice: { gt: 0 },
          mChoice: { gt: 0 },
        },
      });
      return matchingData;
    } catch (err) {
      throw err;
    }
  }
}
