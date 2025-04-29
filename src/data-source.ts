import { DataSource } from 'typeorm';
import { VerificationLog } from './entities/verification-log.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'certiva',
  entities: [VerificationLog],
  migrations: ['src/migrations/*.ts'],
  synchronize: false
});