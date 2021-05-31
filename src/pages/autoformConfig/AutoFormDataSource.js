/**
 * 功  能：AutoForm数据源配置
 * 创建人：张哲
 * 创建时间：2020.11.11
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Row, Card, Button, Tabs } from 'antd';
import DataSourceConfig from './components/dataSourceConfig'  //数据源配置
import moment from 'moment';
import FieldConfig from './components/FieldConfig';
import DbSourceTree from './components/DbSourceTree'
import OtherConfig from './components/otherConfig'  //其他配置
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import Preview from './components/Preview'

const { TabPane } = Tabs;
const pageUrl = {
    // updateState:'historydata/updateState',
    getDBSourceTree: 'dbTree/GetDBSourceTree',
    updateDbTreeState: 'dbTree/updateState',
    GetTables: 'dataSourceConfigModel/GetTables',
    TableConfig: 'dataSourceConfigModel/TableConfig',
    GetCfgFiledsData: 'fieldConfigModel/GetCfgFiledsData',

    GetButtonsByConfigID: 'getButtonData/GetButtonsByConfigID',
    GetTableExtend: 'getButtonData/GetTableExtend',
    GetTableStyle: 'getButtonData/GetTableStyle'
};

@connect(({ loading, dbTree, dataSourceConfigModel, fieldConfigModel, getButtonData }) => ({
    // loading: loading.effects[pageUrl.GetHourDataForOriginal],
    selectedKey: dbTree.selectedKeys,
    PkByTable: dataSourceConfigModel.PkByTable,
    tableList: dataSourceConfigModel.tableList,
    tableConfigList: dataSourceConfigModel.tableConfigList,
    dbKey: dataSourceConfigModel.dbKey,
    GUID: dataSourceConfigModel.GUID,
    dbTreeArray: dbTree.dbTreeArray,
    treeList: dbTree.treeList,
    tableDatas: fieldConfigModel.tableDatas,

    buttonDatas: getButtonData.buttonDatas,
    formDatas: getButtonData.formDatas,
    styleDatas: getButtonData.styleDatas
}))


class AutoFormDataSource extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedKey: '',
            id: '',
            dbKey: '',

            stateKey: '1',
            tableName: '',
            seleKey: [],

            checkedList: [],
        };
    }

    //首次渲染之前调用
    componentWillMount() {
        this.reloadTreeData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dbTreeArray != this.props.dbTreeArray) {
            const { selectedKey } = this.props
            this.props.dispatch({
                type: pageUrl.GetTables,
                payload: {
                    id: selectedKey.join(',').substr(7, selectedKey.join(',').length - 1)
                }
            })
        }
    }

    componentDidMount() {
    }

    callback(key) {

        // console.log(key);
        this.setState({
            stateKey: key
        });

        const { selectedKey } = this.props
        this.TabsChnageHandle(selectedKey, key)
    }
    //加载树
    reloadTreeData = () => {
        //获取树形导航
        this.props.dispatch({
            type: pageUrl.getDBSourceTree,
            payload: {
                callback: () => {
                    // this.getTables();
                }
            }
        }).then(() => {
            const { selectedKey } = this.props
            this.props.dispatch({
                type: pageUrl.GetTables,
                payload: {
                    id: selectedKey.join(',').substr(7, selectedKey.join(',').length - 1)
                }
            })
        }).then(() => {
            let res = this.props.treeList.find(x => x.key == this.props.selectedKey);
            if (res) {
                this.props.dispatch({
                    type: pageUrl.GetCfgFiledsData,
                    payload: {
                        id: res.id,
                        dbKey: res.dbKey
                    }
                })
            }

        });
    }

    onSelect = (selectedKeys) => {
        const { selectedKey } = this.props
        this.updateTreeState({
            selectedKeys,
        });
        this.TabsChnageHandle(selectedKeys, this.state.stateKey)
    }

    // 目录树节点选择
    TabsChnageHandle = (selectedKey, key) => {
        const { seleKey } = this.state

        if (selectedKey.length > 0) {
            this.setState({
                seleKey: selectedKey
            })
            let result = selectedKey.join(',').startsWith('parent_');
            if (result) {
                let id = selectedKey.join(',').substr(7, selectedKey.join(',').length - 1)
                this.props.dispatch({
                    type: pageUrl.GetTables,
                    payload: {
                        id: id
                    }
                }).then(() => {
                    if (this.props.tableList.length > 0) {
                        this.setState({
                            stateKey: '1'
                        })
                    }
                })
            }
            else {
                this.props.dispatch({
                    type: pageUrl.TableConfig,
                    payload: {
                        id: selectedKey.join(',')
                    }
                })
            }

            if (key == "2") {
                let res = this.props.treeList.find(x => x.key == selectedKey);
                if (res) {
                    this.props.dispatch({
                        type: pageUrl.GetCfgFiledsData,
                        payload: {
                            id: res.id,
                            dbKey: res.dbkey
                        }
                    })
                    this.setState({
                        id: res.id,
                        dbKey: res.dbkey,
                        tableName: res.tablename
                    });
                }
            }

            if (key == "3") {
                let newRes = this.props.treeList.find(x => x.key == selectedKey);
                if (newRes && newRes.dbkey) {
                    // 列表按钮设置
                    this.props.dispatch({
                        type: pageUrl.GetButtonsByConfigID,
                        payload: {
                            ConfigID: newRes.id
                        }
                    })
                        .then(() => {
                            let { buttonDatas } = this.props;
                            let isCheckBtn = [];
                            buttonDatas.map(item => {
                                isCheckBtn.push(item.DISPLAYBUTTON)
                            })
                            this.setState({
                                checkedList: isCheckBtn
                            })
                        });

                    // 页面样式和脚本配置
                    this.props.dispatch({
                        type: pageUrl.GetTableExtend,
                        payload: {
                            ConfigID: newRes.id,
                            PageFlag: 'list'
                        }
                    }).then(() => {
                        let { formDatas } = this.props;

                    });

                    // 维护页面宽高
                    this.props.dispatch({
                        type: pageUrl.GetTableStyle,
                        payload: {
                            ConfigID: newRes.id,
                            PageFlag: 'window'
                        }
                    }).then(() => {
                        let { styleDatas } = this.props;

                        // this.props.form.setFieldsValue({
                        //     widthstyle:styleDatas.DT_CUSTOMJS,
                        //     heightstyle:styleDatas.DT_CUSTOMCSS,
                        // })
                    });

                }
            }

        }
        else {
            if (seleKey.length > 0) {
                let result = selectedKey.join(',').startsWith('parent_');
                if (result) {
                    let id = selectedKey.join(',').substr(7, selectedKey.join(',').length - 1)
                    this.props.dispatch({
                        type: pageUrl.GetTables,
                        payload: {
                            id: ''
                        }
                    }).then(() => {
                        this.setState({
                            stateKey: '1'
                        })
                    })
                }
                else {
                    this.props.dispatch({
                        type: pageUrl.TableConfig,
                        payload: {
                            id: ''
                        }
                    })
                }
                if (key == '2') {
                    this.props.dispatch({
                        type: pageUrl.GetCfgFiledsData,
                        payload: {
                            id: '',
                            dbKey: ''
                        }
                    })
                    this.setState({
                        id: '',
                        dbKey: '',
                        tableName: ''
                    });
                }

                if (key == '3') {
                    this.props.dispatch({
                        type: pageUrl.GetButtonsByConfigID,
                        payload: {
                            ConfigID: ''
                        }
                    }).then(() => {
                        let { buttonDatas } = this.props;
                        this.setState({
                            checkedList: []
                        })
                    });

                    // 页面样式和脚本配置
                    this.props.dispatch({
                        type: pageUrl.GetTableExtend,
                        payload: {
                            ConfigID: 'null',
                            // PageFlag:''
                        }
                    }).then(() => {
                        let { formDatas } = this.props;
                    });

                    // 维护页面宽高
                    this.props.dispatch({
                        type: pageUrl.GetTableStyle,
                        payload: {
                            ConfigID: 'null',
                            // PageFlag:'window'
                        }
                    }).then(() => {
                        let { styleDatas } = this.props;
                    });
                }
            }
        }
    }

    //更新查询条件
    updateTreeState = (payload) => {
        this.props.dispatch({
            type: pageUrl.updateDbTreeState,
            payload: payload,
        });
    }


    render() {
        const { PkByTable, tableList, tableConfigList, dbKey, GUID, selectedKeys, tableDatas, formDatas } = this.props
        const { seleKey, stateKey, checkedList } = this.state;

        return (
            <div>
                <DbSourceTree
                    onSelect={this.onSelect}
                />
                <div style={{ flex: 1 }}>
                    <BreadcrumbWrapper>
                        <Card
                            bordered={false}
                        >

                            <Tabs activeKey={stateKey} onChange={this.callback.bind(this)}>
                                <TabPane tab="数据源配置" key="1">
                                    <DataSourceConfig PkByTable={PkByTable} tableList={tableList} tableConfigList={tableConfigList} dbKey={dbKey} GUID={GUID} />
                                </TabPane>
                                <TabPane tab="字段配置" key="2" disabled={tableList.length > 0 ? true : false}>
                                    <FieldConfig onRef={(ref) => { this.$Child = ref }} tableDatas={tableDatas} dbKey={this.state.dbKey} id={this.state.id} tableName={this.state.tableName} />
                                </TabPane>
                                <TabPane tab="其他配置" key="3" disabled={tableList.length > 0 ? true : false}>
                                    <OtherConfig tableConfigList={tableConfigList} changeList={this.state.checkedList} pageConfig={this.props.formDatas} styleConfig={this.props.styleDatas} />
                                </TabPane>
                                <TabPane tab="预览" key="4" disabled={(tableConfigList.length && tableConfigList[0].DT_CONFIG_ID) ? false : true}>
                                    <Preview tableConfigList={tableConfigList} />
                                </TabPane>
                            </Tabs>
                        </Card>
                    </BreadcrumbWrapper>
                </div>
            </div>
        );
    }
}
export default AutoFormDataSource;
