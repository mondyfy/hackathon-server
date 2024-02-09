import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { IMail, MailInput } from './interfaces/mail.interface';

const configService = new ConfigService();

@Injectable()
export class MailService {
  private logger = new Logger();

  private smtpTransport;
  constructor() {
    this.smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: configService.get('EMAIL_AUTH_USERNAME'),
        pass: configService.get('EMAIL_AUTH_PASSWORD'),
      },
    });
  }

  public async sendMail(mail: IMail) {
    const mailOptions: MailInput = {
      from: `SON <${configService.get('SENDER_EMAIL')}>`,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
    };
    try {
      await this.smtpTransport.sendMail(mailOptions, function (error) {
        if (error) {
          this.logger.warn(`Problem in sending email: ${error}`);
        } else {
          this.logger.log(`Successfully sent email.`);
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
