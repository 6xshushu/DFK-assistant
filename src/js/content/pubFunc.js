import $ from "cash-dom";
import {
    getHeroInfoWithId,
    getUserProfileByName,
    getWalletHeroes
} from '../graphql/getQlData';

// 检查节点类名
// Check node class name
export function checkNodeClassName(_node, _className) {
    const fixedClassName = _className;
    // 创建正则表达式，用于匹配类名
    // Create a regular expression for matching class names
    const regex = new RegExp(`\\b${fixedClassName}\\S*\\b`);

    // 如果节点具有className属性且为字符串类型，则进行匹配
    // If the node has a className attribute and is of string type, then match
    if (typeof _node.className === 'string') {
        // 创建正则表达式，用于匹配类名
        // Create a regular expression for matching class names
        const regex = new RegExp(`\\b${fixedClassName}\\S*\\b`);

        // 检查节点的类名是否包含固定值
        // Check if the node's class name contains the fixed value
        if (_node.className.match(regex)) {
            // 操作匹配的节点
            // Handle the matched node
            return true;
        }
    }

    return false;
}

// 用于遍历子节点的递归函数
// Recursive function for traversing child nodes
export function traverseChildNodes(node, callback) {
    if (!node || !callback || typeof callback !== 'function') {
        throw new Error('参数错误，无法遍历子节点。'); // Parameter error, unable to traverse child nodes
    }

    callback(node);
    if (node.childNodes) {
        for (const child of node.childNodes) {
            traverseChildNodes(child, callback);
        }
    }
}

export function getHeroIdFromIdDom(element) {
    if (!element) {
        throw new Error('元素不存在。'); // Element does not exist
    }

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
// Create button
export function createButton(_buttonId, _buttonText) {
    return $('<button>')
        .text(_buttonText)
        .attr('id', _buttonId)
        .attr('type', 'button')
        .addClass('btn btn-dark')
}

// 创建buttonContaniner
// Create button container
export function createButtonContainer(_containerId) {
    return $('<div>')
        .attr('id', _containerId)
        .addClass('d-flex')
        .css({
            justifyContent: 'center'
        });
}

// 显示loading状态
// Show loading status
export function showLoading(button, _text) {
    if (!button) {
        throw new Error('按钮元素不存在。'); // Button element does not exist
    }

    button.text(_text).attr('disabled', 'disabled');
}

// 隐藏loading状态
// Hide loading status
export function hideLoading(button, _text) {
    if (!button) {
        throw new Error('按钮元素不存在。'); // Button element does not exist
    }

    button.text(_text).removeAttr('disabled');
}

export function normalizeHeroes(_heroes) {
    if (!_heroes || !Array.isArray(_heroes)) {
        throw new Error('英雄数据错误。'); // Hero data error
    }

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
        // 计算召唤英雄的费用
        // Calculate the cost of summoning a hero
        hero.summonPrice = calculateHeroSummonCost(hero.generation, hero.summons);
        hero.totalSummonPrice = hero.summonPrice + hero.assistingPrice;

        hero.craft1 = hero.statsUnknown1;
        hero.craft2 = hero.statsUnknown2;

        hero.isOwn = '';


    });
    return _heroes;
}


// Fetch a hero with the given ID and normalize the data
// 使用给定的 ID 获取英雄并规范化数据
export function fetchHeroWithId(_heroId) {
    return new Promise(async (resolve, reject) => {
        try {
            let results = await getHeroInfoWithId(_heroId);
            let hero = results.hero;
            let heroProcessedInfo = normalizeHeroes([hero]);

            resolve(heroProcessedInfo[0]);
        } catch (error) {
            console.error('Error fetching hero with ID:', error);
            reject(error);
        }
    });
}

// Fetch all heroes associated with a given wallet address and normalize the data
// 获取与给定钱包地址关联的所有英雄并规范化数据
export function fetchWalletHeroes(_walletAddr) {
    return new Promise(async (resolve, reject) => {
        try {
            let results = await getWalletHeroes(_walletAddr);

            let walletHeroes = results.heroes;
            let walletHeroesProcessed = normalizeHeroes(walletHeroes);

            resolve(walletHeroesProcessed);
        } catch (error) {
            console.error('Error fetching wallet heroes:', error);
            reject(error);
        }
    });
}

// Calculate the cost of summoning a hero based on the summoner's generation and the total number of heroes already summoned
// 根据召唤者的代数和已召唤的英雄总数计算召唤英雄的成本
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
}

// Get the wallet address associated with a given user's name
// 获取与给定用户名关联的钱包地址
export function getWalletAddrByName(_name) {
    return new Promise(async (resolve, reject) => {
        try {

            let result = await getUserProfileByName(_name);
            let walletAddr = result.profiles[0].id;

            resolve(walletAddr);
        } catch (error) {
            console.error('Error getting wallet address by name:', error);
            reject(error);
        }
    });
}

// Get the username from the DOM element
// 从 DOM 元素获取用户名
export function getUserName() {
    // 用于匹配类名以 PlayerProfileInfo_playerName 开头的元素
    const classNamePrefix = 'PlayerProfileInfo_playerName';
    const matchedElement = $(`[class^="${classNamePrefix}"]`);

    let userName = null;
    // 如果找到匹配的元素，可以继续获取或操作该元素
    if (matchedElement.length > 0) {

        userName = matchedElement.text();

        // console.log('用户名为:', userName);
    } else {
        // console.log('未找到用户名');
    }

    return userName;
}

// Store a key-value pair using Chrome's local storage API
// 使用 Chrome 的本地存储 API 存储键值对
export function setStorageData(key, value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
            resolve();
        });
    });
}

// Retrieve the value associated with a key from Chrome's local storage
// 从 Chrome 的本地存储中检索与键关联的值
export function getStorageData(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
            resolve(result[key]);
        });
    });
}

// Remove a key-value pair from Chrome's local storage
// 从 Chrome 的本地存储中删除键值对
export function removeStorageData(key) {
    return new Promise((resolve) => {
        chrome.storage.local.remove([key], () => {
            resolve();
        });
    });
}

// Get the user's wallet address from local storage or by calling getWalletAddrByName()
// 从本地存储中获取用户的钱包地址，或者通过调用 getWalletAddrByName() 获取
export async function getUserWalletAddrGeneral(_name) {
    try {
        let userWalletAddr = await getStorageData('userWalletAddr');
        if (userWalletAddr == undefined) {
            userWalletAddr = await getWalletAddrByName(_name);
        }

        return userWalletAddr;
    } catch (error) {
        console.error('Error getting user wallet address:', error);
        throw error;
    }
}

export async function getUserNameGeneral() {
    try {
        let userName = await getStorageData('userName');
        if (userName == undefined) {
            userName = getUserName();
        }

        return userName;
    } catch (error) {
        console.error('Error getting user name:', error);
        throw error;
    }
}

export async function getCurrentChainGeneral() {
    try {
        let chain = await getStorageData('currentChain');
        if (chain == undefined) {
            chain = getCurrentChain();
        }

        return chain;
    } catch (error) {
        console.error('Error getting chain:', error);
        throw error;
    }
}



// Get the current blockchain chain from the DOM element
// 从 DOM 元素获取当前区块链链
export function getCurrentChain() {
    const classNamePrefix = 'PlayerProfileInfo_playerTokenGrid';
    const matchedElement = $(`[class^="${classNamePrefix}"]`);

    let chain = null;
    // 如果找到匹配的元素，可以继续获取或操作该元素
    if (matchedElement.length > 0) {

        const imgSrc = matchedElement.find('img').attr('src');



        if (imgSrc.includes('jade')) {
            chain = 'kla';
        } else if (imgSrc.includes('crystal')) {
            chain = 'dfk';
        }

        // chain = matchedElement.text();
        // console.log(chain);

        // console.log('用户名为:', userName);
    } else {
        console.log('未找到链名');
    }

    return chain;
}

// Check if a given string contains another string
// 检查给定的字符串是否包含另一个字符串
export function searchString(str, strToSearch) {
    const mainString = str;
    const searchString = strToSearch;

    if (mainString.includes(searchString)) {
        // console.log('The main string contains the search string.');
        return true;
    } else {
        // console.log('The main string does not contain the search string.');
        return false;
    }
}

// Add a style element with the given CSS rules to the document's head
// 将带有给定 CSS 规则的样式元素添加到文档的 head 中
export function addStyles(styles) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styles));
    document.head.appendChild(style);
}

// Convert a given ID to a short ID by removing a fixed constant value
// 通过移除固定常数值将给定的 ID 转换为短 ID
export function getShortId(_id) {
    let shortId;
    if (BigInt(_id) > BigInt('2000000000000')) {
        shortId = BigInt(_id) - BigInt('2000000000000');
    } else if (BigInt(_id) > BigInt('1000000000000') && BigInt(_id) < BigInt('2000000000000')) {
        shortId = BigInt(_id) - BigInt('1000000000000');
    } else {
        shortId = _id;
    }
    shortId = shortId.toString();
    return shortId;
}

// Create a toast notification element with Bootstrap 5 classes
// 使用 Bootstrap 5 类创建一个 toast 通知元素
export function createToast() {
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