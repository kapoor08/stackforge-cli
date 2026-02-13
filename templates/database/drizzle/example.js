import { db } from './client';
import { users } from './schema';

export async function listUsers() {
  return db.select().from(users);
}
