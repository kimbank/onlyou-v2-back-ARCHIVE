import { Injectable, NotFoundException } from '@nestjs/common';
import { ncpConfig } from 'src/config/env.config';
import { PrismaService } from 'src/prisma/prisma.service';

import axios from 'axios';
import { ncpHeaders } from '../utils/crypto';

const ourMobileNumber = ncpConfig().NCP_SENS_MOBILE_NUMBER;
const url = ncpConfig().NCP_SENS_URL_LOGIN;

@Injectable()
export class CronService {
  constructor(private readonly prismaService: PrismaService) {}
  async sendMessage(mobileNumber: string, message: string) {
    try {
      const body = {
        type: 'LMS',
        contentType: 'COMM',
        countryCode: '82',
        from: ourMobileNumber,
        subject: '성사 안내',
        content: '성사 안내 컨텐츠',
        messages: [
          {
            to: mobileNumber,
            subject: '[온리유]',
            content: message,
          },
        ],
      };
      // TODO 문자발송 ******
      // const response = await axios.post(url, body, { headers: ncpHeaders });
      // console.log('@@@@ response @@@', response.data);

      return;
    } catch (err) {
      throw err;
    }
  }
  async getUserMobileNumbersByType(phase: number, type: string) {
    try {
      function createWhereCondition(type: string) {
        const inDeadline = {
          phase,
          deadline: { gt: new Date() },
          status: true,
        };
        const outDeadline = {
          phase,
          deadline: { lt: new Date() },
          status: true,
        };
        switch (type) {
          case 'common':
            return {
              OR: [
                { fChoice: 0, mChoice: 0 }, // 여성 미선택 / 남성 미선택
              ],
              ...inDeadline,
            };
          case 'mnfr':
            return {
              OR: [
                { mChoice: 0, fChoice: -1 }, // 남성 미선택 / 여성 거절
              ],
              ...inDeadline,
            };
          case 'mnfa':
            return {
              OR: [
                { mChoice: 0, fChoice: 1 }, // 남성 미선택 / 여성 수락
              ],
              ...inDeadline,
            };
          case 'fnmr':
            return {
              OR: [
                { fChoice: 0, mChoice: -1 }, // 여성 미선택 / 남성 거절
              ],
              ...inDeadline,
            };
          case 'fnma':
            return {
              OR: [
                { fChoice: 0, mChoice: 1 }, // 여성 미선택 / 남성 수락
              ],
              ...inDeadline,
            };
          case 'md':
            return {
              OR: [
                { mChoice: 0, fChoice: -1 }, // 남성 미선택 / 휴면
                { mChoice: 0, fChoice: 0 },
                { mChoice: 0, fChoice: 1 },
              ],
              ...outDeadline,
            };
          case 'fd':
            return {
              OR: [
                { fChoice: 0, mChoice: -1 }, // 여성 미선택 / 휴면
                { fChoice: 0, mChoice: 0 },
                { fChoice: 0, mChoice: 1 },
              ],
              ...outDeadline,
            };
          default:
            throw new Error(`Unsupported type: ${type}`);
        }
      }

      const whereCondition = createWhereCondition(type);

      const matchingDataByPhase = await this.prismaService.matching.findMany({
        where: whereCondition,
      });
      if (!matchingDataByPhase || matchingDataByPhase.length === 0) {
        throw new NotFoundException(
          `${type} 조건에 해당하는 매칭 결과가 존재하지 않습니다.`,
        );
      }
      let allUserIds = [];

      if (type === 'common') {
        allUserIds = matchingDataByPhase
          .map((matching) => matching.femaleId)
          .concat(matchingDataByPhase.map((matching) => matching.maleId));
      } else if (type === 'mnfr' || type === 'mnfa' || type === 'md') {
        allUserIds = matchingDataByPhase.map((matching) => matching.maleId);
      } else if (type === 'fnmr' || type === 'fnma' || type === 'fd') {
        allUserIds = matchingDataByPhase.map((matching) => matching.femaleId);
      }
      const allUserMobileNumbers = await Promise.all(
        allUserIds.map(async (userId) => {
          const user = await this.prismaService.user.findUnique({
            where: { id: userId },
          });
          if (!user) {
            throw new NotFoundException(
              '매칭 userId가 유효하지 않습니다. userId가 존재하지 않습니다.',
            );
          }
          return user.mobileNumber;
        }),
      );
      return allUserMobileNumbers;
    } catch (err) {
      throw err;
    }
  }
}
