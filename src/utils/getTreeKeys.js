/**
 * 功  能：获取树形结构的默认选中值、展开值、所有父级值
 * 创建人：李月
 * 创建时间：2019.3.29
 */

//选中的导航Id
export function getTreeCheckedKeys(treeData, checkedKyes) {

    if (treeData.children && treeData.children.length) {
        return getTreeCheckedKeys(treeData.children[0], checkedKyes);
    }
    checkedKyes.push(treeData.id);
    return checkedKyes;
}
//选中的导航Name
export function getTreeCheckedName(treeData, checkedKyes) {

    if (treeData.children && treeData.children.length) {
        return getTreeCheckedName(treeData.children[0], checkedKyes);
    }
    return treeData.name;
}
//展开导航Id
export function getTreeExpandedKeys(treeData, expandedKeys) {
    if (treeData.children && treeData.children.length) {
        expandedKeys.push(treeData.id);
        return getTreeExpandedKeys(treeData.children[0], expandedKeys);
    }
    return expandedKeys;
}
//父级导航Id
export function getTreeParentKeys(treeData, parentKeys) {

    treeData.map((item) => {
        if (item.children && item.children.length > 0) {
            parentKeys.push(item.id);
            return getTreeParentKeys(item.children, parentKeys);
        }
    })
    return parentKeys;
}
//子级导航Id
export function getTreeChildrenKeys(treeData, childrenKeys) {

    treeData.map((item) => {
        if (item.children && item.children.length > 0) {
            return getTreeChildrenKeys(item.children, childrenKeys);
        }
        childrenKeys.push(item.id);
    })

    return childrenKeys;
}

//搜索组合
export function generateList(treeData, dataList) {

    treeData.map((item) => {
        const key = item.id;
        dataList.push({ key, name: item.name });
        if (item.children && item.children.length > 0) {
            return generateList(item.children, dataList);
        }
    })

    return dataList;
}
//搜索组合
export function generateLists(treeData, dataList) {
    treeData.map((item) => {
        const key = item.Menu_Id;
        dataList.push({ key, name: item.Menu_Name });
        if (item.children && item.children.length > 0) {
            return generateLists(item.children, dataList);
        }
    })

    return dataList;
}
//搜索时获取父级Key值
export function getParentKey(key, tree) {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children && node.children.length > 0) {
            if (node.children.some(item => item.id === key)) {
                parentKey = node.id;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};
//搜素时获取父级Key值
export function getParentKeys(key, tree) {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children && node.children.length > 0) {
            if (node.children.some(item => item.Menu_Id === key)) {
                parentKey = node.Menu_Id;
            } else if (getParentKeys(key, node.children)) {
                parentKey = getParentKeys(key, node.children);
            }
        }
    }
    return parentKey;
};

