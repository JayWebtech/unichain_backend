import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { University } from './entities/university.entity';
import { CreateUniversityDTO } from './dtos/create-university.dto';
import { MailService } from '../mail/mail.service';
import { SendSecretKeysDTO } from './dtos/send-secret-keys.dto';

type UniversityResponse = Omit<University, 'password'>;

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(University)
    private universityRepository: Repository<University>,
    private readonly mailService: MailService,
  ) {}

  async registerUniversity(data: CreateUniversityDTO): Promise<UniversityResponse> {
    // Check if university with the same email exists
    const existingUniversity = await this.universityRepository.findOne({
      where: { university_email: data.university_email }
    });

    if (existingUniversity) {
      throw new ConflictException('University with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const university = this.universityRepository.create({
      ...data,
      password: hashedPassword,
    });

    const savedUniversity = await this.universityRepository.save(university);
    
    // Exclude password from the returned data
    const { password, ...universityWithoutPassword } = savedUniversity;
    return universityWithoutPassword;
  }

  async sendSecretKeys(data: SendSecretKeysDTO): Promise<{ message: string; results: { email: string; success: boolean }[] }> {
    const results = await Promise.all(
      data.data.map(async ({ email, secretKey }) => {
        try {
          await this.mailService.sendSecreteKey(email, secretKey);
          return { email, success: true };
        } catch (error) {
          console.error(`Failed to send secret key to ${email}:`, error);
          return { email, success: false };
        }
      })
    );

    return {
      message: 'Secret keys sending process completed',
      results,
    };
  }
}
