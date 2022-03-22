import React, { Component, Fragment } from 'react';
import { BarsOutlined, RollbackOutlined, YoutubeOutlined } from '@ant-design/icons';
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
import { routerRedux } from 'dva/router';
import styles from './index.less';
import MonitorContent from '../../components/MonitorContent/index';
import NewDataFilter from '../Userinfo/DataFilterNew';
import EnterpriseDataFilter from '../../components/UserInfo/EnterpriseDataFilter';
import { connect } from 'dva';
import SdlTable from './AutoFormTable';
import SearchWrapper from './SearchWrapper';
import { sdlMessage } from '../../utils/utils';
import PollutantType from './PollutantType';
import SdlForm from './SdlForm';
import AutoFormViewItems from './AutoFormViewItems';

let pointConfigId = '';
let pointConfigIdEdit = '';
@connect(({ loading, autoForm, monitorTarget }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    otherloading: loading.effects['monitorTarget/getPollutantTypeList'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    // columns: autoForm.columns,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    pointDataWhere: monitorTarget.pointDataWhere,
    isEdit: monitorTarget.isEdit,
    btnloading: loading.effects['monitorTarget/addPoint'],
    btnloading1: loading.effects['monitorTarget/editPoint'],
}))
@Form.create()
export default class MonitorPoint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pollutantType: 0,
            visible: false,
            FormDatas: {},
            selectedPointCode: '',
            isView: false,
        };
    }

    componentDidMount() {
        // 1.监控目标ID
        // 2.污染物类型
        // 3.获取监测点数据
        const { dispatch, match } = this.props;

        dispatch({
            type: 'monitorTarget/getPollutantTypeList',
            payload: {
                callback: result => {
                    this.setState({
                        pollutantType: result,
                    });
                    this.getPageConfig(result);
                },
            },
        })
    }

    getPageConfig = type => {
        this.setState({
            pollutantType: type,
        });
        const { dispatch, match } = this.props;

        // 1	废水
        // 2	废气
        // 3	噪声
        // 4	固体废物
        // 5	环境质量
        // 6	水质
        // 8	小型站
        // 9	恶臭
        // 10	voc
        // 11	工况
        // 12	扬尘
        // 18	颗粒物
        // 23	国控
        // 24	省控
        // 25	市控

        switch (type) {
            case 1:
                // 废水
                pointConfigId = 'WaterOutputNew';
                pointConfigIdEdit = 'WaterOutput';
                break;
            case 2:
                // 废气
                pointConfigId = 'GasOutputNew';
                pointConfigIdEdit = 'GasOutput';
                break;
            case 3:
                // 噪声
                break;
            case 4:
                break;
        }
        dispatch({
            type: 'monitorTarget/updateState',
            payload: {
                pollutantType: type,
                pointDataWhere: [
                    {
                        Key: 'dbo__T_Cod_MonitorPointBase__BaseCode',
                        Value: match.params.targetId,
                        Where: '$=',
                    },
                ],
            },
        });
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId: pointConfigId,
            },
        })
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId: pointConfigIdEdit,
            },
        })
    }

    editMonitorInfo = () => {
        const { key, row } = this.state;
        if ((!row || row.length === 0) || row.length > 1) {
            sdlMessage('请选择一行进行操作', 'warning');
            return false;
        }
    }

    onMenu = (key, id, name, code) => {
        const { match: { params: { configId, targetId, targetName } } } = this.props;
        // match.params
        switch (key) {
            case '1':
                this.props.dispatch(routerRedux.push(`/platformconfig/usestandardlibrary/${id}/${name}/${configId}/${targetId}/${targetName}/${this.state.pollutantType}`));
                break;
            case '2':
                this.props.dispatch(routerRedux.push(`/sysmanage/stopmanagement/${id}/${name}/${configId}/${targetId}/${targetName}`));
                break;
            case '3':
                this.props.dispatch(routerRedux.push(`/platformconfig/ysymanager/${name}/${code}/${id}/${targetId}/${targetName}`));
                break;
            case '4':
                this.props.dispatch(routerRedux.push(`/pointdetail/${id}/pointinfo`));
                break;
            default:
                break;
        }
    }

    showModal = PointCode => {
        const { dispatch } = this.props;
        if (PointCode) {
            this.setState({
                visible: true,
                isEdit: true,
                selectedPointCode: PointCode,
            });
            dispatch({
                type: 'autoForm/getFormData',
                payload: {
                    configId: pointConfigIdEdit,
                    'dbo.T_Bas_CommonPoint.PointCode': PointCode,
                },
            })
        } else {
            this.setState({
                visible: true,
                isEdit: false,
                selectedPointCode: '',
            });
        }
    };

    handleCancel = e => {
        this.setState({
            visible: false,
            isEdit: false,
            selectedPointCode: '',
            isView: false,
        });
    };

    onSubmitForm() {
        const { dispatch, match, pointDataWhere, form } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                const FormData = {};
                for (const key in values) {
                    if (values[key] && values[key].fileList) {
                        FormData[key] = uid;
                    } else {
                        FormData[key] = values[key] && values[key].toString()
                    }
                }

                if (!Object.keys(FormData).length) {
                    sdlMessage('数据为空', 'error');
                    return false;
                }
                if (this.state.isEdit) {
                    FormData.PointCode = this.state.selectedPointCode;
                }
                dispatch({
                    type: !this.state.isEdit ? 'monitorTarget/addPoint' : 'monitorTarget/editPoint',
                    payload: {
                        configId: pointConfigIdEdit,
                        targetId: match.params.targetId,
                        FormData,
                        callback: (result => {
                            if (result.IsSuccess) {
                                this.setState({
                                    visible: false,
                                });
                                dispatch({
                                    type: 'autoForm/getAutoFormData',
                                    payload: {
                                        configId: pointConfigId,
                                        searchParams: pointDataWhere,
                                    },
                                });
                            }
                        }),
                    },
                })
            }
        });
    }

    delPoint(PointCode, DGIMN) {
        const { dispatch, match, pointDataWhere } = this.props;
        const { pollutantType } = this.state;
        dispatch({
            type: 'monitorTarget/delPoint',
            payload: {
                configId: pointConfigIdEdit,
                targetId: match.params.targetId,
                pollutantType,
                DGIMN,
                PointCode,
                callback: (result => {
                    if (result.IsSuccess) {
                        dispatch({
                            type: 'autoForm/getAutoFormData',
                            payload: {
                                configId: pointConfigId,
                                searchParams: pointDataWhere,
                            },
                        });
                    }
                }),
            },
        })
    }

    render() {
        const { searchConfigItems, searchForm, tableInfo, match: { params: { targetName, configId } }, dispatch, pointDataWhere, isEdit, btnloading, btnloading1 } = this.props;
        const searchConditions = searchConfigItems[pointConfigId] || []
        const columns = tableInfo[pointConfigId] ? tableInfo[pointConfigId].columns : [];
        if (this.props.loading || this.props.otherloading) {
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
        const menu = (id, name, code) => (
            <Menu onClick={e => {
                this.onMenu.bind()(e.key, id, name, code);
            }}>
                <Menu.Item key="1"><BarsOutlined />监测标准</Menu.Item>
                {/* <Menu.Item key="2"><Icon type="tool" />停产管理</Menu.Item> */}
                <Menu.Item key="3"><YoutubeOutlined />视频管理</Menu.Item>
                {/* <Menu.Item key="4"><Icon type="home" />进入排口</Menu.Item> */}
            </Menu>
        );
        return (
            <MonitorContent breadCrumbList={
                [
                    { Name: '首页', Url: '/' },
                    { Name: '平台配置', Url: '' },
                    { Name: '企业管理', Url: `/platformconfig/monitortarget/${  configId}` },
                    { Name: '维护点信息', Url: '' },
                ]
            }>
                <div className={styles.cardTitle}>
                    <Card title={<span>{targetName}<Button style={{ marginLeft: 10 }} onClick={() => {
                        history.go(-1);
                    }} type="link" size="small"><RollbackOutlined />返回上级</Button></span>} extra={<PollutantType handlePollutantTypeChange={this.getPageConfig} />}>

                        <SdlTable
                            style={{ marginTop: 10 }}
                            // columns={columns}
                            configId={pointConfigId}
                            rowChange={(key, row) => {
                                this.setState({
                                    key, row,
                                })
                            }}
                            onAdd={() => {
                                this.showModal()
                            }}
                            searchParams={pointDataWhere}
                            appendHandleRows={row => <Fragment>
                                    <a onClick={() => {
                                        this.showModal(row["dbo.T_Bas_CommonPoint.PointCode"]);
                                    }}>编辑</a>
                                    <Divider type="vertical" />
                                    <a onClick={() => {
                                        this.setState({
                                            visible: true,
                                            isEdit: false,
                                            isView: true,
                                            selectedPointCode: row["dbo.T_Bas_CommonPoint.PointCode"]
                                        });
                                    }}>详情</a>
                                    <Divider type="vertical" />
                                    <Popconfirm
                                        title="确认要删除吗?"
                                        onConfirm={() => {
                                            this.delPoint(row["dbo.T_Bas_CommonPoint.PointCode"], row["dbo.T_Bas_CommonPoint.DGIMN"])
                                        }}
                                        onCancel={this.cancel}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a href="#">删除</a>
                                    </Popconfirm>
                                    <Divider type="vertical" />

                                    <Dropdown overlay={menu(row['dbo.T_Bas_CommonPoint.DGIMN'], row['dbo.T_Bas_CommonPoint.PointName'], row["dbo.T_Bas_CommonPoint.PointCode"])} >
                                        <a>
                                            更多
                                        </a>
                                    </Dropdown>
                                </Fragment>}
                        />
                    </Card>
                    <Modal
                        title={this.state.isView ? '详情' : (this.state.isEdit ? '编辑监测点' : '添加监测点')}
                        visible={this.state.visible}
                        confirmLoading={ this.state.IsEdit === true ? btnloading1 : btnloading}
                        onOk={this.onSubmitForm.bind(this)}
                        onCancel={this.handleCancel}
                        width="60%"
                        destroyOnClose
                    >
                        {
                            !this.state.isView ? <SdlForm
                                configId={pointConfigIdEdit}
                                onSubmitForm={this.onSubmitForm.bind(this)}
                                form={this.props.form}
                                noLoad
                                hideBtns
                                isEdit={this.state.isEdit}
                                keysParams={{ 'dbo.T_Bas_CommonPoint.PointCode': this.state.selectedPointCode }}
                            /> : <AutoFormViewItems
                                    configId={pointConfigIdEdit}
                                    keysParams={{ 'dbo.T_Bas_CommonPoint.PointCode': this.state.selectedPointCode }}
                                />
                        }
                    </Modal>
                </div>
            </MonitorContent>
        );
    }
}
