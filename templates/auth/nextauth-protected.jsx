import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1>Protected</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
