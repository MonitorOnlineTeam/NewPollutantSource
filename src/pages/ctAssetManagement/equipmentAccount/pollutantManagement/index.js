
/*
 * @desc: 资产管理/设备台账 污染源管理 
 * @Author: jab
 * @Date: 2023.08.31
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

@connect(({ loading, autoForm, global }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    configInfo: global.configInfo,
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
    }

    goPointInfo = (row) => {
        router.push({
            pathname: `/ctAssetManagement/equipmentAccount/pollutantManagement/CTEnterprise/point`,
            query: {
                targetId :row['dbo.T_Bas_Enterprise.ID'],
                targetName : row['dbo.T_Bas_Enterprise.EntName'],
            },
        });
    }






    onRef1 = ref => {
        this.child = ref;
    };
    render() {
        const { searchConfigItems, searchForm, tableInfo, match: { params: { configId } }, dispatch,configInfo, } = this.props;
        const searchConditions = searchConfigItems[configId] || []
        const columns = tableInfo[configId] ? tableInfo[configId].columns : [];
        const noDelFlag = configInfo&&configInfo.DeleteTestUser==0? true : false;

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
                <Card className={styles.contentContainerSty}>

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
                        noDel={noDelFlag}
                        appendHandleRows={row => <Fragment>
                            {!noDelFlag&&<Divider type="vertical" />}
                            <Tooltip title="维护点信息">
                                <a onClick={() => {
                                    this.goPointInfo(row);
                                }}><PointIcon />    </a>
                            </Tooltip>
                        </Fragment>}
                        parentcode="platformconfig/monitortarget"
                        {...this.props}
                    />
                </Card>
            </BreadcrumbWrapper>
        );
    }
}
}
