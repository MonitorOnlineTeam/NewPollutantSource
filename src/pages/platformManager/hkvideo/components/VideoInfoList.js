import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Row, Col } from 'antd';
import { connect } from 'dva';
import {
    routerRedux,
} from 'dva/router';

const FormItem = Form.Item;

@connect()
@Form.create()
 class VideoInfoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keys: this.props.indexkey,
            exceptrangeDate: [],
            realrangeDate: [],
            description: '',
        };
    }

    componentWillMount() {
        this.props.onRef(this);
    }

    render() {
        console.log(this.props.item);
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 12 },
            },
        };
        return (

            <div>
                <Form onSubmit={this.handleSubmitupdate}>

                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} >
                            <FormItem

                                {...formItemLayout}
                                label="DGIMN">
                                {getFieldDecorator('PointName', {
                                    initialValue: this.props.item.PointName,

                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="设备名称">
                                {getFieldDecorator('VedioDevice_Name', {
                                    initialValue: this.props.item.VedioDevice_Name,

                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>

                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="设备编号">
                                {getFieldDecorator('VedioDevice_No', {
                                    initialValue: this.props.item.VedioDevice_No,

                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="设备位置">
                                {getFieldDecorator('VedioDevice_Position', {
                                    initialValue: this.props.item.VedioDevice_Position,

                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 8 }}>

                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="IP">
                                {getFieldDecorator('IP', {
                                    initialValue: this.props.item.IP,
                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="端口">
                                {getFieldDecorator('Device_Port', {
                                    initialValue: this.props.item.Device_Port,
                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 8 }}>

                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="登录名">
                                {getFieldDecorator('User_Name', {
                                    initialValue: this.props.item.User_Name,
                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="密码">
                                {getFieldDecorator('User_Pwd', {
                                    initialValue: this.props.item.User_Pwd,
                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 8 }}>

                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="相机名称">
                                {getFieldDecorator('VedioCamera_Name', {
                                    initialValue: this.props.item.VedioCamera_Name,
                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="相机位置">
                                {getFieldDecorator('VedioCamera_Position', {
                                    initialValue: this.props.item.VedioCamera_Position,

                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 8 }}>

                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="通道号">
                                {getFieldDecorator('VedioCamera_No', {
                                    initialValue: this.props.item.VedioCamera_No,
                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="相机编号">
                                {getFieldDecorator('VedioCamera_Version', {
                                    initialValue: this.props.item.VedioCamera_Version,

                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 8 }}>

                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="经度">
                                {getFieldDecorator('Longitude', {
                                    initialValue: this.props.item.Longitude,
                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="纬度">
                                {getFieldDecorator('Latitude', {
                                    initialValue: this.props.item.Latitude,

                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 8 }}>

                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label="生产日期"

                            >
                                {getFieldDecorator('ProduceDate',
                                    {
                                        initialValue: this.props.item.ProduceDate,
                                    })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} style={{ display: 'none' }}>
                            <FormItem
                                {...formItemLayout}
                                label="点编号">
                                {getFieldDecorator('VedioDevice_ID', {
                                    initialValue: this.props.item.VedioDevice_ID,

                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} style={{ display: 'none' }}>
                            <FormItem
                                {...formItemLayout}
                                label="点编号">
                                {getFieldDecorator('CameraMonitorID', {
                                    initialValue: this.props.item.CameraMonitorID,

                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} style={{ display: 'none' }}>
                            <FormItem
                                {...formItemLayout}
                                label="点编号">
                                {getFieldDecorator('VedioCamera_ID', {
                                    initialValue: this.props.item.VedioCamera_ID,
                                })(
                                    <Input style={{ border: 0 }} readOnly />,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}
export default VideoInfoList;
