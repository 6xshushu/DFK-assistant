


import {
    checkNodeClassName
    , traverseChildNodes,
    getWalletAddrByName,
    setStorageData,
    removeStorageData
} from "./pubFunc";

import { handleMutationsSummon } from "./summonAssist";
import { handleMutationsLevelUp } from "./levelUpAssist";
import { handleDuelAssist } from "./duelAssist";


let summonDomObserver, levelUpObserver,duelObserver;


console.log('DFK Enhanced Assistant has been loaded.');

const documentOberver = new MutationObserver(handleMutationsDocument);

// 选择要观察的DOM树的根元素
const rootElement = document.documentElement;

// 配置观察器
const config = {
    childList: true,
    subtree: true,
};

// 开始观察
documentOberver.observe(rootElement, config);

setTimeout(async () => {
    await removeStorageData('userWalletAddr');
    let userWalletAddr=await getWalletAddrByName();
    await setStorageData('userWalletAddr',userWalletAddr);
    // console.log('userWalletAddr:',userWalletAddr);
}, 5000);

function handleMutationsDocument(mutations) {
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


// 处理添加的节点
async function handleAddedNode(node, _observeType) {

    if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'InfusionTab_heroSelectRow')) {
        // console.log('召唤框被创建了创建:', node);

        summonDomObserver = new MutationObserver(handleMutationsSummon);
        summonDomObserver.observe(node.firstChild, config);

    } else if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'LevelUpModal_levelUpContents')) {
        // console.log('升级框被创建了创建:', node);

        levelUpObserver = new MutationObserver(handleMutationsLevelUp);
        levelUpObserver.observe(node, config);

    }else if(node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'StartDuelModal_duelHeroSelectionWrapper')) {
        // console.log('duel框被创建了创建:', node);

        // await handleDuelAssist();
        // duelObserver = new MutationObserver(handleMutationsDuel);
        // duelObserver.observe(node, config);

    }



}


// 处理删除的节点
function handleRemovedNode(node) {

    if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'InfusionTab_heroSelectRow')) {
        // console.log('召唤框被删除了:', node);
        summonDomObserver.disconnect();
    } else if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'LevelUpModal_levelUpContents')) {
        // console.log('召唤框被删除了:', node);
        levelUpObserver.disconnect();
    }else if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'StartDuelModal_duelHeroSelectionWrapper')) {
        // console.log('召唤框被删除了:', node);
        duelObserver.disconnect();
    }

}


