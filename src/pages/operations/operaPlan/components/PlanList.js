/**
 * 功  能：预测性维护 运维计划  生成计划列表
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
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
import PlanCalendar from '../components/PlanCalendar'

const { Option } = Select;

const namespace = 'operaPlan'



const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    tableDatas: operaPlan.operationPlanInfo,
    tableTotal: operaPlan.operationPlanInfoTotal,
    ExportOperationPlanInfo: loading.effects[`${namespace}/ExportOperationPlanInfo`],
    queryPar: operaPlan.operationPlanInfoQueryPar,
    xjPointList: operaPlan.xjPointList,
    jzPointList: operaPlan.jzPointList,
    operationPlanInfoRefreshType: operaPlan.operationPlanInfoRefreshType,
    operationPlanInfoRefreshId: operaPlan.operationPlanInfoRefreshId,
    delOperationPlanPointLoading: loading.effects[`${namespace}/DelOperationPlanPoint`],
})

const Index = (props) => {



    const [form] = Form.useForm();



    const { operationPlanInfoRefreshId,operationPlanInfoRefreshType, operationPlanPointPar, type,xjPointList,jzPointList, queryPar, tableDatas, tableTotal, exportLoading,delOperationPlanPointLoading } = props;


    const [planCalendarVisible, setPlanCalendarVisible] = useState(false)
    useEffect(() => {
           props.dispatch({type: `${namespace}/updateState`, payload: { operationPlanInfo: []} });
            onFinish(pageIndex, pageSize);
            //  if (operationPlanPointPar?.entCode && operationPlanPointPar?.pollutantType) {
            //     props.dispatch({
            //         type: `${namespace}/GetOperationPlanPointList`,
            //         payload: { entCode: entCode, pollutantType: pollutantType },
            //     });
            // }
    }, []);
    useEffect(() => {
        if (operationPlanInfoRefreshType) {
            if (operationPlanInfoRefreshType == 1) {
                onFinish(pageIndex, pageSize);
            } else {
                setPageIndex(1)
                setPageSize(20)
                onFinish(1, 20);
            }
            props.dispatch({
                type: `${namespace}/updateState`,
                payload: {operationPlanInfoRefreshType:''},
            });
        }
    }, [operationPlanInfoRefreshType]);

    const planContentOpera = type==1? [
        {
            title: '操作',
            fixed: 'right',
            width: 60,
            ellipsis: true,
            render: (text, record, index) => {
                return (
                    <Popconfirm placement='left' title="确认要删除这条运维计划点位信息吗?" onConfirm={() => { delPlan([record.ID]) }} > <a> 删除</a></Popconfirm>
                );

            }
        },
    ] : type=2?
    [
        {
            title: '操作',
            fixed: 'right',
            width: 100,
            ellipsis: true,
            render: (text, record, index) => {
                const isOpen = 1;
                return (
                    <Space>
                        <Popconfirm title="确认要开启这条计划吗?" onConfirm={() => { openPlan(record) }} disabled={!isOpen}><a className={isOpen? '':'disabled_a'}> 开启 </a></Popconfirm> 
                        <Popconfirm title="确认要停止这条计划吗?" onConfirm={() => { ceasePlan(record)}} disabled={isOpen} > <a className={isOpen? 'disabled_a' : ''}> 停止 </a></Popconfirm> 
                    </Space>
                );

            }
        },
    ]:[]


    const columns = [
        {
            title: '序号',
            align: 'center',
            ellipsis: true,
            render: (text, record, index) => {
                return (index + 1) + (pageIndex - 1) * pageSize;
            }
        },
        {
            title: '监测点名称',
            dataIndex: 'PointName',
            key: 'PointName',
            ellipsis: true,
        },
        {
            title: '间隔',
            dataIndex: 'IntervalDays',
            key: 'IntervalDays',
            ellipsis: true,
        },
        {
            title: '计划内容',
            dataIndex: 'RecordTypeName',
            key: 'RecordTypeName',
            ellipsis: true,
        },
        {
            title: '实际起始日期',
            dataIndex: 'BeginTime',
            key: 'BeginTime',
            ellipsis: true,
        },
        {
            title: '实际结束日期',
            dataIndex: 'EndTime',
            key: 'EndTime',
            ellipsis: true,
        },
        ...planContentOpera,
    ];

    
    const delPlan =  (idList) =>{
      if(idList?.[0]){
        props.dispatch({
            type: `${namespace}/DelOperationPlanPoint`,
            payload: {delIDList:idList },
            callback:()=>{
                onFinish(pageIndex, pageSize);
            }
        });
      }
    }
    const openPlan = (record) =>{

    }

    const ceasePlan = (record) =>{

    }
    const [tableLoading,setTableLoading] = useState(false)
    const onFinish = async (PageIndex, PageSize, queryPar) => {  //计划列表
      if(operationPlanInfoRefreshId){
        try {
            const values = await form.validateFields();
            const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
                ...values,
                beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
                endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
                time: undefined,
                pageIndex: PageIndex,
                pageSize: PageSize,
                id:operationPlanInfoRefreshId,
            }
            setTableLoading(true)
            props.dispatch({
                type: `${namespace}/GetOperationPlanInfo`,
                payload: {
                    ...par,
                },
                callback:()=>{
                    setTableLoading(false)
                }
            });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    }
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const handleTableChange = (PageIndex, PageSize) => { //分页
        setPageSize(PageSize)
        setPageIndex(PageIndex)
        onFinish(PageIndex, PageSize, queryPar2)
    }

    const exportData = () => {
        props.dispatch({
            type: `${namespace}/ExportOperationPlanInfo`,
            payload: queryPar,
        });
    };


    const searchComponents = () => {

        const resDataHandle = () => { form.resetFields(); setPageIndex(1); setPageSize(20); onFinish(1, 20) }
        return <Form
            name="advanced_search3"
            className={'ant-advanced-search-form'}
            form={form}
            layout='inline'
            onFinish={resDataHandle}
        >
            <Form.Item name='pointID' label='监测点' style={{ marginBottom: 8 }}>
                <Select
                    mode="multiple"
                    maxTagCount={2}
                    maxTagTextLength={6}
                    maxTagPlaceholder="..."
                    placeholder="请选择"
                    style={{ width: 200 }}
                    options={xjPointList|| jzPointList}
                />
            </Form.Item>
            <Form.Item name='recordType' label='计划内容' style={{ marginBottom: 8 }}>
                {type == 1 ?
                    <Select placeholder='请选择' allowClear style={{ width: 100 }}>
                        <Option key={1} value={1}>巡检</Option>
                        <Option key={2} value={2}>校准</Option>
                    </Select>
                    :
                    <Select placeholder='请选择' allowClear style={{ width: 100 }}>
                        <Option key={1} value={1}>巡检</Option>
                        <Option key={2} value={2}>校准</Option>
                        <Option key={3} value={3}>校验测试</Option>
                        <Option key={4} value={4}>全系统校准</Option>

                    </Select>
                }
            </Form.Item>
            <Form.Item name='time' label={type == 1 ? '计划日期' : '日期'} style={{ marginBottom: 8 }}>
                <RangePicker_ format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 4 }}>
                <Space>
                    <Button type="primary" htmlType="submit" loading={tableLoading}>
                        查询
                                 </Button>
                    <Button loading={tableLoading} onClick={resDataHandle}  >
                        重置
                                  </Button>
                    <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exportData() }}>
                        导出
                             </Button>
                    {type == 1 && 
                    <Popconfirm title="确认要批量删除运维计划点位吗?" onConfirm={() => { delPlan(delList) }} disabled={delList?.length<=0}>
                    <Button type="primary" disabled={delList?.length<=0} loading={delOperationPlanPointLoading} >
                        批量删除
                             </Button></Popconfirm>}
                    {(type == 1 || type == 2) && <Button type="primary" onClick={() => {
                        setPlanCalendarVisible(true)
                    }}>
                        计划日历
                    </Button>}
                    {type == 2 && <Button type="primary" onClick={() => props.extensionPlan && props.extensionPlan()}>
                        延长计划
                     </Button>}
                </Space>
            </Form.Item>
        </Form>
    }
    const [delList,setDelList] = useState([])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setDelList(selectedRowKeys)
        },
    };
    return (
        <div>
            {searchComponents()}
            <SdlTable
                rowSelection={type == 1 ? {
                    ...rowSelection,
                } : null}
                resizable
                loading={tableLoading || delOperationPlanPointLoading}
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
            <Modal
                visible={planCalendarVisible}
                title={'计划日历'}
                onCancel={() => { setPlanCalendarVisible(false) }}
                destroyOnClose
                wrapClassName={`spreadOverModal`}
                mask={false}
                footer={null}
            >
                <PlanCalendar type={type} />
            </Modal>
        </div>
    );
};
export default connect(dvaPropsData)(Index);