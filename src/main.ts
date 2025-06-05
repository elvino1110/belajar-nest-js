import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import * as mustache from 'mustache-express'
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationFilter } from './validation/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); //mengambil semua method bawaan express
  app.use(cookieParser("RAHASIA"))

  const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER)
  app.useLogger(loggerService)
  
  app.set('views', __dirname + '/../views') // /../ naik satu folder
  app.set('view engine', 'html')
  app.engine('html', mustache())

  //Global Filter untuk semua
  // tapi harusnya bisa semua jangan Zod aja kalau mau disini
  //harus nangani semua
  app.useGlobalFilters(new ValidationFilter())
  // app.useGlobalPipes() //global pipes
  // app.useGlobalInterceptors() //global harus dipastikan responsenya json atau text

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
