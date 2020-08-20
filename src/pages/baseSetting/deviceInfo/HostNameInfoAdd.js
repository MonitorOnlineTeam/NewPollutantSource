import React, { Component } from 'react';
import { Input, Select, InputNumber, Form, Button, Upload, DatePicker, Row, Col, message, Popover, Icon, Radio } from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
@connect(({ BaseSetting }) => ({
    MonitorPointTypeList: BaseSetting.MonitorPointTypeList,
}))

@connect()

/**
 * 功  能：设备主机名称
 * 创建人：dongxiaoyun
 * 创建时间：2020.8.17
 */

export default class HostNameInfoAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exceptrangeDate: [],
            realrangeDate: [],
            description: '',
            pollutantList: [],
        };
    }
    componentWillMount() {
        const { dispatch, row } = this.props;
        debugger
        dispatch({
            type: 'BaseSetting/GetMonitorPointTypeList',
            payload: {
            },
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { MonitorPointTypeList, row } = this.props;
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
        const ParatemersInfo = (
            <div>
                <p>参数编号请从001、002等依次填写，</p>
                <p>切勿填写其他内容。</p>
            </div>
        );
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'监测点类型'}>
                                {getFieldDecorator('PointTypeCode', {
                                    initialValue: row ? row["dbo.T_Bas_HostNameInfo.PointTypeCode"] : null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择监测点类型!',
                                        },
                                    ],
                                })(
                                    <Select
                                    >
                                        {
                                            MonitorPointTypeList !== null ? MonitorPointTypeList.length != 0 ? MonitorPointTypeList.map(item => <Option key={item.PointTypeCode}>{item.PointTypeName}</Option>) : null : null
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'编号'}>
                                {getFieldDecorator('HostNumber', {
                                    initialValue: row ? row["dbo.T_Bas_HostNameInfo.HostNumber"] : null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入编号!',
                                        },
                                    ],
                                })(
                                    <Input style={{ width: '90%' }} placeholder="请输入" />
                                )}
                                <Popover
                                    content={ParatemersInfo}
                                >
                                    <Icon style={{ width: '10%' }} type="question-circle" theme="twoTone" />
                                </Popover>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'主机名称'}>
                                {getFieldDecorator('HostName', {
                                    initialValue: row ? row["dbo.T_Bas_HostNameInfo.HostName"] : null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入主机名称!',
                                        },
                                    ],
                                })(
                                    <Input placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'填写方式'}>
                                {getFieldDecorator('FillInType', {
                                    initialValue: row ? row["dbo.T_Bas_HostNameInfo.FillInType"] + "" : '0',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择!',
                                        },
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio value="0">列表选择</Radio>
                                        <Radio value="1">手工录入</Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'使用状态'}>
                                {getFieldDecorator('DeleteMark', {
                                    initialValue: row ? row["dbo.T_Bas_HostNameInfo.DeleteMark"] + "" : '1',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择!',
                                        },
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio value="1">正常</Radio>
                                        <Radio value="2">禁用</Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={{ display: 'none' }} gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                            >
                                {getFieldDecorator('ID', {
                                    initialValue: row ? row["dbo.T_Bas_HostNameInfo.ID"] : null,
                                })(
                                    <Input placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div >
        );
    }
}
