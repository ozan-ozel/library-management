import { User } from './entities/user';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Book } from './entities/book';
import { UserBook } from './entities/userBook';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT
    ? parseInt(process.env.POSTGRES_PORT, 10)
    : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Book, UserBook], // Ensure User entity is listed here
  synchronize: false,
  migrations: ['./src/migrations/**/*.ts'],
});
