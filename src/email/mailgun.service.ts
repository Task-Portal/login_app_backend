import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { IEmailService } from './email.interface';

@Injectable()
export class MailgunMailService implements IEmailService {
  private mailgun: Mailgun;

  constructor(private readonly cs: ConfigService) {
    this.mailgun = new Mailgun(formData);
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const mg = this.mailgun.client({
      username: this.cs.get<string>('MAILGUN_USERNAME')!,
      key: this.cs.get<string>('MAILGUN_API_KEY')!,
    });

    const resetLink = `${this.cs.get<string>('REACT_FRONTED_URL')}reset-password?token=${token}`;
    const domain = this.cs.get<string>('MAILGUN_DOMAIN')!;

    const messageData = {
      from: `Support <mailgun@${domain}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h3>Password Reset</h3>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    try {
      await mg.messages.create(domain, messageData);
      console.log('Password reset email sent via Mailgun.');
    } catch (error) {
      console.error('Error sending email with Mailgun:', error);
      // We throw the error so our failover service knows something went wrong.
      throw error;
    }
  }
}
