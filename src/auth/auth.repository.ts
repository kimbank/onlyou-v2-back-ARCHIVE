import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAuthSens(phone: string, code: string, date: Date) {
    const authSensData = await this.prismaService.auth_sens.create({
      data: {
        code: code,
        count: 0,
        mobileNumber: phone,
        createdAt: date,
        succeedAt: date,
      },
    });
    return authSensData;
  }

  async deleteAuthSens(phone: string) {
    const authSensData = await this.prismaService.auth_sens.delete({
      where: { mobileNumber: phone },
    });
    return authSensData;
  }

  async updateAuthCode(phone: string, newCode: string, date: Date) {
    const authSensData = await this.prismaService.auth_sens.update({
      where: { mobileNumber: phone },
      data: { code: newCode, succeedAt: date },
    });
    return authSensData;
  }

  async updateAuthCount(phone: string, originCount: number) {
    const authSensData = await this.prismaService.auth_sens.update({
      where: { mobileNumber: phone },
      data: {
        count: originCount,
      },
    });
    return authSensData;
  }

  async updateAuthBlock(phone: string, date: Date) {
    await this.prismaService.user.update({
      where: { mobileNumber: phone },
      data: { dateAuthBlock: new Date() },
    });
  }

  async getAuthSensByPhone(phone: string) {
    const authSensData = await this.prismaService.auth_sens.findUnique({
      where: { mobileNumber: phone },
    });
    return authSensData;
  }

  async getUserByPhone(phone: string) {
    const userData = await this.prismaService.user.findUnique({
      where: { mobileNumber: phone },
    });
    return userData;
  }

  async getSession(jwtString: string) {
    const sessionData = await this.prismaService.session.findUnique({
      where: { jti: jwtString },
    });
    return sessionData;
  }

  async upsertSession(
    userId: string,
    refreshToken: string,
    ip: string,
    userAgent: string,
    phone?: string,
  ) {
    const transactionResult = await this.prismaService.$transaction(
      async (prisma) => {
        const insertRefresh = await prisma.session.upsert({
          where: { userId },
          update: {
            jti: refreshToken,
            refreshCount: {
              increment: 1,
            },
            ip: ip,
            userAgent: userAgent,
          },
          create: {
            userId,
            jti: refreshToken,
            createdAt: new Date(),
            device: 'device', // TODO: device 미정
            updatedAt: new Date(),
            valid: true,
            refreshCount: 0,
            ip: ip,
            userAgent: userAgent,
          },
        });

        // 로그인할때만 phone을 받아서 count 0으로 초기화, refresh토큰 재발급시에는 초기화 x
        if (phone) {
          await this.updateAuthCount(phone, 0);
        }
        return insertRefresh;
      },
    );
  }
}
