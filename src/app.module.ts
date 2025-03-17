import { Module, Logger, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalExceptionFilter } from './middlewares/error.middleware';

import { LoggerMiddleware } from './middlewares/logger.middleware';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { PrismaModule } from './prisma/prisma.module';
import { validationSchema } from './config/validationSchema';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GlobalStatusMiddleware } from './middlewares/status.middleware';
import { MatchingModule } from './matching/matching.module';
import { MyInfoModule } from './my-info/my-info.module';
import { TargetingModule } from './targeting/targeting.module';
import { PromotionModule } from './promotion/promotion.module';
import { CronModule } from './cron/cron.module';
import { AdminModule } from './admin/admin.module';
// import { AgreementModule } from './agreement/agreement.module';
import { TypeformModule } from './typeform-webhook-listener/typeform-webhook-listener.module';
import { AgreementModule } from './agreement/agreement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('onlyou', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    TargetingModule,
    MyInfoModule,
    MatchingModule,
    AgreementModule,
    PromotionModule,
    CronModule,
    AdminModule,
    TypeformModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(GlobalStatusMiddleware).forRoutes('*');
  }
}
