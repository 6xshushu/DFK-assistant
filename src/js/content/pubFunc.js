
import $ from "cash-dom";

import {
    getHeroInfoWithId
} from '../graphql/getQlData';

export function checkNodeClassName(_node, _className) {
    const fixedClassName = _className;
    // 创建正则表达式，用于匹配类名
    const regex = new RegExp(`\\b${fixedClassName}\\S*\\b`);

    // 如果节点具有className属性且为字符串类型，则进行匹配
    if (typeof _node.className === 'string') {
        // 创建正则表达式，用于匹配类名
        const regex = new RegExp(`\\b${fixedClassName}\\S*\\b`);

        // 检查节点的类名是否包含固定值
        if (_node.className.match(regex)) {
            // 操作匹配的节点
            // handleMatchedNode(node, _className);
            return true;
        }
    }

    return false;
}

// 用于遍历子节点的递归函数
export function traverseChildNodes(node, callback) {
    callback(node);
    if (node.childNodes) {
        for (const child of node.childNodes) {
            traverseChildNodes(child, callback);
        }
    }
}

export function getHeroIdFromIdDom(element) {
    const idText = $(element).text();
    const idNumberMatch = idText.match(/#(\d+)/);

    if (idNumberMatch) {
        const idNumber = BigInt(idNumberMatch[1]);
        const imgSrc = $(element).find('img').attr('src');

        let resultNumber;

        if (imgSrc.includes('jade')) {
            resultNumber = idNumber + BigInt(2000000000000);
        } else if (imgSrc.includes('crystal')) {
            resultNumber = idNumber + BigInt(1000000000000);
        } else if (imgSrc.includes('jewel')) {
            resultNumber = idNumber;
        }

        if (resultNumber !== undefined) {
            return resultNumber.toString();
        }
    }

    return null;
}

// 创建按钮
export function createButton(_buttonId, _buttonText) {
    return $('<button>')
        .text(_buttonText)
        .attr('id', _buttonId)
        .attr('type', 'button')
        .addClass('btn btn-dark')
}

// 创建buttonContaniner
export function createButtonContainer(_containerId) {
    return $('<div>')
        .attr('id', _containerId)
        .addClass('d-flex')
        .css({
            justifyContent: 'center'

        });
}

// 显示loading状态
export function showLoading(button, _text) {
    button.text(_text).attr('disabled', 'disabled');
}

// 隐藏loading状态
export function hideLoading(button, _text) {
    button.text(_text).removeAttr('disabled');
}

export function normalizeHeroes(_heroes) {
    _heroes.forEach((hero) => {
        hero.summonerId = hero.summonerId.id;
        hero.assistantId = hero.assistantId.id;

        if (hero.assistingPrice != null) {
            let bigNum = BigInt(hero.assistingPrice);
            let divisor = BigInt('1000000000000000000');
            let result = bigNum / divisor;
            let finalResult = Number(result);
            hero.assistingPrice = finalResult;
        } else {
            hero.assistingPrice = 0;
        }

        hero.summonPrice = calculateHeroSummonCost(hero.generation, hero.summons);
        hero.totalSummonPrice = hero.summonPrice + hero.assistingPrice;

        hero.craft1=hero.statsUnknown1;
        hero.craft2=hero.statsUnknown2;

    });
    return _heroes;
}

export async function fetchHeroWithId(_heroId) {

    // console.log('按钮被点击了');
    // console.log(mySummonHeroId);

    let results = await getHeroInfoWithId(_heroId);
    let hero = results.hero;
    let heroProcessedInfo = normalizeHeroes([hero])

    // console.log(heroProcessedInfo[0]);

    return heroProcessedInfo[0];



}



function calculateHeroSummonCost(summonerGen, totalHeroesAlreadySummoned) {
    const baseCost = 6;
    const perChildIncrease = 2;
    const GenerationIncrease = 10;

    let totalCost =
        baseCost +
        perChildIncrease * totalHeroesAlreadySummoned +
        GenerationIncrease * summonerGen;

    if (summonerGen === 0 && totalCost > 30) {
        totalCost = 30;
    }

    return totalCost;
};