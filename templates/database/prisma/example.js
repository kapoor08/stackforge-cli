import { prisma } from './client';

export async function listUsers() {
  return prisma.user.findMany();
}
