
import $ from "cash-dom";
import '../../scss/content.scss';
import 'bootstrap/js/dist/dropdown';
import Toast from 'bootstrap/js/dist/toast';
import Tooltip from 'bootstrap/js/dist/tooltip';


import logo from '../../img/48.png';

console.log('DFK Enhanced Assistant has been loaded.');

import {
    getHeroInfoWithId,
    getAssistingHeroes
} from '../graphql/getQlData';

// 初始化MutationObserver
const observer1 = new MutationObserver(handleMutations1);
let observer2;
let heroId = null;
let selectHeroContainerNode;
let finalHeroes;
let headers, rows;
// 选择要观察的DOM树的根元素
const rootElement = document.documentElement;

// 配置观察器
const config = {
    childList: true,
    subtree: true,
};

// 开始观察
observer1.observe(rootElement, config);

// 处理DOM变化的回调函数
function handleMutations1(mutations) {
    for (const mutation of mutations) {
        // 检查是否有新添加的节点
        if (mutation.type === 'childList') {
            for (const addedNode of mutation.addedNodes) {
                traverseChildNodes(addedNode, handleAddedNode);
            }
            for (const removedNode of mutation.removedNodes) {
                traverseChildNodes(removedNode, handleRemovedNode);
            }
        }
    }
}

// 用于遍历子节点的递归函数
function traverseChildNodes(node, callback) {
    callback(node);
    if (node.childNodes) {
        for (const child of node.childNodes) {
            traverseChildNodes(child, callback);
        }
    }
}

// 处理添加的节点
function handleAddedNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'InfusionTab_heroSelectRow')) {
        // console.log('召唤框被创建了创建:', node);

        observer2 = new MutationObserver(handleMutations2);


        observer2.observe(node.firstChild, config);


    }
}

// 处理删除的节点
function handleRemovedNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'InfusionTab_heroSelectRow')) {
        // console.log('召唤框被删除了:', node);
        observer2.disconnect();
    }
}

function handleMutations2(mutations) {
    for (const mutation of mutations) {
        // 检查是否有新添加的节点
        if (mutation.type === 'childList') {
            for (const addedNode of mutation.addedNodes) {
                traverseChildNodes(addedNode, handleAddedNode2);
            }
            for (const removedNode of mutation.removedNodes) {
                traverseChildNodes(removedNode, handleRemovedNode2);
            }
        }
    }
}

// 处理添加的节点（第二个观察器）
function handleAddedNode2(node) {
    if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'styles_heroID')) {
        // console.log('召唤框中选择了英雄:', node);
        // console.log('可以获取英雄ID并新建按钮了');

        heroId = getHeroTrueId(node);



    } else if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'AddHeroClick_buttonRow')) {
        selectHeroContainerNode = node;
        // console.log('selectHeroContainerNode:', selectHeroContainerNode);

        addTheMatchButton();

    }
}

// 处理删除的节点（第二个观察器）
function handleRemovedNode2(node) {
    if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'styles_heroID')) {
        // console.log('召唤框中删除了英雄:', node);
        // console.log('删除按钮了');

        $('#heroSummonDropUp').remove();


    }
}

function addTheMatchButton() {

    const showContainer = createContainer();
    // 创建按钮元素
    const button = createButton();

    showContainer.append(button);

    // $(selectHeroContainerNode).after(showContainer);


    $(selectHeroContainerNode).after(showContainer);
    button.on('click', getReconmmandedAssistingHeroes);
}

async function getReconmmandedAssistingHeroes() {

    showLoading($('#myExtensionButton'));

    let myHero = await fetchHeroWithId();
    let assistingHeroes = await fetchAssistingHeroes(myHero);
    let assistingHeroesTaged = tagAssistingHeroes(myHero, assistingHeroes);
    let sortedAssistingHeroes = sortAssistingHeroes(assistingHeroesTaged);

    // console.log(sortedAssistingHeroes);

    finalHeroes = sortedAssistingHeroes;

    headers = ['ID', 'A1', 'A2', 'P1', 'P2', 'SC', 'LV', 'P1', 'P2','NW'];
    rows = finalHeroes.map(hero => hero.matchTable);

    //  rows=dd.slice(0,10);

    hideLoading($('#myExtensionButton'));

    hideTheMatchButton();

    let dropDown = createDropdown(headers, rows);


    $(selectHeroContainerNode).after(dropDown);

    activeTooltip();

}

function hideTheMatchButton() {
    // 移除按钮
    $('#myExtensionContainer').remove();
}

async function fetchHeroWithId() {

    // console.log('按钮被点击了');
    // console.log(heroId);

    let results = await getHeroInfoWithId(heroId);
    let hero = results.hero;
    let heroProcessedInfo = normalizeHeroes([hero])

    // console.log(heroProcessedInfo[0]);

    return heroProcessedInfo[0];



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

function getHeroTrueId(node) {
    // console.log(`${node}`)
    let heroTrueId = processElement(node);
    // console.log(heroTrueId);
    return heroTrueId;
}

function processElement(element) {
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


function normalizeHeroes(_heroes) {
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
    });
    return _heroes;
}

function checkNodeClassName(_node, _className) {
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
// 创建按钮
function createButton() {
    return $('<button>')
        .text('Find matching hero')
        .attr('id', 'myExtensionButton')
        .attr('type', 'button')
        .addClass('btn btn-dark')


}

// 创建表格容器
function createContainer() {
    return $('<div>')
        .attr('id', 'myExtensionContainer')
        .addClass('d-flex')
        .css({
            justifyContent: 'center'

        });
}

// 显示loading状态
function showLoading(button) {
    button.text('Matching...').attr('disabled', 'disabled');
}

// 隐藏loading状态
function hideLoading(button) {
    button.text('Matching...').removeAttr('disabled');
}



function createDropdownButton() {
    return $('<button>')
        .addClass('btn btn-dark dropdown-toggle')
        .attr('type', 'button')
        .text('View results')
        .attr('data-bs-toggle', 'dropdown')
    //   .attr('aria-expanded', 'true')
}

function createTable(headers, rows) {
    const table = $('<table>').addClass('table table-striped table-hover mb-0 table-dark table-bordered text-center table-sm align-middle');
    const thead = $('<thead>');
    const tbody = $('<tbody>');

    const headerRow = $('<tr>');

    headers.forEach(headerText => {
        $('<th>').text(headerText).appendTo(headerRow);
    });

    headerRow.appendTo(thead);

    rows.forEach(rowData => {
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
        if (rowData[6] = 0) {
            levelDes = '';
        } else if (rowData[6] = 1) {
            levelDes = 'lv>5';
        } else if (rowData[6] = 2) {
            levelDes = 'lv>10';
        }

        $('<td>').text(levelDes).appendTo(tr);
        $('<td>').text(rowData[7]).appendTo(tr);
        $('<td>').text(rowData[8]).appendTo(tr);
        $('<td>').text(rowData[9]).appendTo(tr);


        tr.appendTo(tbody);
    });
    

    const caption = $('<caption>')
        .addClass('bg-dark text-white p-2 text-left')
        .text('? Explanation')
        .attr('data-bs-toggle', 'tooltip')
        .attr('data-bs-placement', 'bottom')
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
        .css({
            right: '2rem'
        })
        .append(table)


}

function activeTooltip() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))
}

function createDropdown(headers, rows) {
    const dropdown = $('<div>')
        .attr('id', 'heroSummonDropUp')
        .addClass('dropup d-flex')
        .css({ 'justify-content': 'center' });
    const dropdownButton = createDropdownButton();
    const table = createTable(headers, rows);
    const dropdownMenu = createDropdownMenu(table);

    dropdown.append(dropdownButton, dropdownMenu);
    return dropdown;
}

function createToast() {
    return $('<div>')
        .addClass('toast position-fixed bottom-0 end-0 m-3')
        .attr('role', 'alert')
        .attr('aria-live', 'assertive')
        .attr('aria-atomic', 'true')
        .css({ 'z-index': 9999 })
        .append(
            $('<div>')
                .addClass('toast-header')
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
