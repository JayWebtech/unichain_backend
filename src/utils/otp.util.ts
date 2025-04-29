import * as otpGenerator from 'otp-generator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OTPUtil {
  generateOTP(): string {
    return otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
  }

  getOTPExpiration(minutes = 5): Date {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60000);
  }

  isOTPExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}