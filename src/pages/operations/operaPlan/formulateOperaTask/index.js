/**
 * 功  能：预测性维护 运维计划  制定运维计划
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Tabs, Input, InputNumber, Popconfirm, Checkbox, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "../styles.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import CheckPhoto from '@/components/CheckPhoto';
import { permissionButton } from '@/utils/utils';
import TitleComponents from '@/components/TitleComponents'
import ProjectNum from '@/components/ProjectNum'
import EntAtmoList from '@/components/EntAtmoList';
import OperationCompanyList from '@/components/OperationCompanyList'
import PlanList from '../components/PlanList'

import { init } from 'echarts';

const { Option } = Select;

const namespace = 'operaPlan'



const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    commonCol: operaPlan.commonCol,
    tableLoading: loading.effects[`${namespace}/GetOperationPlanList`],
    tableDatas: operaPlan.tableDatas,
    tableTotal: operaPlan.tableTotal,
    queryPar: operaPlan.queryPar,
    exportLoading: loading.effects[`${namespace}/ExportOperationPlanList`],
})

const Index = (props) => {



    const [form] = Form.useForm();
    const [form2] = Form.useForm();






    const { commonCol, tableDatas, tableTotal, tableLoading, queryPar, exportLoading, } = props;

   const [pointType,setPointType] = useState('2')


    useEffect(() => {
        initData(pageIndex, pageSize);

    }, []);

    const initData = () => {
        props.dispatch({
            type: `${namespace}/GetOperationPlanList`,
            payload: {
                planType:1,
                pageIndex: pageIndex,
                pageSize: pageSize,
            }
        });
    }

    const columns = [

        ...commonCol(1),
        {
            title: '操作',
            fixed: 'right',
            width: 140,
            ellipsis: true,
            render: (text, record, index) => {
                return (
                    <Space>
                        <a onClick={() => { editPlan(record) }}> 编辑计划</a>
                        <Popconfirm title="确认要删除这条计划吗?" onConfirm={() => { }} > <a onClick={() => { delPlan(record) }}> 删除计划</a></Popconfirm>
                    </Space>
                );

            }
        },
    ];




    const editPlan = (record) => {
        setFormulateVisible(true)
        // form.setFieldValue({...record})
    }
    const delPlan = () =>{
        props.dispatch({
            type: `${namespace}/ExportQuestionList`,
            payload: queryPar,
        });
    }

    const [formulateVisible, setFormulateVisible] = useState(false)





    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const handleTableChange = async (PageIndex, PageSize) => { //分页
        setPageSize(PageSize)
        setPageIndex(PageIndex)
        onFinish(PageIndex, PageSize, queryPar)
    }





    const saveBasicInfo = (values) => { //保存基本信息
        console.log(values)

    }
    const [generatePlanLoading,setGeneratePlanLoading] = useState(false)
    const generatePlan = () =>{ //生成计划
        form.validateFields().then((values)=>{
            form2.validateFields().then((values2)=>{
                setGeneratePlanLoading(true)
                const par = {
                    data:{...values},
                    list:[{...values2}],
                }
                props.dispatch({
                    type: `${namespace}/AddOperationPlan`,
                    payload: par,
                    callback:()=>{
                        setGeneratePlanLoading(true)
                    }
                });
              }).catch((errorInfo) => {
                    console.log('Failed:', errorInfo);
                });
            }).catch((errorInfo) => {
                console.log('Failed:', errorInfo);
            });
    }
    const formulatePlanSubmit = ()=>{ //制定计划 提交
        form.validateFields().then((values)=>{
            form2.validateFields().then((values2)=>{



            
              }).catch((errorInfo) => {
                    console.log('Failed:', errorInfo);
                    message.error('请填写')
                });
            }).catch((errorInfo) => {
                console.log('Failed:', errorInfo);
            });
    }
    const checkOptions = [
        { label: '1#机组废气入口', value: 'Apple', }, { label: '1#机组废气入口', value: 'Apple232313', }, { label: '1#机组废气入口', value: 'Apple75', },
        { label: '1#机组废气入口', value: 'Apple13242', }, { label: '1#机组废气入口', value: 'Apple3', }, { label: '1#机组废气入口嗯嗯', value: 'Apple63236', }, { label: '1#机组废气入口', value: 'Apple5633', }, { label: '1#机组废气入口', value: 'Apple75533', },
        { label: '1#机组废气入口', value: 'Apple23424', }, { label: '1#机组废气入口', value: 'Apple4', }, { label: '1#机组废气入口额问问', value: 'Apple3277', }, { label: '1#机组废气入口', value: 'Apple34567', }, { label: '1#机组废气入口', value: 'Apple7635', },
        { label: '1#机组废气入口', value: 'Apple656', }, { label: '1#机组废气入口', value: 'Apple5565', }, { label: '1#机组废气入口', value: 'Apple883232', }, { label: '1#机组废气入柔柔弱弱口', value: 'Apple23777', }, { label: '1#机组废气入口', value: 'Apple53376', }, { label: '1#机组废气入口', value: 'Apple733366', },
        { label: '1#机组废气入口', value: 'Apple6666', }, { label: '1#机组废气入口', value: 'Apple6', }, { label: '1#机组废气入口', value: 'Apple32356', }, { label: '1#机组废气入口', value: 'Apple77238', },
    ];
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const checkboxChange = (list) => {
        setIndeterminate(!!list.length && list.length < checkOptions.length);
        setCheckAll(list.length === checkOptions.length);
    }
    const onCheckAllChange = (e) => {
        const allVal = checkOptions.map(item=>item.value)
        form2.setFieldsValue({point:e.target.checked ? allVal : []})
        setIndeterminate(false);
        setCheckAll(e.target.checked);
      };
      const startDisabledDate = (current) => {
        const time = form.getFieldValue('EndTime')
        return time && current && current > moment(time).startOf('day');
      }
      const endDisabledDate = (current) => {
        const time = form.getFieldValue('BeginTime')
        return time && current && current < moment(time).endOf('day');
      }
    
    const PlanContentComponents = () => {
        return <Form
            form={form2}
            name="advanced_search_plancontent_form"
            className={'ant-advanced-search-form'}
        >
              <Checkbox style={{paddingLeft:94}} indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                   全选
                </Checkbox> 
            <Form.Item className='form_label_width_94 pointItemSty' name='pointID' label='监测点' rules={[{ required: true, message: '请选择监测点！' }]} >
                <Checkbox.Group
                    options={checkOptions}
                    onChange={checkboxChange}
                />
            </Form.Item>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Form.Item name='intervalDays' label='间隔（天）' rules={[{ required: true, message: '请输入间隔！' }]}>
                        <InputNumber style={{ width: '100%' }} placeholder='请输入' />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='beginTime' label={`${pointType==2?'实际':'计划'}起始日期`} rules={[{ required: true, message: '请选择实际起始日期！' }]}>
                        <DatePicker disabledDate={startDisabledDate} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='endTime'  label={`${pointType==2?'实际':'计划'}结束日期`} rules={[{ required: true, message: '请选择实际结束日期！' }]}>
                        <DatePicker disabledDate={endDisabledDate} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify='end'>
                <Form.Item>
                    <Button type="primary" loading={generatePlanLoading} onClick={generatePlan}>
                        生成计划
                </Button>
                </Form.Item>
            </Row>
        </Form>
    }


    const planContentOpera = [
        {
            title: '操作',
            fixed: 'right',
            width: 60,
            ellipsis: true,
            render: (text, record, index) => {
                return (
                        <Popconfirm title="确认要删除这条信息吗?" onConfirm={() => { del(record) }} > <a> 删除</a></Popconfirm>
                );

            }
        },
    ]

    return (
        <div className={`queryCriterTitleSty ${styles.formulateOperaTaskSty}`}>
            <BreadcrumbWrapper>
                <Card title={<Button type="primary" onClick={() => { setFormulateVisible(true); form.resetFields(); }} loading={tableLoading}> 制定运维计划 </Button>}>
                    <SdlTable
                        resizable
                        loading={tableLoading}
                        bordered
                        dataSource={tableDatas}
                        columns={columns}
                        align='center'
                        pagination={{
                            total: tableTotal,
                            pageSize: pageSize,
                            current: pageIndex,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            onChange: handleTableChange,
                        }}
                    />
                </Card>
                <Modal
                    visible={formulateVisible}
                    title={'制定计划'}
                    onCancel={() => { setFormulateVisible(false) }}
                    destroyOnClose
                    wrapClassName={`spreadOverModal ${styles.formulateModalSty}`}
                    mask={false}
                    okText='提交'
                    onOk={formulatePlanSubmit}
                >
                    <Form
                        form={form}
                        name="advanced_search_formulate"
                        className={'ant-advanced-search-form'}
                        onFinish={saveBasicInfo}
                        labelCol={{ flex: '108px' }}
                    >
                        <TitleComponents simpleSty text='基本信息' />
                        <Row align='middle' justify='space-between'>
                            <Col span={12}>
                                <Form.Item name='projectID' label='项目编号' rules={[{ required: true, message: '请选择项目编号！' }]}>

                                    <ProjectNum
                                        onChange={(value) => {
                                            form.setFieldsValue({ projectID: value })
                                        }
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='entID' label='污染源企业' rules={[{ required: true, message: '请选择污染源企业！' }]}>
                                    <EntAtmoList style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='pollutantType' label='点位类型' rules={[{ required: true, message: '请选择点位类型！' }]}>
                                    <Radio.Group onChange={(e)=>{setPointType(e.target.value)}}>
                                        <Radio value={'2'}>废气</Radio>
                                        <Radio value={'1'}>废水</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='operationCompany' label='运维单位' className='form_label_width_97' rules={[{ required: true, message: '请选择运维单位！' }]}>
                                    <OperationCompanyList />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='beginTime' label='计划起始日期' rules={[{ required: true, message: '请选择计划起始日期！' }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='endTime' label='计划结束日期' rules={[{ required: true, message: '请选择计划结束日期！' }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={24} >
                                <Form.Item name='remark' label='备注'>
                                    <Input.TextArea placeholder='请输入' />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row justify='end' >
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={tableLoading}>
                                    保存
                                </Button>
                            </Form.Item>
                        </Row>
                    </Form>
                    <TitleComponents simpleSty text='运维计划内容' />
                    <Tabs
                        defaultActiveKey="1"
                        type='card'
                        items={[
                            {
                                label: `巡检（剩下${10}个）`,
                                key: '1',
                                children: <PlanContentComponents />,
                            },
                            {
                                label: `${pointType==2? '校准' : '标样核查及校准'}（剩下${10}个）`,
                                key: '2',
                                children: <PlanContentComponents />,
                            },
                        ]}
                    />
                    <PlanList type={1} planContentOpera={planContentOpera}/>


                </Modal>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);