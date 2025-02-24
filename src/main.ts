import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'
import { ConfigService } from '@nestjs/config';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true,forbidNonWhitelisted: true}));
  const config=app.get(ConfigService)
  const port=config.get<number>('PORT') 
  await app.listen(Number(port)) ;
}
bootstrap();
