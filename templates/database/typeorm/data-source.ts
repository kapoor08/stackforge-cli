import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';

const DATABASE_URL = process.env.DATABASE_URL || '';

export const AppDataSource = new DataSource({
  type: '{{typeormType}}',
  url: DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: ['{{migrationsPath}}'],
  subscribers: []
});
