import { createServer } from 'node:http';
import { createYoga, createSchema } from 'graphql-yoga';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const schemaPath = join(process.cwd(), 'src', 'graphql', 'schema.graphql');
const typeDefs = readFileSync(schemaPath, 'utf8');

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers: {
      Query: {
        hello: () => 'hello',
        users: () => [{ id: 1, name: 'Ada' }]
      },
      Mutation: {
        addUser: (_: unknown, args: { name: string }) => ({ id: 2, name: args.name })
      }
    }
  })
});

const server = createServer(yoga);
server.listen(3001, () => {
  console.log('GraphQL server listening on http://localhost:3001/graphql');
});
