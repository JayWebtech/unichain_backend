import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupAdminDto } from '../auth/dto/admin-signup.dto';
import { CreateUniversityDTO } from '../university/dtos/create-university.dto';
import { RolesGuard } from '../../config/guard/roles.guard';
import { Roles } from '../../config/decorators/roles.decorator';
import { Role } from '../auth/entities/admin.entity';
import { Request } from 'express';

interface CustomRequest extends Request {
  user: {
    universityId: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async createAdminUser(@Body() createAdminUserDto: SignupAdminDto) {
    return this.usersService.createAdminUser(createAdminUserDto);
  }
  @Post('university')
  @UseGuards(RolesGuard)
  @Roles(Role.UNIVERSITY_ADMIN)
  async createUniversityUser(
    @Body() createUniversityUserDto: CreateUniversityDTO,
    @Req() req: CustomRequest,
  ) {
    const universityId = req.user.universityId;
    return this.usersService.createUniversityUser(
      createUniversityUserDto,
      universityId,
    );
  }
}
