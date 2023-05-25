import { Transfer, Tree } from 'antd';
import React, { useState } from 'react';
// Customize Table Transfer

const Index = (props) => {
    const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey);
    const generateTree = (treeNodes = [], checkedKeys = []) =>
        treeNodes.map(({ children, ...props }) => ({
            ...props,
            disabled: checkedKeys.includes(props.key),
            children: generateTree(children ? children : [], checkedKeys),
        }));
    const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
        const transferDataSource = [];
        function flatten(list = []) {
            list.forEach((item) => {
                transferDataSource.push(item);
                flatten(item.children?item.children :[] );
            });
        }
        flatten(dataSource);
        return (
            <Transfer
                {...restProps}
                targetKeys={targetKeys}
                dataSource={transferDataSource}
                className="tree-transfer"
                render={(item) => item.title}
                showSelectAll={false}
            >
                {({ direction, onItemSelect, selectedKeys }) => {
                    if (direction === 'left') {
                        const checkedKeys = [...selectedKeys, ...targetKeys];
                        return (
                            <Tree
                                blockNode
                                checkable
                                // checkStrictly
                                defaultExpandAll
                                checkedKeys={checkedKeys}
                                {...props}
                                treeData={generateTree(dataSource, targetKeys)}
                                onCheck={(_, { node: { key } }) => {
                                    onItemSelect(key, !isChecked(checkedKeys, key));
                                }}
                                onSelect={(_, { node: { key } }) => {
                                    onItemSelect(key, !isChecked(checkedKeys, key));
                                }}
                            />
                        );
                    }
                }}
            </Transfer>
        );
    };
    const { treeData } = props;
    const [targetKeys, setTargetKeys] = useState([]);
    const onChange = (keys) => {
        console.log(keys)
        setTargetKeys(keys);
    };
    console.log(treeData,1111111);
    return <TreeTransfer {...props} dataSource={treeData} targetKeys={targetKeys} onChange={onChange} />;
};
export default Index;