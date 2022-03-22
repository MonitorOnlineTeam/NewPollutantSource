/**
 * 功  能：autoFrom - 数据源树形导航
 * 创建人：白金索
 * 创建时间：2020.11.11
 */

import React, { Component } from 'react'
import { Tree, Card, Input, Button, message, Icon } from 'antd'
import { connect } from 'dva';
import { FolderOpenOutlined, FileOutlined } from '@ant-design/icons'

const { TreeNode, DirectoryTree } = Tree;
const { Search } = Input;

//获取父节点ID
const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children && node.children.length > 0) {
            if (node.children.some(item => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};

const pageUrl = {
    getDBSourceTree: 'dbTree/GetDBSourceTree',
    updateState: 'dbTree/updateState',
    deleteTreeConfig: 'dbTree/DeleteTreeConfig',
}

@connect(({ loading, dbTree }) => ({
    dbTreeArray: dbTree.dbTreeArray,
    selectedKeys: dbTree.selectedKeys,
    expandedKeys: dbTree.expandedKeys,
    searchValue: dbTree.searchValue,
    autoExpandParent: dbTree.autoExpandParent,
    treeList: dbTree.treeList,
}))

class DbSourceTree extends Component {
    constructor() {
        super();
        this.state = {
        };
    };

    //首次渲染之前调用
    componentWillMount() {
        // this.getTreeData();
    }

    componentWillUnmount() {
        this.updateState({
            dbTreeArray: [],
            selectedKeys: [],
            expandedKeys: [],
            treeList: []
        })
    }

    //加载树
    reloadTreeData = () => {
        this.props.dispatch({
            type: pageUrl.getDBSourceTree,
            payload: {
                callback: () => {
                }
            }
        });
    }

    //树搜索
    onChange = (e) => {
        const { dbTreeArray, treeList } = this.props;
        if (dbTreeArray && dbTreeArray.length > 0) {
            const { value } = e.target;
            const expandedKeys = treeList.map((item) => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, dbTreeArray);
                }
                return null;
            }).filter((item, i, self) => item && self.indexOf(item) === i);
            this.updateState({
                expandedKeys,
                searchValue: value,
                autoExpandParent: true
            });
        }
    }

    //删除树
    delete = () => {
        this.props.dispatch({
            type: pageUrl.deleteTreeConfig,
            payload: {
                callback: (result) => {
                    if (result === "1") {
                        message.success("删除成功");
                        this.reloadTreeData();
                    } else {
                        message.warn("删除失败");
                    }
                }
            }
        });
    }

    //展开树
    onExpand = (expandedKeys) => {
        this.updateState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    //更新查询条件
    updateState = (payload) => {
        this.props.dispatch({
            type: pageUrl.updateState,
            payload: payload
        });
    };

    //获取搜索和删除
    getSearchAndDel = () => {
        return (
            <div >
                <Search style={{ margin: '5px 0px 5px 0px', width: '70%' }} placeholder="关键词" onChange={this.onChange} />
                <Button type="primary" onClick={this.delete} style={{ marginLeft: '10px' }}>删除</Button>
            </div>
        )
    }

    getTree = () => {
        const { dbTreeArray, selectedKeys, expandedKeys, searchValue, autoExpandParent } = this.props;
        if (dbTreeArray && dbTreeArray.length > 0) {
            const loop = data =>
                data.map(item => {
                    const index = item.title.indexOf(searchValue);
                    const beforeStr = item.title.substr(0, index);
                    const afterStr = item.title.substr(index + searchValue.length);
                    const title =
                        index > -1 ? (
                            <span>
                                {beforeStr}
                                <span style={{ color: '#f50' }}>{searchValue}</span>
                                {afterStr}
                            </span>
                        ) : (
                            <span>{item.title}</span>
                        );
                    if (item.children) {
                        return (
                            <TreeNode icon={<FolderOpenOutlined />} key={item.key} title={title}>
                                {loop(item.children)}
                            </TreeNode>
                        );
                    }
                    return <TreeNode key={item.key} title={title} icon={<FileOutlined />} />;
                });

            return (
                <div>
                    {
                        this.getSearchAndDel()
                    }
                    <div>
                        <Tree
                            showIcon={true}
                            onExpand={this.onExpand}
                            onSelect={this.props.onSelect}
                            selectedKeys={selectedKeys}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                        >
                            {loop(dbTreeArray)}
                        </Tree>
                    </div>
                </div>
            )
        } else {
            return <img style={{ display: 'block', textAlign: 'center', margin: '5vh auto', width: 150 }} src="/nodata.png" />
        }
    };

    render() {
        return (
            // <Card
            //     style={{ width: '380px', height: 'calc(106vh - 140px)', overflow: 'auto', zIndex: 10, marginLeft: 10 }}
            //     bordered={false}
            //     bodyStyle={
            //         {
            //             padding: '0'
            //         }
            //     }
            // >
            <div style={{ width: '380px', float: 'left', height: 'calc(100vh - 64px)', overflow: 'auto', margin: '0 10px 0 -20px', backgroundColor: "#fff", padding: '10px', boxSizing: 'border-box' }}>
                { this.getTree()}
            </div>
            // </Card>
        )
    }
}

export default DbSourceTree;