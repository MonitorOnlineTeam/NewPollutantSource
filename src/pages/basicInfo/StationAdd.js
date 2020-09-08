import React, { Component } from 'react';
import {
    Input, Select, InputNumber, Form, Button, Upload, DatePicker, Row, Col, message, Popover, Icon, Radio, Tabs, Divider, Card,


} from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import moment from 'moment';
import SdlForm from './SdlForm'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { handleFormData } from '@/utils/utils';
import { router } from 'umi';
const Option = Select.Option;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const ButtonGroup = Button.Group;
@connect(({ surfaceWater, loading }) => ({
    rowmodel: surfaceWater.rowmodel,
}))

// @connect()

/**
 * 功  能：添加点位信息
 * 创建人：dongxiaoyun
 * 创建时间：2020.8.17
 */
@Form.create()
export default class StationAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabKey: '1',
        };
    }
    componentWillMount() {
        const { dispatch, row } = this.props;
        dispatch({
            type: 'BaseSetting/GetMonitorPointTypeList',
            payload: {
            },
        });
    }
    //添加
    onSubmitForm = () => {
        let { form, dispatch } = this.props;
        const { configId } = this.props.match.params;
        form.validateFields((err, values) => {
            if (!err) {
                const formData = handleFormData(values);
                let pType;
                switch (configId) {
                    case "SurfaceWaterPointOperation":
                        pType = 6;
                        break;
                    case "VocStation":
                        pType = 10;
                        break;
                    case "AirStation":
                        pType = 27;
                        break;
                    default:
                        pType = formData.PollutantType;
                        break;
                }
                dispatch({
                    type: 'surfaceWater/AddPoint',
                    payload: {
                        PointName: formData.PointName,
                        DGIMN: formData.DGIMN,
                        Longitude: formData.Longitude,
                        Latitude: formData.Latitude,
                        RegionCode: formData.RegionCode,
                        UpdateDate: formData.UpdateDate,
                        Col1: formData.Col1,
                        SurfaceWaterLevel: formData.SurfaceWaterLevel,
                        PollutantType: pType,
                        callback: result => {
                            if (result.Datas === 1) {
                                dispatch({
                                    type: 'autoForm/getAutoFormData',
                                    payload: {
                                        configId,
                                    },
                                })
                                message.success("添加成功!")
                                router.push(`/basicInfo/${configId}/${configId}`)
                            }
                            else if (result.Datas === 2) {
                                message.error("添加重复,请检查编号!");
                            }
                            else {
                                message.error("添加失败!");
                            }
                        },
                    },
                });
            }
        });
    }
    //修改
    onUpdateForm = () => {
        let { form, dispatch, rowmodel } = this.props;
        const { configId } = this.props.match.params;
        form.validateFields((err, values) => {
            if (!err) {
                const formData = handleFormData(values);
                let pType;
                switch (configId) {
                    case "SurfaceWaterPointOperation":
                        pType = 6;
                        break;
                    case "VocStation":
                        pType = 10;
                        break;
                    case "AirStation":
                        pType = 27;
                        break;
                    default:
                        pType = formData.PollutantType;
                        break;
                }
                dispatch({
                    type: 'surfaceWater/UpdatePoint',
                    payload: {
                        PointCode: rowmodel['dbo.T_Bas_CommonPoint.PointCode'],
                        PointName: formData.PointName,
                        DGIMN: formData.DGIMN,
                        SurfaceWaterLevel: formData.SurfaceWaterLevel,
                        Longitude: formData.Longitude,
                        Latitude: formData.Latitude,
                        RegionCode: formData.RegionCode,
                        UpdateDate: formData.UpdateDate,
                        PollutantType: pType,
                        Col1: formData.Col1,
                        callback: result => {
                            if (result.Datas === 1) {
                                dispatch({
                                    type: 'autoForm/getAutoFormData',
                                    payload: {
                                        configId,
                                    },
                                })
                                message.success("修改成功!")
                                router.push(`/basicInfo/${configId}/${configId}`)
                            }
                            else if (result.Datas === 2) {
                                message.error("修改重复,请检查编号!");
                            }
                            else {
                                message.error("修改失败!");
                            }
                        },
                    },
                });
            }
        });
    }
    callback = (tabKey) => {
        this.setState({
            tabKey
        })
    }

    render() {
        const { configId } = this.props.match.params;
        const { rowmodel } = this.props;
        const { getFieldDecorator } = this.props.form;
        const keysParams = {
            'dbo.T_Bas_CommonPoint.PointCode': rowmodel ? rowmodel['dbo.T_Bas_CommonPoint.PointCode'] : ''
        };
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
            <BreadcrumbWrapper title={(rowmodel && rowmodel != 'null') ? '编辑信息' : '添加信息'}>
                <Card>
                    <Tabs activeKey={this.state.tabKey} onChange={this.callback}>
                        <TabPane tab="基本信息" key="1">
                            {rowmodel && rowmodel != 'null' ?
                                <SdlForm configId={configId} form={this.props.form} hideBtns isEdit keysParams={keysParams} noLoad />
                                :
                                // onSubmitForm={this.onSubmitForm}
                                <SdlForm configId={configId} form={this.props.form} hideBtns noLoad />
                            }
                            {
                                rowmodel && rowmodel != 'null' ?
                                    <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                                        <Button type="primary"
                                            onClick={this.onUpdateForm}
                                        >
                                            保存
                                            </Button>
                                        <Button style={{ marginLeft: 8 }} onClick={() => {
                                            router.push(`/basicInfo/${configId}/'${configId}'`)
                                        }}>
                                            返回
                                            </Button>
                                    </Divider> :
                                    <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>

                                        <Button type="primary"
                                            onClick={this.onSubmitForm}
                                        >
                                            保存
                                            </Button>
                                        <Button style={{ marginLeft: 8 }} onClick={() => {
                                            router.push(`/basicInfo/${configId}/${configId}`)
                                        }}>
                                            返回
                                            </Button>
                                    </Divider>
                            }
                        </TabPane>
                        <TabPane tab="运维配置" key="2">
                            <Form onSubmit={this.handleSubmit}>
                                <Row gutter={24}>
                                    <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={'项目编号'}>
                                            {getFieldDecorator('pollutantType', {
                                                 initialValue: '20200828-SDL123',
                                            })(
                                                <Select defaultValue="20200828-SDL123" style={{ width: 120 }} >
                                                    {/* <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="disabled" disabled>
                                                  Disabled
                                                </Option> */}
                                                    <Option value="20200828-SDL123">yiminghe</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={'运维负责人'}>
                                            {getFieldDecorator('pollutantTypes', {
                                                 initialValue: "董晓云-SDL3123",
                                            })(
                                                <Select defaultValue="董晓云-SDL3123" style={{ width: 120 }} >
                                                    {/* <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="disabled" disabled>
                                                  Disabled
                                                </Option> */}
                                                    <Option value="董晓云-SDL3123">yiminghe</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={'单程（小时）'}>
                                            {getFieldDecorator('MonitorTime',
                                                {
                                                    // initialValue: isExists ? moment(item.MonitorTime === null ? Date.now() : item.MonitorTime) : '',
                                                    // rules: [
                                                    //     {
                                                    //         required: true,
                                                    //         message: '请选择监测时间!',
                                                    //     },
                                                    // ],
                                                })(
                                                    <Input placeholder="请选择" />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={'半径（米）'}>
                                            {getFieldDecorator('AvgValue', {
                                                // initialValue: isExists ? item.MonitorValue.split('.')[0] + '.000' : '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '请选择浓度!',
                                                //     },
                                                // ],
                                            })(
                                                <Input placeholder="请选择" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginTop: 8 }}>
                                    <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} >
                                        <FormItem
                                            {...formItemLayout}
                                            label={'运维状态'}>
                                            {getFieldDecorator('DGIMN', {
                                                initialValue: 1,
                                            })(
                                                <Radio.Group >
                                                    <Radio value={1}>运维中</Radio>
                                                    <Radio value={2}>停止运维</Radio>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} >
                                        <FormItem
                                            {...formItemLayout}
                                            label={'巡检频次'}>
                                            {getFieldDecorator('DGIMN', {
                                                initialValue: 1,
                                            })(
                                                <Radio.Group>
                                                    <Radio value={1}>一周一次</Radio>
                                                    <Radio value={2}>一月一次</Radio>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginTop: 8 }}>
                                    <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} >
                                        <FormItem
                                            {...formItemLayout}
                                            label={'校准频次'}>
                                            {getFieldDecorator('DGIMN', {
                                                initialValue: 2,
                                            })(
                                                <Radio.Group >
                                                    <Radio value={1}>一周一次</Radio>
                                                    <Radio value={2}>一月一次</Radio>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} >
                                        <FormItem
                                            {...formItemLayout}
                                            label={'质控频次'}>
                                            {getFieldDecorator('DGIMN', {
                                                initialValue: 2,
                                            })(
                                                <Radio.Group>
                                                    <Radio value={1}>一周一次</Radio>
                                                    <Radio value={2}>一月一次</Radio>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            {<Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                                <Button type="primary"
                                    onClick={this.onUpdateForm}
                                >
                                    保存
                                            </Button>
                                <Button style={{ marginLeft: 8 }} onClick={() => {
                                    router.push(`/basicInfo/${configId}/'${configId}'`)
                                }}>
                                    返回
                                            </Button>
                            </Divider>}
                        </TabPane>
                        <TabPane tab="运维暂停" key="3">
                        </TabPane>
                        <TabPane tab="运维时段" key="4">
                        </TabPane>
                        <TabPane tab="设备管理" key="5">
                        </TabPane>
                    </Tabs>
                </Card>
            </BreadcrumbWrapper>

        );
    }
}
