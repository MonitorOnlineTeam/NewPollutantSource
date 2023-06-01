import React, { useState, useEffect } from 'react'
import { Transfer, Tree } from 'antd'
 
const Index = (props) => {

  const { treeData,checkedKeys,height, } = props;
  const [targetKeys, setTargetKeys] = useState(checkedKeys)
  const [rightTreeData, setRightTreeData] = useState([])
  const generateTree = (treeNodes = [], checkedKeys = []) =>
    treeNodes.map(({ children, ...props }) => ({
      ...props,
      disabled: checkedKeys.includes(props.key),
      children: generateTree(children?children : [], checkedKeys),
    }))
  const dealCheckboxSeleted = ({ node, onItemSelect, onItemSelectAll }) => {
    let {
      checked,
      halfCheckedKeys,
      node: { key, children },
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
        let parentKeys = [halfCheckedKeys?.[0]] || []
        onItemSelectAll([...parentKeys, key], checked)
      } else {
        let parentKey = ''
        treeData.forEach(tree => {
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
    const transferDataSource = []
    function flatten(list = []) {
      list.forEach(item => {
        transferDataSource.push(item)
        flatten(item.children ? item.children : [])
      })
    }
    flatten(dataSource)
    return (
      <Transfer
        {...restProps}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        className="tree-transfer"
        render={item => item.title}
        showSelectAll={false}
      >
        {({ direction, onItemSelect, onItemSelectAll, selectedKeys }) => {
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...targetKeys]
            return (
              <Tree
                blockNode
                checkable
                defaultExpandAll
                {...props}
                checkedKeys={checkedKeys}
                treeData={generateTree(dataSource, targetKeys)}
                onCheck={(_, node) => {
                  dealCheckboxSeleted({ node, onItemSelect, onItemSelectAll })
                }}
                onSelect={(_, node) => {
                  dealCheckboxSeleted({ node, onItemSelect, onItemSelectAll })
                }}
              />
            )
          }
          if (direction === 'right') {
            const checkedKeys = [...selectedKeys]
            return (
              <Tree
                blockNode
                checkable
                defaultExpandAll
                {...props}
                checkedKeys={checkedKeys}  
                treeData={rightTreeData}
                onCheck={(_, node) => {
                  dealCheckboxSeleted({ node, onItemSelect, onItemSelectAll })
                }}
                onSelect={(_, node) => {
                  dealCheckboxSeleted({ node, onItemSelect, onItemSelectAll })
                }}
              />
            )
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
      // console.log('keys:==', keys)
      keys.forEach(key => {
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
  useEffect(()=>{
    getRightTreeData(checkedKeys, 1)
  },[checkedKeys])
 
  const onChange = (keys, direction, moveKeys) => {
    let changeArrType = 1 // 0-删除  1-新增
    if (direction === 'left') {
      changeArrType = 0
      if (keys?.length > 0) {
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
    setTargetKeys(keys)
    let keysList = changeArrType === 1 ? keys : moveKeys
    getRightTreeData(keysList, changeArrType)
  }
  return <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={onChange} />
}
 
export default Index