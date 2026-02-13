import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('/api/graphql');

export async function fetchHello() {
  const query = gql`
    query Hello {
      hello
    }
  `;
  return client.request(query);
}
