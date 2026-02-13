import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/api/root';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${baseUrl}/trpc`
    })
  ]
});

export async function fetchHello() {
  return trpcClient.hello.query();
}
