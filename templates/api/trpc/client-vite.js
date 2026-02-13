import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const trpcClient = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: `${baseUrl}/trpc`
    })
  ]
});

export async function fetchHello() {
  return trpcClient.hello.query();
}
