const { createHTTPServer } = require('@trpc/server/adapters/standalone');
const { appRouter } = require('./api/root');

const server = createHTTPServer({
  router: appRouter
});

server.listen(3001);
console.log('tRPC server listening on http://localhost:3001');
