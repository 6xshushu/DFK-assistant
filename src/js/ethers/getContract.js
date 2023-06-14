
// const ethers = require("ethers");
// const klaytnPubConfig=require("../../dfk_klaytn/config_pub.json")
// const dfkPubConfig=require("../../dfk_dfkchain/config_pub.json")

// const abiHeroCore=require("../abi/heroCore.json")
// const abiRouter=require("../abi/UniswapV2Router02.json")
// const abiFactory=require("../abi/UniswapV2Factory.json")
// const abiItemBridge=require("../abi/ItemBridge.json")
// const abiItemGoldTraderV2=require("../abi/ItemGoldTraderV2.json")
// const abidfkQuestCoreV2=require("../abi/QuestCoreV2.3.json")
// const abidfkQuestCoreV3=require("../abi/QuestCoreV3Diamond.json")
// const abiAlchemist=require("../abi/Alchemist.json")
// const abiRaffleMaster=require("../abi/raffleMaster.json")
// const abiRaffleTicket=require("../abi/DuelRaffleTicket.json")
// const abiStoneCarver=require("../abi/stoneCarver.json")
// const abiAirdrop = require("../abi/AirdropClaim.json");
// const abiHeroBridge= require("../abi/HeroBridge.json");
// const abiPetCore=require("../abi/petCore.json")
// const abiFlagStorageV2=require("../abi/FlagStorageV2.json")
// const abiMeditationCircle=require("../abi/MeditationCircle.json")
// const abiAssistingAuctionUpgradeable=require("../abi/AssistingAuctionUpgradeable.json")

import {ethers} from 'ethers';

import abiDuelS4 from "../../abi/DuelS4.json"
import contractAddrs from "../../config/contract.json"


export function getContractDuelS4(_currentRpc,_chain){
    let contractAddr;
    if(_chain=='dfk'){
        contractAddr=contractAddrs.dfk.duelS4;
    }else if(_chain=='kla'){
        contractAddr=contractAddrs.klaytn.duelS4;
    }

    const  provider  = _currentRpc;
    const contract = new ethers.Contract(contractAddr, abiDuelS4, provider);
    return contract;
}

// exports.getContractMeditationCircle=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.MeditationCircle;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.MeditationCircle;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiMeditationCircle, provider);
//     return contract;
// }

// exports.getContractFlagStorageV2=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.FlagStorageV2;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.FlagStorageV2;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiFlagStorageV2, provider);
//     return contract;
// }

// exports.getContractHeroCore=(_currentRpc,_chain='dfk')=>{
//     let heroCoreContractAddr;
//     if(_chain=='dfk'){
//         heroCoreContractAddr=dfkPubConfig.dfkHeroContract;
//     }else if(_chain=='klaytn'){
//         heroCoreContractAddr=klaytnPubConfig.dfkHeroContract;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(heroCoreContractAddr, abiHeroCore, provider);
//     return contract;
// }

// exports.getContractPetCore=(_currentRpc,_chain='dfk')=>{
//     let petCoreContractAddr;
//     if(_chain=='dfk'){
//         petCoreContractAddr=dfkPubConfig.petCore;
//     }else if(_chain=='klaytn'){
//         petCoreContractAddr=klaytnPubConfig.petCore;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(petCoreContractAddr, abiPetCore, provider);
//     return contract;
// }

// exports.getContractRouter=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.UNISWAPV2ROUTERContract;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.UNISWAPV2ROUTERContract;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiRouter, provider);
//     return contract;
// }

// exports.getContractFactory=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.UniswapV2Factory;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.UniswapV2Factory;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiFactory, provider);
//     return contract;
// }

// exports.getContractItemBridge=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.itemBridge;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.itemBridge;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiItemBridge, provider);
//     return contract;
// }

// exports.getContractGoldVendor=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.ItemGoldTraderV2;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.ItemGoldTraderV2;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiItemGoldTraderV2, provider);
//     return contract;
// }

// exports.getContractQuestCoreV2=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.dfkQuestContractV2;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.dfkQuestContractV2;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abidfkQuestCoreV2, provider);
//     return contract;
// }

// exports.getContractQuestCoreV3=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.QuestCoreV3;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.QuestCoreV3;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abidfkQuestCoreV3, provider);
//     return contract;
// }

// exports.getContractIAlchemist=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.Alchemist;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.Alchemist;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiAlchemist, provider);
//     return contract;
// }

// exports.getContractRaffleMaster=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.RaffleMaster;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.RaffleMaster;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiRaffleMaster, provider);
//     return contract;
// }

// exports.getContractRaffleTicket=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.raffleTicket;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.raffleTicket;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiRaffleTicket, provider);
//     return contract;
// }

// exports.getContractStoneCarver=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.stoneCarver;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.stoneCarver;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiStoneCarver, provider);
//     return contract;
// }


// exports.getContractAirdrop=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.AirdropClaim;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.AirdropClaim;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiAirdrop, provider);
//     return contract;
// }


// exports.getContractHeroBridge=(_currentRpc,_chain='dfk')=>{
//     let contractAddr;
//     if(_chain=='dfk'){
//         contractAddr=dfkPubConfig.heroBridge;
//     }else if(_chain=='klaytn'){
//         contractAddr=klaytnPubConfig.heroBridge;
//     }

//     const  provider  = _currentRpc;
//     const contract = new ethers.Contract(contractAddr, abiHeroBridge, provider);
//     return contract;
// }

