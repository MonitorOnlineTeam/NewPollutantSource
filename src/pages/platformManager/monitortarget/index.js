
/*
 * @desc: 监控目标公共页面【企业、监测站、河段、工地】
 * @Author: JianWei
 * @Date: 2019年7月29日15:11:59
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
    Select, Modal, Tag, Divider, Dropdown, Icon, Menu, Popconfirm, message, DatePicker, InputNumber
} from 'antd';
import styles from './style.less';
import { PointIcon, DelIcon } from '@/utils/icon'
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { sdlMessage } from '@/utils/utils';
const { confirm } = Modal;

@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm: autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig
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
            if (nextProps.match.params.configId !== this.props.routerConfig)
                this.reloadPage(nextProps.match.params.configId);
        }
    }

    reloadPage = (configId) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'autoForm/updateState',
            payload: {
                routerConfig: configId
            }
        });
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId: configId
            }
        })
    }

    editMonitorInfo = (key, row) => {
        const { match: { params: { targetType, configId, pollutantTypes } } } = this.props;
        //const configId = match.params.configId;

        var target = this.getTargetIds(row);
        let targetId = target.targetId;
        let targetName = target.targetName;

        this.props.dispatch(routerRedux.push(`/platformconfig/monitortarget/${configId}/${targetType}/${pollutantTypes}/monitorpoint/${targetId}/${targetName}`))
    }

    getTargetIds = (row) => {
        const { match: { params: { targetType } } } = this.props;
        let targetId = '';
        let targetName = '';

        switch ((+targetType)) {
            case 1://企业
                targetId = row['dbo.T_Bas_Enterprise.EntCode'];
                targetName = row['dbo.T_Bas_Enterprise.EntName'];
                //targetType = 1;
                break;
            case 2://监测站
                targetId = row['dbo.T_Bas_Station.StationCode'];
                targetName = row['dbo.T_Bas_Station.StationName'];
                //targetType = 2;
                break;
            case 3://河段
                targetId = row['dbo.T_Bas_Reach.ReachCode'];
                targetName = row['dbo.T_Bas_Reach.ReachName'];
                //targetType = 3;
                break;
            case 4://工地
                targetId = row['dbo.T_Bas_BuildingSite.BuildingSiteCode'];
                targetName = row['dbo.T_Bas_BuildingSite.BuildingSiteName'];
                //targetType = 4;
                break;
            default: break;
        }

        return { targetId: targetId, targetName: targetName };
    }

    showDeleteConfirm = (row) => {
        let that = this;
        const { dispatch } = this.props;
        //console.log("row=", row);
        confirm({
            title: '确定要删除该条数据吗？',
            content: '删除后不可恢复',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {

                let target = that.getTargetIds(row);
                let where = [];
                where.push(target.targetId);

                dispatch({
                    type: 'monitorTarget/queryPointForTarget',
                    payload: {
                        where,
                        callback: (res) => {
                            if (res.IsSuccess) {
                                that.child.delRowData(row);
                            }
                        }
                    }
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
        //console.log("this.props=", this.props);
        const searchConditions = searchConfigItems[configId] || []
        const columns = tableInfo[configId] ? tableInfo[configId]["columns"] : [];
        if (this.props.loading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                size="large"
            />);
        }
        return (
            <PageHeaderWrapper>
                <div className="contentContainer">
                    <Card>

                        <SearchWrapper
                            onSubmitForm={(form) => this.loadReportList(form)}
                            configId={configId}
                        ></SearchWrapper>
                        <AutoFormTable
                            onRef={this.onRef1}
                            style={{ marginTop: 10 }}
                            // columns={columns}
                            scroll={{y: 600}}
                            configId={configId}
                            rowChange={(key, row) => {
                                console.log("key=", key);
                                this.setState({
                                    key, row
                                })
                            }}
                            // onAdd={()=>{
                            //     dispatch(routerRedux.push(`/platformconfig/monitortarget/${configId}/add`));
                            // }}
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
                            appendHandleRows={row => {
                                return <Fragment>
                                    <Divider type="vertical" />
                                    <Tooltip title="删除">
                                        <a onClick={() => {
                                            this.showDeleteConfirm(row);
                                        }}><DelIcon />    </a>
                                    </Tooltip>
                                    <Divider type="vertical" />
                                    <Tooltip title="维护点信息">
                                        <a onClick={() => {
                                            this.editMonitorInfo('', row);
                                        }}><PointIcon />    </a>
                                    </Tooltip>
                                </Fragment>
                            }}
                            parentcode='platformconfig'
                            {...this.props}
                        >
                        </AutoFormTable>
                    </Card>
                </div>
            </PageHeaderWrapper>
        );
    }
}
