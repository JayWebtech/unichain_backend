import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { InitiateVerificationDto } from './dto/initiate-verification.dto';
import { InitiateVerificationResponseDto } from './dto/initiate-verification-response.dto';
import { ApproveVerificationDto } from './dto/approve-verification.dto';
import { VerificationStorage } from './verification.storage'; // Using in-memory storage
import { VerificationGateway } from './verification.gateway';

@Injectable()
export class VerificationService {
  private readonly graduateBaseUrl = 'https://localhost:3000/verify'; // Replace with your front-end URL
  private readonly saltRounds = 10; // For bcrypt

  constructor(
    private readonly verificationStorage: VerificationStorage, // Inject storage
    private readonly verificationGateway: VerificationGateway, // Inject gateway
  ) {}

  async initiateVerification(
    initiateDto: InitiateVerificationDto,
  ): Promise<InitiateVerificationResponseDto> {
    const verificationId = uuidv4();
    const approvalKey = this.generateSecretKey(); // Generate a random key
    const secretKeyHash = await bcrypt.hash(approvalKey, this.saltRounds);

    const newVerification = {
      verificationId,
      certificateId: initiateDto.certificate_id,
      secretKeyHash,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.verificationStorage.create(newVerification);

    const graduateLink = `${this.graduateBaseUrl}/${verificationId}`;

    // In a real application, you would associate this verification with an employer's WebSocket connection
    // For this example, we'll assume the employer client will listen for an event related to the verificationId

    return {
      verification_id: verificationId,
      graduate_link: graduateLink,
    };
  }

  async approveVerification(approveDto: ApproveVerificationDto): Promise<boolean> {
    const verification = await this.verificationStorage.findById(approveDto.verification_id);

    if (!verification) {
      throw new NotFoundException('Verification record not found.');
    }

    if (verification.status !== 'pending') {
      throw new BadRequestException(`Verification is already ${verification.status}.`);
    }

    const isKeyValid = await bcrypt.compare(approveDto.approval_key, verification.secretKeyHash);

    if (isKeyValid) {
      await this.verificationStorage.update(verification.verificationId, { status: 'approved' });

      // Emit WebSocket event to notify the employer
      // In a real app, you'd target a specific client or room associated with the employer
      this.verificationGateway.handleVerificationApproved(verification.verificationId, 'approved');

      return true;
    } else {
      // Optional: Update status to rejected after a few failed attempts or immediately
      // await this.verificationStorage.update(verification.verificationId, { status: 'rejected' });
      // this.verificationGateway.handleVerificationApproved(verification.verificationId, 'rejected');
      throw new BadRequestException('Invalid approval key.');
    }
  }

  // Simple function to generate a random key (you might want a more robust approach)
  private generateSecretKey(): string {
    return Math.random().toString(36).substring(2, 15); // Example: generates a random alphanumeric string
  }
}
