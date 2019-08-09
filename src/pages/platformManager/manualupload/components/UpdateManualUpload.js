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
    PollutantTypesList: manualupload.PollutantTypesList,
    addselectdata: manualupload.addselectdata,
    unit: manualupload.unit,
    requstresult: manualupload.requstresult,
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
        this.props.onRef(this);
        this.GetAllPollutantTypes();
        this.SelectHandleChange();
    }
    GetAllPollutantTypes = () => {
        this.props.dispatch({
            type: 'manualupload/GetAllPollutantTypes',
            payload: {
                DGIMN: this.props.item.DGIMN,
            },
        });
    }
    //污染物类型改变事件
    SelectHandleChange = () => {
        //获取绑定下拉污染物
        this.props.dispatch({
            type: 'manualupload/addGetPollutantByPoint',
            payload: {
                DGIMN: this.props.item.DGIMN,
            }
        });
    }
    //根据污染物编号获取单位
    pollutantChange = (value) => {
        //获取绑定下拉污染物
        this.props.dispatch({
            type: 'manualupload/GetUnitByPollutant',
            payload: {
                pollutantCode: value
            }
        });
    }
    handleSubmitupdate = (e) => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && flag === true) {
                this.props.dispatch({
                    type: 'manualupload/UpdateManualSupplementData',
                    payload: {
                        pollutantCode: values.pollutantCode,
                        monitorTime: values.monitorTime.format('YYYY-MM-DD HH:mm:ss'),
                        avgValue: values.avgValue,
                        DGIMN: values.DGIMN,
                        callback: (reason) => {
                            message.success(reason)
                        }
                    },
                });
                this.props.onCancels();
            } else {
            }
        });
    }
    render() {
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
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'污染物种类'}>
                                {getFieldDecorator('pollutantType', {
                                    initialValue: this.props.PollutantTypesList.length !== 0 ? this.props.PollutantTypesList[0].PollutantTypeName : null
                                })(
                                    <Select
                                        disabled={true}
                                        value={2}
                                        placeholder="请选择污染物种类"
                                    >
                                        {this.props.PollutantTypesList.length !== 0 ? this.props.PollutantTypesList.map(item => <Option key={item.PollutantTypeCode}>{item.PollutantTypeName}</Option>) : null}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'污染物名称'}>
                                {getFieldDecorator('pollutantCode', {
                                    initialValue: this.props.item.PollutantCode
                                })(
                                    <Select
                                        placeholder="请选择污染物名称"
                                        onChange={this.pollutantChange}
                                        disabled={true}
                                    >
                                      <Option key={this.props.item.PollutantCode}>{this.props.item.PollutantName}</Option>
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
                                {getFieldDecorator('monitorTime',
                                    {
                                        initialValue: moment(this.props.item.MonitorTime === null ? Date.now() : this.props.item.MonitorTime),
                                    })(
                                        <DatePicker disabled={true} showTime format="YYYY-MM-DD HH:mm:ss" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'浓度'}>
                                {getFieldDecorator('avgValue', {
                                    initialValue: this.props.item.MonitorValue.split('.')[0] + '.000'
                                })(

                                    <Input placeholder="请输入浓度" onkeyup="value=value.replace(/[^\-?\d.]/g,'')" addonAfter={this.props.unit} />
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
                                    initialValue: this.props.item.DGIMN,
                                })(
                                    <Input placeholder="" value={1} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div >
        );
    }
}
