
import client from './graphQl';


// 将 GraphQL 查询嵌入为字符串常量
const getHeroInfoWithId_gql = `
  
query getHeroInfoWithId($id: ID!) {
  hero(id: $id) {
    id
    rarity
    generation
    mainClassStr
    subClassStr
    professionStr
    summonerId {
      id
    }
    assistantId {
      id
    }
    nextSummonTime
    maxSummons
    summons
    summonsRemaining
    assistingPrice
    level
    mainClass
    subClass
    profession
    passive1
    passive2
    active1
    active2
    statBoost1
    statBoost2
    statsUnknown1
    element
    statsUnknown2
    pjStatus
    network
  }
}
`;

const getAssistingHeroes_gql=`
query getAssistingHeroes($mainClass: Int!,$generation:Int!,$summonsRemaining:Int!) {
  heroes(orderBy: level, orderDirection: desc,where: {mainClass:$mainClass,
  generation_lte: $generation,summonsRemaining_gte:$summonsRemaining,assistingPrice_gt:"0"}) {
    id
    rarity
    generation
    mainClassStr
    subClassStr
    professionStr
    summonerId {
      id
    }
    assistantId {
      id
    }
    nextSummonTime
    maxSummons
    summons
    summonsRemaining
    assistingPrice
    level
    mainClass
    subClass
    profession
    passive1
    passive2
    active1
    active2
    statBoost1
    statBoost2
    statsUnknown1
    element
    statsUnknown2
    pjStatus
    network
  }
}

`;


// console.log(getWalletHeroes);


export async function getHeroInfoWithId(_heroId) {
  try {
    const variables = { 'id': _heroId };
    const response = await client.request(getHeroInfoWithId_gql, variables);
    return response;
  } catch (error) {
    console.error('Error fetching getHeroInfoWithId:', error);
    throw error;
  }
}

export async function getAssistingHeroes (_targetMainClass,_targetGeneration,_targetSummonsRemaining) {
  try {
    
    const variables = { 'mainClass':_targetMainClass ,
    'generation':_targetGeneration,'summonsRemaining':_targetSummonsRemaining};
    const response = await client.request(getAssistingHeroes_gql, variables);
    // console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching getAssistingHeroes:', error);
    throw error;
  }
};