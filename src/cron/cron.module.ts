import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthRepository } from 'src/auth/auth.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CronController],
  providers: [CronService, AuthService, AuthRepository],
})
export class CronModule {}
