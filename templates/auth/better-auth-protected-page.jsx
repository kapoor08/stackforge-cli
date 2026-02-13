import { auth } from '../../../auth/auth';
import { headers } from 'next/headers';

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: headers() });
  return (
    <div>
      <h1>Protected</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
