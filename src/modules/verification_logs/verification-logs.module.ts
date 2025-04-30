// src/modules/verification-logs/verification-logs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationLog } from '../../entities/verification-log.entity';
import { VerificationLogsService } from './services/verification-logs.service';
import { VerificationLogsController } from './controllers/verification-logs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationLog]), // Clean feature-specific registration
  ],
  providers: [VerificationLogsService],
  controllers: [VerificationLogsController],
})
export class VerificationLogsModule {}