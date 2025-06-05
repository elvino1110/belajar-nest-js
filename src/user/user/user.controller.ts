import { Body, Controller, Get, Header, HttpCode, HttpRedirectResponse, Inject, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { Request, response, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from 'generated/prisma';

@Controller('/api/users')
export class UserController {

    constructor(
        private service: UserService,
        private connection: Connection,
        private mailService: MailService,
        @Inject('EmailService') private emailService: MailService,
        private userRepository: UserRepository,
        private memberService: MemberService
    ) {}

    @Get('/connection')
    async getConnection(): Promise<string> {
        // this.userRepository.save()
        this.mailService.send()
        this.emailService.send()

        console.info(this.memberService.getConnectionName())
        this.memberService.sendEmail()

        return this.connection.getName()
    }
    
    @Get('/create')
    async create(
        @Query('first_name') first_name: string,
        @Query('last_name') last_name: string
    ): Promise<User> {
        return this.userRepository.save(first_name, last_name)
    }

    @Get('/hello')
    async sayHello(
        @Query('name') name: string,
    ): Promise<string> {
        return this.service.sayHello(name)
    }

    @Get('/view/hello')
    viewHello(@Query('name') name: string, @Res() response: Response) {
        response.render('index.html', {
            title: 'Template Engine',
            name: name
        })
    }

    @Get('/set-cookie')
    setCookie(@Query('name') name: string, @Res() response: Response) { //karena cookie tidak bawaan nestJS makanya harus pakai Res dari Express
        response.cookie('name', name)
        response.status(200).send('Success Set Cookie')
    }

    @Get('/get-cookie')
    getCookie(@Req() request: Request): string {
        return request.cookies['name']
    }

    @Get('/sample-response')
    @Header("Content-Type", "application/json")
    @HttpCode(200)
    sampleResponse() : Record<string, string> {
        return {
            "data": "Hello JSON"
        }
    }

    @Get('/redirect')
    @Redirect()
    redirect(): HttpRedirectResponse {
        return {
            url: "/api/users/sample-response",
            statusCode: 301
        }
    }

    // @Get('/sample-response')
    // sampleResponse(@Res() response: Response) {
    //     response.status(200).json({
    //         data: "Hello world"
    //     })
    // }

    // @Get('/hello')
    // sayHello(
    //     @Query('first_name') firstName: string,
    //     @Query('last_name') lastName: string
    // ): string {
    //     return `Hello ${firstName} ${lastName}`
    // }

    

    @Get('/:id')
    getById(@Param('id') id: string): string {
        return `GET ${id}`
    }
    // @Get('/:id')
    // getById(@Req() request: Request): string {
    //     return `GET ${request.params.id}`
    // }

    @Post()
    post(): string {
        return 'POST';
    }

    @Get("/sample")
    get(): string {
        return 'Hello NestJS';
    }
}

