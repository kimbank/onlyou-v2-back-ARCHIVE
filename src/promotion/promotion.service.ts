import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePromotionDto } from './dto/updatePromotion.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionService {
  constructor(private readonly prismaService: PrismaService) {}
  async updatePromotion(userId: string, dto: UpdatePromotionDto) {
    try {
      const [beforeData, returnData] = await this.prismaService.$transaction([
        this.prismaService.user.update({
          where: { id: userId },
          data: {
            promotion: {
              jobType: null,
              jobName: null,
              jobGroup: null,
              salary: null,
              height: null,
              university: null,
              education: null,
              universityName: null,
              divorce: null,
            },
          },
        }),
        this.prismaService.user.update({
          where: { id: userId },
          data: {
            promotion: { ...dto },
          },
        }),
      ]);
      return returnData.promotion;
    } catch (err) {
      throw err;
    }
  }
}
