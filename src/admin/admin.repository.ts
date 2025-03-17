import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { PromotionUserDto } from './dto/promotionUser.dto';
import { CreateMatchingDto } from './dto/createMatching.dto';

@Injectable()
export class AdminRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    // TODO integration, dateAcceptTerms, kakaoId, tmpJob
    const userData = await this.prismaService.user.create({
      data: {
        ...dto,
        dateAcceptTerms: new Date(),
        dateJoin: new Date(),
        dateAcceptMarketing: null,
        dateDormancy: null,
        dateSuspension: null,
        dateAuthBlock: null,
        dateWithdrawal: null,
        kakaoId: null,
      },
    });
    return userData;
  }

  async promotionUser(dto: PromotionUserDto) {
    const { userId, residence, ...otherProps } = dto;

    const userData = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        residence: residence,
        verification: {
          status: 4,
          approvalDetail: {
            reason: '관리자 승인',
            handledBy: '관리자',
            date: new Date(),
          },
        },
        promotion: {
          ...otherProps,
        },
      },
    });
    return userData;
  }

  async createMatching(dto: CreateMatchingDto) {
    // integration, dateAcceptTerms, kakaoId, tmpJob
    const { deadline, ...otherProps } = dto;
    const deadlineDate = new Date(deadline);

    const matchingData = await this.prismaService.matching.create({
      data: {
        ...otherProps,
        fChoice: 0,
        mChoice: 0,
        deadline: deadlineDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return matchingData;
  }
}
