import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTargetDto } from './dto/updateTargetDto';

@Injectable()
export class TargetingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAllTargets(userId: string, items: UpdateTargetDto) {
    try {
      const returnData = await this.prismaService.targeting.create({
        data: { userId, fillStatus: 0, ...items },
      });
      return returnData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async patchAllTargets(userId: string, items: UpdateTargetDto) {
    try {
      const returnData = await this.prismaService.targeting.update({
        where: { userId },
        data: {
          ...items,
        },
      });
      return returnData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getTargetingByUserId(userId: string) {
    try {
      const result = await this.prismaService.targeting.findUnique({
        where: { userId },
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
