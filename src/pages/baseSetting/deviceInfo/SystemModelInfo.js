import React, { Component, Fragment } from 'react';
import {
    Card, Spin, Modal, Button, Form, Divider, Tooltip, Popconfirm, Icon, message,
} from 'antd';
import { connect } from 'dva';
import cuid from 'cuid';
import SdlTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import SdlForm from '@/pages/AutoFormManager/SdlForm'
import { handleFormData } from '@/utils/utils';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import {
    DelIcon, EditIcon,
} from '@/utils/icon';
import SystemModelInfoAdd from './SystemModelInfoAdd';
/**
 * 设备系统型号
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
class SystemModelInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataWhere: [],
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
    handleSubmit = e => {
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
                if (!formData.ID) {
                    dispatch({
                        type: 'BaseSetting/AddSystemModelInfo',
                        payload: {
                            PointTypeCode: formData.PointTypeCode,
                            SystemNumber: formData.SystemNumber,
                            SystemModel: formData.SystemModel,
                            FillInType: formData.FillInType,
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
                                    message.error("同一监测点类别下的故障系统型号不能重复!");
                                }
                                else if (result.Datas === 3) {
                                    message.error("添加重复,请检查编号!");
                                }
                                else {
                                    message.error("添加失败!");
                                }
                            },
                        },
                    });
                }
                else {
                    dispatch({
                        type: 'BaseSetting/UpdateSystemModelInfo',
                        payload: {
                            ID: formData.ID,
                            PointTypeCode: formData.PointTypeCode,
                            SystemNumber: formData.SystemNumber,
                            SystemModel: formData.SystemModel,
                            FillInType: formData.FillInType,
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
                                    message.success("修改成功!")
                                }
                                else if (result.Datas === 2) {
                                    message.error("同一监测点类别下的故障系统型号不能重复!");
                                }
                                else if (result.Datas === 3) {
                                    message.error("修改重复,请检查编号!");
                                }
                                else {
                                    message.error("修改失败!");
                                }
                            },
                        },
                    });
                }

            }
        });
    };
    // //删除数据
    // delRowData(ID) {
    //     const { dispatch } = this.props;
    //     const { configId } = this.props.match.params;
    //     // const {
    //     //     DataWhere,
    //     // } = this.state;
    //     dispatch({
    //         type: 'BaseSetting/DelDeviceParametersInfo',
    //         payload: {
    //             ID,
    //             callback: result => {
    //                 debugger
    //                 if (result.IsSuccess) {
    //                     this.setState({
    //                         visible: false,
    //                     }, () => {
    //                         dispatch({
    //                             type: 'autoForm/getAutoFormData',
    //                             payload: {
    //                                 configId,
    //                                 // searchParams: this.state.DataWhere,
    //                             },
    //                         })
    //                     })
    //                     message.success("删除成功!")
    //                 }
    //                 else {
    //                     message.error("删除失败");
    //                 }
    //             },
    //         },
    //     });
    // }

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
            <BreadcrumbWrapper title="设备系统型号">
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
                                    title: "添加",
                                    row: null,
                                })
                            }}>添加</Button>
                        </Fragment>
                        }
                        appendHandleRows={row => <Fragment>
                            <Divider type="vertical" />
                            <Tooltip title="编辑">
                                <a onClick={() => {

                                    this.setState({
                                        visible: true,
                                        title: "编辑",
                                        row: handleFormData(row)
                                    })

                                }}><EditIcon /></a>
                            </Tooltip>

                            {/* <Tooltip title="删除">
                                <Popconfirm
                                    placement="left"
                                    title="确认是否删除?"
                                    onConfirm={() => {
                                        this.delRowData(row['dbo.T_Bas_DeviceParametersInfo.ID']);
                                    }}
                                    okText="是"
                                    cancelText="否">
                                    <a href="#"><DelIcon /></a>
                                </Popconfirm>
                            </Tooltip> */}
                        </Fragment>}
                        parentcode="platformconfig"
                        {...this.props}
                    >
                    </SdlTable>

                    <Modal
                        title={this.state.title}
                        visible={this.state.visible}
                        destroyOnClose // 清除上次数据
                        onOk={this.handleSubmit}
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
                        <SystemModelInfoAdd form={this.props.form} row={this.state.row} />
                    </Modal>
                </Card>
            </BreadcrumbWrapper>
        );
    }
}
export default SystemModelInfo;
