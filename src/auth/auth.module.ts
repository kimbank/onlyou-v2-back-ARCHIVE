import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { authConfig } from '../config/env.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { MatchingRepository } from '../matching/matching.repository';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forFeature(authConfig),
    PrismaModule,
  ],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    MatchingRepository,
    AuthRepository,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
