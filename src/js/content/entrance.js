// 导入所需的函数
// Import required functions
import {
    checkNodeClassName,
    traverseChildNodes,
    getWalletAddrByName,
    setStorageData,
    removeStorageData,
    getCurrentChain,
    getUserName
} from "./pubFunc";

import { handleMutationsSummon } from "./summonAssist";
import { handleMutationsLevelUp } from "./levelUpAssist";
import { handleDuelAssist, showTheDuelRecInfo2 } from "./duelAssist";

// 定义观察器变量
// Define observer variables
let summonDomObserver, levelUpObserver, duelObserver;

console.log("DFK Enhanced Assistant has been loaded.");

// 创建文档观察器用于处理DOM树变化
// Create document observer for handling DOM tree changes
const documentOberver = new MutationObserver(handleMutationsDocument);

// 选择要观察的DOM树的根元素
// Select the root element of the DOM tree to observe
const rootElement = document.documentElement;

// 配置观察器
// Configure the observer
const config = Object.freeze({
    childList: true,
    subtree: true,
});

// 开始观察
// Start observing
documentOberver.observe(rootElement, config);

// 初始化数据
// Initialize data
// setTimeout(async () => {
//     try {
//         // 移除旧数据并获取新数据
//         // Remove old data and get new data
//         // await Promise.all([
//         //     removeStorageData("userName"),
//         //     removeStorageData("userWalletAddr"),
//         //     removeStorageData("currentChain"),
//         // ]);

//         // const userName =  getUserName();
//         // setStorageData("userName", userName);

//         // const userWalletAddr = await getWalletAddrByName(userName);
//         // setStorageData("userWalletAddr", userWalletAddr);

//         // const currentChain = getCurrentChain();
//         // setStorageData("currentChain", currentChain);
//     } catch (error) {
//         // 错误处理
//         // Error handling
//         console.error("Error during initialization:", error);
//     }
// }, 5000);

// 处理文档变化的回调函数
// Callback function for handling document changes
function handleMutationsDocument(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === "childList") {
            for (const addedNode of mutation.addedNodes) {
                traverseChildNodes(addedNode, handleAddedNode);
            }

            for (const removedNode of mutation.removedNodes) {
                traverseChildNodes(removedNode, handleRemovedNode);
            }
        }
    }
}

// 处理添加的节点
// Handle added nodes
async function handleAddedNode(node, _observeType) {
    try {
        if (
            node.nodeType === Node.ELEMENT_NODE &&
            checkNodeClassName(node, "InfusionTab_heroSelectRow")
        ) {
            // 当召唤框被创建时
            // When summon box is created
            summonDomObserver = new MutationObserver(handleMutationsSummon);
            summonDomObserver.observe(node.firstChild, config);
        } else if (
            node.nodeType === Node.ELEMENT_NODE &&
            checkNodeClassName(node, "LevelUpModal_levelUpContents")
        ) {
            // 当升级框被创建时
            // When level up box is created
            levelUpObserver = new MutationObserver(handleMutationsLevelUp);
            levelUpObserver.observe(node, config);
        } else if (
            node.nodeType === Node.ELEMENT_NODE &&
            checkNodeClassName(node, "StartDuelModal_duelHeroSelectionWrapper")
        ) {
            // 当决斗框被创建时
            // When duel box is created
            console.log("duel框被创建了创建:", node);

            await handleDuelAssist();
        } else if (
            node.nodeType === Node.ELEMENT_NODE &&
            checkNodeClassName(node, "HeroList_rechargeToggle")
        ) {
            // 当决斗英雄选择框被建立时
            // When duel hero selection box is created
            console.log("duel英雄选择框被建立:", node);

            showTheDuelRecInfo2(node);
        }
    } catch (error) {
        // 错误处理
        // Error handling
        console.error("Error handling added node:", error);
    }
}

// 处理删除的节点
// Handle removed nodes
function handleRemovedNode(node) {
    if (
        node.nodeType === Node.ELEMENT_NODE &&
        checkNodeClassName(node, "InfusionTab_heroSelectRow")
    ) {
        // 当召唤框被删除时
        // When summon box is removed
        summonDomObserver.disconnect();
    } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        checkNodeClassName(node, "LevelUpModal_levelUpContents")
    ) {
        // 当升级框被删除时
        // When level up box is removed
        levelUpObserver.disconnect();
    } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        checkNodeClassName(node, "StartDuelModal_duelHeroSelectionWrapper")
    ) {
        // 当决斗框被删除时
        // When duel box is removed
    } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        checkNodeClassName(node, "HeroList_rechargeToggle")
    ) {
        // 当决斗英雄选择框被删除时
        // When duel hero selection box is removed
    }
}