import React, { Component } from 'react';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Input,
    Select,
    InputNumber,
    Button,
    Upload,
    DatePicker,
    Row,
    Col,
    Radio,
    message,
    Popover,
} from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect(({ SparepartManage, loading }) => ({
    sparePartsStationList: SparepartManage.sparePartsStationList,
    storehouseList:SparepartManage.storehouseList,
    monitoringTypeList:SparepartManage.monitoringTypeList

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
        const { dispatch, item } = this.props;
        dispatch({
            type: 'SparepartManage/GetSparePartsStation',
            payload: {
            }
        });
        dispatch({
            type: 'SparepartManage/GetMonitoringTypeList',
            payload: {
            }
        });
        
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { item, sparePartsStationList,storehouseList,monitoringTypeList } = this.props;
        let isExists = false;
        if (item.ID) {
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
        const DepartInfo = (
            <div>
                <p>如果备品备件没有编码，则按以下规则定义编码，格式：B+年+</p>
                <p>月+日+001（累计排序），如：B20200601001、B20200601002</p>
            </div>
        );
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={24} align='middle'>
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
                                    <Input style={{ width: '100%' }} placeholder="请输入" />

                                )}
                                <Popover
                                    content={DepartInfo}
                                >
                                    <QuestionCircleTwoTone style={{ width: '10%',position:'absolute',top:0 }} />
                                </Popover>
                            </FormItem>
                        </Col>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'备品备件名称'}>
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
                    </Row>
                    <Row gutter={24}>
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'备品备件型号'}>
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
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'库存数量'}>
                                {getFieldDecorator('Quantity', {
                                    initialValue: isExists ? item.Quantity : null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择数量!',
                                        },
                                    ],
                                })(
                                    <InputNumber style={{width:'100%'}} min={0}  placeholder='请输入'/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
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
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'状态'}>
                                {getFieldDecorator('IsUsed', {
                                    initialValue: isExists ? item.IsUsed : 1,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择状态!',
                                        },
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio key={1} value={1}>启用</Radio>
                                        <Radio key={0} value={0}>禁用</Radio>
                                    </Radio.Group>
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
                                    >
                                        {/* <Option key='1'>废水</Option>
                                        <Option key='2'>废气</Option>
                                        <Option key='5'>环境质量</Option> */}
                                      {
                                      monitoringTypeList[0]&&monitoringTypeList.map(item => {
                                       return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                                          })
                                           }  
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {/* <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
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
                        </Col> */}
                        <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                            <FormItem
                                {...formItemLayout}
                                label={'仓库名称'}>
                                {getFieldDecorator('SparePartsStationCode', {
                                    initialValue: isExists ? item.SparePartsStationCode : undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择仓库名称!',
                                        },
                                    ],
                                })(
                                    <Select
                                        placeholder="请选择"
                                        allowClear
                                    >
                                         {
                                            storehouseList[0]&&storehouseList.map(item => <Option key={item.ID} value={item.ID}>{item.StorehouseName}</Option>)
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
