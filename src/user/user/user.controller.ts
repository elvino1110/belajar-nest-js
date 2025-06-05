import {
    Body,
    Controller,
    Get,
    Header,
    HttpCode, HttpException,
    HttpRedirectResponse,
    Inject,
    Param, ParseIntPipe,
    Post,
    Query,
    Redirect,
    Req,
    Res,
    UseFilters, UseInterceptors, UsePipes,
} from '@nestjs/common';
import { Request, response, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from 'generated/prisma';
import { ValidationFilter } from '../../validation/validation.filter';
import { ValidationPipe } from '../../validation/validation.pipe';
import { LoginUserRequest, loginUserRequestValidation } from '../../model/login.model';
import { TimeInterceptor } from '../../time/time.interceptor';

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


    @UseFilters(ValidationFilter)
    @UsePipes(new ValidationPipe(loginUserRequestValidation)) //semua parameter akan di validasi bukan body tadi terlalu beresiko jika tidak di handle
    @Header("Content-Type", "application/json")
    @UseInterceptors(TimeInterceptor) // menambahkan interceptor
    @Post('/login')
    login(
      @Query('name') name: string, //akan membuat eror invalid type karena di validationPipe itu tipenya loginRequest zod bukan zod string
      @Body() request: LoginUserRequest
    ){
        // return `Hello ${request.username}`
        // retrun jadi json karena mau intercept tambah data

        return {
            data: `Hello ${request.username}`

        }
    }

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
        //HttpException
        if (!first_name) {
            throw new HttpException({
                code: 400,
                errors: "First name is required"
            }, 400)
        }
        return this.userRepository.save(first_name, last_name)
    }

    @Get('/hello')
    /*@UseFilters(ValidationFilter)*/ //penggunaan filter atau bisa juga langsung satu controller
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

    //Pipe untuk memastikan id integer dan mengubahnya
    // kalau gak pakai ParseIntPipe maka akan dianggap string karena compile JS
    // pipe bisa di param, query, atau body
    //pipe bukan hanya validasi atau konversi intinya paramnya diolah dulu atau transformasi
    //pipe bisa di pakai di semua controller
    @Get('/:id')
    getById(@Param('id', ParseIntPipe) id: number): string {
        console.info(id*10);
        return `GET ${id}`
    }

    //Normal
    // @Get('/:id')
    // getById(@Param('id') id: string): string {
    //     return `GET ${id}`
    // }
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

