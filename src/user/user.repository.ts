import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UserLifestyleDto,
  UserPersonalityDto,
  UserValuesDto,
  UserAppearanceDto,
  UserDatingstyleDto,
  UserLetterDto,
  UserPhotosDto,
  UserEtcDto,
} from './dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserMeById(userId: string) {
    try {
      const userData = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!userData) {
        throw new UnauthorizedException('조회된 id가 없습니다.');
      }
      return userData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getUserTargetById(userId: string) {
    try {
      const userData = await this.prismaService.user.findUnique({
        where: { id: userId },
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

  async updateUserMe(
    type: string,
    userId: string,
    dto:
      | UserLifestyleDto
      | UserPersonalityDto
      | UserValuesDto
      | UserAppearanceDto
      | UserDatingstyleDto
      | UserLetterDto
      | UserPhotosDto
      | UserEtcDto,
  ) {
    try {
      const updatedUserData = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          [type]: { fillStatus: 2, ...dto },
        },
      });
      if (!updatedUserData) {
        throw new UnprocessableEntityException('업데이트에 실패했습니다.');
      }
      return updatedUserData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateUserEtc(userId: string, dto: UserEtcDto) {
    try {
      const updatedUserData = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          informationBeforeMeeting: dto.informationBeforeMeeting,
          kakaoId: dto.kakaoId,
        },
      });
      if (!updatedUserData) {
        throw new UnprocessableEntityException('업데이트에 실패했습니다.');
      }
      return updatedUserData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateUserLetter(userId: string, dto: UserLetterDto[]) {
    try {
      const updatedUserLetterData = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          letter: dto,
        },
      });
      if (!updatedUserLetterData) {
        throw new UnprocessableEntityException('업데이트에 실패했습니다.');
      }
      return updatedUserLetterData.letter;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateUserTicket(userId: string, ticket: number) {
    try {
      const updatedUserTicketData = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          ticket: ticket,
        },
      });
      if (!updatedUserTicketData) {
        throw new UnprocessableEntityException('업데이트에 실패했습니다.');
      }
      return updatedUserTicketData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
