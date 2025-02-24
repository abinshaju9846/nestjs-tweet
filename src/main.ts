import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express'

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true ,transform: true }));
  app.useStaticAssets(join(__dirname,'..','uploads'),{prefix:'/uploads'})
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  const config = app.get(ConfigService)
  const port = config.get<number>('PORT') || 3000
  await app.listen(Number(port));
}
bootstrap();
