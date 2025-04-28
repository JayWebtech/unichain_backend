import { DataSource } from 'typeorm';
import { VerificationLog } from './entities/verification-log.entity';
import * as dotenv from 'dotenv';

// Load environment variables (if not already loaded globally)
dotenv.config();

export const FeatureDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'your_database_name',
  entities: [VerificationLog],
  migrations: ['src/verification-logs/migrations/*.ts'],
  migrationsTableName: 'verification_logs_migrations', // Isolate your migration history
  synchronize: false // Always false for migrations
});