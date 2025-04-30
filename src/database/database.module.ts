// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { VerificationLog } from '../entities/verification-log.entity'; // <-- New import

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOptions, // Preserves all existing config
        autoLoadEntities: true, // Keeps current auto-load behavior
        entities: [
          ...dataSourceOptions.entities, // Existing entities
          VerificationLog // <-- Add entity
        ],
      }),
    }),
  ],
})
export class DatabaseModule {}
