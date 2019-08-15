import React, { Component } from 'react';
import { Input, Select, InputNumber, Form, Button, Upload, DatePicker, Row, Col, Radio, message } from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect(({ manualupload, loading }) => ({
    addSelectPollutantData: manualupload.addSelectPollutantData,
    reason: manualupload.reason
}))
/*
页面：编辑手工录入数据页面
*/
@connect()
@Form.create()
export default class UpdateManualUpload extends Component {
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
        const { item } = this.props;
        if (item) {
            this.pollutantChange(item.PollutantCode)
        }
    }
    //根据污染物编号获取单位
    pollutantChange = (value) => {
        const { addSelectPollutantData ,item} = this.props;
        if (value) {
            let PollutantCode = '';
            let unit = '';
            PollutantCode = value.split('--')[0]
            if (item) {
                unit=item.Unit;
            }
            else
            {
                   //测试
                   addSelectPollutantData.filter(n => n.PollutantCode == PollutantCode).map((item) => {
                    unit = item.Unit
                })
            }
            this.setState({
                unit
            })
        }

    }
    handleSubmit = (e) => {
        const { item, dispatch, form } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.onSubmitForm && this.props.onSubmitForm(values, item, pollutantCode);
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { item, addSelectPollutantData } = this.props;
        const { unit } = this.state;
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
                                label={'污染物类型'}>
                                {getFieldDecorator('pollutantType', {
                                    initialValue: addSelectPollutantData ? addSelectPollutantData[0].PollutantTypeName : null,
                                })(
                                    <Select
                                        disabled={true}
                                    >
                                        {
                                            addSelectPollutantData ? <Option key={addSelectPollutantData[0].PollutantTypeCode}>{addSelectPollutantData[0].PollutantTypeName}</Option> : null
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'污染物名称'}>
                                {getFieldDecorator('PollutantCode', {
                                    initialValue: isExists ? item.PollutantName : '',
                                    rules: [
                                        {
                                          required: true,
                                          message: '请选择污染物名称!',
                                        },
                                      ],
                                })(
                                    <Select
                                        placeholder="请选择污染物名称"
                                        onChange={this.pollutantChange}
                                        disabled={isExists}
                                    >
                                        {
                                            addSelectPollutantData !== null ? addSelectPollutantData.map(item => <Option key={item.PollutantCode + '--' + item.PollutantName}>{item.PollutantName}</Option>) : null
                                        }


                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'检测时间'}>
                                {getFieldDecorator('MonitorTime',
                                    {
                                        initialValue: isExists ? moment(item.MonitorTime === null ? Date.now() : item.MonitorTime) : '',
                                        rules: [
                                            {
                                              required: true,
                                              message: '请选择监测时间!',
                                            },
                                          ],
                                    })(
                                        <DatePicker disabled={isExists} showTime format="YYYY-MM-DD HH:mm:ss" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'浓度'}>
                                {getFieldDecorator('AvgValue', {
                                    initialValue: isExists ? item.MonitorValue.split('.')[0] + '.000' : '',
                                    rules: [
                                        {
                                          required: true,
                                          message: '请选择浓度!',
                                        },
                                      ],
                                })(

                                    <Input type="number" placeholder="请输入浓度" addonAfter={unit} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 8 }}>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 8 }}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} style={{ display: 'none' }}>
                            <FormItem
                                {...formItemLayout}
                                label={'点编号'}>
                                {getFieldDecorator('DGIMN', {
                                    initialValue: this.props.DGIMN,
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
