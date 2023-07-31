import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://api.defikingdoms.com/graphql';
const client = new GraphQLClient(endpoint);

export default client;