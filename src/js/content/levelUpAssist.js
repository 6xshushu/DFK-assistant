
import $ from "cash-dom";

import {
    checkNodeClassName
    , traverseChildNodes,
    getHeroIdFromIdDom,
    createButton,
    createButtonContainer,
    showLoading,
    hideLoading,
    fetchHeroWithId
} from "./pubFunc";

let levelUpHeroId = null,
    levelUpButtonLocatedNode,
    levelUpInfoLocatedNode,
    levelUpFinalData;

export function handleMutationsLevelUp(mutations) {
    for (const mutation of mutations) {
        // 检查是否有新添加的节点
        if (mutation.type === 'childList') {
            for (const addedNode of mutation.addedNodes) {
                traverseChildNodes(addedNode, handleAddedNodeLevelUp);
            }
            for (const removedNode of mutation.removedNodes) {
                traverseChildNodes(removedNode, handleRemovedNodeLevelUp);
            }
        }
    }
}

// 处理添加的节点（第二个观察器）
function handleAddedNodeLevelUp(node) {
    if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'styles_heroID')) {
        console.log('升级框中选择了英雄:', node);
        console.log('可以获取英雄ID并新建按钮了');

        levelUpHeroId = getHeroIdFromIdDom(node);

        

    } else if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'AddHeroClick_buttonRow')) {
        levelUpButtonLocatedNode = node;
        console.log('levelUpButtonLocatedNode:', levelUpButtonLocatedNode);
        
        addTheRecommandButton();

    }
    // else if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'LevelUpModal_statGrid')) {
    //     levelUpInfoLocatedNode = node;
    //     console.log('levelUpInfoLocatedNode:', levelUpInfoLocatedNode);
        
        

    // }
}

// 处理删除的节点（第二个观察器）
function handleRemovedNodeLevelUp(node) {
    if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'styles_heroID')) {
        // console.log('召唤框中删除了英雄:', node);
        // console.log('删除按钮了');

        $('#levelUpHeroRecinfoBlock').remove();


    }
}

function addTheRecommandButton() {
    const showContainer = createButtonContainer('levelUpRecButtonContainer');
    // 创建按钮元素
    const button = createButton('levelUpRecButton', 'Recommend hero leveling strategy');

    showContainer.append(button);


    $(levelUpButtonLocatedNode).after(showContainer);
    button.on('click', getRecommandedLevelUpStrategy);
}

async function getRecommandedLevelUpStrategy() {
    showLoading($('#levelUpRecButton'), 'Recommanding...');

    let myHero = await fetchHeroWithId(levelUpHeroId);

    console.log('myHero:', myHero);

    let recData = chooseStatsToUpgrade(myHero);

    console.log('recData:', recData);

    levelUpFinalData = {
        comBatRec: recData.comBatStats,
        workRec: recData.workStats.finalSelectStats,
        professionDesc: recData.workStats.professionDesc,
        craft1Desc: recData.workStats.craft1Desc,
        craft2Desc: recData.workStats.craft2Desc
    }

    hideLoading($('#levelUpRecButton'), 'Recommanding...');
    $('#levelUpRecButton').remove();

    showTheInfo();

}

// 选择属性的主逻辑
function chooseStatsToUpgrade(hero) {



    let comBatStats = chooseStatsForCombat(hero);
    console.log('comBatStats:', comBatStats);

    let workStats = chooseStatsForWorker(hero);
    console.log('workStats:', workStats);

    return {
        comBatStats,
        workStats
    }
}


// 选择战斗类英雄的三个主属性
function chooseStatsForCombat(hero) {
    let primaryStats = {
        "STR": hero.strengthGrowthP,
        "INT": hero.intelligenceGrowthP,
        "WIS": hero.wisdomGrowthP,
        "LCK": hero.luckGrowthP,
        "AGI": hero.agilityGrowthP,
        "VIT": hero.vitalityGrowthP,
        "END": hero.enduranceGrowthP,
        "DEX": hero.dexterityGrowthP
    }
    let stats = Object.keys(primaryStats);
    // 按primaryStatGrowth的值排序,选择三个最大的属性
    stats.sort((a, b) => primaryStats[b] - primaryStats[a]);
    return stats.slice(0, 3);
}

// 选择打工类英雄的三个属性
function chooseStatsForWorker(hero) {

    function getStatsByCraft(craft, _seq) {
        if (craft === 0) { // Blacksmithing
            stats.push('STR', 'WIS');
            if (_seq == 1) {
                craft1Desc = ['Blacksmithing', 'STR', 'WIS'];
            } else if (_seq == 2) {
                craft2Desc = ['Blacksmithing', 'STR', 'WIS'];
            }

        } else if (craft === 2) { // Goldsmithing
            stats.push('DEX', 'LCK');
            if (_seq == 1) {
                craft1Desc = ['Goldsmithing', 'DEX', 'LCK'];
            } else if (_seq == 2) {
                craft2Desc = ['Goldsmithing', 'DEX', 'LCK'];
            }
        } else if (craft === 4) { // Armorsmithing
            stats.push('END', 'AGI');
            if (_seq == 1) {
                craft1Desc = ['Armorsmithing', 'END', 'AGI'];
            } else if (_seq == 2) {
                craft2Desc = ['Armorsmithing', 'END', 'AGI'];
            }
        } else if (craft === 6) { // Woodworking
            stats.push('VIT', 'DEX');
            if (_seq == 1) {
                craft1Desc = ['Woodworking', 'VIT', 'DEX'];
            } else if (_seq == 2) {
                craft2Desc = ['Woodworking', 'VIT', 'DEX'];
            }
        } else if (craft === 8) { // Leatherworking
            stats.push('AGI', 'STR');
            if (_seq == 1) {
                craft1Desc = ['Leatherworking', 'AGI', 'STR'];
            } else if (_seq == 2) {
                craft2Desc = ['Leatherworking', 'AGI', 'STR'];
            }
        } else if (craft === 10) { // Tailoring
            stats.push('WIS', 'END');
            if (_seq == 1) {
                craft1Desc = ['Tailoring', 'WIS', 'END'];
            } else if (_seq == 2) {
                craft2Desc = ['Tailoring', 'WIS', 'END'];
            }
        } else if (craft === 12) { // Enchanting
            stats.push('INT', 'VIT');
            if (_seq == 1) {
                craft1Desc = ['Enchanting', 'INT', 'VIT'];
            } else if (_seq == 2) {
                craft2Desc = ['Enchanting', 'INT', 'VIT'];
            }
        } else if (craft === 14) { // Alchemy
            stats.push('LCK', 'INT');
            if (_seq == 1) {
                craft1Desc = ['Alchemy', 'LCK', 'INT'];
            } else if (_seq == 2) {
                craft2Desc = ['Alchemy', 'LCK', 'INT'];
            }
        }
    }

    let stats = [];
    let profession = hero.profession;
    let craft1 = hero.craft1;
    let craft2 = hero.craft2;
    let professionDesc, craft1Desc, craft2Desc;

    // 根据profession选择属性
    if (profession == 0) {
        stats.push('STR', 'END');
        professionDesc = ['Mining', 'STR', 'END'];
    } else if (profession == 4) {
        stats.push('AGI', 'LCK');
        professionDesc = ['Fishing', 'AGI', 'LCK'];
    } else if (profession == 6) {
        stats.push('INT', 'DEX');
        professionDesc = ['Foraging', 'INT', 'DEX'];
    } else if (profession == 2) {
        stats.push('WIS', 'VIT');
        professionDesc = ['Gardening', 'WIS', 'VIT'];
    }


    // 根据craft1选择属性
    getStatsByCraft(craft1, 1);
    getStatsByCraft(craft2, 2);

    // 添加战斗属性
    // let combatStats = chooseStatsForCombat(hero);
    // stats.push(...combatStats);

    // console.log('stats:', stats)


    // 综合profession和craft选择的属性,选择三个重合性高的属性
    let selectedStats = [];
    let statCount = {};

    stats.forEach(s => {
        if (selectedStats.includes(s)) {
            statCount[s]++;
        } else {
            selectedStats.push(s);
            statCount[s] = 1;
        }
    });

    
    // console.log('selectedStats:', selectedStats)
    // console.log('statCount:', statCount)

    selectedStats.sort((a, b) => statCount[b] - statCount[a]);
    // console.log(statCount);
    let finalSelectStats = selectedStats.slice(0, 3);

    return {
        professionDesc,
        craft1Desc,
        craft2Desc,
        finalSelectStats
    }
}


function showTheInfo() {
    // 2. 创建一个信息块，信息块中包含 3 部分信息。
    const infoBlock = $('<div class="container bg-dark text-white my-2 p-2"></div>');
    infoBlock.attr('id', 'levelUpHeroRecinfoBlock');
  
    // 3. 信息 1 是一段文案，信息 2 也是一段文案
    const info1 = $(`<p>Combat Hero: ${levelUpFinalData.comBatRec.join(', ')}</p>`);
    const info2 = $(`<p>Working Hero: ${levelUpFinalData.workRec.join(', ')}</p>`);

    infoBlock.append(info1, info2);

    const table = $('<table class="table table-dark table-bordered table-striped table-sm align-middle"></table>');
    const tbody = $('<tbody></tbody>');
    
    const tableData = [
        levelUpFinalData.professionDesc,
        levelUpFinalData.craft1Desc,
        levelUpFinalData.craft2Desc
    ];
    
    tableData.forEach((rowData, index) => {
        const tr = $('<tr></tr>');
        rowData.forEach((cellData, cellIndex) => {
            if (cellIndex === 0) {
                const th = $('<th></th>').text(cellData);
                tr.append(th);
            } else {
                const td = $('<td></td>').text(cellData);
                tr.append(td);
            }
        });
        tbody.append(tr);
    });
    
    table.append(tbody);
    infoBlock.append(table);

    // 5. 表格下面有一段文案说明。
    const tableDescription = $('<p></p>');
    infoBlock.append(tableDescription);

    // 6. 将这个信息块插入到原始网页的某个特定 DOM 前面。
    const targetElement = $(levelUpButtonLocatedNode); // 请将 #target-element 替换为你想插入信息块前面的实际元素选择器
    targetElement.after(infoBlock);
}



