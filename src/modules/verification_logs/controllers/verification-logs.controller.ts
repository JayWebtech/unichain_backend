// src/modules/verification-logs/controllers/verification-logs.controller.ts
import { 
    Controller, 
    Post, 
    Get, 
    Body, 
    HttpException, 
    HttpStatus,
    UsePipes,
    ValidationPipe
  } from '@nestjs/common';
  import { VerificationLogsService } from '../services/verification-logs.service';
  import { CreateVerificationLogDto } from '../data_transfer_objects/create-verification-log.dto';
  
  /**
   * Handles HTTP requests for verification logs
   * @route /verification-logs
   */
  @Controller('verification-logs')
  @UsePipes(new ValidationPipe({ transform: true })) // Auto-validate all requests
  export class VerificationLogsController {
    constructor(private readonly service: VerificationLogsService) {}
  
    /**
     * Creates a new verification log
     * @param dto - Validated request data
     * @returns Created log record
     * @throws HTTP 400 if validation fails
     * @throws HTTP 500 if database error occurs
     */
    @Post()
    async create(@Body() dto: CreateVerificationLogDto) {
      try {
        return await this.service.create(dto);
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Failed to create log',
            details: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    /**
     * Retrieves all verification logs
     * @returns Array of existing logs
     */
    @Get()
    async findAll() {
      return this.service.findAll();
    }
  }