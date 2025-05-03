import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportRequestDTO } from './dtos/create-support-request.dto';
import { ZodValidationPipe } from 'src/utils/ZodValidationPipe';
import { supportRequestSchema } from './schema/support-request.schema';
import { SupportRequest } from './entities/support-request.entity';

interface CreateSupportRequestResponse {
  message: string;
  data: SupportRequest;
}

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('request')
  @UsePipes(new ZodValidationPipe(supportRequestSchema))
  async createSupportRequest(@Body() supportRequestData: CreateSupportRequestDTO): Promise<CreateSupportRequestResponse> {
    const supportRequest = await this.supportService.createSupportRequest(supportRequestData);
    return {
      message: 'Support request submitted successfully',
      data: supportRequest,
    };
  }

  @Get('requests')
  async getAllSupportRequests(): Promise<SupportRequest[]> {
    return this.supportService.getAllSupportRequests();
  }
}