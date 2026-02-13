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

export { yoga as GET, yoga as POST };
