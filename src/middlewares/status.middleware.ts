import {
  Injectable,
  NestMiddleware,
  NotAcceptableException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { StateRequest } from '../type/request.type';

@Injectable()
export class GlobalStatusMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: StateRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.prisma.global.findFirst({
        select: {
          phase: true,
          status: true,
        },
        orderBy: [{ phase: 'desc' }, { status: 'desc' }],
        take: 1,
      });
      if (!result) {
        throw new NotAcceptableException('global 상태가 존재하지 않습니다.');
      }
      const maxPhase = result.phase;
      const maxStatus = result.status;
      const date = new Date();
      const now = Date.now();

      req.state = {
        phase: maxPhase,
        status: maxStatus,
        time: date,
        start: now,
        ip: req.ip,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }

    next();
  }
}
