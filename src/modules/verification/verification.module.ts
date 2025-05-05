// src/verification/verification.module.ts
import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { VerificationGateway } from './verification.gateway';
import { VerificationStorage } from './verification.storage'; // Import storage

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, VerificationGateway, VerificationStorage], // Add VerificationStorage here
  // If other modules need to use VerificationService or VerificationGateway, export them:
  // exports: [VerificationService, VerificationGateway],
})
export class VerificationModule {}
