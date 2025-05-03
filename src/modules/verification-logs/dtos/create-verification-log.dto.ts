// src/modules/verification-logs/data_transfer_objects/create-verification-log.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Data transfer object for creating verification logs
 * @field website_domain - Domain to verify (required)
 * @field status - Verification status (required)
 * @field certificate_id - Optional certificate reference
 */
export class CreateVerificationLogDto {
  @IsString()
  @IsNotEmpty()
  website_domain: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  certificate_id?: string;
}