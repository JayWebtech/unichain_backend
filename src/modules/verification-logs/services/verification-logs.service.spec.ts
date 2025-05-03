// src/modules/verification-logs/services/verification-logs.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { VerificationLogsService } from './verification-logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VerificationLog } from '../../../entities/verification-log.entity';
import { Logger } from '@nestjs/common';

describe('VerificationLogsService', () => {
  let service: VerificationLogsService;
  let mockRepository;
  let mockLogger;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    mockLogger = {
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationLogsService,
        {
          provide: getRepositoryToken(VerificationLog),
          useValue: mockRepository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        }
      ],
    }).compile();

    service = module.get<VerificationLogsService>(VerificationLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a verification log', async () => {
      const createDto = {
        website_domain: 'example.com',
        status: 'verified',
        certificate_id: 'cert_12345',
      };

      const verificationLog = {
        id: 1,
        ...createDto,
        created_at: new Date(),
      };

      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockResolvedValue(verificationLog);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(verificationLog);
    });

    it('should throw error when database operation fails', async () => {
      const createDto = {
        website_domain: 'example.com',
        status: 'verified',
        certificate_id: 'cert_12345',
      };

      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      // This must match EXACTLY the error message thrown in your service implementation
      await expect(service.create(createDto)).rejects.toThrow('Database operation failed');
    });
  });

  describe('findAll', () => {
    it('should return all verification logs', async () => {
      const expectedLogs = [
        {
          id: 1,
          website_domain: 'example1.com',
          status: 'verified',
          certificate_id: 'cert_12345',
          created_at: new Date(),
        },
        {
          id: 2,
          website_domain: 'example2.com',
          status: 'pending',
          certificate_id: 'cert_67890',
          created_at: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(expectedLogs);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedLogs);
    });
  });
});