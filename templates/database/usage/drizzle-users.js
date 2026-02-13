import { db } from '../../drizzle/client';
import { users } from '../../drizzle/schema';

export async function listUsers() {
  return db.select().from(users);
}
