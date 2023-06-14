import $ from "cash-dom";

import Toast from 'bootstrap/js/dist/toast';
import Tooltip from 'bootstrap/js/dist/tooltip';

import {

    createButton,
    createButtonContainer,
    showLoading,
    hideLoading,
    getUserName,
    getWalletAddrByName,
    fetchWalletHeroes,
    searchString,
    getShortId,
    createToast,
    getCurrentChain
} from "./pubFunc";

import {
    getHeroDuelCountForDay,
    getCurrentClassBonuses
} from "../ethers/getChainData"

let userWalletAddr, currentChain;
let duelInfoLocatedNode;
let duel1RecHeroes, duel3RecHeroes, duel9RecHeroes;
let duelType;
let isDuelRecUsed = false;
let groupSelect;

const duelLimit = {
    '1': 10,
    '3': 30,
    '9': 90
}

const statKeyMap = {
    0: "strength",
    2: "agility",
    4: "intelligence",
    6: "wisdom",
    8: "luck",
    10: "vitality",
    12: "endurance",
    14: "dexterity"
}

const backgroundKeyMap = {
    0: "Desert",
    2: "Forest",
    4: "Plains",
    6: "Island",
    8: "Swamp",
    10: "Mountains",
    12: "City",
    14: "Arctic"
}

const elementKeyMap = {
    0: "Fire",
    2: "Water",
    4: "Earth",
    6: "Wind",
    8: "Lightning",
    10: "Ice",
    12: "Light",
    14: "Dark"
}

const classKeyMap = {
    0: "Warrior",
    1: "Knight",
    2: "Thief",
    3: "Archer",
    4: "Priest",
    5: "Wizard",
    6: "Monk",
    7: "Pirate",
    8: "Berserker",
    9: "Seer",
    10: "Legionnaire",
    11: "Scholar",
    16: "Paladin",
    17: "DarkKnight",
    18: "Summoner",
    19: "Ninja",
    20: "Shapeshifter",
    21: "Bard",
    24: "Dragoon",
    25: "Sage",
    26: "SpellBow",
    28: "DreadKnight"
}

export async function handleDuelAssist() {



    addTheRecommandButton();



}

function addTheRecommandButton() {
    const showContainer = createButtonContainer('duelRecommandButtonContainer');
    // 创建按钮元素
    const button = createButton('duelRecommandButton', 'Recommend Duel Teams');

    showContainer.append(button);

    // console.log(showContainer);

    duelInfoLocatedNode = getDuelRecInfoNode();
    // console.log(duelInfoLocatedNode);
    duelInfoLocatedNode.after(showContainer);
    button.on('click', getRecommandedDuelStrategy);
}

async function getRecommandedDuelStrategy() {

    showLoading($("#duelRecommandButton"), "Recommending duel teams, please wait...");

    let userName=getUserName();
    userWalletAddr = await getWalletAddrByName(userName);
    // console.log(userWalletAddr);

    currentChain = getCurrentChain();
    // console.log(currentChain);
    // currentChain = getCurrentChain();
    let walletHeroes = await fetchWalletHeroes(userWalletAddr);
    // console.log(walletHeroes);

    let walletHeroesFilterWithChain = walletHeroes.filter(hero => hero.network == currentChain);
    // console.log(walletHeroesFilterWithChain);

    let duelProcessedHeroes = getDuelProcessedHeroes(walletHeroesFilterWithChain);
    // console.log(duelProcessedHeroes);

    let heroIds = duelProcessedHeroes.map(hero => hero.id);

    duelType = getDuelType();

    let duelCountList = await getHeroDuelCountForDay(currentChain, heroIds, duelType);

    let finalAvailableHeroes = duelProcessedHeroes.filter((hero, index) => {
        hero.duelData.duelCountLeft = duelLimit[duelType] - duelCountList[index].toNumber();
        if (hero.duelData.duelCountLeft > 0) {
            return true;
        } else {
            return false;
        }

    });

    if (finalAvailableHeroes.length == 0) {
        const toast = createToast();
        toast.find('.toast-body').text('No heroes available for duel');
        $('body').append(toast);
        const bsToast = new Toast(toast[0], { autohide: true, delay: 3000 });
        bsToast.show();

        // 在Toast消失后删除其HTML结构
        toast.on('hidden.bs.toast', () => {
            toast.remove();
        });

        hideLoading($("#duelRecommandButton"), "Recommend Duel Heroes");
        $("#duelRecommandButtonContainer").remove();

        return;
    }

    // console.log(finalAvailableHeroes);

    // let bonusHeroes = await duelFilterClassBonus(finalAvailableHeroes, currentChain);

    // console.log(bonusHeroes);

    if (duelType == '1') {
        duel1RecHeroes = groupHeroes1(finalAvailableHeroes);
        addGroupStatAndBkg(duel1RecHeroes)
        // console.log('排序后的1人队英雄');
        // console.log(duel1RecHeroes);

    }
    else if (duelType == '3') {
        duel3RecHeroes = groupHeroes32(finalAvailableHeroes);

        addGroupStatAndBkg(duel3RecHeroes)
        // console.log('排序后的3人队英雄');
        // console.log(duel3RecHeroes);
    }
    else if (duelType == '9') {
        duel9RecHeroes = groupHeroes92(finalAvailableHeroes);
        addGroupStatAndBkg(duel9RecHeroes)
        // console.log('排序后的9人队英雄');
        // console.log(duel9RecHeroes);
    }







    hideLoading($("#duelRecommandButton"), "Recommend Duel Heroes");
    $("#duelRecommandButtonContainer").remove();

    showTheDuelRecInfo1();

    activeTooltip();
}

function addGroupStatAndBkg(_groups) {
    // 统计每个颜色出现的次数
    groupSelect = [];
    _groups.forEach((group, index) => {
        const counter = {};

        group.forEach(hero => {
            if (!counter[hero.background]) {
                counter[hero.background] = 0;
            }
            counter[hero.background]++;
        });

        // 找出出现次数最多的颜色
        let mostCommonBkg;
        let count = 0;
        for (const bkg in counter) {
            if (counter[bkg] > count) {
                mostCommonBkg = bkg;
                count = counter[bkg];
            }
        }

        groupSelect[index] = {
            selectedBkgForGroup: Number(mostCommonBkg),
            selectedStatForGroup: Number(group[0]?.duelData.maxProp)
        }

        // console.log(groupSelect);


    });


}

function createDuelRecInfoBlock() {
    // 设置表头信息
    const tableHeaders = ['ID', 'STATS\nSUM', 'STAT', 'BKG', 'MAIN\nCLASS', 'SUB\nCLASS', 'LEVEL', 'COUNT\nLEFT', 'ELE'];

    // 示例英雄二维数组数据
    let recHeroes;
    if (duelType == 1) {
        recHeroes = duel1RecHeroes;
    } else if (duelType == 3) {
        recHeroes = duel3RecHeroes;

    } else if (duelType == 9) {
        recHeroes = duel9RecHeroes;
    }

    // recStat = recHeroes[0][0].duelData.selectedStatForGroup;
    // recBkg = recHeroes[0][0].duelData.selectedBkgForGroup;

    recHeroes.forEach((group, groupIndex) => {

        // console.log(groupSelect[groupIndex])

        group.forEach((hero) => {
            let shortId = getShortId(hero.id);
            let statName = statKeyMap[groupSelect[groupIndex].selectedStatForGroup];
            let bkgName = "";
            if (hero.background == groupSelect[groupIndex].selectedBkgForGroup) {
                bkgName = "*";
            }
            hero.tableInfo = [shortId, hero.duelData.statsSum,
                statName.slice(0, 3).toUpperCase() + `_${hero.duelData.stats[statName]}`,
                backgroundKeyMap[hero.background] + bkgName,
                classKeyMap[hero.mainClass], classKeyMap[hero.subClass], hero.level,
                hero.duelData.duelCountLeft, elementKeyMap[hero.element]];
        });
    });

    // 创建信息块
    const infoBlock = $('<div></div>').addClass('info-block bg-dark');

    // 创建表格容器（添加滚动条）
    const tableContainer = $('<div></div>').css({
        height: '400px', // 设置容器高度，根据需要调整
        overflowY: 'scroll' // 设置垂直滚动条
    });

    // 创建表格
    const table = $('<table></table>').addClass('table table-bordered table-dark table-sm text-center align-middle');

    // 添加表头
    const thead = $('<thead></thead>');
    const headerRow = $('<tr></tr>');

    tableHeaders.forEach((header) => {
        const th = $('<th></th>').text(header);
        headerRow.append(th);
    });

    thead.append(headerRow);
    table.append(thead);

    // 添加表格内容
    const tbody = $('<tbody></tbody>');

    recHeroes.forEach((group, groupIndex) => {
        group.forEach((hero) => {
            const row = $('<tr></tr>');
            if (groupIndex % 2 == 0) {
                // row.addClass('custom-bg-secondary');
                row.addClass('table-secondary');
            } else {
                // row.addClass('custom-bg-light');
                row.addClass('table-dark');
            }

            row.on('click', function () {

                row.toggleClass('table-active');
            });

            tableHeaders.forEach((header, ind) => {
                const td = $('<td></td>').text(hero.tableInfo[ind]);
                // if (ind === 0) {
                //     td.addClass('id-column');
                //   }
                row.append(td);
            });

            // 为ID列添加点击事件，复制ID到剪贴板
            row.find('td:first-child').on('click', (e) => {
                let text = e.target.textContent;
                navigator.clipboard.writeText(e.target.textContent).then(() => {
                    // console.log('ID已复制到剪贴板');
                    const toast = createToast();
                    toast.find('.toast-body').text('The hero ID has been copied to the clipboard.' + text);

                    $('body').append(toast);
                    const bsToast = new Toast(toast[0], { autohide: true, delay: 3000 });
                    bsToast.show();

                    // 在Toast消失后删除其HTML结构
                    toast.on('hidden.bs.toast', () => {
                        toast.remove();
                    });
                });
            });

            tbody.append(row);
        });
    });

    table.append(tbody);


    // 将表格添加到表格容器中
    tableContainer.append(table);



    // 将表格容器添加到信息块中
    infoBlock.append(tableContainer);

    // 5. 表格下面有一段文案说明。
    const tableDescription = $('<p></p>');
    tableDescription.text('? Explanation')
        .addClass('text-start')
        .addClass('bg-dark text-white')
        .css({
            fontSize: '0.8rem',
            marginBottom: '0.5rem',
            marginTop: '0.5rem'
        })
        .attr('data-bs-toggle', 'tooltip')
        .attr('data-bs-placement', 'left')
        .attr('data-bs-title', `The group above prioritizes heroes based on the highest overall sum of stats. 
        Preference is given to heroes with the highest individual stat value and those sharing the same background, 
        if possible. In this context, STAT represents the chosen attribute value, 
        while a BKG marked with an asterisk (*) signifies a selected background. 
        To copy a hero's ID, simply click on it. Heroes within the same color block belong to the same team.
        Just for your reference`)

    infoBlock.append(tableDescription);

    return infoBlock;
}

function showTheDuelRecInfo1() {


    let infoBlock = createDuelRecInfoBlock();

    // 将信息块插入到指定DOM前面，例如'id'为'your-element-id'的元素
    duelInfoLocatedNode.after(infoBlock);

    isDuelRecUsed = true;
}

export function showTheDuelRecInfo2(_node) {

    if (!isDuelRecUsed) return;

    let infoBlock = createDuelRecInfoBlock();

    // 将信息块插入到指定DOM前面，例如'id'为'your-element-id'的元素
    $(_node).after(infoBlock);

    activeTooltip();

}

function getDuelRecInfoNode() {
    const classNamePrefix = 'heroDuelSelectRow_heroSelectTitle';
    const matchedElement = $(`[class^="${classNamePrefix}"]`);

    // let chain = null;
    // 如果找到匹配的元素，可以继续获取或操作该元素
    if (matchedElement.length > 0) {

        return matchedElement;

    } else {
        console.log('未找到位置元素');
    }

    return null;
}

function groupHeroes1(_heros) {



    _heros.sort((heroA, heroB) => {
        return heroB.duelData.statsSum - heroA.duelData.statsSum

    })

    let oneHeroTeams = [];

    _heros.forEach(hero => {

        hero.duelData.maxBackground = hero.background;
        hero.duelData.maxProp = hero.duelData.maxStatCode;

        oneHeroTeams.push([hero])
    });

    return oneHeroTeams.splice(0, 20);

}

function groupHeroes32(_heroes) {
    // 按照值最高的属性排序

    // console.log('开始分组3');

    let heroes = _heroes.slice();

    // console.log(heroes.length);
    const groups = [];

    let teamCount = Math.floor(heroes.length / 3);
    if (teamCount > 10) { teamCount = 10; }

    // 按照规则分组
    while (groups.length < teamCount) {

        heroes.sort((heroA, heroB) => {
            return heroB.duelData.statsSum - heroA.duelData.statsSum
        })

        let tempHeroes;
        if (heroes.length < 15) {
            tempHeroes = heroes.splice();
        } else {
            tempHeroes = heroes.splice(0, 15);
        }


        let tempHeroesBkgList = {};
        let tempHeroeFirstStaList = {};

        tempHeroes.forEach(hero => {
            // console.log(hero);
            if (tempHeroesBkgList[hero.background] == undefined) {
                tempHeroesBkgList[hero.background] = 0;
            }
            if (tempHeroeFirstStaList[hero.duelData.maxStatCode] == undefined) {
                tempHeroeFirstStaList[hero.duelData.maxStatCode] = 0;
            }
            tempHeroesBkgList[hero.background]++;
            tempHeroeFirstStaList[hero.duelData.maxStatCode]++;
        });

        const sortedTempHeroesBkgList = Object.keys(tempHeroesBkgList).sort((a, b) => tempHeroesBkgList[b] - tempHeroesBkgList[a]);
        const sortedTempHeroeFirstStaList = Object.keys(tempHeroeFirstStaList).sort((a, b) => tempHeroeFirstStaList[b] - tempHeroeFirstStaList[a]);

        // console.log('查看')
        // console.log(sortedTempHeroesBkgList);
        // console.log(sortedTempHeroeFirstStaList);


        const group = [];
        let temLength = tempHeroes.length;
        for (let i = 0; i < temLength; i++) {

            const hero = tempHeroes[i];
            // console.log(`查看1 ${hero.id}`)
            let canAdd = false;
            // console.log(`查看1  ${hero.id}--- ${hero.duelData.maxSecondStatCode}`)


            if (hero.background == sortedTempHeroesBkgList[0] &&
                (hero.duelData.maxStatCode == sortedTempHeroeFirstStaList[0] || hero.duelData.maxSecondStatCode == sortedTempHeroeFirstStaList[0])) {
                canAdd = true;
            }

            if (canAdd) {
                // console.log(`查看2 ${hero.id}`)
                group.push(hero);
                tempHeroes.splice(i, 1)
                // console.log(`删除2 ${ttt[0].id}`)
                temLength--;
                i--;
            }

            if (group.length == 3) break;

        }

        if (group.length < 3) {
            temLength = tempHeroes.length;
            for (let i = 0; i < temLength; i++) {

                const hero = tempHeroes[i];
                let canAdd = false;

                if (hero.duelData.maxStatCode == sortedTempHeroeFirstStaList[0] ||
                    hero.duelData.maxSecondStatCode == sortedTempHeroeFirstStaList[0]) {
                    canAdd = true;
                }

                if (canAdd) {
                    // console.log(`查看3 ${hero.id}`)
                    group.push(hero);
                    tempHeroes.splice(i, 1)
                    temLength--;
                    i--;
                }

                if (group.length == 3) break;

            }
        }

        if (group.length < 3) {
            temLength = tempHeroes.length;
            for (let i = 0; i < temLength; i++) {

                const hero = tempHeroes[i];
                let canAdd = false;

                if (hero.background == sortedTempHeroesBkgList[0]) {
                    canAdd = true;
                }

                if (canAdd) {
                    // console.log(`查看4 ${hero.id}`)
                    group.push(hero);
                    tempHeroes.splice(i, 1)
                    temLength--;
                    i--;
                }

                if (group.length == 3) break;

            }
        }

        if (group.length < 3) {
            temLength = tempHeroes.length;
            for (let i = 0; i < temLength; i++) {

                const hero = tempHeroes[0];


                group.push(hero);
                tempHeroes.shift();
                temLength--;
                i--;


                if (group.length == 3) break;

            }
        }

        group.forEach(hero => {
            hero.duelData.maxBackground = sortedTempHeroesBkgList[0];
            hero.duelData.maxProp = sortedTempHeroeFirstStaList[0];
        });


        group.sort(function (a, b) {
            return b.duelData.statsSum - a.duelData.statsSum;
        });

        // console.log(group);
        groups.push(group);

        heroes = tempHeroes.concat(heroes);

    }

    // console.log(`共有${groups.length}组英雄`);
    // console.log(groups);
    return groups;
}

function groupHeroes92(_heroes) {
    // 按照值最高的属性排序

    // console.log('开始分组');

    let heroes = _heroes.slice();

    // console.log(heroes.length);
    const groups = [];

    let teamCount = Math.floor(heroes.length / 9);
    if (teamCount > 5) { teamCount = 5; }

    // 按照规则分组
    while (groups.length < teamCount) {

        heroes.sort((heroA, heroB) => {
            return heroB.duelData.statsSum - heroA.duelData.statsSum
            // return heroB.stats[heroB.duelData.maxStatName] - heroA.stats[heroA.duelData.maxStatName];
        })

        let tempHeroes;
        if (heroes.length < 20) {
            tempHeroes = heroes.splice();
        } else {
            tempHeroes = heroes.splice(0, 20);
        }


        let tempHeroesBkgList = {};
        let tempHeroeFirstStaList = {};

        tempHeroes.forEach(hero => {
            // console.log(hero);
            if (tempHeroesBkgList[hero.background] == undefined) {
                tempHeroesBkgList[hero.background] = 0;
            }
            if (tempHeroeFirstStaList[hero.duelData.maxStatCode] == undefined) {
                tempHeroeFirstStaList[hero.duelData.maxStatCode] = 0;
            }
            tempHeroesBkgList[hero.background]++;
            tempHeroeFirstStaList[hero.duelData.maxStatCode]++;
        });

        const sortedTempHeroesBkgList = Object.keys(tempHeroesBkgList).sort((a, b) => tempHeroesBkgList[b] - tempHeroesBkgList[a]);
        const sortedTempHeroeFirstStaList = Object.keys(tempHeroeFirstStaList).sort((a, b) => tempHeroeFirstStaList[b] - tempHeroeFirstStaList[a]);

        // console.log('查看')
        // console.log(sortedTempHeroesBkgList);
        // console.log(sortedTempHeroeFirstStaList);


        const group = [];
        let temLength = tempHeroes.length;
        for (let i = 0; i < temLength; i++) {

            const hero = tempHeroes[i];
            // console.log(`查看1 ${hero.id}`)
            let canAdd = false;
            // console.log(`查看1  ${hero.id}--- ${hero.duelData.maxSecondStatCode}`)


            if (hero.background == sortedTempHeroesBkgList[0] &&
                (hero.duelData.maxStatCode == sortedTempHeroeFirstStaList[0] || hero.duelData.maxSecondStatCode == sortedTempHeroeFirstStaList[0])) {
                canAdd = true;
            }

            if (canAdd) {
                // console.log(`查看2 ${hero.id}`)
                group.push(hero);
                tempHeroes.splice(i, 1)
                // console.log(`删除2 ${ttt[0].id}`)
                temLength--;
                i--;
            }

            if (group.length == 9) break;

        }

        if (group.length < 9) {
            temLength = tempHeroes.length;
            for (let i = 0; i < temLength; i++) {

                const hero = tempHeroes[i];
                let canAdd = false;

                if (hero.duelData.maxStatCode == sortedTempHeroeFirstStaList[0] ||
                    hero.duelData.maxSecondStatCode == sortedTempHeroeFirstStaList[0]) {
                    canAdd = true;
                }

                if (canAdd) {
                    // console.log(`查看3 ${hero.id}`)
                    group.push(hero);
                    tempHeroes.splice(i, 1)
                    temLength--;
                    i--;
                }

                if (group.length == 9) break;

            }
        }

        if (group.length < 9) {
            temLength = tempHeroes.length;
            for (let i = 0; i < temLength; i++) {

                const hero = tempHeroes[i];
                let canAdd = false;

                if (hero.background == sortedTempHeroesBkgList[0]) {
                    canAdd = true;
                }

                if (canAdd) {
                    // console.log(`查看4 ${hero.id}`)
                    group.push(hero);
                    tempHeroes.splice(i, 1)
                    temLength--;
                    i--;
                }

                if (group.length == 9) break;

            }
        }

        if (group.length < 9) {
            temLength = tempHeroes.length;
            for (let i = 0; i < temLength; i++) {

                const hero = tempHeroes[0];


                group.push(hero);
                tempHeroes.shift();
                temLength--;
                i--;


                if (group.length == 9) break;

            }
        }

        group.forEach(hero => {
            hero.duelData.maxBackground = sortedTempHeroesBkgList[0];
            hero.duelData.maxProp = sortedTempHeroeFirstStaList[0];
        });


        group.sort(function (a, b) {
            return b.duelData.statsSum - a.duelData.statsSum;
        });

        // console.log(group);
        groups.push(group);

        heroes = tempHeroes.concat(heroes);

    }
    // let groups2 = groups.filter((group) => group.length == 9)
    // let groups2=groups;


    // for (let k = 0; k < groups2.length; k++) {
    //     // console.log(group[k].id)
    //     console.log('***********************************')
    //     for (let m = 0; m < groups2[k].length; m++) {
    //         const element = groups2[k][m];
    //         console.log(element.id);

    //     }

    // }
    // console.log(`共有${groups.length}组英雄`);
    // console.log(groups);
    return groups;
}

async function duelFilterClassBonus(_heros, _chain) {
    console.log('过滤器，有class bonus 的英雄')
    let classBonus;
    try {
        classBonus = await getCurrentClassBonuses(_chain);
    } catch (error) {
        console.log(error)
        // console.log("获取class bonus失败")
        // throw error;
    }
    // console.log(classBonus)
    let heros2 = _heros.filter((hero) => {
        for (let i = 0; i < classBonus.length; i++) {
            for (let j = 0; j < classBonus[i].length; j++) {
                const bonusCode = classBonus[i][j];

                if (hero.mainClass == bonusCode || hero.subClass == bonusCode) {
                    return true;
                }

            }

        }

        return false;
    })


    console.log(`还有${heros2.length}个英雄有bonus`)
    return heros2;

}

function getDuelType() {

    const classNamePrefix = 'StartDuelModal_fancyTitle';
    const matchedElement = $(`[class^="${classNamePrefix}"]`);

    let duelType = null;
    // 如果找到匹配的元素，可以继续获取或操作该元素
    if (matchedElement.length > 0) {

        let duelTypeStr = matchedElement.text();

        if (searchString(duelTypeStr, 'Solo')) {
            duelType = 1;
        } else if (searchString(duelTypeStr, 'Squad')) {
            duelType = 3;
        } else if (searchString(duelTypeStr, 'Warr')) {
            duelType = 9;
        }

        // console.log(duelType);

        // console.log('用户名为:', userName);
    } else {
        console.log('未找到DuelType');
    }

    return duelType;

}



function getDuelProcessedHeroes(_heroes) {

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

function activeTooltip() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))
}