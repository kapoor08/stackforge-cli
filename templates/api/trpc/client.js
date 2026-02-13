import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const trpcClient = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: '/api/trpc'
    })
  ]
});

export async function fetchHello() {
  return trpcClient.hello.query();
}
