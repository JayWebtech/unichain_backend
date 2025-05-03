import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MailService } from '../../mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

// Add type for mocked bcrypt
jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockMailService = {
    sendOtp: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      if (key === 'JWT_EXPIRATION') return '1h';
      return null;
    }),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: MailService, useValue: mockMailService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('verifyOtp', () => {
    it('should verify correct OTP', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      const hashedOtp = await bcrypt.hash(otp, 10);
      const mockUser = {
        id: 1,
        email,
        otp: hashedOtp,
        otpCreatedAt: new Date(),
        otpAttempts: 0,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyOtp(email, otp);
      expect(result.token).toBe('test-token');
      expect(bcrypt.compare).toHaveBeenCalledWith(otp, hashedOtp);
    });

    it('should reject incorrect OTP', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      const mockUser = {
        id: 1,
        email,
        otp: await bcrypt.hash(otp, 10),
        otpCreatedAt: new Date(),
        otpAttempts: 0,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.verifyOtp(email, 'wrong-otp')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
