// src/modules/verification-logs/controllers/verification-logs.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { VerificationLogsController } from './verification-logs.controller';
import { VerificationLogsService } from '../services/verification-logs.service';
import { HttpException } from '@nestjs/common';

describe('VerificationLogsController', () => {
  let controller: VerificationLogsController;
  let service: VerificationLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationLogsController],
      providers: [
        {
          provide: VerificationLogsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VerificationLogsController>(VerificationLogsController);
    service = module.get<VerificationLogsService>(VerificationLogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a verification log', async () => {
      const createDto = {
        website_domain: 'example.com',
        status: 'verified',
        certificate_id: 'cert_12345',
      };

      const expectedResult = {
        id: 1,
        website_domain: 'example.com',
        status: 'verified',
        certificate_id: 'cert_12345',
        created_at: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw HttpException when creation fails', async () => {
      const createDto = {
        website_domain: 'example.com',
        status: 'verified',
        certificate_id: 'cert_12345',
      };

      jest.spyOn(service, 'create').mockRejectedValue(new Error('Database operation failed'));

      await expect(controller.create(createDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return an array of verification logs', async () => {
      const expectedResult = [
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

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});