import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './api/root';

const server = createHTTPServer({
  router: appRouter
});

server.listen(3001);
console.log('tRPC server listening on http://localhost:3001');
