/**
 * 功  能：菜单管理
 * 创建人：张哲
 * 创建时间：2019.9.17
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Card, Input, Button, Popconfirm, Modal, AutoComplete } from 'antd';
import styles from './MenuManagement.less';
import { getParentKeys } from '@/utils/getTreeKeys';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import MenuManagementModal from './components/MenuManagementModal' //菜单管理弹框
import { Form } from '@ant-design/compatible';

const { confirm } = Modal;
const pageUrl = {
    GetMenuInfos: 'menumanagementpage/GetMenuInfos',//获取
    DelectMenuManagement: 'menumanagementpage/DelectMenuManagement'//删除
};

let MenuName = [];
let res = '';

@connect(({ loading, menumanagementpage }) => ({
    loading: loading.effects[pageUrl.GetMenuInfos],
    TableData: menumanagementpage.TableData,
    treeList: menumanagementpage.treeList
}))
class MenuManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            records: [],
            value: '',
            dataSource: [],
            TableDatas: [],
            expandedKeys: ["99dbc722-033f-481a-932a-3c6436e17245"]
        };
        this.columns = [
            {
                title: '菜单名称',
                dataIndex: 'Menu_Name',
                width: '20%',
            },
            {
                title: '菜单提示',
                dataIndex: 'Menu_Title',
                width: '20%',
                align: 'center'

            },
            // {
            //     title: '上级菜单',
            //     dataIndex: 'wu',
            //     width: '15%',
            //     align:'center'
            // },
            {
                title: '类型',
                dataIndex: 'Target',
                width: 120,
                key: 'type',
                align: 'center'
            },
            {
                title: '图标',
                dataIndex: 'Menu_Img',
                width: 120,
                align: 'center'
            },
            {
                title: '链接地址',
                dataIndex: 'NavigateUrl',
                width: '20%',
                align: 'center',
                render: (text) => <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                    {text}
                </span>
            },
            {
                title: '启用',
                dataIndex: 'DeleteMark',
                width: '5%',
                key: 'add',
                align: 'center',
                render: (text) => text === 1 ? '启用' : <span style={{ color: '#ccc' }}>禁用</span>
            },
            {
                title: '排序',
                dataIndex: 'SortCode',
                width: '5%',
                align: 'center'
            },
            {
                title: '编辑',
                dataIndex: 'Set',
                align: 'center',
                render: (text, record) => <MenuManagementModal
                    type={1}
                    selectedRowKeys={this.state.selectedRowKeys}
                    reloadData={this.reloadData}
                    TableData={this.props.TableData}
                    record={record}
                    title="编辑菜单"
                />
            }
        ];
    }

    //首次渲染之前调用
    componentWillMount() {
        this.reloadData();
    }
    //获取数据
    reloadData = () => {
        this.props.dispatch({
            type: pageUrl.GetMenuInfos,
            payload: {}
        }).then(() => {
            this.handleSort(this.props.TableData);
            const { searchText } = this.state;
            if (searchText) {
                this.handleSearch(searchText)
            } else {
                this.setState({
                    TableDatas: this.props.TableData
                })
            }
        });
    }
    //删除确认
    handledeleteConfirm = () => {
        let _this = this;
        confirm({
            content: '确认删除吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {//确认
                _this.handledelete();
            },
            onCancel() {//取消
                _this.setState({
                    selectedRowKeys: []
                });
            }
        });
    }
    //删除
    handledelete = () => {
        this.props.dispatch({
            type: pageUrl.DelectMenuManagement,
            payload: {
                Menu_Id: this.state.selectedRowKeys[0]
            }
        }).then(() => {
            this.setState({
                selectedRowKeys: []
            })
            this.reloadData();
        }).catch(() => {
            this.reloadData();
        });
    }
    // //排序
    handleSort = (data) => {
        // debugger
        if (data.length > 0) {
            data.forEach(item => {
                data.sort((a, b) => a.SortCode - b.SortCode);
                if (item.children) {
                    this.handleSort(item.children);
                }
            });
        }
    }

    handleSearch = searchText => {
        console.log('searchText', searchText)
        const { TableData } = this.props;
        if (searchText.trim() == '') {
            this.setState({
                TableDatas: TableData,
                searchText: searchText.trim()
            });
        } else {
            let val = [];
            val = this.SearchRecursion(TableData, searchText);
            this.setState({
                TableDatas: val,
                searchText: searchText.trim()
            });
        }
    };
    //搜索框递归
    SearchRecursion = (data, value) => {
        data.find(item => {
            if (item.Menu_Name == value) {
                res = item;
            } else {
                if (item.children) {
                    this.SearchRecursion(item.children, value);
                }
            }
        })
        return [res];
    }
    render() {
        let { TableData } = this.state;
        const { TableDatas } = this.state;
        const { loading } = this.props;

        const { selectedRowKeys, dataSource, value } = this.state;
        const hasSelected = selectedRowKeys.length > 0;
        const rowSelection = {
            selectedRowKeys,
            onSelect: (record, selected, selectedRows) => {
                let { selectedRowKeys } = this.state;
                if (record.Menu_Id === selectedRowKeys[0]) {
                    this.setState({
                        selectedRowKeys: [],
                        records: []
                    })
                } else {
                    this.setState({
                        selectedRowKeys: [record.Menu_Id],
                        records: record
                    })
                }
            }
        };
        return (
            <Card>
                <Row style={{ marginBottom: 10 }}>
                    <AutoComplete
                        dataSource={dataSource}
                        // onSelect={this.onSelect}
                        onSearch={this.handleSearch}
                        placeholder="请输入菜单名称"
                        className={styles.autoCompleteTop}
                    />
                    <MenuManagementModal
                        hasSelected={hasSelected}
                        type={0}
                        reloadData={this.reloadData}
                        records={{ Menu_Id: 0 }}
                        title="添加根菜单"
                    />
                    <span style={{ margin: "0 5px" }}></span>
                    <MenuManagementModal
                        hasSelected={!hasSelected}
                        type={0}
                        reloadData={this.reloadData}
                        records={this.state.records}
                        title="添加子菜单"
                    />
                    <Button
                        type="danger"
                        disabled={!hasSelected}
                        onClick={this.handledeleteConfirm}
                        className={styles.buttonTop}
                    >
                        删除
                    </Button>
                </Row>
                <Table
                    size="small"
                    loading={loading}
                    columns={this.columns}
                    rowSelection={rowSelection}
                    dataSource={this.state.TableDatas}
                    rowClassName={(record, index) => record.DeleteMark == 2 ? styles.MenuTableColor : ''}
                    defaultExpandedRowKeys={this.state.expandedKeys}
                    // expandedRowRender={(render)=>{console.log(render)}}
                    // expandedRowKeys={this.state.expandedKeys}
                    bordered
                    // scroll={{ y: layoutStyle.tableYstyle }}
                    pagination={false}
                    rowKey={(record) => record.Menu_Id}
                />
            </Card>
        );
    }
}
export default MenuManagement;


