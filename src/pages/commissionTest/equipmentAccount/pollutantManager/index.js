
/*
 * @desc: 调试检测 污染源管理
 * @Author: jab
 * @Date: 2022.07.20
 */
import React, { Component, Fragment } from 'react';
import { CalendarTwoTone, QrcodeOutlined,FundOutlined } from '@ant-design/icons';
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

export default class Index extends Component {
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
        // dispatch({
        //     type: 'autoForm/getAutoFormData',
        //     payload: {
        //       configId:configId,
        //       searchParams:  [
        //         {
        //           Key: 'dbo__T_Cod_MonitorPointBase__BaseCode',
        //           Value: match.params.targetId,
        //           Where: '$=',
        //         },
        //       ],
        //     },
        // });
    }

    editMonitorInfo = (row) => {
        const { match: { params: { targetType, configId, pollutantTypes } } } = this.props;

        const target = this.getTargetIds(row);
        const { targetId } = target;
        const { targetName } = target;
        router.push({
            pathname: `/commissionTest/equipmentAccount/point`,
            query: {
                targetId :row['dbo.T_Bas_Enterprise.EntCode'],
                targetName : row['dbo.T_Bas_Enterprise.EntName'],
            },
        });
    }

    adddischargepermit = (key, row) => {
        const { match: { params: { targetType } } } = this.props;
        const target = this.getTargetIds(row);
        const { targetId } = target;
        const { targetName } = target;
        const configId = 'PDPermit';
        router.push({
            pathname: `/platformconfig/basicInfo/monitortarget/AEnterpriseTest/${targetType}/dischargepermit/${configId}/${targetId}/${targetName}`,
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





    onRef1 = ref => {
        this.child = ref;
    };
    render() {
        const { searchConfigItems, searchForm, tableInfo, match: { params: { configId } }, dispatch } = this.props;
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
        }else{
        return (
            <BreadcrumbWrapper>
                <Card className={styles.contentContainer}>

                    <SearchWrapper
                        onSubmitForm={form => this.loadReportList(form)}
                        configId={configId}
                        isCoustom
                        selectType='3,是'
                    ></SearchWrapper>
                    <AutoFormTable
                        resizable
                        onRef={this.onRef1}
                        style={{ marginTop: 10 }}
                        configId={configId}
                        rowChange={(key, row) => {
                            console.log('key=', key);
                            this.setState({
                                key, row,
                            })
                        }}
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
                                    this.editMonitorInfo(row);
                                }}><PointIcon />    </a>
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
}
