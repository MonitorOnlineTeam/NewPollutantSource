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
import { permissionButton, } from '@/utils/utils';
import PlanCalendar from '../components/PlanCalendar'

const { Option } = Select;

const namespace = 'operaPlan'



const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    tableDatas: operaPlan.operationPlanInfo,
    tableTotal: operaPlan.operationPlanInfoTotal,
    exportLoading: loading.effects[`${namespace}/ExportOperationPlanInfo`],
    queryPar: operaPlan.operationPlanInfoQueryPar,
    xjPointList: operaPlan.xjPointList,
    jzPointList: operaPlan.jzPointList,
    operationPlanInfoRefreshType: operaPlan.operationPlanInfoRefreshType,
    operationPlanInfoRefreshId: operaPlan.operationPlanInfoRefreshId,
    delOperationPlanPointLoading: loading.effects[`${namespace}/DelOperationPlanPoint`],
    pointLoading: loading.effects[`common/getPointByEntCode`],
    updOperationPlanPointLoading: loading.effects[`${namespace}/UpdOperationPlanPoint`],
})

const Index = (props) => {



    const [form] = Form.useForm();



    const { entCode, pointLoading, operationPlanInfoRefreshId, operationPlanInfoRefreshType, operationPlanPointPar, type, pointType, xjPointList, jzPointList, queryPar, tableDatas, tableTotal, exportLoading, delOperationPlanPointLoading, updOperationPlanPointLoading } = props;
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)

    const [planCalendarVisible, setPlanCalendarVisible] = useState(false)

    const [pointList, setPointList] = useState([])
    useEffect(() => {
        return () => {
            // 执行清理工作，比如取消订阅或清除定时器
            // 这个清理函数会在组件卸载时自动执行
            props.dispatch({ type: `${namespace}/updateState`, payload: { operationPlanInfo: [], operationPlanInfoTotal: 0 } });
        };
    }, []);
    useEffect(() => {
        props.pointList && setPointList(props.pointList)
    }, [props.pointList]);
    useEffect(() => {
        entCode && props.dispatch({    //获取排口
            type: 'common/getPointByEntCode',
            payload: { EntCode: entCode },
            callback: (res) => {
                setPointList(res)
            }
        });
    }, [entCode]);
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
                payload: { operationPlanInfoRefreshType: '' },
            });
        }
    }, [operationPlanInfoRefreshType]);

    const planContentOpera = type == 1 ? [
        {
            title: '操作',
            fixed: 'right',
            width: 60,
            ellipsis: true,
            render: (text, record, index) => {
                return (
                    <Popconfirm placement='left' title="确认要删除这条运维计划点位信息吗?" onConfirm={() => { delPlan([record.ID]) }} >
                        <a
                        //  onClick={() => { setSelectedRows([record]); }}
                        > 删除
                        </a>
                    </Popconfirm>
                );
            }
        },
    ] : type == 2 ?
            [
                {
                    title: '操作',
                    fixed: 'right',
                    width: 100,
                    ellipsis: true,
                    render: (text, record, index) => {
                        const isOpen = record.Status == 2;
                        return (
                            <Space>
                                <Popconfirm title="确认要开启这条计划吗?" onConfirm={() => { startCeasePlan(record, 1) }} disabled={!isOpen}><a className={isOpen ? '' : 'disabled_a'}> 开启 </a></Popconfirm>
                                <Popconfirm title="确认要停止这条计划吗?" onConfirm={() => { startCeasePlan(record, 2) }} disabled={isOpen} > <a className={isOpen ? 'disabled_a' : ''}> 停止 </a></Popconfirm>
                            </Space>
                        );

                    }
                },
            ] : []


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
            width: 'auto',
        },
        {
            title: '间隔（天）',
            dataIndex: 'IntervalDays',
            key: 'IntervalDays',
            ellipsis: true,
            width: 'auto',
        },
        {
            title: '计划内容',
            dataIndex: 'RecordTypeName',
            key: 'RecordTypeName',
            ellipsis: true,
            width: 'auto',
        },
        {
            title: '实际起始日期',
            dataIndex: 'BeginTime',
            key: 'BeginTime',
            ellipsis: true,
            width: 'auto',
        },
        {
            title: '实际结束日期',
            dataIndex: 'EndTime',
            key: 'EndTime',
            ellipsis: true,
            width: 'auto',
        },
        ...planContentOpera,
    ];
    const delPlan = (idList) => {
        if (idList?.[0]) {
            props.dispatch({
                type: `${namespace}/DelOperationPlanPoint`,
                payload: { delIDList: idList },
                callback: () => {
                    props.delPlanCallback && props.delPlanCallback()
                    setPageSize(1); setPageSize(20); onFinish(1, 20)
                }
            });
        }
    }
    const startCeasePlan = (record, status) => {
        props.dispatch({
            type: `${namespace}/UpdOperationPlanPoint`,
            payload: { id: record.ID, status: status },
            callback: () => {
                onFinish(pageIndex, pageSize)
            }
        });
    }


    const [tableLoading, setTableLoading] = useState(false)
    const onFinish = (PageIndex, PageSize, queryPar) => {  //计划列表
        if (operationPlanInfoRefreshId) {
            const values = form.getFieldsValue();
            const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
                ...values,
                beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
                endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
                time: undefined,
                id: operationPlanInfoRefreshId,
                // pageIndex: PageIndex,
                // pageSize: PageSize,
            }
            setTableLoading(true)
            props.dispatch({
                type: `${namespace}/GetOperationPlanInfo`,
                payload: {
                    pollutantType: pointType,
                    ...par,
                },
                callback: () => {
                    setTableLoading(false)
                }
            });
        }
    }
    const handleTableChange = (PageIndex, PageSize) => { //分页
        setPageIndex(PageIndex)
        setPageSize(PageSize)
        // onFinish(PageIndex, PageSize, queryPar)
    }

    const exportData = () => {
        props.dispatch({
            type: `${namespace}/ExportOperationPlanInfo`,
            payload: { ...queryPar, pageIndex: undefined, pageSize: undefined },
        });
    };

    const commonSearchComponents = (type) => {
        return <>

            {planCalendarVisible ? <Spin spinning={!!pointLoading} size='small' className='formItemSpinSty'>
                <Form.Item name='pointID' label='监测点' style={{ marginBottom: 8 }}>
                    <Select
                        mode="multiple"
                        maxTagCount={2}
                        maxTagTextLength={10}
                        maxTagPlaceholder="..."
                        placeholder="请选择"
                        style={{ width: 200 }}
                        optionFilterProp="children"
                    >
                        {pointList.map(item => (<Option key={item.PointCode} value={item.PointCode}>{item.PointName}</Option>))}
                    </Select>

                </Form.Item>

            </Spin> :
                <Form.Item name='pointName' label='监测点'   style={{ marginBottom: 8 }}>
                    <Input placeholder='请输入' allowClear/>
                </Form.Item>
            }
            <Form.Item name='recordType' label='计划内容' style={{ marginBottom: 8 }}>
                <Select placeholder='请选择' allowClear style={{ width: 100 }}>
                    <Option key={pointType == 2 ? 1 : 7} value={pointType == 2 ? 1 : 7}>巡检</Option>
                    <Option key={pointType == 2 ? 3 : 9} value={pointType == 2 ? 3 : 9}>校准</Option>
                </Select>
            </Form.Item>
        </>
    }

    const searchComponents = () => {

        const resDataHandle = () => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }
        return <Form
            name="advanced_search3"
            className={'ant-advanced-search-form'}
            form={form}
            layout='inline'
            onFinish={resDataHandle}
        >   
            {commonSearchComponents(type)}
            <Form.Item name='time' label={'日期'} style={{ marginBottom: 8 }}>
                    <RangePicker_ format="YYYY-MM-DD" />
               </Form.Item>
            <Form.Item style={{ marginBottom: 4 }}>
                <Space>
                    <Button type="primary" htmlType="submit" loading={tableLoading}>
                        查询
                                 </Button>
                    <Button loading={tableLoading} onClick={() => { form.resetFields(); resDataHandle() }}  >
                        重置
                                  </Button>
                    <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exportData() }}>
                        导出
                             </Button>
                    {type == 1 &&
                        <Popconfirm title="确认要批量删除运维计划点位吗?" onConfirm={() => { delPlan(delList) }} disabled={delList?.length <= 0}>
                            <Button type="primary" disabled={delList?.length <= 0} loading={delOperationPlanPointLoading} >
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
    const [delList, setDelList] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setDelList(selectedRowKeys)
            // setSelectedRows(selectedRows)
        },
        selectedRowKeys: delList,
    };
    return (
        <div>
            {operationPlanInfoRefreshId && searchComponents()}
            <SdlTable
                rowSelection={type == 1 ? {
                    ...rowSelection,
                } : null}
                // resizable
                loading={tableLoading || !!delOperationPlanPointLoading || !!updOperationPlanPointLoading}
                bordered
                dataSource={tableDatas}
                columns={columns}
                align='center'
                scroll={{ x: 840, y: props.isEdit? 'auto' : 'calc(100vh - 264px)' }}
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
                <PlanCalendar type={type} pointType={tableDatas?.[0]?.RecordType == 1 || tableDatas?.[0]?.RecordType == 3 ? 2 : 1} pointList={pointList} pointLoading={pointLoading} commonSearchComponents={commonSearchComponents} />
            </Modal>
        </div>
    );
};
export default connect(dvaPropsData)(Index);