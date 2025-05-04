import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { OTPUtil } from 'src/utils/otp.util';
import { Admin } from './entities/admin.entity';
import { OTP } from './entities/otp.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Admin,OTP]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minute
        limit: 5, // 5 requests per minute for login attempts
      },
      {
        name: 'long',
        ttl: 3600000, // 1 hour
        limit: 3, // 3 requests per hour for OTP attempts
      },
    ]),
    MailModule,
  ],
 
  controllers: [AuthController],
  providers: [AuthService,OTPUtil],
  exports: [AuthService],
})
export class AuthModule { }
