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
    pollutantTypesItem: manualupload.pollutantTypesItem,
    addSelectPollutantData: manualupload.addSelectPollutantData,
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
        this.SelectHandleChange();
        const { item } = this.props;
        if (item) {
            this.pollutantChange(item.PollutantCode)
        }
    }
    //根据MN号获取绑定污染物类型
    SelectHandleChange = () => {
        this.props.dispatch({
            type: 'manualupload/addGetPollutantByPoint',
            payload: {
                DGIMN: this.props.DGIMN,
            }
        });
    }
    //根据污染物编号获取单位
    pollutantChange = (value) => {
        if (value) {
            let pollutantCode = '';
            pollutantCode = value.split('--')[0]

            //获取绑定下拉污染物
            this.props.dispatch({
                type: 'manualupload/GetUnitByPollutant',
                payload: {
                    pollutantCode
                }
            });
            this.setState({
                pollutantCode,
            })
        }

    }
    handleSubmit = (e) => {
        const { item, dispatch, form } = this.props;
        if (!item) {
            form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    dispatch({
                        type: 'manualupload/AddUploadFiles',
                        payload: {
                            pollutantCode: this.state.pollutantCode,
                            monitorTime: moment(values.monitorTime.format("YYYY-MM-DD HH:mm:ss")),
                            avgValue: values.avgValue,
                            DGIMN: values.DGIMN,
                            callback: (reason) => {
                                var flag = '';
                                switch (reason) {
                                    case 1:
                                        flag = "添加成功！";
                                        break;
                                    case 2:
                                        flag = "添加数据重复！";
                                        break;
                                    case 3:
                                        flag = "选择时间不能大于当前时间！";
                                        break;
                                    default:
                                        flag = "添加失败！";
                                        break;
                                }
                                return (reason === 1 ? message.success(flag) : message.error(flag));
                            }
                        },
                    });
                    this.props.onCancels();
                } else {
                }
            });
        }
        else {
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    dispatch({
                        type: 'manualupload/UpdateManualSupplementData',
                        payload: {
                            pollutantCode: this.state.pollutantCode,
                            monitorTime: values.monitorTime.format('YYYY-MM-DD HH:mm:ss'),
                            avgValue: values.avgValue,
                            DGIMN: values.DGIMN,
                            callback: (reason) => {
                                var flag = '';
                                switch (reason) {
                                    case 1:
                                        flag = "修改成功！";
                                        break;
                                    default:
                                        flag = "修改失败！";
                                        break;
                                }
                                return (reason === 1 ? message.success(flag) : message.error(flag));
                            }
                        },
                    });
                    this.props.onCancels();
                } else {
                }
            });
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { item, pollutantTypesItem, unit, addSelectPollutantData } = this.props;
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
                                label={'污染物种类'}>
                                {getFieldDecorator('pollutantType', {
                                    initialValue: pollutantTypesItem ? pollutantTypesItem.PollutantTypeName : null
                                })(
                                    <Select
                                        disabled={true}
                                    >
                                        {
                                            pollutantTypesItem ? <Option key={pollutantTypesItem.PollutantTypeCode}>{pollutantTypesItem.PollutantTypeName}</Option> : null
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'污染物名称'}>
                                {getFieldDecorator('pollutantCode', {
                                    initialValue: isExists ? item.PollutantName : ''
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
                                {getFieldDecorator('monitorTime',
                                    {
                                        initialValue: isExists ? moment(item.MonitorTime === null ? Date.now() : item.MonitorTime) : '',
                                    })(
                                        <DatePicker disabled={isExists} showTime format="YYYY-MM-DD HH:mm:ss" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'浓度'}>
                                {getFieldDecorator('avgValue', {
                                    initialValue: isExists ? item.MonitorValue.split('.')[0] + '.000' : ''
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
