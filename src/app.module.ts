import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { WinstonModule } from 'nest-winston';
import { ValidationModule } from './validation/validation.module';
import * as winston from 'winston';
import { LogMiddleware } from './log/log.middleware';
@Module({
  imports: [
    WinstonModule.forRoot({ //forRoot salah satu Dynamic Module
      format: winston.format.json(),
      level: 'debug',
      transports: [new winston.transports.Console()]
    }),
    //penggunaan config env
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    PrismaModule,
    ValidationModule.forRoot(true)
  ],
  controllers: [AppController],
  providers: [AppService],
})
//registrasi middleware
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({ //Middleware bisa lebih dari satu langsung , , ,
      path: '/api/*', //semua url /api/ atau bisa juga langsung ke Controllernya , , , 
      method: RequestMethod.ALL //semua method
    })
  }
}
