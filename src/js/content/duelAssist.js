import $ from "cash-dom";

import {
    checkNodeClassName
    , traverseChildNodes,
    getHeroIdFromIdDom,
    createButton,
    createButtonContainer,
    showLoading,
    hideLoading,
    fetchHeroWithId,
    getUserWalletAddr,
    fetchWalletHeroes
} from "./pubFunc";

let userWalletAddr;

export async function handleDuelAssist() {
   userWalletAddr=await getUserWalletAddr();
   console.log(userWalletAddr);
   let walletHeroes = await fetchWalletHeroes(userWalletAddr);
   console.log(walletHeroes);
   let duelProcessedHeroes=getDuelProcessedHeroes(walletHeroes);

   console.log(duelProcessedHeroes);



}

function getDuelProcessedHeroes(_heroes){

    let statsMap = {
        strength: 0,
        agility: 2,
        intelligence: 4,
        wisdom: 6,
        luck: 8,
        vitality: 10,
        endurance: 12,
        dexterity: 14
    }

    let basicSum = [
        62,
        67,
        72,
        77
    ];

    for (let i = 0; i < _heroes.length; i++) {

        const hero = _heroes[i];
        hero.duelData = {
            stats: {
                intelligence: hero.intelligence,
                luck: hero.luck,
                vitality: hero.vitality,
                dexterity: hero.dexterity,
                strength: hero.strength,
                wisdom: hero.wisdom,
                agility: hero.agility,
                endurance: hero.endurance
            },
            statsSum: hero.intelligence +
                hero.luck +
                hero.vitality +
                hero.dexterity +
                hero.strength +
                hero.wisdom +
                hero.agility +
                hero.endurance,
            maxStatName: "",
            maxStatCode: 99,
            maxSecondStatName: "",
            maxSecondStatCode: 99

        }

        const maxProp = Object.keys(hero.duelData.stats).reduce((a, b) => hero.duelData.stats[a] > hero.duelData.stats[b] ? a : b);

        hero.duelData.maxStatName = maxProp;
        hero.duelData.maxStatCode = statsMap[maxProp];
        hero.duelData.maxSecondStatName = getSecondProp(hero).secondLargestKey;
        hero.duelData.maxSecondStatCode = statsMap[hero.duelData.maxSecondStatName];

        hero.duelData.treeClass = getHeroTreeClass(hero);
        let statsBasicSum = basicSum[hero.duelData.treeClass]; //这里计算有点问题，没有算入卡颜色

        if (hero.level > 1) {
            hero.duelData.averageLevelPoint = (hero.duelData.statsSum - basicSum[0]) / (hero.level - 1)
        } else {
            hero.duelData.averageLevelPoint = 0;
        }


        // console.log(hero.duelData.averageLevelPoint);
    }

    _heroes.sort((heroA, heroB) => {
        return heroB.duelData.statsSum - heroA.duelData.statsSum
    })

    // console.log(_heroes.length);

    return _heroes;

}



function getHeroTreeClass(_hero) {
    if (_hero.mainClass >= 0 && _hero.mainClass <= 11) {
        return 0;
    } else if (_hero.mainClass >= 16 && _hero.mainClass <= 21) {
        return 1;
    } else if (_hero.mainClass >= 24 && _hero.mainClass <= 26) {
        return 2;
    } else if (_hero.mainClass == 28) {
        return 3;
    }
}

function getSecondProp(_hero) {
    const stats = _hero.duelData.stats;

    const values = Object.values(stats);

    const sortedValues = values.sort((a, b) => b - a);

    const secondLargestValue = sortedValues[1];

    const keys = Object.keys(stats);

    let secondLargestKey;

    for (const key of keys) {
        if (stats[key] === secondLargestValue) {
            secondLargestKey = key;
            break;
        }
    }

    return {
        secondLargestKey: secondLargestKey,
        secondLargestValue: secondLargestValue
    }

}