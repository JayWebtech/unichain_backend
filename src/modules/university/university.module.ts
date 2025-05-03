import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';
import { University } from './entities/university.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([University]),
    MailModule,
  ],
  providers: [UniversityService],
  controllers: [UniversityController]
})
export class UniversityModule {}
