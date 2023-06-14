
import chainConfig from '../../config/chainInfo.json';
import {ethers} from 'ethers';
import { getContractDuelS4 } from './getContract.js';



export function getRpc(_chain) {
    // return config.useBackupRpc ? config.rpc.poktRpc : config.rpc.harmonyRpc;
    // return config.rpc.chainstack_me;

    if (_chain == 'dfk') {
        return chainConfig.rpc.dfk.dfkRpc;
        // return chainConfig.rpc.dfk.poktRpc;
    } else if (_chain == 'kla') {
        // return klaytnPubConfig.rpc.Cypress;
        return chainConfig.rpc.klaytn.klaytnRpc;
    }

}   

export function getProvider(_chain) {
    return new ethers.providers.JsonRpcProvider(getRpc(_chain));
}

export async function getHeroDuelCountForDay(_chain, _heroIds, _duelType) {
    const provider = getProvider(_chain);
    const contract = getContractDuelS4(provider,_chain);

    let result;

    // console.log(_heroIds);
    // console.log(_duelType);
    try {
        result = await tryReadRequest(
            () => contract.getHeroDuelCountForDay(_heroIds,_duelType), 2
        )
    } catch (error) {
        console.log('获取英雄剩余duel次数失败');
        throw error;
    }

    console.log('获取英雄剩余duel次数成功');
    console.log(result);

    return result;

    
}

export async function getCurrentClassBonuses(_chain) {
    const provider = getProvider(_chain);
    const contract = getContractDuelS4(provider,_chain);

    let classBonus=[];
    try {
        classBonus = await tryReadRequest(
            () => contract.getCurrentClassBonuses(), 2
        );
    } catch (error) {
        console.log('获取class bonus 出错')
        // throw error;
    }


    return classBonus;
}

async function tryReadRequest(_transaction, _attempts) {
    for (let i = 0; i < _attempts; i++) {
        try {

            let result = await _transaction();
            return result;

        } catch (err) {
            if (i === _attempts - 1) throw err;
        }
    }
}



