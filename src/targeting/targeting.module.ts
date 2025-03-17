import { Module } from '@nestjs/common';
import { TargetingService } from './targeting.service';
import { TargetingController } from './targeting.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { MatchingRepository } from '../matching/matching.repository';
import { TargetingRepository } from './targeting.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TargetingController],
  providers: [
    TargetingService,
    UserService,
    UserRepository,
    MatchingRepository,
    TargetingRepository,
  ],
})
export class TargetingModule {}
