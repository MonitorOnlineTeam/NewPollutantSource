/**
 * 功  能：萤石云视频管理组件
 * 创建人：wjw
 * 修改人：-
 * 创建时间：2019.10.21
 */

import React, { Component, Fragment } from 'react';
import { PlayCircleTwoTone } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Tooltip, Card, Spin, Divider, Modal, message, Popconfirm, Button } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './style.less';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import SdlForm from '@/pages/AutoFormManager/SdlForm';
import { DelIcon } from '@/utils/icon'

@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    // columns: autoForm.columns,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
}))
@Form.create()
class YSYManagerIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            FormDatas: {},
        };
    }

    /** 初始化加载table配置 */
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId: 'CameraMonitor',
            },
        });
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId: 'VideoCamera',
            },
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    delete = id => {
        const { dispatch } = this.props;
        dispatch({
            type: 'ysyvideo/DeleteCamera',
            payload: {
                CameraMonitorID: id,
                PointCode: this.props.DGIMN,
            },
        });
    }

    handleOk = e => {
        const { dispatch, form, DGIMN } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const FormData = {};
                for (const key in values) {
                    // if (values[key] && values[key].fileList) {
                    //     FormData[key] = uid;
                    // } else {
                    FormData[key] = values[key] && values[key].toString();
                    // }
                }
                dispatch({
                    type: 'ysyvideo/IsTrueSerialNumber',
                    payload: {
                        SerialNumber: FormData.VedioCamera_No,
                        callback: result => {

                            if (result.Datas) {
                                dispatch({
                                    type: 'ysyvideo/AddDevice',
                                    payload: {
                                        configId: 'VideoCamera',
                                        FormData: {
                                            ...FormData,
                                            VedioDevice_ID: 1,
                                        },
                                        PointCode: DGIMN,//this.props.match.params.Pointcode,
                                        callback: result => {
                                            this.setState({
                                                visible: false,
                                            });
                                        },
                                    },
                                });
                            } else {
                                message.error('序列号或验证码不正确，请重新填写');
                            }
                        },
                    },
                });
            }
        });
    };

    render() {
        const { dispatch, loading, match, DGIMN } = this.props;
        const pointDataWhere = [
            {
                Key: '[dbo]__[T_Bas_CameraMonitor]__BusinessCode',
                Value: DGIMN,//match.params.Pointcode,
                Where: '$=',
            },
            {
                Key: '[dbo]__[T_Bas_CameraMonitor]__MonitorType',
                Value: 1,
                Where: '$=',
            },
        ];
        if (loading) {
            return (
                <Spin
                    style={{
                        width: '100%',
                        height: 'calc(100vh/2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    size="large"
                />
            );
        }
        return (
            <div className={styles.cardTitle}>
                <Card
                //        title={
                //             <span>{match.params.Pointname}<Button
                //                 style={{ marginLeft: 10 }}
                //                 onClick={() => {
                //                     history.go(-1);
                //                 }}
                //                 type="link"
                //                 size="small"
                //             >
                //                 <Icon type="rollback" />
                //                 返回上级
                // </Button></span>}
                >
                    <SearchWrapper configId="VideoCamera" searchParams={pointDataWhere} />
                    <AutoFormTable
                        style={{ marginTop: 10 }}
                        configId="CameraMonitor"
                        searchParams={pointDataWhere}
                        rowChange={(key, row) => {
                            this.setState({
                                key,
                                row,
                            });
                        }}
                        onAdd={() => {
                            this.showModal();
                        }}
                        appendHandleRows={row => (
                            <Fragment>
                                <Tooltip title="删除">
                                    <Popconfirm
                                        title="确认要删除吗?"
                                        onConfirm={() => {
                                            this.delete(
                                                row['dbo.T_Bas_CameraMonitor.CameraMonitorID'],
                                            );
                                        }}
                                        onCancel={this.cancel}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a href="#"><DelIcon /></a>
                                    </Popconfirm>
                                </Tooltip>
                                <Divider type="vertical" />
                                <Tooltip title="播放">
                                    <a
                                        onClick={() => {
                                            dispatch(
                                                routerRedux.push(
                                                    `/platformconfig/ysyshowvideo/${row['dbo.T_Bas_VideoCamera.VedioCamera_ID']
                                                    }/${DGIMN}`,
                                                ),
                                            );
                                        }}
                                    >
                                        <PlayCircleTwoTone />
                                    </a>
                                </Tooltip>
                            </Fragment>
                        )}
                    />
                </Card>
                <Modal
                    title="摄像头管理"
                    visible={this.state.visible}
                    destroyOnClose // 清除上次数据
                    onOk={this.handleOk}
                    okText="保存"
                    cancelText="关闭"
                    onCancel={() => {
                        this.setState({
                            visible: false,
                        });
                    }}
                    width="50%"
                >
                    <SdlForm configId="VideoCamera" form={this.props.form} noLoad hideBtns />
                </Modal>
            </div>
        );
    }
}
export default YSYManagerIndex;
