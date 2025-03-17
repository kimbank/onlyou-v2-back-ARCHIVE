import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { PromotionUserDto } from './dto/promotionUser.dto';
import { CreateMatchingDto } from './dto/createMatching.dto';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async createUser(createAdminDto: CreateUserDto) {
    try {
      const userData = await this.adminRepository.createUser(createAdminDto);
      if (!userData) {
        throw new UnprocessableEntityException('유저 생성에 실패했습니다.');
      }
      return userData.id;
    } catch (err) {
      throw err;
    }
  }

  async promotionUser(updateAdminDto: PromotionUserDto) {
    try {
      const userData = await this.adminRepository.promotionUser(updateAdminDto);
      if (!userData) {
        throw new UnprocessableEntityException('유저 승급에 실패했습니다.');
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async createMatching(createAdminDto: CreateMatchingDto) {
    try {
      const matchingData =
        await this.adminRepository.createMatching(createAdminDto);
      if (!matchingData) {
        throw new UnprocessableEntityException('유저 생성에 실패했습니다.');
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}
