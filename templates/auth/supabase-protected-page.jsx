import { createSupabaseServerClient } from '../../../src/lib/supabase-server';

export default async function ProtectedPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div>
      <h1>Protected</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
