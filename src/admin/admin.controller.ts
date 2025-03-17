import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Headers,
  Post,
  Body,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { SuccessData, successCode } from 'src/middlewares/error.middleware';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/createUser.dto';
import { PromotionUserDto } from './dto/promotionUser.dto';
import { CreateMatchingDto } from './dto/createMatching.dto';

import { adminAccessConfig } from 'src/config/env.config';

const ADMIN_ACCESS_KEY = adminAccessConfig().ADMIN_ACCESS_KEY;


@ApiTags('Admin Access')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/user/signup')
  async signupUser(
    @Headers('admin-access-key') adminAccessKey: string,
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      if (adminAccessKey !== ADMIN_ACCESS_KEY) {
        throw new ForbiddenException('관리자 키가 일치하지 않습니다.');
      }

      const userId = await this.adminService.createUser(createUserDto);
      return res
        .status(successCode.CREATED)
        .json(SuccessData(successCode.CREATED, '유저 생성 성공', userId));
    } catch (err) {
      throw err;
    }
  }

  @Post('/user/promotion')
  async promotionUser(
    @Headers('admin-access-key') adminAccessKey: string,
    @Body() promotionUserDto: PromotionUserDto,
    @Res() res: Response,
  ) {
    try {
      if (adminAccessKey !== ADMIN_ACCESS_KEY) {
        throw new ForbiddenException('관리자 키가 일치하지 않습니다.');
      }

      const user = await this.adminService.promotionUser(promotionUserDto);
      return res
        .status(successCode.CREATED)
        .json(SuccessData(successCode.CREATED));
    } catch (err) {
      throw err;
    }
  }

  @Post('/matching/create')
  async createMatching(
    @Headers('admin-access-key') adminAccessKey: string,
    @Body() createMatchingDto: CreateMatchingDto,
    @Res() res: Response,
  ) {
    try {
      if (adminAccessKey !== ADMIN_ACCESS_KEY) {
        throw new ForbiddenException('관리자 키가 일치하지 않습니다.');
      }

      const matching =
        await this.adminService.createMatching(createMatchingDto);
      return res
        .status(successCode.CREATED)
        .json(SuccessData(successCode.CREATED));
    } catch (err) {
      throw err;
    }
  }
}
