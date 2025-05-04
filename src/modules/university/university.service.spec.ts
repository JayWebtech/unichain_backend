// src/modules/university/university.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UniversityService } from './university.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Define DTO interface
interface CreateUniversityDTO {
  university_name: string;
  website_domain: string;
  country: string;
  accreditation_body?: string;
  university_email: string;
  wallet_address: string;
  staff_name: string;
  job_title: string;
  phone_number: string;
  password: string;
  is_verified: boolean;
}

// Mock bcrypt to avoid actual hashing during tests
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashedPassword')),
}));

describe('UniversityService', () => {
  let service: UniversityService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversityService,
        {
          provide: getRepositoryToken(University),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UniversityService>(UniversityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUniversity', () => {
    it('should successfully register a university', async () => {
      const createUniversityDto: CreateUniversityDTO = {
        university_name: 'Example University',
        website_domain: 'exampleuniversity.edu',
        country: 'United States',
        university_email: 'info@exampleuniversity.edu',
        wallet_address: '0x123456789abcdef',
        staff_name: 'John Doe',
        job_title: 'Registrar',
        phone_number: '+1234567890',
        password: 'SecurePassword123!',
        is_verified: false,
        accreditation_body: 'Example Accreditation Body'
      };

      const savedUniversity = {
        id: 1,
        ...createUniversityDto,
        password: 'hashedPassword',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createUniversityDto);
      mockRepository.save.mockResolvedValue(savedUniversity);

      // Update the expected return value based on your actual service implementation
      const { password, ...expectedData } = savedUniversity;
     
      // Mock the actual return value from your service
      const result = await service.registerUniversity(createUniversityDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { university_email: createUniversityDto.university_email }
      });
    });
  });
});