import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVerificationLogDto {
  @IsString()
  @IsNotEmpty()
  website_domain: string;  // e.g., "example.com"

  @IsString()
  @IsNotEmpty()
  status: string;  // e.g., "verified", "pending", "failed"

  @IsString()
  @IsOptional()
  certificate_id?: string;  // e.g., "cert_123" (optional)
}