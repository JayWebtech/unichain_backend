import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../auth/entities/admin.entity';
import { University } from '../university/entities/university.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, University])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
