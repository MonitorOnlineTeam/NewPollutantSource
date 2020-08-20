import React, { Component, Fragment } from 'react';
import {
    Card, Spin, Modal, Button, Form, Divider, Tooltip, Popconfirm, Icon, message,
} from 'antd';
import { connect } from 'dva';
import cuid from 'cuid';
import SdlTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import SdlForm from './AutoForm/SdlForm'
import { handleFormData } from '@/utils/utils';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import {
    DelIcon, EditIcon,
} from '@/utils/icon';
/**
 * 仓库管理
 */
@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    btnisloading: loading.effects['autoForm/add'],
    btnisloading1: loading.effects['autoForm/saveEdit'],
}))
@Form.create()
class WarehouseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // DataWhere: [],
            visible: false,
            Evisible: false,
            keysParams: null,
            AttachmentID: '',
            ID: '',
            title: '',
        };
    }

    /** 初始化加载 */
    componentDidMount() {
        const {
            configId,
        } = this.props.match.params;
        // const DataWhere = [{
        //     Key: '[dbo]__[T_Bas_MonitorPointTypeInfo]__DeleteMark',
        //     Value: 0,
        //     Where: '!=',
        // }];
        // this.setState({
        //     DataWhere,
        // }, () => {
        //     this.reloadPage(configId);
        // })
        this.reloadPage(configId);
    }

    /** 加载autoform */
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



    /** 添加 */
    handleOk = e => {
        const {
            dispatch,
            form,
        } = this.props;
        const { configId } = this.props.match.params;
        // const {
        //     DataWhere,
        // } = this.state;
        form.validateFields((err, values) => {
            if (!err) {
                const formData = handleFormData(values);
                
                dispatch({
                    type: 'BaseSetting/AddWarehouseInfo',
                    payload: {
                        WarehouseNo: formData.WarehouseNo,
                        WarehouseName: formData.WarehouseName,
                        RegionCode: formData.RegionCode,
                        WarehouseAddress: formData.WarehouseAddress,
                        Longitude: formData.Longitude,
                        Latitude: formData.Latitude,
                        CreateUserId: formData.CreateUserId,
                        CreateTime: formData.CreateTime,
                        DeleteMark: formData.DeleteMark,
                        callback: result => {
                            if (result.Datas === 1) {
                                this.setState({
                                    visible: false,
                                }, () => {
                                    dispatch({
                                        type: 'autoForm/getAutoFormData',
                                        payload: {
                                            configId,
                                            // searchParams: this.state.DataWhere,
                                        },
                                    })
                                })
                                message.success("添加成功!")
                            }
                            else if (result.Datas === 2) {
                                message.error("添加重复,请检查编号!");
                            }
                            else {
                                message.error("添加失败!");
                            }
                        },
                    },
                });
            }
        });
    };
    /** 编辑 */
    SaveOk = e => {
        const {
            dispatch,
            form,
        } = this.props;
        const { keysParams } = this.state;
        const { configId } = this.props.match.params;
        // const {
        //     DataWhere,
        // } = this.state;
        form.validateFields((err, values) => {
            if (!err) {
                values.ID = keysParams["dbo.T_Bas_WarehouseInfo.ID"];
                const formData = handleFormData(values);
                dispatch({
                    type: 'BaseSetting/UpdateWarehouseInfo',
                    payload: {
                        ID: formData.ID,
                        WarehouseNo: formData.WarehouseNo,
                        WarehouseName: formData.WarehouseName,
                        RegionCode: formData.RegionCode,
                        WarehouseAddress: formData.WarehouseAddress,
                        Longitude: formData.Longitude,
                        Latitude: formData.Latitude,
                        CreateUserId: formData.CreateUserId,
                        CreateTime: formData.CreateTime,
                        DeleteMark: formData.DeleteMark,
                        callback: result => {
                            
                            if (result.Datas === 1) {
                                this.setState({
                                    Evisible: false,
                                }, () => {
                                    dispatch({
                                        type: 'autoForm/getAutoFormData',
                                        payload: {
                                            configId,
                                            // searchParams: this.state.DataWhere,
                                        },
                                    })
                                })
                                message.success("修改成功!")
                            }
                            else if (result.Datas === 2) {
                                message.error("修改重复,请检查编号!");
                            }
                            else {
                                message.error("修改失败!");
                            }
                        },
                    },
                });
            }
        });
    };

    render() {
        const { btnisloading, btnisloading1 } = this.props;
        const { configId, EntName } = this.props.match.params;
        // const { DataWhere } = this.state;
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
            <BreadcrumbWrapper title="设备主机名称">
                <Card>
                    <SearchWrapper
                        onSubmitForm={form => this.loadReportList(form)}
                        configId={configId}
                    ></SearchWrapper>
                    <SdlTable
                        style={{ marginTop: 10 }}
                        configId={configId}
                        parentcode="ddd"
                        // searchParams={DataWhere}
                        appendHandleButtons={(selectedRowKeys, selectedRows) => <Fragment>
                            <Button icon="plus" type="primary" onClick={() => {
                                this.setState({
                                    visible: true,
                                })
                            }}>添加</Button>
                        </Fragment>
                        }
                        appendHandleRows={row => <Fragment>
                            <Divider type="vertical" />
                            <Tooltip title="编辑">
                                <a onClick={() => {
                                    
                                    const keysParams = {
                                        'dbo.T_Bas_WarehouseInfo.ID': row['dbo.T_Bas_WarehouseInfo.ID'],
                                    };
                                    this.setState({
                                        keysParams,
                                        // AttachmentID: arr.length > 0 ? arr[arr.length - 2] : '',
                                        ID: row['dbo.T_Bas_WarehouseInfo.ID'],
                                    }, () => {
                                        this.setState({
                                            Evisible: true,
                                        })
                                    })
                                }}><EditIcon /></a>
                            </Tooltip>

                        </Fragment>}
                        parentcode="platformconfig"
                        {...this.props}
                    >
                    </SdlTable>
                    <Modal
                        title="添加"
                        visible={this.state.visible}
                        destroyOnClose // 清除上次数据
                        onOk={this.handleOk}
                        okText="保存"
                        cancelText="关闭"
                        confirmLoading={btnisloading}
                        onCancel={() => {
                            this.setState({
                                visible: false,
                            });
                        }}
                        width="50%"
                    >
                        <SdlForm configId={configId} form={this.props.form} hideBtns noLoad />
                    </Modal>
                    <Modal
                        title="编辑"
                        visible={this.state.Evisible}
                        destroyOnClose // 清除上次数据
                        onOk={this.SaveOk}
                        confirmLoading={btnisloading1}
                        okText="保存"
                        cancelText="关闭"
                        onCancel={() => {
                            this.setState({
                                Evisible: false,
                            });
                        }}
                        width="50%"
                    >
                        <SdlForm configId={configId} onSubmitForm={this.onSubmitForm} form={this.props.form} hideBtns isEdit keysParams={this.state.keysParams} noLoad />
                    </Modal>

                </Card>
            </BreadcrumbWrapper>
        );
    }
}
export default WarehouseInfo;
