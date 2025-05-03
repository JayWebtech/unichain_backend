// typeorm.config.js - This file will be used directly by the TypeORM CLI
require('dotenv').config();
const path = require('path');

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'certiva',
  // Use glob patterns to avoid TypeScript path resolution issues
  entities: [
    path.join(__dirname, 'src', 'entities', '*.entity.{ts,js}'),
    path.join(__dirname, 'dist', 'entities', '*.entity.js')
  ],
  migrations: [
    path.join(__dirname, 'src', 'migrations', '*.{ts,js}'),
    path.join(__dirname, 'dist', 'migrations', '*.js')
  ],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations'
  },
  synchronize: false
};