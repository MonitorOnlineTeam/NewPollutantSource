/**
 * 功  能：预测性维护 运维计划  制定运维计划
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Tabs, Input, InputNumber, Popconfirm, Skeleton, Checkbox, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio, Empty } from 'antd';
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
import { permissionButton, arrDistinctByProp } from '@/utils/utils';
import TitleComponents from '@/components/TitleComponents'
import ProjectNum from '@/components/ProjectNum'
import EntAtmoList from '@/components/EntAtmoList';
import OperationCompanyList from '@/components/OperationCompanyList'
import PlanList from '../components/PlanList'

const { Option } = Select;

const namespace = 'operaPlan'



const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    commonCol: operaPlan.commonCol,
    tableLoading: loading.effects[`${namespace}/GetOperationPlanList`] || loading.effects[`${namespace}/DeleteOperationPlan`],
    tableDatas: operaPlan.tableDatas,
    tableTotal: operaPlan.tableTotal,
    queryPar: operaPlan.queryPar,
    exportLoading: loading.effects[`${namespace}/ExportOperationPlanList`],
    updOperationPlanLoading: loading.effects[`${namespace}/UpdOperationPlan`],
    getOperationPlanPointListLoading: loading.effects[`${namespace}/GetOperationPlanPointList`],
    xjPointList: operaPlan.xjPointList,
    jzPointList: operaPlan.jzPointList,
    operationPlanInfoRefreshType: operaPlan.operationPlanInfoRefreshType,
    operationPlanInfoRefreshId: operaPlan.operationPlanInfoRefreshId,
    operationPlanInfo: operaPlan.operationPlanInfo,
})

const Index = (props) => {



    const [form] = Form.useForm();
    const [form2] = Form.useForm();






    const { commonCol, tableDatas, tableTotal, tableLoading, queryPar,updOperationPlanLoading, getOperationPlanPointListLoading, xjPointList, jzPointList, operationPlanInfoRefreshType, operationPlanInfoRefreshId, operationPlanInfo, } = props;

    const [pointType, setPointType] = useState()
    const [recordType, setRecordType] = useState()
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [formulateVisible, setFormulateVisible] = useState(false)
    const [formulateTitlt, setFormulateTitle] = useState('')
    useEffect(() => {
        initData(pageIndex, pageSize);
    }, []);

    useEffect(() => {
        if (!formulateVisible) {
            resData()
        }
    }, [formulateVisible]);
    const initData = () => {
        props.dispatch({
            type: `${namespace}/GetOperationPlanList`,
            payload: {
                planType: 1,
                pageIndex: pageIndex,
                pageSize: pageSize,
            }
        });
    }

    const columns = [

        ...commonCol(1, pageIndex, pageSize),
        {
            title: '操作',
            fixed: 'right',
            width: 140,
            ellipsis: true,
            render: (text, record, index) => {
                return (
                    <Space>
                        <a onClick={() => { editPlan(record) }}> 编辑计划</a>
                        <Popconfirm title="确认要删除这条计划吗?" onConfirm={() => { delPlan(record) }} > <a> 删除计划</a></Popconfirm>
                    </Space>
                );

            }
        },
    ];


    const [editLoading, setEditLoading] = useState(false)
    const [projectName, setProjectName] = useState()


    const editPlan = (record) => {
        setFormulateVisible(true)
        setFormulateTitle('编辑计划')
        setEditLoading(true)
        setProjectName(record.projectName)
        props.dispatch({ type: `${namespace}/updateState`, payload: { operationPlanInfoRefreshId: record.ID } });
        props.dispatch({
            type: `${namespace}/GetOperationPlanInfo`,
            payload: {
                ID: record.ID,
            },
            callback: (data) => {
                setEditLoading(false)
                if (data) {
                    form.setFieldsValue({
                        projectID: data.ProjectID, entID: data.EntID, pollutantType: data.PollutantType, operationCompany: data.OperationCompany,
                        beginTime: data.BeginTime && moment(data.BeginTime), endTime: data.EndTime && moment(data.EndTime), remark: data.Remark
                    })
                    setPointType(data.PollutantType);
                    setRecordType(data.PollutantType == 2 ? '1' : '7')
                    props.dispatch({ type: `${namespace}/updateState`, payload: { xjPointList: data.xjList, jzPointList: data.jzList } });
                   
                }
            }
        });
    }
    const delPlan = (record) => {
        props.dispatch({
            type: `${namespace}/DeleteOperationPlan`,
            payload: { id: record.ID },
            callback: () => {
                setPageIndex(1)
                setPageSize(20)
                initData(1, 20);
            }
        });
    }








    const handleTableChange = async (PageIndex, PageSize) => { //分页
        setPageSize(PageSize)
        setPageIndex(PageIndex)
        initData(pageIndex, pageSize);
    }







    const saveBasicInfo = (values) => { //保存基本信息
        console.log(values)

    }
    const [generateSubmitPlanLoading, setGenerateSubmitPlanLoading] = useState(false)
    const generateSubmitPlan = (type) => { //生成计划  提交计划

        const resDataRequest = (par, pointIdList) => {
            props.dispatch({
                type: `${namespace}/AddOperationPlan`,
                payload: par,
                callback: (isSuccess,id) => {
                    setGenerateSubmitPlanLoading(false)
                    if (isSuccess) {
                        form2.resetFields()
                        setCheckAll(false)
                        setIndeterminate(false)
                        props.dispatch({
                            type: `${namespace}/updateState`,
                            payload: { operationPlanInfoRefreshType: 1 }
                        });
                        par?.data&&getOperationPlanPointListRequest(par.data.entID, par.data.pollutantType,id)
                         // const pointList = recordType == '1' || recordType == '7' ? xjPointList : jzPointList
                        // const pointFilter = pointList.filter(obj => !pointIdList.includes(obj.PointCode));
                        // if (recordType == '1' || recordType == '7') {
                        //     props.dispatch({ type: `${namespace}/updateState`, payload: { xjPointList: pointFilter } });
                        // } else {
                        //     props.dispatch({ type: `${namespace}/updateState`, payload: { jzPointList: pointFilter } });
                        // }
                        if (type == 2) {
                            setFormulateVisible(false)
                            props.dispatch({
                                type: `${namespace}/updateState`,
                                payload: { operationPlanInfoRefreshId: '' },
                            });
                        }
                        setPageIndex(1)
                        setPageSize(20)
                        initData(1, 20);
                    }
                }
            });

        }
        form.validateFields().then((values) => {
            if (type == 1) { //生成计划
                form2.validateFields().then((values2) => {
                    setGenerateSubmitPlanLoading(true)
                    const addedPoint = operationPlanInfo?.[0]? operationPlanInfo.map(item=>({recordType:item.RecordType,intervalDays:item.IntervalDays,pointID:item.PointID,beginTime:item.BeginTime,endTime:item.EndTime})) : []
                    const addNewPoint = values2.pointID?.[0]? values2.pointID.map(item => ({ recordType: recordType, ...values2, pointID: item, beginTime: values2.beginTime && moment(values2.beginTime).format('YYYY-MM-DD 00:00:00'), endTime: values2.endTime && moment(values2.endTime).format('YYYY-MM-DD 23:59:59') })) : []
                    const par = {
                        data: { commitStatus: type, id: operationPlanInfoRefreshId, ...values, beginTime: values.beginTime && moment(values.beginTime).format('YYYY-MM-DD 00:00:00'), endTime: values.endTime && moment(values.endTime).format('YYYY-MM-DD 23:59:59') },
                        list: [...addedPoint,...addNewPoint],
                    }
                    resDataRequest(par, values2.pointID)
                }).catch((errorInfo) => {
                    console.log('Failed:', errorInfo);
                });
                
            } else {
                if (!operationPlanInfo || operationPlanInfo?.length <= 0) {
                    message.error('请先生成计划')
                    return
                }
                setGenerateSubmitPlanLoading(true)
                const par = {
                    data: { commitStatus: type, id: operationPlanInfoRefreshId, ...values, beginTime: values.beginTime && moment(values.beginTime).format('YYYY-MM-DD 00:00:00'), endTime: values.endTime && moment(values.endTime).format('YYYY-MM-DD 23:59:59') },
                    list: operationPlanInfo?.map(item => ({ id: item.ID, recordType: item.RecordType, pointID: item.PointID, intervalDays: item.IntervalDays, pointID: item.PointID, beginTime: item.BeginTime, endTime: item.EndTime })),
                }
                const pointIdList = operationPlanInfo?.map(item => item.PointID)
                resDataRequest(par, pointIdList)
            }
        }).catch((errorInfo) => {
            console.log('Failed:', errorInfo);
        });

    }


    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const checkboxChange = (valList, checkOptions) => {
        setIndeterminate(!!valList.length && valList.length < checkOptions.length);
        setCheckAll(valList.length === checkOptions.length);
    }
    const onCheckAllChange = (e, checkOptions) => {
        const allVal = checkOptions.map(item => item.PointCode)
        form2.setFieldsValue({ pointID: e.target.checked ? allVal : [] })
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };



    const getOperationPlanPointListRequest = (entCode, pollutantType,id) => {
        form2.resetFields(); setCheckAll(false); setIndeterminate(false)
        if (entCode && pollutantType) {
            props.dispatch({
                type: `${namespace}/GetOperationPlanPointList`,
                payload: { entCode: entCode, pollutantType: pollutantType,id: id || operationPlanInfoRefreshId },
            });
        } else {
            props.dispatch({
                type: `${namespace}/updateState`,
                payload: { xjPointList: [], jzPointList: [] },
            });

        }
    }


    const PlanContentComponents = () => {
        const dataList = recordType == '1' || recordType == '7' ? xjPointList : jzPointList
        return getOperationPlanPointListLoading ? <Skeleton active style={{ height: 158 }} /> :
            <>{dataList?.length ? <Form
                form={form2}
                name="advanced_search_plancontent_form"
                className={'ant-advanced-search-form'}
            >
                <Checkbox style={{ paddingLeft: 94 }} indeterminate={indeterminate} onChange={(e) => onCheckAllChange(e, dataList)} checked={checkAll}>
                    全选
                </Checkbox>
                <Form.Item className='form_label_width_94 pointItemSty' name='pointID' label='监测点' rules={[{ required: true, message: '请选择监测点！' }]} >
                    <Checkbox.Group
                        onChange={(val) => checkboxChange(val, dataList)}
                    >
                        {
                            dataList.map(itm => {
                                return <Checkbox key={itm.PointCode} value={itm.PointCode}>{itm.PointName}</Checkbox>
                            })
                        }
                    </Checkbox.Group>
                </Form.Item>
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Form.Item name='intervalDays' label='间隔（天）' rules={[{ required: true, message: '请输入间隔！' }]}>
                            <InputNumber style={{ width: '100%' }} placeholder='请输入' />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name='beginTime' label={`${pointType == 2 ? '实际' : '计划'}起始日期`} rules={[{ required: true, message: '请选择实际起始日期！' }]}>
                            <DatePicker
                                disabledDate={(current) => {
                                    if (!current) {
                                        return false;
                                    }
                                    return current < moment() ||  form2.getFieldValue('endTime') && current > form2.getFieldValue('endTime').startOf('day')

                                }}
                                style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name='endTime' label={`${pointType == 2 ? '实际' : '计划'}结束日期`} rules={[{ required: true, message: '请选择实际结束日期！' }]}>
                            <DatePicker
                                disabledDate={(current) => {
                                    if (!current) {
                                        return false;
                                    }
                                    return current < moment().add(1,'day') || form2.getFieldValue('beginTime') && current < form2.getFieldValue('beginTime').endOf('day')

                                }}
                                style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='end'>
                    <Form.Item>
                        <Button type="primary" loading={generateSubmitPlanLoading} onClick={() => generateSubmitPlan(1)}>
                            生成计划
                </Button>
                    </Form.Item>
                </Row>
            </Form>
                :
                <Empty description='暂无监测点' image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBottom: 24 }} />
            }</>
    }


    const resData = () => {
        form.resetFields();
        form2.resetFields();
        setPointType();
        setProjectName();
        setCheckAll(false);
        setIndeterminate(false);
        props.dispatch({
            type: `${namespace}/updateState`,
            payload: { xjPointList: [], jzPointList: [], operationPlanInfoRefreshType: '', operationPlanInfoRefreshId: '' },
        });
    }
    return (
        <div className={`queryCriterTitleSty ${styles.formulateOperaTaskSty}`}>
            <BreadcrumbWrapper>
                <Card title={<Button  type="primary" onClick={() => { setFormulateVisible(true); setFormulateTitle('制定计划'); }}> 制定运维计划 </Button>}>
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
                    title={formulateTitlt}
                    onCancel={() => {
                        setFormulateVisible(false);
                    }}
                    destroyOnClose
                    wrapClassName={`spreadOverModal isFooterSty ${styles.formulateModalSty}`}
                    mask={false}
                    okText='提交'
                    confirmLoading={generateSubmitPlanLoading || editLoading}
                    onOk={() => generateSubmitPlan(2)}
                >
                    <Spin spinning={editLoading}>
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
                                            onChange={(record) => {
                                                form.setFieldsValue({ projectID: record?.ID })
                                            }
                                            }
                                            projectName={projectName}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name='entID' label='污染源企业' rules={[{ required: true, message: '请选择污染源企业！' }]}>
                                        <EntAtmoList enable placeholder="请选择" style={{ width: '100%' }}
                                            onChange={(value) => {
                                                getOperationPlanPointListRequest(value, pointType)
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name='pollutantType' label='点位类型' rules={[{ required: true, message: '请选择点位类型！' }]}>
                                        <Radio.Group onChange={(e) => {
                                            const pointTypeVal = e.target.value
                                            setPointType(pointTypeVal);
                                            setRecordType(pointTypeVal == 2 ? '1' : '7')
                                            const entCode = form.getFieldValue('entID')
                                            getOperationPlanPointListRequest(entCode, pointTypeVal)
                                        }}>
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
                                        <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && form.getFieldValue('endTime') && current > form.getFieldValue('endTime').startOf('day')} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name='endTime' label='计划结束日期' rules={[{ required: true, message: '请选择计划结束日期！' }]}>
                                        <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && form.getFieldValue('beginTime') && current < form.getFieldValue('beginTime').endOf('day')} />
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item name='remark' label='备注'>
                                        <Input.TextArea placeholder='请输入' allowClear/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify='end' >
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={updOperationPlanLoading}>
                                        保存
                                </Button>
                                </Form.Item>
                            </Row>
                        </Form>
                        <TitleComponents simpleSty text='运维计划内容' />
                        {pointType ? <Tabs
                            pointType
                            type='card'
                            onChange={(key) => {
                                setRecordType(key)
                                form2.resetFields()
                                setCheckAll(false)
                                setIndeterminate(false)
                            }}
                            items={[
                                {
                                    label: `巡检 （剩下${xjPointList?.length || 0}个）`,
                                    key: pointType == 2 ? '1' : '7',
                                    children: <PlanContentComponents />,
                                },
                                {
                                    label: `${pointType == 2 ? '校准' : '标样核查及校准'}（剩下${jzPointList?.length || 0}个）`,
                                    key: pointType == 2 ? '3' : '9',
                                    children: <PlanContentComponents />,
                                },
                            ]}
                        /> :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }

                        <PlanList
                            type={1}
                            pointType={pointType}
                            recordType={recordType}
                            entCode={form.getFieldValue('entID')}
                            delPlanCallback={() => {
                                setCheckAll(false)
                                setIndeterminate(false)
                                const data = form.getFieldsValue();
                                getOperationPlanPointListRequest(data?.entID, data?.pollutantType)
                            }} />

                    </Spin>
                </Modal>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);