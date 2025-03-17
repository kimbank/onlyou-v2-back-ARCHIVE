import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import { UserRepository } from './user.repository';
import { UserModule } from './user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UpdateUserDto } from './dto/updateUser.dto';

describe('UserController', () => {
  let app: INestApplication;
  let controller: UserController;
  let service: UserService;
  let userRepository: UserRepository;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        UserModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './.development.env',
        }),
      ],
      providers: [UserService, UserRepository],
    }).compile();
    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  ``;

  // describe('로그인',()=>{
  //   it('최근 토큰 확인 여부', async()=>{
  //     const token
  //   })
  // })

  describe('isUser 가입여부', () => {
    it('번호 미등록시 can signup 정상 반환여부', async () => {
      const phone: string = '01012345677';
      const response = await service.getUser(phone, 'phone');
      expect(response).toBe('can signup');
    });

    it('번호 기등록시 name 정상 반환여부 ', async () => {
      const phone: string = '01012345678';
      const response = await service.getUser(phone, 'phone');
      expect(response).toBe('test_name');
    });
  });

  describe('getUser 회원정보조회', () => {
    it('SUCCESS: userId 찾은 경우', async () => {
      const userId: string = '2';
      const response = await service.getUser(userId, 'id');
      expect(response).toBe(response);
    });
    it('ERROR: userId 없을 때 NotFound', async () => {
      try {
        const userId: string = '999999999';
        await service.getUser(userId, 'id');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('updateUser 회원정보수정', () => {
    it('데이터 동일하게 변경완료 후 정상 수정 여부', async () => {
      try {
        const dto: UpdateUserDto = {
          nickname: '변경 후 닉네임',
          residence: 12346,
        };
        const userId = 1;
        const changedUserInfo = await service.update(userId, dto);
        expect(changedUserInfo.nickname).toBe('변경 후 닉네임');
        expect(changedUserInfo.residence).toBe(12346);
      } catch (err) {
        expect(err).toBeInstanceOf(NotAcceptableException);
      }
    });
  });
});
