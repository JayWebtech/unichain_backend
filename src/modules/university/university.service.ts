import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { University } from './entities/university.entity';
import { CreateUniversityDTO } from './dtos/create-university.dto';

type UniversityResponse = Omit<University, 'password'>;

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(University)
    private universityRepository: Repository<University>,
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
}
