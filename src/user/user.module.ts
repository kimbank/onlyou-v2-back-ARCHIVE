import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { MatchingService } from '../matching/matching.service';
import { MatchingRepository } from '../matching/matching.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, MatchingService, MatchingRepository],
})
export class UserModule {}
