// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { getAddress } from 'ethers';

// Simple in-memory rate limiting
interface RateLimitRecord {
  count: number;
  firstAttempt: number;
}

@Injectable()
export class AuthService {
  private passwordAttempts = new Map<string, RateLimitRecord>();
  private otpAttempts = new Map<string, RateLimitRecord>();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private checkRateLimit(
    email: string,
    store: Map<string, RateLimitRecord>,
    maxAttempts: number,
    windowMs: number,
    errorMessage: string,
  ): void {
    const now = Date.now();
    const record = store.get(email);

    if (record) {
      if (now - record.firstAttempt > windowMs) {
        store.set(email, { count: 1, firstAttempt: now });
      } else if (record.count >= maxAttempts) {
        throw new BadRequestException(errorMessage);
      } else {
        store.set(email, {
          count: record.count + 1,
          firstAttempt: record.firstAttempt,
        });
      }
    } else {
      store.set(email, { count: 1, firstAttempt: now });
    }
  }

  async validatePassword(email: string, password: string): Promise<any> {
    this.checkRateLimit(
      email,
      this.passwordAttempts,
      5,
      15 * 60 * 1000,
      'Too many login attempts. Please try again later.',
    );

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  async generateOtp(email: string): Promise<any> {
    this.checkRateLimit(
      email,
      this.otpAttempts,
      3,
      60 * 60 * 1000,
      'Too many OTP requests. Please try again later.',
    );

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.otp = hashedOtp;
    user.otpCreatedAt = new Date();
    user.otpAttempts = 0;
    await this.usersRepository.save(user);

    const isDevelopment =
      this.configService.get<string>('NODE_ENV') === 'development';

    return {
      message: 'OTP sent successfully',
      ...(isDevelopment && { otp }),
    };
  }

  async verifyOtp(email: string, otp: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.otp || !user.otpCreatedAt) {
      throw new BadRequestException('OTP not requested or expired');
    }

    const otpAge = new Date().getTime() - user.otpCreatedAt.getTime();
    if (otpAge > 10 * 60 * 1000) {
      throw new BadRequestException('OTP expired');
    }

    if (user.otpAttempts >= 3) {
      throw new BadRequestException(
        'Too many failed attempts. Request a new OTP',
      );
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      user.otpAttempts += 1;
      await this.usersRepository.save(user);
      throw new UnauthorizedException('Invalid OTP');
    }

    user.otp = undefined;
    user.otpCreatedAt = undefined;
    user.otpAttempts = 0;
    await this.usersRepository.save(user);

    return this.generateToken(user);
  }

  async validateWalletAddress(
    email: string,
    walletAddress: string,
  ): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.walletAddress) {
      throw new BadRequestException(
        'No wallet address registered for this user',
      );
    }

    try {
      getAddress(walletAddress);
    } catch (error) {
      throw new BadRequestException('Invalid wallet address format');
    }

    if (walletAddress.toLowerCase() !== user.walletAddress.toLowerCase()) {
      throw new UnauthorizedException(
        'Wallet address does not match registered address',
      );
    }

    return this.generateToken(user);
  }

  // ✅ Here is the missing generateToken method
  private generateToken(user: User): { token: string } {
    const payload = { sub: user.id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
