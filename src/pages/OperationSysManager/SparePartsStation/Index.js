import React, { Component, Fragment } from 'react';
import {
    Card, Spin, Tooltip, Icon, Divider, Modal, Transfer, Switch, Table, Tag
} from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../AutoFormManager/SearchWrapper';
import difference from 'lodash/difference';

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

// const mockTags = ['cat', 'dog', 'bird'];

// const mockData = [];
// for (let i = 0; i < 20; i++) {
//     mockData.push({
//         key: i.toString(),
//         title: `content${i + 1}`,
//         description: `description of content${i + 1}`,
//         disabled: i % 4 === 0,
//         tag: mockTags[i % 3],
//     });
// }
// const originTargetKeys = mockData.filter(item => item.key % 3 > 1).map(item => item.key);

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
        this.reloadPage(match.params.configId);
        dispatch({
            type: 'SparePartsStation/GetAllOperationUsers',
            payload: {
                Roles_ID:'eec719c2-7c94-4132-be32-39fe57e738c9',
            },
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            if (nextProps.match.params.configId !== this.props.routerConfig) { this.reloadPage(nextProps.match.params.configId); }
        }
    }

    reloadPage = configId => {
        const { dispatch } = this.props;
        dispatch({
            type: 'autoForm/updateState',
            payload: {
                routerConfig: configId,
            },
        });
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId,
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
        debugger
        dispatch({
            type: 'SparePartsStation/getSparePartsStationList',
            payload: {
                SparePartsStationCode,
                callback: (Datas) => {
                    debugger
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
        const { match: { params: { configId } }, AllUser, SparePartsStationUserLoading } = this.props;
        debugger
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
                            {...this.props}
                            appendHandleRows={row => (
                                <span>
                                    <Divider type="vertical" />
                                    <Tooltip title="关联用户">
                                        <a onClick={() => {
                                            this.showModal(row['dbo.T_Bas_SparePartsStation.SparePartsStationCode']);
                                        }}><Icon type="usergroup-add" style={{ fontSize: 16 }} /></a>
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
