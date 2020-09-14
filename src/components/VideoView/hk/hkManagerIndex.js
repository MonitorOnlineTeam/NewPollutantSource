/**
 * 功  能：海康威视视频管理组件
 * 创建人：wjw
 * 修改人：-
 * 创建时间：2019.10.21
 */

import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { PlayCircleTwoTone } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Table,
    Card,
    Button,
    Modal,
    message,
    Divider,
    Row,
    Col,
    Tooltip,
    Popconfirm,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import Add from './AddVideoInfo';
import Update from './UpdateVideoInfo';
import InfoList from './VideoInfoList';
import styles from './style.less';
import SdlTable from '@/components/SdlTable';
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon'

@connect(({ loading, hkvideo }) => ({
    ...loading,
    videoListParameters: hkvideo.videoListParameters,
}))
 class HkCameraIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            type: 'add',
            title: '',
            width: 400,
            data: null,
            // pointName: this.props.match.params.pointname,
            pointName: '排口名称',
            footer: <div>
                <Button key="back" onClick={this.handleCancel}>Return</Button>,
                <Button key="submit" type="primary" onClick={this.handleOk}>
                    Submit
                </Button>
            </div>,
        };
    }

    componentDidMount() {
         this.props.dispatch({
           type: 'hkvideo/hkvideourl',
           payload: {
               DGIMN: this.props.DGIMN,
           },
         });
    }

    componentWillReceiveProps = nextProps => {
        if (this.props.DGIMN !== nextProps.DGIMN) {
            this.props.dispatch({
              type: 'hkvideo/hkvideourl',
              payload: {
                DGIMN: nextProps.DGIMN,
              },
            });
        }
    }

    onRef1 = ref => {
        this.child = ref;
    };

    onCancel = () => {
        this.setState({ visible: false })
        this.props.dispatch({
          type: 'hkvideo/hkvideourl',
          payload: {
            DGIMN: this.props.DGIMN,
          },
        });
    };

    AddData = () => {
        this.child.handleSubmit();
    };

    // 修改
    updateData = () => {
        this.child.handleSubmitupdate();
    };


    deleteVideoInfobyIndex = record => {
        this.props.dispatch({
            type: 'hkvideo/deleteVideoInfo',
            payload: {
                DGIMN: this.props.DGIMN,
                VedioCamera_ID: record.VedioCamera_ID,
                VedioDevice_ID: record.VedioDevice_ID,
                CameraMonitorID: record.CameraMonitorID,
                callback: result => {
                    if (result) {
                         this.props.dispatch({
                           type: 'hkvideo/hkvideourl',
                           payload: {
                             DGIMN: this.props.DGIMN,
                           },
                         });
                        message.success('删除成功！')
                    } else {
                        message.error('删除失败！')
                    }
                },
            },
        });
    }

    render() {
        const { videoListParameters } = this.props;
        const columns = [
            { title: '设备名称', dataIndex: 'VedioDevice_Name', key: 'VedioDevice_Name', width: 100 },
            { title: '相机名称', dataIndex: 'VedioCamera_Name', key: 'VedioCamera_Name', width: 100 },
            { title: 'IP', dataIndex: 'IP', key: 'IP', width: 150 },
            { title: '端口', dataIndex: 'Device_Port', key: 'Device_Port', width: 100 },
            { title: '用户名', dataIndex: 'User_Name', key: 'User_Name', width: 100 },
            { title: '密码', dataIndex: 'User_Pwd', key: 'User_Pwd', width: 100 },
            { title: '通道号', dataIndex: 'VedioCamera_No', key: 'VedioCamera_No', width: 100 },
            {
                title: '操作',
                key: 'action',
                width: 200,
                render: (text, record, index) => (
                    <span>
                     <Tooltip title="详情">
                        <a onClick={() => {
                            this.setState({
                                visible: true,
                                type: 'details',
                                title: '视频详情信息',
                                width: 1130,
                                data: record,
                                footer: null,
                            });
                        }}><DetailIcon/></a>
                        </Tooltip>
                        <Divider type="vertical" />
                        <Tooltip title="编辑">
                        <a onClick={() => {
                               this.setState({
                                visible: true,
                                type: 'update',
                                title: '编辑视频信息',
                                width: 1130,
                                data: record,
                                footer: <div>
                                    <Button key="back" onClick={this.onCancel}>取消</Button>
                                    <Button key="submit" type="primary" onClick={this.updateData}>
                                        确定
                                    </Button>
                                </div>,
                            });
                        }}><EditIcon/></a></Tooltip>
                        <Divider type="vertical" />
                        <Tooltip title="删除">
                            <Popconfirm placement="left" title="确定要删除此相机吗？" onConfirm={() => this.deleteVideoInfobyIndex(record)} okText="是" cancelText="否">
                                <a href="#" > <DelIcon/> </a>
                            </Popconfirm>
                        </Tooltip>
                        <Divider type="vertical" />
                        <Tooltip title="播放">
                        <a onClick={() => {
                            this.props.dispatch(
                        routerRedux.push(
                          `/platformconfig/hkshowvideo/${this.props.DGIMN}`,
                        ),
                      );
                    }}><PlayCircleTwoTone /></a></Tooltip>
                    </span>
                ),
            },

        ];

        return (
                <div className={styles.cardTitle}>
                    <Card bordered={false} title={videoListParameters.pointname} style={{ width: '100%' }}>
                        <Form layout="inline" style={{ marginBottom: 10 }}>
                            <Row gutter={8} >
                                <Col span={24} >
                                    <Button type="primary"
                                        onClick={
                                            () => {
                                                this.setState({
                                                    visible: true,
                                                    type: 'add',
                                                    title: '添加视频信息',
                                                    width: 1130,
                                                    footer: <div>
                                                        <Button key="back" onClick={this.onCancel}>取消</Button>
                                                        <Button key="submit" type="primary" onClick={this.AddData}>
                                                            确定
                                    </Button>
                                                    </div>,
                                                });
                                            }
                                        } > 添加 </Button>
                                </Col >
                            </Row>
                        </Form>
                        <SdlTable
                            columns={columns}
                            pagination={false}
                            dataSource={videoListParameters.list}
                            rowKey="VedioCamera_ID"
                            loading={this.props.effects['hkvideo/hkvideourl']}
                            className={styles.dataTable}
                            //scroll={{ y: 'calc(100vh - 360px)' }}
                            // rowClassName={
                            //     (record, index, indent) => {
                            //         if (index === 0) {
                            //             return;
                            //         }
                            //         if (index % 2 !== 0) {
                            //             return 'light';
                            //         }
                            //     }
                            // }
                        />
                     <Modal
                            footer={this.state.footer}
                            destroyOnClose="true"
                            visible={this.state.visible}
                            title={this.state.title}
                            width={this.state.width}
                            onCancel={this.onCancel}>
                            {
                                this.state.type === 'add' ? <Add onCancels={this.onCancel} dgimn={this.props.DGIMN} name="监测点" onRef={this.onRef1} /> : this.state.type === 'update' ? <Update onCancels={this.onCancel} dgimn={this.props.DGIMN} item={this.state.data} onRef={this.onRef1} /> : <InfoList onCancels={this.onCancel} dgimn={this.props.DGIMN} item={this.state.data} onRef={this.onRef1} />
                            }

                        </Modal>

                    </Card>
                </div>

        );
    }
}
export default HkCameraIndex;
