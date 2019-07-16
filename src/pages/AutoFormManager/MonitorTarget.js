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
    Select, Modal, Tag, Divider, Dropdown, Icon, Menu, Popconfirm, message, DatePicker, InputNumber
} from 'antd';
import styles from './index.less';
import MonitorContent from '../../components/MonitorContent/index';
import NewDataFilter from '../Userinfo/DataFilterNew';
import EnterpriseDataFilter from '../../components/UserInfo/EnterpriseDataFilter';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import SdlTable from './Table';
import SearchWrapper from './SearchWrapper';
import { sdlMessage } from '../../utils/utils';


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
        //debugger;
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
        switch (match.params.configId) {
            case 'AEnterpriseTest':
                targetId = row['dbo.T_Bas_Enterprise.EntCode'];
                targetName = row['dbo.T_Bas_Enterprise.EntName']
                break;
            default: break;
        }

        this.props.dispatch(routerRedux.push(`/platformconfig/monitortarget/monitorpoint/${match.params.configId}/${targetId}/${targetName}`))
    }

    render() {
        const { searchConfigItems, searchForm, tableInfo, match: { params: { configId } }, dispatch } = this.props;
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
            <MonitorContent breadCrumbList={
                [
                    { Name: '首页', Url: '/' },
                    { Name: '平台配置', Url: '' },
                    { Name: '企业管理', Url: '' }
                ]
            }>
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
                            appendHandleRows={row => {
                                return <Fragment>
                                    <Divider type="vertical" />
                                    <a onClick={() => {
                                        this.editMonitorInfo('', row);
                                    }}>维护点信息</a>

                                </Fragment>
                            }}
                        >
                        </SdlTable>
                    </Card>
                </div>
            </MonitorContent>
        );
    }
}
