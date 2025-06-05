import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Connection, createConnection, MongoDBConnection, MySQLConnection } from './connection/connection';
import { mailService, MailService } from './mail/mail.service';
// import { createUserRepository, UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user-repository/user-repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService, 
    {
      provide: Connection,
      // useClass: process.env.DATABASE == 'mysql' ? MySQLConnection : MongoDBConnection // ganti ke useFactor
      useFactory: createConnection,
      inject: [ConfigService]
    },
    {
      provide: MailService,
      useValue: mailService
    },
    {
      provide: 'EmailService', //alias Proivder
      useExisting: MailService
    },
    UserRepository,
    // {
    //   provide: UserRepository,
    //   useFactory: createUserRepository,
    //   inject: [Connection]
    // },
    MemberService,
  ],
  exports: [UserService]
})
export class UserModule {}
