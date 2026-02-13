import { auth } from '@clerk/nextjs/server';

export default async function ProtectedPage() {
  const { userId } = auth();
  return (
    <div>
      <h1>Protected</h1>
      <p>User ID: {userId ?? 'anonymous'}</p>
    </div>
  );
}
