import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// We use require instead of import to avoid TypeScript path resolution issues
// with the TypeORM CLI
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'certiva',
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: false
});

export default dataSource;