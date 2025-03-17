import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { MatchingRepository } from './matching.repository';
import { TargetingService } from 'src/targeting/targeting.service';
import { TargetingRepository } from 'src/targeting/targeting.repository';
import { MyInfoService } from 'src/my-info/my-info.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MatchingController],
  providers: [
    TargetingService,
    TargetingRepository,
    UserService,
    UserRepository,
    MatchingService,
    MatchingRepository,
    MyInfoService,
  ],
})
export class MatchingModule {}
