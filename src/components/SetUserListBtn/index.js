/**
 * 功  能：表格穿梭框 设置人员清单
 * 创建人：jab
 * 创建时间：2024.1.10
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Button, Table, Transfer, Spin, Modal } from 'antd';
import { connect } from "dva";
import difference from 'lodash/difference';
import SdlTable from '@/components/SdlTable';

const dvaPropsData = ({ loading, global, common }) => ({
    clientHeight: global.clientHeight,
    inspectorUserList: common.inspectorUserList,
    inspectorUserLoading: loading.effects['common/getInspectorUserList'],
    addSetUserLoading: loading.effects[`common/addSetUser`],
    setUserLoading: loading.effects[`common/getSetUser`],
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
        addSetUser: (payload, callback) => { //设置人员
            dispatch({
                type: `common/addSetUser`,
                payload: payload,
                callback: callback
            })
        },
        getSetUser: (payload, callback) => { //获取设置人员
            dispatch({
                type: `common/getSetUser`,
                payload: payload,
                callback: callback
            })
        },
    }
}


const Index = (props) => {

    const { type, text,onClick } = props;

    const [listVisble, setListVisble] = useState(false)


    useEffect(() => {
        if (listVisble) {
            if (props.inspectorUserList?.length <= 0) {
                props.getInspectorUserList()
            }
            props.getSetUser({ type: type }, (data) => {
                setTargetUserKeys(data)
            })
        }
    }, [listVisble]);

    const [targetUserKeys, setTargetUserKeys] = useState()
    const userChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetUserKeys(nextTargetKeys)
        props.addSetUser({
            userIdList: direction === 'right' ? nextTargetKeys : moveKeys,
            state: direction === 'right' ? 1 : 2,
            type: type,
        })
    }
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
                        scroll={{ y: 'calc(100vh - 420px)' }}
                        style={{ pointerEvents: listDisabled ? 'none' : null, paddingBottom: 10 }}
                        onRow={({ key, disabled: itemDisabled }) => ({
                            onClick: () => {
                                if (itemDisabled || listDisabled) return;
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            },
                        })}
                        pagination={{
                            defaultPageSize: 20,
                        }}
                    />
                );
            }}
        </Transfer>
    );


    return <>
        <Button type="primary" style={{ marginRight: 4, ...props.btnSty }}
            onClick={() => {
                setListVisble(true);
                onClick&&onClick();
            }}
        >
            {text}
        </Button>
        <Modal
            visible={listVisble}
            title={text}
            footer={null}
            onCancel={() => { setListVisble(false) }}
            destroyOnClose
            width={1100}
        >
            <Spin spinning={props.inspectorUserLoading || props.setUserLoading || props.addSetUserLoading || false}>

                <TableTransfer
                    titles={['待分配用户', '已分配用户']}
                    dataSource={props.inspectorUserList}
                    filterOption={(inputValue, item) =>
                        (item.UserAccount && item.UserAccount.indexOf(inputValue) !== -1) ||
                        (item.UserName && item.UserName.indexOf(inputValue) !== -1)
                    }
                    leftColumns={leftTableColumns}
                    rightColumns={rightTableColumns}
                    showSearch
                    targetKeys={targetUserKeys}
                    onChange={userChange}
                    {...props}

                />
            </Spin>
        </Modal>
    </>
};

export default connect(dvaPropsData, dvaDispatch)(Index);



