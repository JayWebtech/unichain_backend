// import { MailerService } from '@nestjs-modules/mailer';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class MailService {
//     constructor(private readonly mailerService: MailerService) {}

//     async sendOTP(email: string, otp: string):Promise<boolean>{
//         try { 
//         await this.mailerService.sendMail({ 
//             to: email,
//             subject: 'Your OTP for verification',
//             template: './templates/otp',
//             context: {
//                 otp,
//             },
//         });
//         return true;
//         }
//         catch(error){
//             console.error('Error sending email:', error);
//             return false;
//         }
//     }
// }


import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'), //eg smtp.gmail.com
      port: this.configService.get('SMTP_PORT'), //eg 587
      secure: false, //true for 465, false for other ports
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"Certiva" <${this.configService.get('SMTP_FROM_EMAIL')}>`,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <div>
            <h2>Your One-Time Password (OTP)</h2>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>This code expires in 5 minutes.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
  async sendSecreteKey(email: string, key: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"Certiva" <${this.configService.get('SMTP_FROM_EMAIL')}>`,
        to: email,
        subject: 'Your Secret Key',
        html: `
          <div>
            <h2>Your One-Time Password (OTP)</h2>
            <p>Your secret is: <strong>${key}</strong></p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}
