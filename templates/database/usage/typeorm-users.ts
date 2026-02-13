import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

export async function listUsers() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource.getRepository(User).find();
}
