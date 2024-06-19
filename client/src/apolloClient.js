import { ApolloClient, InMemoryCache } from '@apollo/client';
import SERVER_URL from './utils/config';

const client = new ApolloClient({
  uri: `${SERVER_URL}/graphql`,
  cache: new InMemoryCache(),
});

export default client;
