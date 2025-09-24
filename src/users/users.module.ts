import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.providers';
import { NodemailerMailService } from 'src/email/nodemailer.service';
import { EMAIL_SERVICE } from 'src/email/email.interface';
import { MailgunMailService } from 'src/email/mailgun.service';
import { MailService } from 'src/email/mail.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    MailgunMailService,
    NodemailerMailService,
    { provide: EMAIL_SERVICE, useClass: MailService },
    ...userProviders,
  ],
})
export class UsersModule {}
