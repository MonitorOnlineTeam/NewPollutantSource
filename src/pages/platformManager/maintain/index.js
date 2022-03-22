
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
import { PointIcon, DelIcon } from '@/utils/icon'
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
        this.state = {};
    }

    componentDidMount() {
        const { match, dispatch } = this.props;
        this.reloadPage(match.params.configId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.configId !== this.props.routerConfig) {
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
            <BreadcrumbWrapper>
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
                        //    scroll={{ y: 600 }}
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
                            // appendHandleRows={row => {
                            //     return <Fragment>
                            //         <Divider type="vertical" />
                            //         <Tooltip title="删除">
                            //             <a onClick={() => {
                            //                 this.showDeleteConfirm(row);
                            //             }}><DelIcon />    </a>
                            //         </Tooltip>
                            //         <Divider type="vertical" />
                            //         <Tooltip title="维护点信息">
                            //             <a onClick={() => {
                            //                 this.editMonitorInfo('', row);
                            //             }}><PointIcon />    </a>
                            //         </Tooltip>
                            //     </Fragment>
                            // }}
                            parentcode='platformconfig'
                            {...this.props}
                        >
                        </AutoFormTable>
                    </Card>
                </div>
            </BreadcrumbWrapper>
        );
    }
}
