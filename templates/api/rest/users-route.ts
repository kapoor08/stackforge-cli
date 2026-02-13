import { listUsers } from '../../../src/db/users';

export async function GET() {
  const users = await listUsers();
  return Response.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ id: 1, name: body.name ?? 'New user' });
}
