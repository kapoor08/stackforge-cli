import { createYoga, createSchema } from 'graphql-yoga';

const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type User {
      id: ID!
      name: String!
    }

    type Query {
      hello: String!
      users: [User!]!
    }

    type Mutation {
      addUser(name: String!): User!
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'hello',
      users: () => [{ id: 1, name: 'Ada' }]
    },
    Mutation: {
      addUser: (_parent, args) => ({ id: 2, name: args.name })
    }
  }
});

const yoga = createYoga({ schema });

export { yoga as GET, yoga as POST };
