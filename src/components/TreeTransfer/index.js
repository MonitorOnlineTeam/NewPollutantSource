/*
*两个节点穿梭框  适用于企业监测点树
*/
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

  const { treeData, checkedKeys, height, clientHeight, permission, permisBtnTip, titles, singleLayer } = props;
  const [targetKeys, setTargetKeys] = useState(checkedKeys)
  const [rightTreeData, setRightTreeData] = useState([])
  const generateTree = (treeNodes = [], checkedKeys = []) => {
    //  return treeNodes?.length && treeNodes.map(({ children, ...props }) => {
    //    return  {
    //     ...props,
    //     disabled: checkedKeys.includes(props.key),
    //     children: generateTree(children, checkedKeys),
    //   }
    //   })
    return treeNodes?.length && treeNodes.filter(item => checkedKeys.indexOf(item.key) == -1).map(item => {
      item = { ...item }
      if (item.children?.length) {
        item.children = generateTree(item.children, checkedKeys)
      }
      return item
    })
  }
  function findParentNodeByKey(nodes, childNodeKey) {  //通过子节点的key 查找父节点  并返回其key  以数组形式返回
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      if (node.children && node.children.length > 0) {
        for (let j = 0; j < node.children.length; j++) {
          let childNode = node.children[j];

          if (childNode.key === childNodeKey) {
            return node.key ? [node.key] : [];
          } else {
            let result = findParentNodeByKey(node.children, childNodeKey);
            if (result !== null) {
              return result;
            }
          }
        }
      }
    }

    return null;
  }
  const dealCheckboxSeleted = ({ node, onItemSelect, onItemSelectAll }) => {
    let {
      checked,
      halfCheckedKeys,
      node: { key, children, title },
    } = node
    // 勾选的是父节点
    if (children?.length > 0) {
      let keys = []
      children?.forEach(child => {
        keys.push(child.key)
      })
      onItemSelectAll([...keys, key], checked)
    } else {
      // 勾选的是子节点
      if (!checked) {
        // 查找该元素的父元素
        let parentKeys = halfCheckedKeys?.[0] && [halfCheckedKeys?.[0]] || findParentNodeByKey(treeData, key) || []
        onItemSelectAll([...parentKeys, key], checked)
      } else {
        let parentKey = ''
        treeData && treeData[0] && treeData.forEach(tree => {
          if (tree?.children) {
            tree.children?.forEach(child => {
              if (child?.key === key) {
                parentKey = tree?.key
              }
            })
          }
        })
        if (!halfCheckedKeys?.includes(parentKey)) {
          onItemSelectAll([key, parentKey], checked)
        } else {
          onItemSelect(key, checked)
        }
      }
    }
  }

  const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
    // const transferDataSource = []
    // function flatten(list = []) {
    //   list.forEach(item => {
    //     transferDataSource.push(item)
    //     flatten(item.children ? item.children : [])
    //   })
    // } 
    // flatten(dataSource)
    const leftData = generateTree(dataSource, targetKeys)
    const leftTreeData = singleLayer ? leftData : leftData?.length ? leftData.filter(item => item.children[0]) : []
    return (
      <Transfer
        {...restProps}
        targetKeys={targetKeys}
        // dataSource={transferDataSource}
        className={styles["tree-transfer"]}
        render={item => item.title}
        titles={titles ? titles : ['待分配点位', '已分配点位']}
      >
        {({ direction, onItemSelect, onItemSelectAll, selectedKeys }) => {
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...targetKeys]
            return (
              leftTreeData?.length ? <Tree
                blockNode
                checkable
                defaultExpandAll
                height={550}
                {...props}
                checkedKeys={checkedKeys}
                treeData={leftTreeData}
                onCheck={(_, node) => {
                  // if(!permission){
                  //   message.warning(permisBtnTip)
                  //   return;
                  // }
                  dealCheckboxSeleted({ node, onItemSelect, onItemSelectAll })
                }}
              // onSelect={(_, node) => {
              //   dealCheckboxSeleted({ node, onItemSelect, onItemSelectAll })
              // }}
              />
                :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
          }
          if (direction === 'right') {
            const checkedKeys = [...selectedKeys]
            return (
              rightTreeData?.length ? <Tree
                blockNode
                checkable
                defaultExpandAll
                height={550}
                {...props}
                checkedKeys={checkedKeys}
                treeData={rightTreeData}
                onCheck={(_, node) => {
                  // if(permission){
                  //   message.warning(permisBtnTip)
                  //   return;
                  // }
                  dealCheckboxSeleted({ node, onItemSelect, onItemSelectAll })
                }}
              // onSelect={(_, node) => {
              //   dealCheckboxSeleted({ node, onItemSelect, onItemSelectAll })
              // }}
              />
                :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
          }
        }}
      </Transfer>
    )
  }


  /**
   * 改变右边tree数据
   * @param {*右边tree需要处理的keys集合} keys
   * @param {*0-删除以上的keys 1-新增以上的keys} type
   */
  const getRightTreeData = (keys, type) => {
    let arr = [...rightTreeData]
    if (keys?.length > 0) {
      keys.forEach(key => {
        // treeData && treeData[0]?.children?.forEach(data => {
        treeData.forEach(data => {
          if (key === data.key) {
            let index = arr.findIndex(i => {
              return i.key === key
            })
            if (type === 1) {
              if (index === -1) {
                arr.push(data)
              } else if (index > -1 && arr?.[index]?.children?.length < data?.children?.length) {
                // 先选择子项再勾选该父级时，传过来的keys是 ['0-1-0','0-1'],此时第一次循环已经将该父级放到arr中，再遍历0-1时，需要先删除再将全部的children复制
                arr.splice(index, 1)
                arr.push(data)
              }
            } else if (type === 0) {
              if (index > -1) {
                arr.splice(index, 1)
              }
            }
          } else {
            let selectedParentKey = ''
            let selectedObj = {}
            if (data?.children?.length > 0) {
              data.children.forEach(child => {
                if (key === child.key) {
                  selectedParentKey = data.key
                  selectedObj = child
                }
              })
            }

            if (Object.keys(selectedObj)?.length > 0) {
              let newData = {}
              let index = arr.findIndex(item => {
                return item.key === selectedParentKey
              })
              if (index > -1) {
                let oldChildArr = [...arr[index].children]
                let selectedIndex = oldChildArr?.findIndex(o => {
                  return o.key === selectedObj.key
                })
                if (selectedIndex === -1 && type === 1) {
                  arr[index].children.push(selectedObj)
                }
                if (selectedIndex > -1 && type === 0) {
                  arr[index].children.splice(selectedIndex, 1)
                  if (arr[index].children?.length === 0) {
                    arr.splice(index, 1)
                  }
                }
              } else {
                newData = { ...data }
                newData.children = []
                newData.children.push(selectedObj)
                arr.push(newData)
              }
            }
          }
        })
      })
      setRightTreeData(arr)
    }
  }
  const [initDataLoading, setInitDataLoading] = useState(false)
  useEffect(() => {
    initData()
  }, [])
  const initData = () => {
    setInitDataLoading(true)
    if (checkedKeys?.length > 0) {
      getRightTreeData(checkedKeys, 1)
    }
    // let keys = [];
    // treeData.forEach(tree => {
    //   if (tree?.children?.length > 0) {
    //     const isIncludes = tree.children.every(item => targetKeys.includes(item.key))
    //     if (isIncludes) {
    //       keys.push(tree.key)
    //     }
    //   }
    // })
    // setTargetKeys([...targetKeys, ...keys])
    // setTargetKeys([...new Set([...targetKeys, ...keys])])
    setTimeout(() => {
      setInitDataLoading(false)
    }, 1000)
  }
  const onChange = (keys, direction, moveKeys) => {
    let changeArrType = direction === 'left'? 0 : 1 // 0-删除  1-新增
    if (singleLayer) {
      keys = keys.filter(item => item)
      moveKeys = moveKeys.filter(item => item)
    } else {
      if (direction === 'left') {
        if (keys?.length > 0) {//去掉父节点的key
          treeData.forEach(tree => {
            let index = keys.indexOf(tree?.key)
            if (index > -1 && tree?.children?.length > 0) {
              tree?.children?.forEach(child => {
                if (keys.includes(child?.key)) {
                  keys?.splice(index, 1)
                }
              })
            }
          })
        }
      }
      treeData.map(item => {
        if (keys.includes(item.key)) {
          keys = keys.filter(filterItem => filterItem !== item.key);
        }
      })

    }
    setTargetKeys(keys)
    let keysList = changeArrType === 1 ? keys : moveKeys
    props.targetKeysChange ? props.targetKeysChange(moveKeys, changeArrType, () => {
      getRightTreeData(keysList, changeArrType)
    }) : getRightTreeData(keysList, changeArrType)
  }

  return <Spin spinning={initDataLoading}><TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={onChange} /> </Spin>
}

export default connect(dvaPropsData, dvaDispatch)(Index);