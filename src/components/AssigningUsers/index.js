/*
 * @Author: lzp
 * @Date: 2019-07-16 09:42:48
 * @LastEditors: outman0611
 * @LastEditTime: 2024-10-09 13:39:18
 * @Description: 分配用户
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import difference from 'lodash/difference';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import {
    Input,
    Button,
    Card,
    Spin,
    Row,
    Col,
    Table,
    Modal,
    Checkbox,
    TreeSelect,
    message,
    Divider,
    Popconfirm,
    Empty,
    Transfer,
    Switch,
    Tag,
    Tree,
    Radio,
    Tooltip,
    Popover,
    Select,
} from 'antd';
const { TreeNode } = Tree;
const { SHOW_PARENT } = TreeSelect;
const TableTransfer = ({ leftColumns, rightColumns, pagination, ...restProps }) => (
    <Transfer {...restProps} showSelectAll={false}>
        {({
            direction,
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys,
            disabled: listDisabled,
        }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;

            const rowSelection = {
                getCheckboxProps: item => ({ disabled: restProps.listDisabled || item.disabled }),
                onSelectAll(selected, selectedRows) {
                    const treeSelectedKeys = selectedRows
                        .filter(item => !item.disabled)
                        .map(({ key }) => key);
                    const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect({ key }, selected) {
                    onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys,
            };

            return (
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    style={{ /*pointerEvents: restProps.listDisabled ? 'none' : null,*/ paddingBottom: 10 }}
                    scroll={{ y: 'calc(100vh - 424px)' }}
                    onRow={({ key, disabled: itemDisabled }) => ({
                        onClick: () => {
                            if (itemDisabled || restProps.listDisabled) return;
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        },
                    })}
                    pagination={{ ...pagination }}
                />
            );
        }}
    </Transfer>
);

const columns = [
    {
        dataIndex: 'userAccount',
        title: '账号',
        ellipsis: true,
    },
    {
        dataIndex: 'userName',
        title: '名称',
        ellipsis: true,
    },
    {
        dataIndex: 'userPhone',
        title: '手机',
        ellipsis: true,
    },
];
@connect(({ loading, common, global }) => ({
    userLoading: loading.effects[`common/getUserList`],
    userList: common.userList,
    clientHeight: global.clientHeight,

}))
@Form.create()
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.getUserList();
    }
    //获取角色列表
    getUserList = params => {
        this.props.dispatch({
            type: 'common/getUserList',
            payload: { roleListID: '', groupListID: '', userName: '', userAccount: '' },
        });
    };
    render() {


        return (
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                destroyOnClose={true}
                onCancel={() => { this.props.onCancel() }}
                width={1100}
                footer={null}
                bodyStyle={{
                    overflowY: 'auto',
                    maxHeight: this.props.clientHeight - 200,
                }}
            >
                <Spin spinning={this.props.userLoading || this.props.getSettingUserLoading || this.props.settingUserLoading} >
                    <TableTransfer
                        rowKey={record => record.ID}
                        titles={['待分配用户', '已分配用户']}
                        dataSource={this.props.userList}
                        targetKeys={this.props.targetKeys}
                        onChange={(nextTargetKeys, direction, moveKeys)=>this.props.onChange(nextTargetKeys, direction === 'right' ? 1 : 2, moveKeys)}
                        disabled={this.props.disabled}
                        listDisabled={this.props.listDisabled}
                        leftColumns={columns}
                        rightColumns={columns}
                        pagination={false}
                        showSearch
                        filterOption={(inputValue, item) =>
                            (item.userAccount && item.userAccount.indexOf(inputValue) !== -1) ||
                            (item.userName && item.userName.indexOf(inputValue) !== -1) ||
                            (item.userPhone && item.userPhone.indexOf(inputValue) !== -1)
                        }
                    />
                </Spin>
            </Modal>



        );
    }
}

export default Index;
