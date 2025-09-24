import { Injectable } from '@nestjs/common';
import { IEmailService } from './email.interface';
import { MailgunMailService } from './mailgun.service';
import { NodemailerMailService } from './nodemailer.service';

@Injectable()
export class MailService implements IEmailService {
  constructor(
    private readonly mgs: MailgunMailService,
    private readonly nms: NodemailerMailService,
  ) {}

  async sendPasswordReset(email: string, token: string): Promise<void> {
    try {
      console.log('Attempting to send email via Mailgun ...');
      await this.mgs.sendPasswordReset(email, token);
    } catch (error) {
      console.error(
        'Mailgun service failed. Falling back  to Nodemailer (secondary).',
        error,
      );
      try {
        await this.nms.sendPasswordReset(email, token);
      } catch (secError) {
        console.log('Nodemailer service also failed. ', secError);
        throw secError;
      }
    }
  }
}
