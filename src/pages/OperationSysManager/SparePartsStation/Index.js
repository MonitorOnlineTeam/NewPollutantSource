import React, { Component, Fragment } from 'react';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { Card, Spin, Tooltip, Divider, Modal, Transfer, Switch, Table, Tag, message } from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../AutoFormManager/SearchWrapper';
import difference from 'lodash/difference';
import { DelIcon } from '@/utils/icon'
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
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
                getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
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
                    style={{ pointerEvents: listDisabled ? 'none' : null }}
                    onRow={({ key, disabled: itemDisabled }) => ({
                        onClick: () => {
                            if (itemDisabled || listDisabled) return;
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        },
                    })}
                />
            );
        }}
    </Transfer>
);

const tableColumns = [
    {
        dataIndex: 'User_Account',
        title: '账号',
    },
    {
        dataIndex: 'User_Name',
        title: '名称',
    },
    {
        dataIndex: 'Phone',
        title: '手机',
    },
];

const { confirm } = Modal;
const configId = 'SparePartsStation';

@connect(({ loading, autoForm, SparePartsStation }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    SparePartsStationUserLoading: loading.effects['SparePartsStation/getSparePartsStationList'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    AllUser: SparePartsStation.AllUser,
    SparePartsStationUser: SparePartsStation.SparePartsStationUser,
}))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            targetKeys: [],
            SparePartsStationCode: '',
        };
    }

    componentDidMount() {
        const { match, dispatch } = this.props;
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId,
            },
        })
        dispatch({
            type: 'SparePartsStation/GetAllOperationUsers',
            payload: {
                Roles_ID: 'eec719c2-7c94-4132-be32-39fe57e738c9',
            },
        })
    }


    /** 设置关联用户 */
    showModal = SparePartsStationCode => {
        const { dispatch, AllUser, SparePartsStationUser } = this.props;
        this.setState({
            visible: true,
            targetKeys: [],
            SparePartsStationCode
        })
        dispatch({
            type: 'SparePartsStation/getSparePartsStationList',
            payload: {
                SparePartsStationCode,
                callback: (Datas) => {
                    if (Datas.length !== 0) {
                        this.setState({
                            targetKeys: AllUser.filter(item => Datas.indexOf(item.User_ID) !== -1).map(item => item.User_ID)
                        })
                    }

                }
            },
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    onChange = nextTargetKeys => {
        this.setState({ targetKeys: nextTargetKeys });
    };
    //删除自定义
    showDeleteConfirm = (SparePartsStationCode) => {
        const that = this;
        const { dispatch } = this.props;
        confirm({
            title: '确定要删除该条数据吗？',
            content: '删除后不可恢复',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                that.delPoint(SparePartsStationCode);
            },
            onCancel() {
            },
        });
    }
    //删除服务站
    delPoint(SparePartsStationCode) {
        const { dispatch, match } = this.props;
        dispatch({
            type: 'SparePartsStation/delSparePartsStation',
            payload: {
                SparePartsStationCode: SparePartsStationCode,
                callback: result => {
                    if (result.IsSuccess) {
                        message.success(result.Message);
                        dispatch({
                            type: 'autoForm/getPageConfig',
                            payload: {
                                configId,
                            },
                        })
                    }
                    else {
                        message.error(result.Message)
                    }
                },
            },
        });
    }

    //保存用户关联信息
    saveUser = () => {
        const { dispatch } = this.props;
        const { SparePartsStationCode, targetKeys } = this.state;
        dispatch({
            type: 'SparePartsStation/saveSparePartsStationUser',
            payload: {
                SparePartsStationCode,
                UserIds: targetKeys,
                callback: () => {
                    this.setState({
                        visible: false,
                    })
                }
            },
        })
    }

    render() {
        const { AllUser, SparePartsStationUserLoading } = this.props;
        const { targetKeys, disabled, showSearch } = this.state;
        if (this.props.loading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                size="large"
            />);
        }
        return (
            <BreadcrumbWrapper>
                <div>
                    <Card>
                        <SearchWrapper
                            onSubmitForm={form => this.loadReportList(form)}
                            configId={configId}
                        ></SearchWrapper>
                        <SdlTable
                            style={{ marginTop: 10 }}
                            configId={configId}
                            parentcode={'operations/serviceSite'}
                            {...this.props}
                            appendHandleRows={row => (
                                <span>
                                    <Divider type="vertical" />
                                    <Tooltip title="删除">
                                        <a onClick={() => {
                                            this.showDeleteConfirm(row['dbo.T_Bas_SparePartsStation.SparePartsStationCode']);
                                        }}><DelIcon />    </a>
                                    </Tooltip>


                                    <Divider type="vertical" />
                                    <Tooltip title="关联用户">
                                        <a onClick={() => {
                                            this.showModal(row['dbo.T_Bas_SparePartsStation.SparePartsStationCode']);
                                        }}><UsergroupAddOutlined style={{ fontSize: 16 }} /></a>
                                    </Tooltip>
                                </span>
                            )}
                        >
                        </SdlTable>
                    </Card>
                </div>
                <Modal
                    title="关联用户"
                    visible={this.state.visible}
                    onOk={this.saveUser}
                    onCancel={this.handleCancel}
                    width="90%"
                    destroyOnClose
                >
                    {SparePartsStationUserLoading ? <Spin
                        style={{
                            width: '100%',
                            height: 'calc(100vh/2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        size="large"
                    /> :
                        <TableTransfer
                            dataSource={AllUser}
                            targetKeys={targetKeys}
                            showSearch={true}
                            onChange={this.onChange}
                            filterOption={(inputValue, item) => {
                                let User_Accountflag = false;
                                let User_Nameflag = false;
                                let Phoneflag = false;
                                if (item.User_Account) {
                                    User_Accountflag = item.User_Account.indexOf(inputValue) !== -1
                                }
                                if (item.User_Name) {
                                    User_Nameflag = item.User_Name.indexOf(inputValue) !== -1
                                }
                                if (item.Phone) {
                                    Phoneflag = item.Phone.indexOf(inputValue) !== -1
                                }
                                return User_Accountflag || User_Nameflag || Phoneflag
                            }
                            }
                            leftColumns={tableColumns}
                            rightColumns={tableColumns}
                        />
                    }
                </Modal>
            </BreadcrumbWrapper>
        );
    }
}
export default Index;
