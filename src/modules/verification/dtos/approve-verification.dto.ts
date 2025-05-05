import { IsUUID, IsString } from 'class-validator';

export class ApproveVerificationDto {
  @IsUUID('4')
  verification_id: string;

  @IsString()
  approval_key: string;
}
