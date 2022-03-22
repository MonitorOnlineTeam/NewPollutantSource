
/*
 * @desc: 监控目标公共页面【企业、监测站、河段、工地】
 * @Author: JianWei
 * @Date: 2019年7月29日15:11:59
 */
import React, { Component, Fragment } from 'react';
import { CalendarTwoTone, QrcodeOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Table,
    Spin,
    Tooltip,
    Select,
    Modal,
    Tag,
    Divider,
    Dropdown,
    Menu,
    Popconfirm,
    message,
    DatePicker,
    InputNumber,
} from 'antd';
import styles from './style.less';
import { PointIcon, DelIcon } from '@/utils/icon'
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { router } from "umi"
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { sdlMessage } from '@/utils/utils';

const { confirm } = Modal;

@connect(({ loading, autoForm, common }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
}))

export default class MonitorTarget extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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

    editMonitorInfo = (key, row) => {
        const { match: { params: { targetType, configId, pollutantTypes } } } = this.props;
        // const configId = match.params.configId;

        const target = this.getTargetIds(row);
        const { targetId } = target;
        const { targetName } = target;
        router.push({
            pathname: `/platformconfig/monitortarget/${configId}/${targetType}/${pollutantTypes}/monitorpoint/${targetId}/${targetName}`,
            query: {
                tabName: '维护点信息',
            },
        });
        // this.props.dispatch(routerRedux.push())
    }

    adddischargepermit = (key, row) => {
        const { match: { params: { targetType } } } = this.props;
        const target = this.getTargetIds(row);
        const { targetId } = target;
        const { targetName } = target;
        const configId = 'PDPermit';
        router.push({
            pathname: `/platformconfig/monitortarget/AEnterpriseTest/${targetType}/dischargepermit/${configId}/${targetId}/${targetName}`,
            query: {
                tabName: '排污许可证',
            },
        });
    }

    getTargetIds = row => {
        const { match: { params: { targetType } } } = this.props;
        let targetId = '';
        let targetName = '';

        switch ((+targetType)) {
            case 1:// 企业
                targetId = row['dbo.T_Bas_Enterprise.EntCode'];
                targetName = row['dbo.T_Bas_Enterprise.EntName'];
                // targetType = 1;
                break;
            case 2:// 监测站
                targetId = row['dbo.T_Bas_Station.StationCode'];
                targetName = row['dbo.T_Bas_Station.StationName'];
                // targetType = 2;
                break;
            case 3:// 河段
                targetId = row['dbo.T_Bas_Reach.ReachCode'];
                targetName = row['dbo.T_Bas_Reach.ReachName'];
                // targetType = 3;
                break;
            case 4:// 工地
                targetId = row['dbo.T_Bas_BuildingSite.BuildingSiteCode'];
                targetName = row['dbo.T_Bas_BuildingSite.BuildingSiteName'];
                // targetType = 4;
                break;
            default: break;
        }

        return { targetId, targetName };
    }

    showDeleteConfirm = row => {
        const that = this;
        const { dispatch } = this.props;
        // console.log("row=", row);
        confirm({
            title: '确定要删除该条数据吗？',
            content: '删除后不可恢复',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                const target = that.getTargetIds(row);
                const where = [];
                where.push(target.targetId);

                dispatch({
                    type: 'monitorTarget/queryPointForTarget',
                    payload: {
                        where,
                        callback: res => {
                            if (res.IsSuccess) {
                                that.child.delRowData(row);
                            }
                        },
                    },
                })
            },
            onCancel() {

            },
        });
    }

    //生成监测点二维码
    CreatQRCode = (row) => {
        debugger
        this.props.dispatch({
            type: 'common/CreatQRCode',
            payload: {
                EntCode: row['dbo.T_Bas_Enterprise.EntCode'],
                callback: (result) => {
                    if (result.IsSuccess && result.Datas) {
                        this.downloadFile(result.Datas);
                    } else {
                        message.error('生成失败');
                    }
                }
            },
        });
    }

    /**下载模版 */
    downloadFile = (returnName) => {
        let a = document.createElement('a');
        a.href = `/upload/${returnName}`;
        a.download = '';
        document.body.appendChild(a);
        a.click();
    }

    onRef1 = ref => {
        this.child = ref;
    };

    render() {
        const { searchConfigItems, searchForm, tableInfo, match: { params: { configId } }, dispatch } = this.props;
        //   console.log("this.props=", this.props);
        const searchConditions = searchConfigItems[configId] || []
        const columns = tableInfo[configId] ? tableInfo[configId].columns : [];
        // if (this.props.loading) {
        //     return (<Spin
        //         style={{
        //             width: '100%',
        //             height: 'calc(100vh/2)',
        //             display: 'flex',
        //             alignItems: 'center',
        //             justifyContent: 'center',
        //         }}
        //         size="large"
        //     />);
        // }
        return (
            <BreadcrumbWrapper>
                <Card className={styles.contentContainer}>
                    <SearchWrapper
                        onSubmitForm={form => this.loadReportList(form)}
                        configId={configId}
                    ></SearchWrapper>
                    <AutoFormTable
                        onRef={this.onRef1}
                        style={{ marginTop: 10 }}
                        // columns={columns}
                        //scroll={{ y: 600 }}
                        configId={configId}
                        rowChange={(key, row) => {
                            console.log('key=', key);
                            this.setState({
                                key, row,
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
                        appendHandleRows={row => <Fragment>
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

                            {configId == "Station" ? "" : <><Divider type="vertical" />
                                <Tooltip title="排污许可证">
                                    <a onClick={() => {
                                        this.adddischargepermit('', row);
                                    }}><CalendarTwoTone style={{ fontSize: 16 }} /> </a>
                                </Tooltip></>}

                            <Divider type="vertical" />
                            <Tooltip title="生成监测点二维码">
                                <a onClick={() => {
                                    this.CreatQRCode(row);
                                }}><QrcodeOutlined /></a>
                            </Tooltip>
                            <Divider type="vertical" />
                            <Tooltip title="机组信息">
                                <a onClick={() => {
                                    router.push('/platformconfig/monitortarget/AEnterpriseTest/1/unitInfoPage/' + row['dbo.T_Bas_Enterprise.EntCode'] + '/' + row['dbo.T_Bas_Enterprise.EntName'])
                                }}><DatabaseOutlined /></a>
                            </Tooltip>
                        </Fragment>}
                        parentcode="platformconfig/monitortarget"
                        {...this.props}
                    >
                    </AutoFormTable>
                </Card>
            </BreadcrumbWrapper>
        );
    }
}
