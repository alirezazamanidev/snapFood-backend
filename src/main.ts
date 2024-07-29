import './configs/env.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import SwaggerConfig from './configs/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  SwaggerConfig(app);
  const { PORT } = process.env;
  await app.listen(PORT, () => {
    console.log(`server run =>  http://localhost:${PORT}`);
    console.log(`swagger run =>  http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
