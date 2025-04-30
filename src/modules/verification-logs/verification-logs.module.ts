// src/modules/verification-logs/verification-logs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationLogsController } from './controllers/verification-logs.controller';
import { VerificationLogsService } from './services/verification-logs.service';
import { VerificationLog } from '../../entities/verification-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationLog]), // Clean feature-specific registration
  ],
  providers: [VerificationLogsService],
  controllers: [VerificationLogsController],
  exports: [VerificationLogsService],
})
export class VerificationLogsModule {}