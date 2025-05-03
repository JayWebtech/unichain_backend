import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { University } from '../modules/university/entities/university.entity';
import { SupportRequest } from '../modules/support/entities/support-request.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [University, SupportRequest],
  migrations: ['dist/migrations/*.js'],
  synchronize: true, // Enable auto-synchronization (use only in development)
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;