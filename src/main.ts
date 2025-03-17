import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './middlewares/error.middleware';
import { setupSwagger } from 'src/utils/swagger';
import * as express from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(
    ['/docs'],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PWD },
    }),
  );

  // 스웨거 설정
  if (process.env.NODE_ENV === 'development') {
    setupSwagger(app);
  }

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // CORS 설정
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'deployment'
        ? ['https://....co.kr']
        : ['http://localhost', 'https://....dev'],
    credentials: true,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT || 3000);
  logger.log(`Server is running on ${await app.getUrl()}`);
}
bootstrap();
