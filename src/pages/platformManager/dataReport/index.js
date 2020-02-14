
/*
 * @desc: 数据上报
 * @Author: zhb
 * @Date: 2020年1月22日9：30
 */
import React, { Component, Fragment } from 'react';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Table,
    Form,
    Spin,
    Tooltip,
    Select, Modal, Tag, Divider, Dropdown, Icon, Menu, Popconfirm, message, DatePicker, InputNumber,
} from 'antd';
import styles from './style.less';

import { PointIcon, DelIcon,EditIcon } from '@/utils/icon'
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { sdlMessage } from '@/utils/utils';
import moment from 'moment';
const { confirm } = Modal;

@connect(({ loading, autoForm, datareport }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    userandentInfo: datareport.userandentInfo
}))

export default class MonitorTarget extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
  

    componentDidMount() {
        const { match, dispatch } = this.props;
        
        this.reloadPage(match.params.configId);
      
    }

    componentWillReceiveProps(nextProps) {
       
        if (nextProps.location.pathname != this.props.location.pathname) {
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

    
 

 

    showDeleteConfirm = (id) => {
        const that = this;
        const { dispatch,match } = this.props;
        
        confirm({
            title: '确定要删除该条数据吗？',
            content: '删除后不可恢复',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
              
                
               // alert();
                dispatch({
                    type: 'datareport/deleteDataReport',
                    payload: {
                        ID:id,
                        callback: res => {
                            that.reloadPage(match.params.configId)
                        },
                    },
                })
            },
            onCancel() {

            },
        });
    }

    onRef1 = ref => {
        this.child = ref;
    };

    render() {
        const { searchConfigItems, searchForm, tableInfo, match: { params: { configId } }, dispatch } = this.props;
        // console.log("this.props=", this.props);
        const searchConditions = searchConfigItems[configId] || []
        const columns = tableInfo[configId] ? tableInfo[configId].columns : [];
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
            <PageHeaderWrapper>
                <div className="contentContainer">
                    <Card className={styles.contentContainer}>

                        <SearchWrapper
                            onSubmitForm={form => this.loadReportList(form)}
                            configId={configId}
                        ></SearchWrapper>
                        {/* <Button icon="plus" type="primary" >添加</Button> */}
                        <AutoFormTable
                            onRef={this.onRef1}
                            style={{ marginTop: 10 }}
                            // columns={columns}
                            scroll={{ y: 600 }}
                            configId={configId}
                            rowChange={(key, row) => {
                                console.log('key=', key);
                                this.setState({
                                    key, row,
                                })
                            }}
                            onAdd={()=>{
                                dispatch(routerRedux.push(`/SewagePlant/DataReportingAdd/${configId}/${null}`));
                            }}
                            // onEdit={()=>{
                            //     dispatch(routerRedux.push(`/platformconfig/monitortarget/${configId}/edit`));
                            // }}
                            // appendHandleButtons={(selectedRowKeys, selectedRows) => (
                            //     <Fragment>
                            //         <Button
                            //             type="danger"
                            //             onClick={() => {
                            //                 this.showConfirm(selectedRowKeys, selectedRows);
                            //             }}
                            //             style={{ marginRight: 8 }}
                            //         >
                            //             重置密码
                            //       </Button>
                            //     </Fragment>
                            // )}
                            appendHandleRows={row => <Fragment>
                                <Tooltip title="编辑">
                                    <a onClick={() => {
                                      
                                        if(moment(row['dbo.T_Bas_DataReporting.MonitorTime']).format('YYYY-MM')==moment().add(-1,'month').format('YYYY-MM') ){
                                            dispatch(routerRedux.push(`/SewagePlant/DataReportingAdd/${configId}/${row['dbo.T_Bas_DataReporting.ID']}`));
                                        }
                                        else{
                                            sdlMessage('只能修改上个月的数据', "error")
                                        }
                                    }}>   <EditIcon /> </a>
                                </Tooltip>
                                <Divider type="vertical" />
                                <Tooltip title="删除">
                                    <a onClick={() => {
                                        this.showDeleteConfirm(row['dbo.T_Bas_DataReporting.ID']);
                                    }}><DelIcon />    </a>
                                </Tooltip>
                            </Fragment>}
                            parentcode="platformconfig"
                            {...this.props}
                        >
                        </AutoFormTable>
                    </Card>
                </div>
            </PageHeaderWrapper>
        );
    }
}
