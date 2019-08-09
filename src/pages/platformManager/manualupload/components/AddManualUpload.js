import React, { Component } from 'react';
import { Input, Select, InputNumber, Form, Button, Upload, DatePicker, Row, Col, Radio, message } from 'antd';
import { connect } from 'dva';
import RangePicker_ from '../../components/PointDetail/RangePicker_';
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
页面：添加手工录入数据页面
*/
@connect()
@Form.create()
export default class AddManualUpload extends Component {
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
             //获取绑定下拉污染物
             this.props.dispatch({
                type: 'manualupload/GetUnitByPollutant',
                payload: {
                    pollutantCode: ""
                }
            });
    }
    GetAllPollutantTypes = () => {
        this.props.dispatch({
            type: 'manualupload/GetAllPollutantTypes',
            payload: {
                DGIMN: this.props.dgimn,
            },
        });
    }
    //污染物类型改变事件
    SelectHandleChange = () => {
        //获取绑定下拉污染物
        this.props.dispatch({
            type: 'manualupload/addGetPollutantByPoint',
            payload: {
                DGIMN: this.props.dgimn,
            }
        });
    }
    //根据污染物编号获取单位
    pollutantChange = (value) => {
        var pCode=value.split('--')
        //获取绑定下拉污染物
        this.props.dispatch({
            type: 'manualupload/GetUnitByPollutant',
            payload: {
                pollutantCode: pCode[0]
            }
        });
    }
    handleSubmit = (e) => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && flag === true) {
                this.props.dispatch({
                    type: 'manualupload/AddUploadFiles',
                    payload: {
                        pollutantCode: values.pollutantCode.split('--')[0],
                        monitorTime: moment(values.monitorTime.format("YYYY-MM-DD HH:mm:ss")),
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
    handleFocus = () => {
        console.log('focus');
    }
    handleBlur = () => {
        console.log('blur');
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
                                       rules: [{
                                        required: true,
                                        message: '请选择污染物名称',
                                    }],
                                })(
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="请选择污染物名称"
                                        optionFilterProp="children"
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        onChange={this.pollutantChange}
                                    >
                                        {this.props.addselectdata !== null ? this.props.addselectdata.map(item => <Option key={item.PollutantCode + '--' + item.PollutantName}>{item.PollutantName}</Option>) : null}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'监测时间'}>
                                {getFieldDecorator('monitorTime', {
                                       rules: [{
                                        required: true,
                                        message: '请输入监测时间',
                                    }],
                                })(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'浓度'}>
                                {getFieldDecorator('avgValue', {
                                    rules: [{
                                        required: true,
                                        message: '请输入浓度',
                                    }],
                                })(

                                    <Input type="number" style={{ width: 200 }} placeholder="请输入浓度" addonAfter={this.props.unit} />


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
                                    initialValue: this.props.dgimn,

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
