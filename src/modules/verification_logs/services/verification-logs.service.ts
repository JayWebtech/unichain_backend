// src/modules/verification-logs/services/verification-logs.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationLog } from '../../../entities/verification-log.entity';
import { CreateVerificationLogDto } from '../data_transfer_objects/create-verification-log.dto';

@Injectable()
export class VerificationLogsService {
  private readonly logger = new Logger(VerificationLogsService.name);

  constructor(
    @InjectRepository(VerificationLog)
    private readonly repo: Repository<VerificationLog>,
  ) {}

  /**
   * Creates a new verification log
   * @param dto - Data transfer object with log details
   * @returns Created log with auto-generated timestamp
   * @throws Error if database operation fails
   */
  async create(dto: CreateVerificationLogDto) {
    try {
      const log = this.repo.create(dto);
      return await this.repo.save(log);
    } catch (error) {
      this.logger.error(`Failed to create log: ${error.message}`, error.stack);
      throw new Error('Database operation failed');
    }
  }

  /**
   * Retrieves all verification logs
   * @returns Array of verification logs
   */
  async findAll() {
    return this.repo.find();
  }
}