
/*
 * @desc:保养项管理页面
 * @Author: lzp
 * @Date: 2019年9月27日10:11:59
 */
import React, { Component, Fragment } from 'react';
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
import { BarChartOutlined } from '@ant-design/icons';
import { PointIcon, DelIcon  } from '@/utils/icon'
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
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

export default class Maintain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pointTitle:'',
            visible:false,
        };
    }

    componentDidMount() {
        const { configId } = this.props;
        this.reloadPage(configId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.configId !== this.props.configId) {
            this.reloadPage(nextProps.configId);
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
    render() {
        const { configId,promptText,isHistory, } = this.props;
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
                <div >
                    <Card>

                        <SearchWrapper     configId={configId} ></SearchWrapper>
                        <span style={{color:'#f5222d'}}>  </span>
                        <AutoFormTable
                            isCenter
                            style={{ marginTop: 10 }}
                            configId={configId}
                            promptText={promptText}
                            appendHandleRows={row => {
                                return (
                                      isHistory&&<Fragment>
                                           <Tooltip title="历史运营详情">
                                            <a href="#">  <BarChartOutlined  style={{ fontSize: 16 }} /></a>
                                            </Tooltip>
                                    </Fragment>
                                );
                            }}
                        >
                        </AutoFormTable>
                    </Card>
                </div>
        );
    }
}
