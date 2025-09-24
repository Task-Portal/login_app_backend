import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { IEmailService } from './email.interface';

@Injectable()
export class NodemailerMailService implements IEmailService {
  private transporter: Transporter<SentMessageInfo>;

  constructor(private readonly cs: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: cs.get<string>('MAIL_USER'),
        pass: cs.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const resetLink = `${this.cs.get<string>('REACT_FRONTED_URL')}reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"Support" <${this.cs.get<string>('MAIL_USER')}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
        <h3>Password Reset</h3>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
      });
      console.log('Password reset email sent via Nodemailer.');
    } catch (error) {
      console.error('Error sending email with Nodemailer:', error);
      // We throw the error so our failover service knows something went wrong.
      throw error;
    }
  }
}
