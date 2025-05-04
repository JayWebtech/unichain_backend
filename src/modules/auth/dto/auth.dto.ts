import {
  IsEmail,
  IsString,
  Length,
  Matches,
  IsNumberString,
} from 'class-validator';

export class PasswordLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 30)
  password: string;
}

export class OtpRequestDto {
  @IsEmail()
  email: string;
}

export class OtpVerifyDto {
  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(6, 6)
  otp: string;
}

export class WalletLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(42, 42)
  @Matches(/^0x[a-fA-F0-9]{40}$/)
  walletAddress: string;
}
