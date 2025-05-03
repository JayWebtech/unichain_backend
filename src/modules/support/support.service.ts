import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportRequest } from './entities/support-request.entity';
import { CreateSupportRequestDTO } from './dtos/create-support-request.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportRequest)
    private supportRequestRepository: Repository<SupportRequest>,
  ) {}

  /**
   * Create a new support request
   * @param supportRequestData Support request data
   * @returns The created support request
   */
  async createSupportRequest(supportRequestData: CreateSupportRequestDTO): Promise<SupportRequest> {
    try {
      const supportRequest = this.supportRequestRepository.create(supportRequestData);
      return await this.supportRequestRepository.save(supportRequest);
    } catch (error) {
      throw new InternalServerErrorException('Could not create support request: ' + error.message);
    }
  }

  /**
   * Get all support requests
   * @returns Array of support requests
   */
  async getAllSupportRequests(): Promise<SupportRequest[]> {
    try {
      return await this.supportRequestRepository.find({
        order: {
          created_at: 'DESC',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Could not retrieve support requests: ' + error.message);
    }
  }
}