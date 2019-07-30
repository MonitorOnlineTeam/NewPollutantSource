
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
import { PointIcon } from '@/utils/icon'
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import SdlTable from '@/components/AutoForm/Table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchWrapper from '@/components/AutoForm/SearchWrapper';
import { sdlMessage } from '@/utils/utils';


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
        const { match } = this.props;
        const configId = match.params.configId;

        let targetId = '';
        let targetName = '';
        let targetType = '';
        switch (match.params.configId) {
            case 'AEnterpriseTest'://企业
                targetId = row['dbo.T_Bas_Enterprise.EntCode'];
                targetName = row['dbo.T_Bas_Enterprise.EntName'];
                targetType = 1;
                break;
            case 'basStation'://监测站
                targetId = row['dbo.T_Bas_Station.StationCode'];
                targetName = row['dbo.T_Bas_Station.StationName'];
                targetType = 2;
                break;
            case 'baseReach'://河段
                targetId = row['dbo.T_Bas_Reach.ReachCode'];
                targetName = row['dbo.T_Bas_Reach.ReachName'];
                targetType = 3;
                break;
            case 'basBuildingSite'://工地
                targetId = row['dbo.T_Bas_BuildingSite.BuildingSiteCode'];
                targetName = row['dbo.T_Bas_BuildingSite.BuildingSiteName'];
                targetType = 1;
                break;
            default: break;
        }

        this.props.dispatch(routerRedux.push(`/platformconfig/monitortarget/${match.params.configId}/${match.params.pollutantTypes}/monitorpoint/${targetType}/${targetId}/${targetName}`))
    }

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
                <div className={styles.cardTitle}>
                    <Card>

                        <SearchWrapper
                            onSubmitForm={(form) => this.loadReportList(form)}
                            configId={configId}
                        ></SearchWrapper>
                        <SdlTable

                            style={{ marginTop: 10 }}
                            // columns={columns}
                            configId={configId}
                            rowChange={(key, row) => {
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
                            appendHandleRows={row => {
                                return <Fragment>
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
                        </SdlTable>
                    </Card>
                </div>
            </PageHeaderWrapper>
        );
    }
}
