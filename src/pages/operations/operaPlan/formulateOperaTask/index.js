/**
 * 功  能：预测性维护 运维计划  制定运维计划
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Tabs, Input, InputNumber, Popconfirm,Checkbox, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
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

const { Option } = Select;

const namespace = 'operaPlan'




const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    commonCol: operaPlan.commonCol,
    tableLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    tableDatas: operaPlan.tableDatas,
    tableTotal: operaPlan.tableTotal,
    queryPar: operaPlan.queryPar,
    exportLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    configInfo: global.configInfo,
})

const Index = (props) => {



    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();






    const { commonCol, queryPar, tableDatas, tableTotal, tableLoading, exportLoading } = props;





    useEffect(() => {
        onFinish(pageIndex, pageSize);

    }, []);

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
                        <a onClick={() => { detail(record) }}> 编辑计划</a>
                        <Popconfirm title="确认要删除这条计划吗?" onConfirm={() => { }} > <a onClick={() => { detail(record) }}> 删除计划</a></Popconfirm>
                    </Space>
                );

            }
        },
    ];



    const [detailVisible, setDetailVisible] = useState(false)
    const [detailData, setDetailData] = useState({})

    const detail = (record) => {
        setDetailVisible(true)
        setDetailData(record)
    }
    const exportData = () => {
        props.dispatch({
            type: `${namespace}/ExportQuestionList`,
            payload: queryPar,
        });
    };
    const [formulateVisible, setFormulateVisible] = useState(false)

    const onFinish = async (PageIndex, PageSize, queryPar) => {  //查询

        try {
            const values = await form.validateFields();
            const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
                ...values,
                beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
                endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
                time: undefined,
                pageIndex: PageIndex,
                pageSize: PageSize,
            }
            props.dispatch({
                type: `${namespace}/GetQuestionList`,
                payload: {
                    ...par,
                },

            });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const handleTableChange = async (PageIndex, PageSize) => { //分页
        setPageSize(PageSize)
        setPageIndex(PageIndex)
        onFinish(PageIndex, PageSize, queryPar)
    }


    const saveBasicInfo = (values) => {
        console.log(values)

    }
    const generatePlan = (values) => {  //生成计划
        console.log(values)

    }
    const options = [
        {  label: '1#机组废气入口',value: 'Apple',},  {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',},
        {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口嗯嗯',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',},
        {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口额问问',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',},
        {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入柔柔弱弱口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',},
        {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',}, {  label: '1#机组废气入口',value: 'Apple',},
      ];
    const PlanContentComponents = () => {
        return <Form
            form={form3}
            name="advanced_search_form3"
            className={'ant-advanced-search-form'}
            onFinish={generatePlan}
        >
            <Form.Item  className='form_label_width_94 pointItemSty' name='num2'  label='监测点' rules={[{ required: true, message: '请选择监测点！' }]} >
                <Checkbox.Group
                    options={options}
                />
            </Form.Item>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Form.Item  name='num' label='间隔（天）' rules={[{ required: true, message: '请输入间隔！' }]}>
                        <InputNumber style={{ width: '100%' }} placeholder='请输入' />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='time2' label='实际起始日期' rules={[{ required: true, message: '请选择实际起始日期！' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='time2' label='实际结束日期' rules={[{ required: true, message: '请选择实际结束日期！' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify='end'>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={tableLoading}>
                        生成计划
                </Button>
                </Form.Item>
            </Row>
        </Form>
    }
    // const searchComponents = () => {
    //     return <Form
    //         name="advanced_search"
    //         className={'ant-advanced-search-form'}
    //     >
    //         <Row align='middle'>
    //             <Col span={8}>
    //                 <Form.Item name='itemCode' label='点位类型'>
    //                     <Radio.Group>
    //                         <Radio value={''}>全部</Radio>
    //                         <Radio value={1}>废气</Radio>
    //                         <Radio value={2}>废水</Radio>
    //                     </Radio.Group>
    //                 </Form.Item>
    //             </Col>
    //             <Col span={8}>
    //                 <Form.Item name='time' label='计划起止日期'>
    //                     <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
    //                 </Form.Item>
    //             </Col>
    //             <Col span={8} >
    //                 <Form.Item>
    //                     <Space>
    //                         <Button type="primary" htmlType="submit" loading={tableLoading}>
    //                             查询
    //                              </Button>
    //                         <Button loading={tableLoading} onClick={() => { form.resetFields(); resetData() }}  >
    //                             重置
    //                               </Button>
    //                         <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exportData() }}>
    //                             导出
    //                          </Button>
    //                     </Space>
    //                 </Form.Item>

    //             </Col>
    //         </Row>
    //     </Form>
    // }

    return (
        <div className={`queryCriterTitleSty ${styles.formulateOperaTaskSty}`}>
            <BreadcrumbWrapper>
                <Card title={<Button type="primary" onClick={() => { setFormulateVisible(true); form2.resetFields(); }} loading={tableLoading}> 制定运维计划 </Button>}>
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
                    footer={null}
                >
                    <Form
                        form={form2}
                        name="advanced_search_formulate"
                        className={'ant-advanced-search-form'}
                        onFinish={saveBasicInfo}
                    >
                        <TitleComponents simpleSty text='基本信息' />
                        <Row align='middle' justify='space-between'>
                            <Col span={12}>
                                <Form.Item name='projectCode' label='项目编号' rules={[{ required: true, message: '请选择项目编号！' }]}>

                                    <ProjectNum
                                        onChange={(value) => {
                                            form.setFieldValue({ projectCode: value })
                                        }
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='entCode' label='污染源企业' rules={[{ required: true, message: '请选择污染源企业！' }]}>
                                    <EntAtmoList style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='pointType' label='点位类型' rules={[{ required: true, message: '请选择点位类型！' }]}>
                                    <Radio.Group>
                                        <Radio value={1}>废气</Radio>
                                        <Radio value={2}>废水</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='operationCompany' label='运维单位' className='form_label_width_97' rules={[{ required: true, message: '请选择运维单位！' }]}>
                                    <OperationCompanyList />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='time' label='计划起始日期' rules={[{ required: true, message: '请选择计划起始日期！' }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='time2' label='计划结束日期' rules={[{ required: true, message: '请选择计划结束日期！' }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={24} >
                                <Form.Item label='备注'>
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
                        items={[
                            {
                                label: `巡检（剩下${10}个）`,
                                key: '1',
                                children: <PlanContentComponents />,
                            },
                            {
                                label: `校准（剩下${10}个）`,
                                key: '2',
                                children: <PlanContentComponents />,
                            },
                        ]}
                    />
                </Modal>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);