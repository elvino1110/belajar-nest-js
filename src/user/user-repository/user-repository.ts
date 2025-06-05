import { Inject, Injectable } from '@nestjs/common';
import { Connection } from '../connection/connection';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { User } from 'generated/prisma';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class UserRepository {
    constructor(
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
    ) {
        // console.info(`Create user repository`)
        this.logger.info(`Create user repository`)
    }
    async save(first_name: string, last_name?: string): Promise<User> {
        this.logger.info(`Create user with firstName ${first_name} and lastName ${last_name}`)
        return await this.prismaService.user.create({
            data: {
                first_name: first_name,
                last_name: last_name
            }
        })
    }
}

//Factory Provider
// export class UserRepository {
//     connection: Connection

//     save() {
//         console.info(`save user with connection ${this.connection.getName()}`)
//     }
// }

// export function createUserRepository(connection: Connection) : UserRepository { //otomatis akan ke inject parammnya
//     const repository = new UserRepository()
//     repository.connection = connection
//     return repository
// }
