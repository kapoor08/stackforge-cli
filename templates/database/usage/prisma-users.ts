import { prisma } from '../prisma';

export async function listUsers() {
  return prisma.user.findMany();
}
