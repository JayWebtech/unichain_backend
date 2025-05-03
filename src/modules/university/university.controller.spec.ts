// src/modules/university/university.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';
import { BadRequestException } from '@nestjs/common';
import { ZodValidationPipe } from '../../utils/ZodValidationPipe';
import { registerUniversitySchema } from './schema/register-university.schema';

// Define interfaces
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

// Define a type matching what your service actually returns
type UniversityResponseData = Omit<CreateUniversityDTO, 'password'> & { id: number };

describe('UniversityController', () => {
  let controller: UniversityController;
  let service: UniversityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniversityController],
      providers: [
        {
          provide: UniversityService,
          useValue: {
            registerUniversity: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UniversityController>(UniversityController);
    service = module.get<UniversityService>(UniversityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerUniversity', () => {
    it('should register a university successfully', async () => {
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

      // Define the expected result directly matching what your service actually returns
      const expectedResult: UniversityResponseData = {
        id: 1,
        university_name: 'Example University',
        website_domain: 'exampleuniversity.edu',
        country: 'United States',
        university_email: 'info@exampleuniversity.edu',
        wallet_address: '0x123456789abcdef',
        staff_name: 'John Doe',
        job_title: 'Registrar',
        phone_number: '+1234567890',
        is_verified: false, 
        accreditation_body: 'Example Accreditation Body'
      };
      
      jest.spyOn(service, 'registerUniversity').mockResolvedValue(expectedResult);
      
      const result = await controller.registerUniversity(createUniversityDto);
      
      expect(service.registerUniversity).toHaveBeenCalledWith(createUniversityDto);
      expect(result).toEqual({
        message: 'University registered successfully',
        data: expectedResult
      });
    });
  });
});