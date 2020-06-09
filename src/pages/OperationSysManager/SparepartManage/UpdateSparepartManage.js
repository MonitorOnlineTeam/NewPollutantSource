import React, { Component } from 'react';
import { Input, Select, InputNumber, Form, Button, Upload, DatePicker, Row, Col, Radio, message } from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect(({ SparepartManage, loading }) => ({
    sparePartsStationList: SparepartManage.sparePartsStationList,
}))

@connect()

/**
 * 功  能：备品备件弹出层（添加与编辑）
 * 创建人：dongxiaoyun
 * 创建时间：2020-5-22
 */

export default class UpdateSparepartManage extends Component {
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
        const { dispatch,item } = this.props;
        dispatch({
            type: 'SparepartManage/GetSparePartsStation',
            payload: {
            }
        });

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { item, sparePartsStationList } = this.props;
        let isExists = false;
        if (item) {
            //有值是修改,状态改为true
            isExists = true;
        }
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
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'备件名称'}>
                                {getFieldDecorator('PartName', {
                                    initialValue: isExists ? item.PartName : null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入备件名称!',
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
                                label={'备件型号'}>
                                {getFieldDecorator('Code', {
                                    initialValue: isExists ? item.Code : null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入设备型号!',
                                        },
                                    ],
                                })(

                                    <Input placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'编码'}>
                                {getFieldDecorator('PartCode', {
                                    initialValue: isExists ? item.PartCode : null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入编码!',
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
                                label={'单位'}>
                                {getFieldDecorator('Unit', {
                                    initialValue: isExists ? item.Unit : null,
                                })(

                                    <Input placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'设备类型'}>
                                {getFieldDecorator('EquipmentType', {
                                    initialValue: isExists ? item.EquipmentType : null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择设备类型!',
                                        },
                                    ],
                                })(

                                    <Select
                                        placeholder="请选择"
                                    // onChange={this.pollutantChange}
                                    >
                                        <Option key='1'>废水</Option>
                                        <Option key='2'>废气</Option>
                                        <Option key='10'>VOC</Option>
                                        <Option key='12'>扬尘</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'状态'}>
                                {getFieldDecorator('IsUsed', {
                                    initialValue: isExists ? item.IsUsed : null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择状态!',
                                        },
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio value={0}>禁用</Radio>
                                        <Radio value={1}>启用</Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'数量'}>
                                {getFieldDecorator('Quantity', {
                                    initialValue: isExists ? item.Quantity : null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择数量!',
                                        },
                                    ],
                                })(
                                    <InputNumber min={0} />
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'服务站'}>
                                {getFieldDecorator('SparePartsStationCode', {
                                    initialValue: isExists ? item.SparePartsStationCode : '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择服务站!',
                                        },
                                    ],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        // onChange={this.pollutantChange}
                                    >
                                        {
                                            sparePartsStationList.length !== 0 ? sparePartsStationList.map(item => <Option key={item.SparePartsStationCode}>{item.Name}</Option>) : null
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: 8 }}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} style={{ display: 'none' }}>
                            <FormItem
                                {...formItemLayout}
                                label={'主键'}>
                                {getFieldDecorator('ID', {
                                    initialValue: isExists ? item.ID : null,
                                })(
                                    <Input placeholder="" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div >
        );
    }
}
