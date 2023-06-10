
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
   
      strengthGrowthP
      intelligenceGrowthP
      wisdomGrowthP
      luckGrowthP
      agilityGrowthP
      vitalityGrowthP
      enduranceGrowthP
      dexterityGrowthP

      strength
intelligence
wisdom
luck
agility
vitality
endurance
dexterity
    
    

    pjStatus
    network
  }
}
`;

const getAssistingHeroes_gql = `
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

    strengthGrowthP
    intelligenceGrowthP
    wisdomGrowthP
    luckGrowthP
    agilityGrowthP
    vitalityGrowthP
    enduranceGrowthP
    dexterityGrowthP

    strength
intelligence
wisdom
luck
agility
vitality
endurance
dexterity

    pjStatus
    network
  }
}

`;


const getUserProfileByName_gql = `
  
query getUserProfileByName($name: String!) {
  profiles(where: {name: $name}) {
    id
    name
    nftId
    collectionId
    picUri
  }
}
`;

const getWalletHeroes_gql = `
  
query getWalletHeroes($owner: String!) {
  heroes(where:{owner: $owner}) {
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
   
      strengthGrowthP
      intelligenceGrowthP
      wisdomGrowthP
      luckGrowthP
      agilityGrowthP
      vitalityGrowthP
      enduranceGrowthP
      dexterityGrowthP
    
      strength
      intelligence
      wisdom
      luck
      agility
      vitality
      endurance
      dexterity

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

export async function getAssistingHeroes(_targetMainClass, _targetGeneration, _targetSummonsRemaining) {
  try {

    const variables = {
      'mainClass': _targetMainClass,
      'generation': _targetGeneration, 'summonsRemaining': _targetSummonsRemaining
    };
    const response = await client.request(getAssistingHeroes_gql, variables);
    // console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching getAssistingHeroes:', error);
    throw error;
  }
};

export async function getUserProfileByName(_name) {
  try {
    const variables = { 'name': _name };
    const response = await client.request(getUserProfileByName_gql, variables);
    return response;
  } catch (error) {
    console.error('Error fetching getHeroInfoWithId:', error);
    throw error;
  }
}

export async function getWalletHeroes(_walletAddr) {
  try {
    const variables = { 'owner': _walletAddr };
    const response = await client.request(getWalletHeroes_gql, variables);
    return response;
  } catch (error) {
    console.error('Error fetching getHeroInfoWithId:', error);
    throw error;
  }
}