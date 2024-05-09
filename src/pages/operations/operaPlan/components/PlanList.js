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
    tableLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    tableDatas: operaPlan.formulateTableDatas2,
    tableTotal: operaPlan.formulateTableTotal2,
    exportLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    queryPar: operaPlan.formulateQueryPar2,
    configInfo: global.configInfo,
})

const Index = (props) => {



    const [form] = Form.useForm();



    const { type,planContentOpera,queryPar, tableDatas, tableTotal, tableLoading, exportLoading } = props;


    const [planCalendarVisible, setPlanCalendarVisible] = useState(false)


    useEffect(() => {
        onFinish(pageIndex, pageSize);

    }, []);



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
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
        },
        {
            title: '间隔',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
        },
        {
            title: '计划内容',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
        },
        {
            title: '实际起始日期',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
        },
        {
            title: '实际结束日期',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
        },
        ...planContentOpera,
    ];

    const onFinish = async (PageIndex, PageSize, queryPar) => {  //计划列表

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
    const handleTableChange = (PageIndex, PageSize) => { //分页
        setPageSize(PageSize)
        setPageIndex(PageIndex)
        onFinish(PageIndex, PageSize, queryPar2)
    }

    const exportData = () => {
        props.dispatch({
            type: `${namespace}/ExportQuestionList`,
            payload: queryPar,
        });
    };
    const del = (record) => {
        console.log(record)
    }

    const searchComponents = () => {

        const resDataHandle = () => { form.resetFields(); setPageIndex2(1); setPageSize2(20); onFinish(1, 20) }
        return <Form
            name="advanced_search"
            className={'ant-advanced-search-form'}
            form={form}
            layout='inline'
            onFinish={resDataHandle}
        >
            <Form.Item name='itemCode' label='监测点' style={{ marginBottom: 8 }}>
                <Input placeholder='请输入' allowClear />
            </Form.Item>
            <Form.Item name='itemCode' label='计划内容' style={{ marginBottom: 8 }}>
               {type==1?
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
            <Form.Item name='time' label={type==1?'计划日期' : '日期'} style={{ marginBottom: 8 }}>
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
                    {type==1&&<Button type="primary">
                        批量删除
                             </Button>}
                   {(type==1 || type==2) && <Button type="primary" onClick={()=>{
                        setPlanCalendarVisible(true)
                    }}>
                        计划日历
                    </Button>}
                    {type==2&&<Button type="primary" onClick={()=>props.extensionPlan&&props.extensionPlan()}>
                        延长计划
                     </Button>} 
                </Space>
            </Form.Item>
        </Form>
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
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