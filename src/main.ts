import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FILE_UPLOADS_DIR } from './constants';
import { appConfig } from './config/app.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useStaticAssets(join(__dirname, '..', FILE_UPLOADS_DIR));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(appConfig.port || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
