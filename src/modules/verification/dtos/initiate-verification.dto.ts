// src/verification/dto/initiate-verification.dto.ts
import { IsUUID } from 'class-validator';

export class InitiateVerificationDto {
  @IsUUID('4')
  certificate_id: string;
}

// src/verification/dto/initiate-verification-response.dto.ts
import { IsUUID, IsString } from 'class-validator';

export class InitiateVerificationResponseDto {
  @IsUUID('4')
  verification_id: string;

  @IsString()
  graduate_link: string;
}

// src/verification/dto/approve-verification.dto.ts
import { IsUUID, IsString } from 'class-validator';

export class ApproveVerificationDto {
  @IsUUID('4')
  verification_id: string;

  @IsString()
  approval_key: string;
}
