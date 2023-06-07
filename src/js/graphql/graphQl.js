import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://defi-kingdoms-community-api-gateway-co06z8vi.uc.gateway.dev/graphql';
const client = new GraphQLClient(endpoint);

export default client;