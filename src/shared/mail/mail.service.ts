import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()

export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendInvitation(email: string, link: string) {
    await this.transporter.sendMail({
      from: `"Keka HRMS" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'You are invited to Keka HRMS',
      html: `
        <h3>Welcome!</h3>
        <p>You are invited to join Keka HRMS.</p>
        <a href="${link}">Accept Invitation</a>
          <p>This link expires in 7 days.</p>
      `,
    });
  }
}
