// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/46275/bitround/v0.0.6',
  cache: new InMemoryCache(),
});

export default client;