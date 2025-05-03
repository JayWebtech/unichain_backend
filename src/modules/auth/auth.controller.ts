import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  PasswordLoginDto,
  OtpRequestDto,
  OtpVerifyDto,
  WalletLoginDto,
} from './dto/auth.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SignupAdminDto } from './dto/admin-signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginAdminDto } from './dto/admin-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/password')
  @UseGuards(ThrottlerGuard)
  @HttpCode(200)
  async loginWithPassword(@Body() passwordLoginDto: PasswordLoginDto) {
    return this.authService.validatePassword(
      passwordLoginDto.email,
      passwordLoginDto.password,
    );
  }

  @Post('login/otp/send')
  @UseGuards(ThrottlerGuard)
  @HttpCode(200)
  async sendOtp(@Body() otpRequestDto: OtpRequestDto) {
    return this.authService.generateOtp(otpRequestDto.email);
  }

  @Post('login/otp/verify')
  @HttpCode(200)
  async verifyOtp(@Body() otpVerifyDto: OtpVerifyDto) {
    return this.authService.verifyOtp(otpVerifyDto.email, otpVerifyDto.otp);
  }

  @Post('login/otp/resend')
  @UseGuards(ThrottlerGuard)
  @HttpCode(200)
  async resendOtp(@Body() otpRequestDto: OtpRequestDto) {
    return this.authService.generateOtp(otpRequestDto.email);
  }

  @Post('login/wallet')
  @HttpCode(200)
  async loginWithWallet(@Body() walletLoginDto: WalletLoginDto) {
    return this.authService.validateWalletAddress(
      walletLoginDto.email,
      walletLoginDto.walletAddress,
    );
  }

  @Post("admin/signup")
  async signupAdmin(@Body() signupAdminDto: SignupAdminDto){
      return this.authService.signupAdmin(signupAdminDto);
  }

  @Post('admin/login')
  async loginAdmin(@Body() loginAdminDto: LoginAdminDto){
      return this.authService.loginAdmin(loginAdminDto);
  }

  @Post('admin/verify-otp')
  async verifyAdminOtp(@Body() verifyOtpDto: VerifyOtpDto){
      return this.authService.verifyAdminOtp(verifyOtpDto);
  }
}
