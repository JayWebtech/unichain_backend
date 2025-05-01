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
import { OTPUtil } from 'src/utils/otp.util';
import { MailService } from '../mail/mail.service';
import { OTP } from './entities/otp.entity';
import { Admin } from './entities/admin.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginAdminDto } from './dto/admin-login.dto';
import { SignupAdminDto } from './dto/admin-signup.dto';

// Rate limit record interface
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
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    private otpUtil: OTPUtil,
    private readonly mailService: MailService,
  ) {}

  private checkRateLimit(
    key: string,
    store: Map<string, RateLimitRecord>,
    maxAttempts: number,
    windowMs: number,
    errorMessage: string,
  ): void {
    const now = Date.now();
    const record = store.get(key);

    if (record) {
      if (now - record.firstAttempt > windowMs) {
        store.set(key, { count: 1, firstAttempt: now });
      } else if (record.count >= maxAttempts) {
        throw new BadRequestException(errorMessage);
      } else {
        store.set(key, {
          count: record.count + 1,
          firstAttempt: record.firstAttempt,
        });
      }
    } else {
      store.set(key, { count: 1, firstAttempt: now });
    }
  }

  async validatePassword(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
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

  async generateOtp(email: string): Promise<{ message: string; otp?: string }> {
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

  async verifyOtp(email: string, otp: string): Promise<{ token: string }> {
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
  ): Promise<{ token: string }> {
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
      getAddress(walletAddress); // Validates checksum
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

  private generateToken(user: User): { token: string } {
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { token };
  }
  async signupAdmin(signupAdminDto: SignupAdminDto) {
    if (signupAdminDto.password !== signupAdminDto.passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingAdmin = await this.adminRepository.findOne({
      where: { email: signupAdminDto.email },
    });

    if (existingAdmin) {
      throw new BadRequestException('Admin already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(signupAdminDto.password, 10);

    // create new admin
    const admin = this.adminRepository.create({
      email: signupAdminDto.email,
      password: hashedPassword,
    });

    // save admin
    await this.adminRepository.save(admin);

    // geneare and send otp for signup verificaition
    const otpCode = this.otpUtil.generateOTP();
    const expiresAt = this.otpUtil.getOTPExpiration();
    const otp = this.otpRepository.create({
      code: otpCode,
      expiresAt,
      admin,
    });

    await this.otpRepository.save(otp);
    // console.log(`SIGNUP OTP FOR ${admin.email}: ${otpCode} (Expires at: ${expiresAt})`);

    // send otp to admin email
    await this.mailService.sendOtpEmail(admin.email, otpCode);

    return {
      message: 'Admin created successfully. OTP sent to email for verification',
      email: admin.email,
    };
  }

  async validateAdmin(email: string, password: string) {
    const admin = await this.adminRepository.findOne({ where: { email } });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return admin;
  }

  async loginAdmin(loginAdminDto: LoginAdminDto) {
    const admin = await this.validateAdmin(
      loginAdminDto.email,
      loginAdminDto.password,
    );

    // generate and save otp
    const otpCode = this.otpUtil.generateOTP();
    const expiresAt = this.otpUtil.getOTPExpiration();

    const otp = this.otpRepository.create({
      code: otpCode,
      expiresAt,
      admin,
    });
    await this.otpRepository.save(otp);
    // console.log(`LOGIN OTP FOR ${admin.email}: ${otpCode} (Expires at: ${expiresAt})`);

    await this.mailService.sendOtpEmail(admin.email, otpCode);

    return {
      message: 'OTP sent to your email',
      email: admin.email,
    };
  }
  async verifyAdminOtp(verifyOtpDto: VerifyOtpDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: verifyOtpDto.email },
      relations: ['otps'],
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    // find the recent otp
    const otp = await this.otpRepository.findOne({
      where: {
        admin: { id: admin.id },
        isUsed: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!otp) {
      throw new UnauthorizedException('No active OTP found');
    }
    if (this.otpUtil.isOTPExpired(otp.expiresAt)) {
      throw new UnauthorizedException('OTP expired');
    }
    if (otp.code !== verifyOtpDto.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // mark otp as used
    otp.isUsed = true;
    await this.otpRepository.save(otp);

    if (!admin.isVerified) {
      admin.isVerified = true;
      await this.adminRepository.save(admin);
    }

    // generate and sign jwt token
    const payload = {
      email: admin.email,
      sub: admin.id,
      isVerified: admin.isVerified,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      email: admin.email,
      isVerified: admin.isVerified,
    };
  }
}
