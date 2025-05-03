import { DataSource } from 'typeorm';
import { VerificationLog } from './verification-log.entity.root';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [VerificationLog],
  migrations: ['./migrations/*.ts'],
  synchronize: false,
});