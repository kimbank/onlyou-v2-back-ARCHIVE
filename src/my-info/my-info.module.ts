import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { AuthRepository } from 'src/auth/auth.repository';
import { MyInfoService } from './my-info.service';
import { MyInfoController } from './my-info.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { MatchingService } from '../matching/matching.service';
import { MatchingRepository } from '../matching/matching.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MyInfoController],
  providers: [
    MyInfoService,
    AuthService,
    AuthRepository,
    UserService,
    UserRepository,
    MatchingService,
    MatchingRepository,
  ],
})
export class MyInfoModule {}
