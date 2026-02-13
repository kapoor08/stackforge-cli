import { User } from '../mongoose-model';

export async function listUsers() {
  return User.find().lean();
}
