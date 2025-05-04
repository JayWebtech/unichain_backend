import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, Role } from '../auth/entities/admin.entity';
import { University } from '../university/entities/university.entity';
import { SignupAdminDto } from '../auth/dto/admin-signup.dto';
import { CreateUniversityDTO } from '../university/dtos/create-university.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async createAdminUser(createAdminUserDto: SignupAdminDto): Promise<Admin> {
    const { email, password, role } = createAdminUserDto;

    const existingUser = await this.adminRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (![Role.ADMIN, Role.SUPER_ADMIN].includes(role)) {
      throw new BadRequestException('Invalid role for admin user');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = this.adminRepository.create({
      email,
      password: hashedPassword,
      role,
    });

    return this.adminRepository.save(user);
  }

  async createUniversityUser(
    createUniversityUserDto: CreateUniversityDTO,
    universityId: string,
  ): Promise<Admin> {
    const existingUser = await this.adminRepository.findOne({
      where: { email: createUniversityUserDto.university_email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const { role } = createUniversityUserDto;
    if (role !== Role.UNIVERSITY_ADMIN) {
      throw new BadRequestException('Invalid role for university user');
    }

    const university = await this.universityRepository.findOne({
      where: { id: Number(universityId) },
    });
    if (!university) {
      throw new BadRequestException('University not found');
    }

    const emailDomain = createUniversityUserDto.university_email.split('@')[1];
    if (emailDomain !== university.website_domain) {
      throw new BadRequestException(
        'Email domain does not match university domain',
      );
    }

    const hashedPassword = await this.hashPassword(
      createUniversityUserDto.password,
    );

    const user = this.adminRepository.create({
      email: createUniversityUserDto.university_email,
      password: hashedPassword,
      role,
      university,
    });

    return this.adminRepository.save(user);
  }
}
