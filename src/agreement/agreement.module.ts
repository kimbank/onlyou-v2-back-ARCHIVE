import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AgreementService } from './agreement.service';
import { AgreementController } from './agreement.controller';
import { AgreementRepository } from './agreement.repository';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { MatchingService } from '../matching/matching.service';
import { MatchingRepository } from '../matching/matching.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AgreementController],
  providers: [
    AgreementService,
    AgreementRepository,
    UserService,
    UserRepository,
    MatchingService,
    MatchingRepository,
  ],
})
export class AgreementModule {}
