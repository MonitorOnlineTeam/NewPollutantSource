/**
 * 功  能：表格穿梭框 人员
 * 创建人：jab
 * 创建时间：2024.1.10
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Switch, Table, Tag, Transfer } from 'antd';
import { connect } from "dva";
import difference from 'lodash/difference';
import SdlTable from '@/components/SdlTable';

const dvaPropsData = ({ loading, global, common }) => ({
    clientHeight: global.clientHeight,
    inspectorUserList: common.inspectorUserList,
})
const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getInspectorUserList: (payload) => { //获取督查人员
            dispatch({
                type: `common/getInspectorUserList`,
                payload: payload,
            })
        },
    }
}
const Index = (props) => {
    useEffect(() => {
        props.getInspectorUserList()
    }, []);
    const leftTableColumns = [
        {
            dataIndex: 'UserAccount',
            title: '账号',
            ellipsis: true,
        },
        {
            dataIndex: 'UserName',
            title: '名称',
            ellipsis: true,
        },
    ];

    const rightTableColumns = [

        ...leftTableColumns
    ];
    const TableTransfer = ({ leftColumns, rightColumns, loading, scroll, bordered, pagination, ...restProps }) => (
        <Transfer {...restProps}>
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
                    getCheckboxProps: (item) => ({
                        disabled: listDisabled || item.disabled,
                    }),
                    onSelectAll(selected, selectedRows) {
                        const treeSelectedKeys = selectedRows
                            .filter((item) => !item.disabled)
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
                        scroll={{ y: 'calc(100vh - 380px)' }}
                        style={{ pointerEvents: listDisabled ? 'none' : null, paddingBottom: 10 }}
                        onRow={({ key, disabled: itemDisabled }) => ({
                            onClick: () => {
                                if (itemDisabled || listDisabled) return;
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            },
                        })}
                        pagination={{
                            defaultPageSize:20,
                          }}
                    />
                );
            }}
        </Transfer>
    );


    return <TableTransfer
        titles={['待分配用户', '已分配用户']}
        dataSource={props.inspectorUserList}
        filterOption={(inputValue, item) =>
            (item.UserAccount && item.User_Name.indexOf(inputValue) !== -1) ||
            (item.UserName && item.User_Account.indexOf(inputValue) !== -1) ||
            (item.Phone && item.Phone.indexOf(inputValue) !== -1)
        }
        leftColumns={leftTableColumns}
        rightColumns={rightTableColumns}
        {...props}
    />
};

export default connect(dvaPropsData, dvaDispatch)(Index);



