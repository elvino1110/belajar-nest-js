import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Connection } from '../connection/connection';
import { mailService, MailService } from '../mail/mail.service';

@Injectable()
export class MemberService {
    //mengambil modul secara manual
    constructor(private modulRef: ModuleRef) {

    }

    getConnectionName(): string {
        const connection = this.modulRef.get(Connection)
        return connection.getName()
    }

    sendEmail() {
        const emailService = this.modulRef.get(MailService)
        mailService.send()
    }
}
