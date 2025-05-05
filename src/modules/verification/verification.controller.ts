// src/verification/verification.controller.ts
import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { InitiateVerificationDto } from './dtos/initiate-verification.dto';
import { InitiateVerificationResponseDto } from './dto/initiate-verification-response.dto';
import { ApproveVerificationDto } from './dtos/approve-verification.dto';

@Controller('api/verify')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.OK) // Return 200 OK on success
  async initiateVerification(
    @Body() initiateDto: InitiateVerificationDto,
  ): Promise<InitiateVerificationResponseDto> {
    return this.verificationService.initiateVerification(initiateDto);
  }

  @Post('approve')
  @HttpCode(HttpStatus.OK) // Return 200 OK on success
  async approveVerification(@Body() approveDto: ApproveVerificationDto): Promise<{ success: boolean }> {
    const success = await this.verificationService.approveVerification(approveDto);
    return { success };
  }
}
