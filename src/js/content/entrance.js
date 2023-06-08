


import {
    checkNodeClassName
    , traverseChildNodes
} from "./pubFunc";

import { handleMutationsSummon } from "./summonAssist";
import { handleMutationsLevelUp } from "./levelUpAssist";

let summonDomObserver,levelUpObserver;

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
function handleAddedNode(node, _observeType) {
  
        if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'InfusionTab_heroSelectRow')) {
            // console.log('召唤框被创建了创建:', node);

            summonDomObserver = new MutationObserver(handleMutationsSummon);
            summonDomObserver.observe(node.firstChild, config);

        }else if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'LevelUpModal_levelUpContents')) {
            console.log('升级框被创建了创建:', node);

            levelUpObserver = new MutationObserver(handleMutationsLevelUp);
            levelUpObserver.observe(node, config);

        }
        
   

}


// 处理删除的节点
function handleRemovedNode(node) {
 
        if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'InfusionTab_heroSelectRow')) {
            // console.log('召唤框被删除了:', node);
            summonDomObserver.disconnect();
        }else if (node.nodeType === Node.ELEMENT_NODE && checkNodeClassName(node, 'LevelUpModal_levelUpContents')) {
            // console.log('召唤框被删除了:', node);
            levelUpObserver.disconnect();
        }
    
}