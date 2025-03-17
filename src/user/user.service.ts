import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import {
  CommonError,
  errorCode,
  errorMessage,
} from '../middlewares/error.middleware';
import { MatchingRepository } from '../matching/matching.repository';
import { isAfter } from 'date-fns';
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
import { UserLetter } from 'src/type/request.type';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly matchingRepository: MatchingRepository,
  ) {}

  async getUserMe(userId: string) {
    try {
      const userData = await this.userRepository.getUserMeById(userId);
      return userData;
    } catch (err) {
      throw err;
    }
  }

  async getUserTarget(userId: string) {
    try {
      const userData = await this.userRepository.getUserTargetById(userId);
      return userData;
    } catch (err) {
      throw err;
    }
  }

  async isSelectable(id: string, phase: number, gender: boolean) {
    try {
      const matchingData = await this.matchingRepository.getMatchingByUserId(
        id,
        gender,
        phase,
      );
      const now = new Date();

      if (isAfter(now, new Date(matchingData.deadline))) {
        throw new CommonError(
          errorCode.BAD_REQUEST,
          errorMessage.BAD_REQUEST,
          'deadline over',
        );
      }
      const checkSelected = (selected: number) => {
        if (selected === -1) {
          throw new CommonError(
            errorCode.BAD_REQUEST,
            errorMessage.BAD_REQUEST,
            'no choice selected',
          );
        }
      };

      if (gender === false) {
        checkSelected(matchingData.mChoice);
      } else {
        checkSelected(matchingData.fChoice);
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async updateUserMe(
    type: string,
    userId: string,
    dto: any,
      // | UserLifestyleDto
      // | UserPersonalityDto
      // | UserValuesDto
      // | UserAppearanceDto
      // | UserDatingstyleDto
      // | UserLetterDto
      // | UserPhotosDto
      // | UserEtcDto,
  ) {
    try {
      if (type === 'etc') {
        const updatedUserData = await this.userRepository.updateUserEtc(
          userId,
          dto,
        );
        if (updatedUserData) {
          return true;
        }
      } else {
        const updatedUserData = await this.userRepository.updateUserMe(
          type,
          userId,
          dto,
        );
        if (updatedUserData) {
          return true;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  async updateUserLetter(userId: string, dto: UserLetterDto[]) {
    try {
      const updatedUserData = await this.userRepository.updateUserLetter(
        userId,
        dto,
      );
      if (updatedUserData) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  async getFillStatuOfEachFileds(userId: string) {
    try {
      const userData = await this.userRepository.getUserMeById(userId);
      const {
        lifestyle,
        personality,
        values,
        appearance,
        datingstyle,
        letter,
        // photo,
        // promotion,
      } = userData;
      // TODO user.letter << prisma.JsonValue 라는 특수한 타입으로 되어 있어 강제 형변환
      const userLetter: UserLetter[] = letter as unknown as UserLetter[];
      const statusData = {
        lifestyle: lifestyle?.fillStatus > 0 ? true : false,
        personality: personality?.fillStatus > 0 ? true : false,
        values: values?.fillStatus > 0 ? true : false,
        appearance: appearance?.fillStatus > 0 ? true : false,
        datingstyle: datingstyle?.fillStatus > 0 ? true : false,
        letter: userLetter.length > 0 ? true : false,
        // photo: photo.length > 0 ? true : false,
        // promotion: promotion ? true : false,
      };

      return statusData;
    } catch (err) {
      throw err;
    }
  }

  async decreaseTicket(userId: string) {
    try {
      const userData = await this.userRepository.getUserMeById(userId);
      const updatedUserData = await this.userRepository.updateUserTicket(
        userId,
        userData.ticket - 1,
      );
      if (updatedUserData) {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}
