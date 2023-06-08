
import $ from "cash-dom";

import 'bootstrap/js/dist/dropdown';
import Toast from 'bootstrap/js/dist/toast';
import Tooltip from 'bootstrap/js/dist/tooltip';

import {
    checkNodeClassName
    , traverseChildNodes,
    getHeroIdFromIdDom,
    createButton,
    createButtonContainer,
    showLoading,
    hideLoading,
    fetchHeroWithId,
    normalizeHeroes
} from "./pubFunc";




import {
    
    getAssistingHeroes
} from '../graphql/getQlData';

// 初始化MutationObserver

let mySummonHeroId = null;
let summonInfoLocatedNode;
let finalAssistingHeroes;
let summonInfoHeaders, summonInfoRows;




export function handleMutationsSummon(mutations) {
    for (const mutation of mutations) {
        // 检查是否有新添加的节点
        if (mutation.type === 'childList') {
            for (const addedNode of mutation.addedNodes) {
                traverseChildNodes(addedNode, handleAddedNodeSummon);
            }
            for (const removedNode of mutation.removedNodes) {
                traverseChildNodes(removedNode, handleRemovedNodeSummon);
            }
        }
    }
}

// 处理添加的节点（第二个观察器）
function handleAddedNodeSummon(node) {
    if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'styles_heroID')) {
        // console.log('召唤框中选择了英雄:', node);
        // console.log('可以获取英雄ID并新建按钮了');

        mySummonHeroId = getHeroIdFromIdDom(node);



    } else if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'AddHeroClick_buttonRow')) {
        summonInfoLocatedNode = node;
        // console.log('summonInfoLocatedNode:', summonInfoLocatedNode);

        addTheMatchButton();

    }
}

// 处理删除的节点（第二个观察器）
function handleRemovedNodeSummon(node) {
    if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'styles_heroID')) {
        // console.log('召唤框中删除了英雄:', node);
        // console.log('删除按钮了');

        $('#heroSummonDropUp').remove();


    }
}

function addTheMatchButton() {

    const showContainer = createButtonContainer('summonButtonContainer');
    // 创建按钮元素
    const button = createButton('summonMatchButton', 'Find matching hero');

    showContainer.append(button);

    // $(summonInfoLocatedNode).after(showContainer);


    $(summonInfoLocatedNode).after(showContainer);
    button.on('click', getRecommandedAssistingHeroes);
}

async function getRecommandedAssistingHeroes() {

    showLoading($('#summonMatchButton'), 'Matching...');

    let myHero = await fetchHeroWithId(mySummonHeroId);
    let assistingHeroes = await fetchAssistingHeroes(myHero);
    let assistingHeroesTaged = tagAssistingHeroes(myHero, assistingHeroes);
    let sortedAssistingHeroes = sortAssistingHeroes(assistingHeroesTaged);

    // console.log(sortedAssistingHeroes);

    finalAssistingHeroes = sortedAssistingHeroes;

    summonInfoHeaders = ['ID', 'A1', 'A2', 'P1', 'P2', 'SC', 'LV', 'P1', 'P2', 'NW'];
    let tableData = finalAssistingHeroes.map(hero => hero.matchTable);

    if (tableData.length > 12) {
        summonInfoRows = tableData.slice(0, 12);
    } else {
        summonInfoRows = tableData;
    }

    hideLoading($('#summonMatchButton'), 'Matching...');

    $('#summonButtonContainer').remove();

    let dropDown = createDropdown(summonInfoHeaders, summonInfoRows);


    $(summonInfoLocatedNode).after(dropDown);

    activeTooltip();

}






async function fetchAssistingHeroes(_hero) {
    // console.log(_hero);
    const targetMainClass = getPartnerFeature(_hero.mainClass);

    const targetGeneration = _hero.generation;
    const targetSummonsRemaining = _hero.summonsRemaining;

    // console.log(targetMainClass);
    let results = await getAssistingHeroes(targetMainClass, targetGeneration, targetSummonsRemaining);

    let assistingHeroes = results.heroes;
    // console.log(results.heroes);

    let assistingHeroesProcessed = normalizeHeroes(assistingHeroes);
    // console.log(assistingHeroesProcessed);

    return assistingHeroesProcessed;

}

function sortAssistingHeroes(_assistingHeroesTaged) {
    let scoredFilteredHeroes = _assistingHeroesTaged.filter(hero => {
        return hero.score >= 1;
    });

    let sortedAssistingHeroes = scoredFilteredHeroes.sort((a, b) => {
        return b.score - a.score;
    });

    return sortedAssistingHeroes;

}



function tagAssistingHeroes(_hero, _assistingHeroes) {
    const targetSubClass = getPartnerFeature(_hero.subClass);
    const targetAcitve1 = getPartnerFeature(_hero.active1);
    const targetAcitve2 = getPartnerFeature(_hero.active2);
    const targetPassive1 = getPartnerFeature(_hero.passive1);
    const targetPassive2 = getPartnerFeature(_hero.passive2);
    // const level = 5;


    for (let i = 0; i < _assistingHeroes.length; i++) {
        let hero = _assistingHeroes[i];
        hero.score = 0;
        hero.matchDesc = "";
        hero.matchTable = [hero.id];

        if (hero.active1 == targetAcitve1) {
            hero.score += 1;
            hero.matchDesc += " 主动技能1匹配";
            hero.matchTable.push(1);
        } else {
            hero.matchTable.push(0)
        }
        if (hero.active2 == targetAcitve2) {
            hero.score += 1;
            hero.matchDesc += " 主动技能2匹配";
            hero.matchTable.push(1);
        } else {
            hero.matchTable.push(0)
        }
        if (hero.passive1 == targetPassive1) {
            hero.score += 1;
            hero.matchDesc += " 被动技能1匹配";
            hero.matchTable.push(1);
        } else {
            hero.matchTable.push(0)
        }
        if (hero.passive2 == targetPassive2) {
            hero.score += 1;
            hero.matchDesc += " 被动技能2匹配";
            hero.matchTable.push(1);
        } else {
            hero.matchTable.push(0)
        }
        if (hero.subClass == targetSubClass) {
            hero.score += 1;
            hero.matchDesc += " 副职业匹配";
            hero.matchTable.push(1);

        } else {
            hero.matchTable.push(0)
        }
        if (hero.level >= 5 && hero.level < 10) {
            // hero.score += 1;
            hero.matchDesc += ` 等级5以上`;
            hero.matchTable.push(1);
        } else if (hero.level >= 10) {
            hero.matchDesc += ` 等级10以上`;
            hero.matchTable.push(2);
        }
        else {
            hero.matchTable.push(0)
        }

        hero.matchTable.push(hero.assistingPrice);
        hero.matchTable.push(hero.summonPrice);
        hero.matchTable.push(hero.network);
        // count.push(score);
    }

    _assistingHeroes.sort((a, b) => {
        return b.score - a.score;
    });

    return _assistingHeroes;
}

function getPartnerFeature(_feature) {
    // _feature=parseInt(_feature);
    if (_feature % 2 == 0) {
        return _feature + 1;
    } else {
        return _feature - 1;
    }
}












function createDropdownButton() {
    return $('<button>')
        .addClass('btn btn-dark dropdown-toggle')
        .attr('type', 'button')
        .text('View results')
        .attr('data-bs-toggle', 'dropdown')
    //   .attr('aria-expanded', 'true')
}

function createTable(summonInfoHeaders, summonInfoRows) {
    const table = $('<table>').addClass('table table-striped table-hover mb-0 table-dark table-bordered text-center table-sm align-middle');
    const thead = $('<thead>');
    const tbody = $('<tbody>');

    const headerRow = $('<tr>');

    summonInfoHeaders.forEach(headerText => {
        $('<th>').text(headerText).appendTo(headerRow);
    });

    headerRow.appendTo(thead);

    summonInfoRows.forEach(rowData => {
        const tr = $('<tr>');
        const firstColumn = $('<th>').text(rowData[0]).appendTo(tr);
        // 添加点击事件处理器
        firstColumn.on('click', () => {
            navigator.clipboard.writeText(rowData[0]);
            // 创建并显示Toast
            const toast = createToast();
            toast.find('.toast-body').text('The hero ID has been copied to the clipboard.' + rowData[0]);

            $('body').append(toast);
            const bsToast = new Toast(toast[0], { autohide: true, delay: 3000 });
            bsToast.show();

            // 在Toast消失后删除其HTML结构
            toast.on('hidden.bs.toast', () => {
                toast.remove();
            });
        });
        $('<td>').text(rowData[1] > 0 ? '\u2713' : '').appendTo(tr);
        $('<td>').text(rowData[2] > 0 ? '\u2713' : '').appendTo(tr);
        $('<td>').text(rowData[3] > 0 ? '\u2713' : '').appendTo(tr);
        $('<td>').text(rowData[4] > 0 ? '\u2713' : '').appendTo(tr);
        $('<td>').text(rowData[5] > 0 ? '\u2713' : '').appendTo(tr);

        let levelDes;
        if (rowData[6] == 0) {
            levelDes = '';
        } else if (rowData[6] == 1) {
            levelDes = 'lv>5';
        } else if (rowData[6] == 2) {
            levelDes = 'lv>10';
        }

        $('<td>').text(levelDes).appendTo(tr);
        $('<td>').text(rowData[7]).appendTo(tr);
        $('<td>').text(rowData[8]).appendTo(tr);
        $('<td>').text(rowData[9]).appendTo(tr);


        tr.appendTo(tbody);
    });


    const caption = $('<caption>')
        .addClass('bg-dark text-white p-2 text-right')
        .text('? Explanation')
        .attr('data-bs-toggle', 'tooltip')
        .attr('data-bs-placement', 'right')
        .attr('data-bs-title', `A1 represents active1, P1 represents passive1, SC represents subClass, 
        LV represents level, P1 represents rental price, P2 represents summoning price, NW represents network. The mainClass, 
        summonRemain, and generation of the heroes in the table have already been matched. Click hero ID to copy.`)


    table.append(caption);
    table.append(thead, tbody);
    return table;
}

function createDropdownMenu(table) {
    return $('<div>')
        .addClass('dropdown-menu p-0 table-responsive')
        // .attr('id', 'heroSummonDropUp')
        .append(table)


}

function activeTooltip() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))
}

function createDropdown(summonInfoHeaders, summonInfoRows) {
    const dropdown = $('<div>')
        .attr('id', 'heroSummonDropUp')
        .addClass('dropup d-flex')
        .css({ 'justify-content': 'center' });
    const dropdownButton = createDropdownButton();
    const table = createTable(summonInfoHeaders, summonInfoRows);
    const dropdownMenu = createDropdownMenu(table);

    dropdown.append(dropdownButton, dropdownMenu);
    return dropdown;
}

function createToast() {
    return $('<div>')
        .addClass('toast position-fixed bottom-0 end-0 m-3 bg-dark')
        .attr('role', 'alert')
        .attr('aria-live', 'assertive')
        .attr('aria-atomic', 'true')
        .css({ 'z-index': 9999 })
        .append(
            $('<div>')
                .addClass('toast-header bg-dark text-white')
                .append(
                    $('<strong>')
                        .addClass('me-auto')
                        .text('Hint')
                )
                .append(
                    $('<button>')
                        .addClass('btn-close')
                        .attr('type', 'button')
                        .attr('data-bs-dismiss', 'toast')
                        .attr('aria-label', 'Close')
                )
        )
        .append(
            $('<div>')
                .addClass('toast-body')
        );
}
