import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class AppService {
  async getCode(gender: string) {
    if (process.env.NODE_ENV === 'development') {
      if (gender === 'male') {
        const code = await prisma.auth_sens.findUnique({
          where: { mobileNumber: '01012121212' },
        });
        return code;
      } else if (gender === 'female') {
        const code = await prisma.auth_sens.findUnique({
          where: { mobileNumber: '01034343434' },
        });
        return code;
      }
    } else throw new UnauthorizedException('개발환경에서만 가능합니다.');
  }
}
