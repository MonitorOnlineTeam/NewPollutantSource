import React, { useState, useEffect } from 'react'
import { Transfer, Tree, Spin, Empty, message, } from 'antd'
import { ConsoleSqlOutlined, CalculatorFilled } from '@ant-design/icons';
import { connect } from 'dva';
import styles from './styles.less'

const dvaPropsData = ({ global }) => ({
  clientHeight: global.clientHeight,
  permisBtnTip: global.permisBtnTip,
})
const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {

  const { treeData, checkedKeys, height, clientHeight, titles, } = props;
  const [targetKeys, setTargetKeys] = useState(checkedKeys)
  const [rightTreeData, setRightTreeData] = useState([])
  // const generateTree = (treeNodes = [], checkedKeys = []) => {
  //   return treeNodes?.length && treeNodes.filter(item => checkedKeys.indexOf(item.key) == -1).map(item => {
  //     item = { ...item }
  //     if (item.children?.length) {
  //       item.children = generateTree(item.children, checkedKeys)
  //     }
  //     return item
  //   })
  // }
  const generateTree = (treeNodes = [], checkedKeys = []) => {
    // 遍历树形数组  
    for (let i = 0; i < treeNodes.length; i++) {
      if (checkedKeys.includes(treeNodes[i].key)) {
        // 如果当前节点的key在要移除的节点数组中，则移除该节点  
        let childrenToKeep = treeNodes[i].children;
        // 移除父节点  
        treeNodes.splice(i, 1);
        // 将父节点的子节点插入到被移除的位置  
        if (childrenToKeep) {
          for (let j = 0; j < childrenToKeep.length; j++) {
            treeNodes.splice(i + j, 0, childrenToKeep[j]);
          }
        }
        // 由于移除了节点，需要退回一步，以便下次正确遍历  
        i--;
      } else if (treeNodes[i].children) {
        // 如果当前节点有子节点，递归查找子节点  
        generateTree(treeNodes[i].children, checkedKeys);
      }
    }
    return treeNodes;
  }
  // function findParentNodeByKey(nodes, childNodeKey) {  //通过子节点的key 查找父节点  并返回其key  以数组形式返回
  //   for (let i = 0; i < nodes.length; i++) {
  //     let node = nodes[i];
  //     if (node.children && node.children.length > 0) {
  //       for (let j = 0; j < node.children.length; j++) {
  //         let childNode = node.children[j];

  //         if (childNode.key === childNodeKey) {
  //           return node.key ? [node.key] : [];
  //         } else {
  //           let result = findParentNodeByKey(node.children, childNodeKey);
  //           if (result !== null) {
  //             return result;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   return null;
  // }
  // const dealCheckboxSeleted = ({ node, onItemSelect, onItemSelectAll }) => {
  //   let {
  //     checked,
  //     halfCheckedKeys,
  //     node: { key, children, title },
  //   } = node
  //   // 勾选的是父节点
  //   if (children?.length > 0) {
  //     const getKeys = (node) => {
  //       const keyArr = [];
  //       const keysValue = (node) => {
  //         node?.[0] && node.forEach(child => {
  //           keyArr.push(child.key)
  //           keysValue(child.children)
  //         })
  //       }
  //       keysValue(node)
  //       return keyArr;
  //     }
  //     let keys = []
  //     keys = getKeys(children)
  //     onItemSelectAll([...keys, key], checked)
  //   } else {
  //     // 勾选的是子节点
  //     if (!checked) {
  //       // 查找该元素的父元素
  //       let parentKeys = halfCheckedKeys?.[0] && [halfCheckedKeys?.[0]] || findParentNodeByKey(treeData, key) || []
  //       onItemSelectAll([...parentKeys, key], checked)
  //     } else {
  //       let parentKey = ''
  //       treeData && treeData[0] && treeData.forEach(tree => {
  //         if (tree?.children) {
  //           tree.children?.forEach(child => {
  //             if (child?.key === key) {
  //               parentKey = tree?.key
  //             }
  //           })
  //         }
  //       })
  //       if (!halfCheckedKeys?.includes(parentKey)) {
  //         onItemSelectAll([key, parentKey], checked)
  //       } else {
  //         onItemSelect(key, checked)
  //       }
  //     }
  //   }
  // }
  const [leftData, setLeftData] = useState([])

  const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {

    const transferDataSource = []
    function flatten(list = []) {
      list.forEach(item => {
        transferDataSource.push(item)
        flatten(item.children ? item.children : [])
      })
    }
    flatten(dataSource)
    const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey);
    return (
      <Transfer
        {...restProps}
        targetKeys={targetKeys}
        className={styles["tree-transfer"]}
        render={item => item.title}
        dataSource={transferDataSource}
        titles={titles ? titles : ['待分配点位', '已分配点位']}
      >
        {({ direction, onItemSelect, onItemSelectAll, selectedKeys }) => {
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...targetKeys]
            return (
              leftData?.length ? <Tree
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                height={550}
                {...props}
                checkedKeys={checkedKeys}
                treeData={leftData}
                // onCheck={(_, node) => {
                //   dealCheckboxSeleted({ node, onItemSelect, onItemSelectAll })
                // }}
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
              />
                :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
          }
        }}
      </Transfer>
    )
  }

  // function findParentNodes(tree, targetKeys) {  //所有子节点被选中的 父节点
  //   const parentNodes = [];

  //   function dfs(nodes, parentNode) {
  //     for (let i = 0; i < nodes.length; i++) {
  //       const isIncludes = nodes.every(item => targetKeys.includes(item.key))
  //       if (parentNode && isIncludes) {  //parentNode 只添加有子节点的父节点
  //         parentNodes.push(parentNode.key);
  //       }
  //       const node = nodes[i];
  //       if (node.children && node.children.length > 0) {
  //         dfs(node.children, node);
  //       }
  //     }
  //   }

  //   dfs(tree, null);
  //   return parentNodes;
  // }
  // const [initDataLoading, setInitDataLoading] = useState(false)
  useEffect(() => {
    initData()
  }, [targetKeys])

  function copyArrayTree(tree) {  
    // 使用map方法遍历数组并复制每个元素  
    const newNode = tree.map(node => {  
      // 如果是叶子节点，直接返回复制后的节点  
      if (!node.children) {  
        return { ...node };  
      }  
      // 如果是父节点，递归复制子节点数组  
      return {  
        ...node,  
        children: copyArrayTree(node.children)  
      };  
    });  
    return newNode;  
  }
  const initData = () => {

    // let keys = findParentNodes(treeData, targetKeys)
    // const leftDatas = generateTree(treeData, [...targetKeys, ...keys])
    // setLeftData(leftDatas)
    const dataSource = copyArrayTree(treeData)
    setLeftData(generateTree(dataSource, targetKeys))
  }
  // function getLastChildKeys(tree) { //所有父节点 
  //   const lastChildKeys = [];

  //   function dfs(nodes) {
  //     for (let i = nodes.length - 1; i >= 0; i--) {
  //       const node = nodes[i];
  //       if (node.children && node.children.length > 0) {
  //         dfs(node.children);
  //       } else {
  //         lastChildKeys.push(node.key);
  //       }
  //     }
  //   }

  //   dfs(tree);
  //   return lastChildKeys;
  // }
  const onChange = (keys, direction, moveKeys) => {
    // let changeArrType = 1 // 0-删除  1-新增
    // if (direction === 'left') {
    //   changeArrType = 0
    //   if (keys?.length > 0) {
    //     treeData.forEach(tree => {
    //       let index = keys.indexOf(tree?.key)
    //       if (index > -1 && tree?.children?.length > 0) {
    //         tree?.children?.forEach(child => {
    //           if (keys.includes(child?.key)) {
    //             keys?.splice(index, 1)
    //           }
    //         })
    //       }
    //     })
    //   }
    // }
    // // 获取两个数组的相同值  
    // keys = keys.filter(value => getLastChildKeys(treeData).includes(value)); //所有移除的key
    // moveKeys = moveKeys.filter(value => getLastChildKeys(treeData).includes(value));//本次需要移除的key
    // setTargetKeys(keys)
    // let keysList = changeArrType === 1 ? keys : moveKeys
    // props.targetKeysChange && props.targetKeysChange(moveKeys, changeArrType, () => {

    // })
    let changeArrType = direction === 'left' ? 0 : 1 // 0-删除  1-新增
    props.targetKeysChange && props.targetKeysChange(moveKeys, changeArrType, () => {
      setTargetKeys(keys)
    })
  }


  return <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={onChange} />
}

export default connect(dvaPropsData, dvaDispatch)(Index);