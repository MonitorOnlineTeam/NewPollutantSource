/**
 * 功  能：预测性维护 运维计划  制定运维计划
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Empty, Checkbox, Skeleton, Spin, Tag, Tabs, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import CheckPhoto from '@/components/CheckPhoto';
import { permissionButton } from '@/utils/utils';
import AdjustExtendPlanModal from './AdjustExtendPlanModal';
import TaskRecordDetails from '@/pages/EmergencyTodoList/EmergencyDetailInfoLayout'

const { Option } = Select;

const namespace = 'operaPlan'


const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    clientHeight: global.clientHeight,
    dateCol: operaPlan.operationPlanCalendarCol,
    tableDatas: operaPlan.operationPlanCalendarList,
    tableTotal: operaPlan.operationPlanCalendarTotal,
    tableLoading: loading.effects[`${namespace}/GetOperationPlanCalendar`],
    queryPar: operaPlan.operationPlanCalendarQueryPar,
    operationPlanInfoRefreshId: operaPlan.operationPlanInfoRefreshId,
    exportLoading: loading.effects[`${namespace}/ExportOperationPlanCalendar`],
})

const Index = (props) => {



    const [form] = Form.useForm();
    const [form2] = Form.useForm();



    const { type, pointType, commonSearchComponents, operationPlanInfoRefreshId, tableDatas, tableTotal, tableLoading, queryPar, exportLoading } = props;
    const [recordType, setRecordType] = useState(pointType == 2 ? '1' : '7')
    const [justVisible, setJustVisible] = useState(false)
    const [adjustPointList, setAdjustPointList] = useState({ xjPointList: [], jzPointList: [], szwcPointList: [], jycsPointList: [] })
    const typeLegendData = [{ title: '按计划完成', value: 1, color: '#1890ff' }, { title: '超时完成', value: 2, color: '#faad14' }, { title: '超时未完成', value: 4, color: '#f5222d' }]


    useEffect(() => {
        if (operationPlanInfoRefreshId) {
            onFinish(pageIndex, pageSize);
        } else {
            props.dispatch({ type: `${namespace}/updateState`, payload: { operationPlanCalendarList: [] } });
        }
    }, []);

    useEffect(() => {
        if (operationPlanInfoRefreshId && justVisible) {
            props.dispatch({
                type: `${namespace}/GetFormulatePointList`,
                payload: {
                    id: operationPlanInfoRefreshId,
                },
                callback: res => {
                    setAdjustPointList({ xjPointList: res?.xjList, jzPointList: res?.jzList,szwcPointList:  res?.szwcList, jycsPointList: res?.jycsList })
                }
            });
        }
    }, [justVisible]);



    const { dateCol } = props;
    const columns = () => { //计划内 巡检周期
        let col = [{
            title: '序号',
            align: 'center',
            ellipsis: true,
            fixed: 'left',
            render: (text, record, index) => {
                return (index + 1) + (pageIndex - 1) * pageSize;
            }
        },
        {
            title: '监测点名称',
            dataIndex: 'pointName',
            key: 'pointName',
            fixed: 'left',
            ellipsis: true,
            width: 'auto',
        }]
        if (dateCol && dateCol[0]) {
            const colList = dateCol.map((item, index) => {
                return {
                    title: `${item.month}`,
                    align: 'center',
                    colSpan: item.count,
                    children: [{
                        title: `${item.day}`,
                        align: 'center',
                        children: [{
                            title: `${item.week}`,
                            dataIndex: `${item.date}`,
                            key: `${item.date}`,
                            width: 90,
                            align: 'center',
                            render: (text, record, index) => {
                                const filterData = (status) => typeLegendData.filter(item => item.value == status)?.[0]?.color;
                                return text && <div style={{ fontWeight: 'bold', }}>
                                    <Space>
                                    <span onClick={() => { text.xjID && taskDetail(text.xjID) }} style={{ color: filterData(text.xjStatus), cursor: text.xjID && 'pointer' }}>{text.xjStr}</span>
                                    <span onClick={() => { text.jzID && taskDetail(text.jzID) }} style={{ color: filterData(text.jzStatus), cursor: text.jzID && 'pointer' }}>{text.jzStr}</span>
                                    <span onClick={() => { text.szwcID && taskDetail(text.szwcID) }} style={{ color: filterData(text.szwcStatus), cursor: text.szwcID && 'pointer' }}>{text.szwcStr}</span>
                                    <span onClick={() => { text.jycsID && taskDetail(text.jycsID) }} style={{ color: filterData(text.jycsStatus), cursor: text.jycsID && 'pointer' }}>{text.jycsStr}</span>
                                   
                                   </Space>
                                   </div>
                            }
                        }]
                    }]

                }
            })
            col.push(...colList)
        }
        return col;
    }

    const [taskRecordDetailVisible, setTaskRecordDetailVisible] = useState(false)
    const [taskID, setTaskID] = useState()
    const taskDetail = (id) => { //任务详情
        setTaskID(id)
        setTaskRecordDetailVisible(true)
    }
    const onFinish = async (PageIndex, PageSize, queryPar) => {  //计划列表
        try {
            const values = await form.validateFields();
            const par = queryPar ? { ...queryPar, pageIndex: PageIndex, pageSize: PageSize, } : {
                ...values,
                beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
                endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
                time: undefined,
                pageIndex: PageIndex,
                pageSize: PageSize,
                statusList: legendSelectVal,
                id: operationPlanInfoRefreshId,
            }
            props.dispatch({
                type: `${namespace}/GetOperationPlanCalendar`,
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
        onFinish(PageIndex, PageSize, queryPar)
    }

    const exportData = () => {
        props.dispatch({
            type: `${namespace}/ExportOperationPlanCalendar`,
            payload: { ...queryPar, pageIndex: undefined, pageSize: undefined },
        });
    };

    const adjustPlan = () => { //调整计划
        setJustVisible(true)
    }
    const [dates, setDates] = useState(null);
    const [value, setValue] = useState([moment().subtract(2, 'months').startOf('month'), moment()]);
    const disabledDate = (current) => {
        if (!dates) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 90;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 90;
        return !!tooEarly || !!tooLate;
    };
    const onOpenChange = (open) => {
        if (open) {
            form.setFieldsValue({time:[]})
            setDates([null, null]);
        } else {
            form.setFieldsValue({time:value})
            setDates(null);
        }
    };
    const searchComponents = () => {

        return <Form
            name="advanced_search"
            className={'ant-advanced-search-form'}
            form={form}
            layout='inline'
            onFinish={() => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }}
            initialValues={{
                time:  [moment(), moment().add(90, 'days')],
            }}
        >
            {commonSearchComponents && commonSearchComponents(type)}
            <Form.Item name='time' label={'日期'} style={{ marginBottom: 8 }}>
                <RangePicker_ 
                    format="YYYY-MM-DD" 
                    value={dates || value}
                    disabledDate={disabledDate}
                    onCalendarChange={(val) => setDates(val)}
                    onChange={(val) => setValue(val)}
                    onOpenChange={onOpenChange}
                    allowClear={false}
                    />
            </Form.Item>
            <Form.Item style={{ marginBottom: 4 }}>
                <Space>
                    <Button type="primary" htmlType="submit" loading={tableLoading}>
                        查询
                                 </Button>
                    <Button loading={tableLoading} onClick={() => { form.resetFields(); setLegendSelectVal([]); setPageIndex(1); setPageSize(20); onFinish(1, 20, { id: operationPlanInfoRefreshId }) }}   >
                        重置
                                  </Button>
                    <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exportData() }}>
                        导出
                             </Button>
                    {(type == 1 || type == 2) && <Button type="primary" onClick={adjustPlan}>
                        调整
                             </Button>}
                </Space>
            </Form.Item>
        </Form>
    }

    // const [indeterminate, setIndeterminate] = useState(false);
    // const [checkAll, setCheckAll] = useState(false);
    // const checkboxChange = (valList, checkOptions) => {
    //     setIndeterminate(!!valList.length && valList.length < checkOptions.length);
    //     setCheckAll(valList.length === checkOptions.length);
    // }
    // const onCheckAllChange = (e, checkOptions) => {
    //     const allVal = checkOptions.map(item => item.PointCode)
    //     form2.setFieldsValue({ pointID: e.target.checked ? allVal : [] })
    //     setIndeterminate(false);
    //     setCheckAll(e.target.checked);
    // };
    // const AdJustPlanComponents = () => {
    //     return props.formulatePointListLoading ? <Skeleton active style={{ height: 158 }} /> :
    //        <>{dataList?.length ?  <Form
    //         form={form2}
    //         name="advanced_search_plancontent_form"
    //         className={'ant-advanced-search-form'}
    //         labelCol={{ flex: '108px' }}
    //     >
    //             <Checkbox style={{ paddingLeft: 108 }} indeterminate={indeterminate} onChange={(e) => onCheckAllChange(e, dataList)} checked={checkAll}>
    //                 全选
    //             </Checkbox>
    //             <Form.Item className='form_label_width_94 pointItemSty' name='pointID' label='监测点' rules={[{ required: true, message: '请选择监测点！' }]} >
    //                 <Checkbox.Group
    //                     onChange={(val) => checkboxChange(val, dataList)}
    //                 >
    //                     {
    //                         dataList.map(itm => {
    //                             return <Checkbox key={itm.PointCode} value={itm.PointCode}>{itm.PointName}</Checkbox>
    //                         })
    //                     }
    //                 </Checkbox.Group>
    //             </Form.Item>
    //         <Form.Item
    //             name='tzDate'
    //             label='调整起始日期'
    //             rules={[{ required: true, message: '请选择调整起始日期！' }]}
    //             >
    //             <DatePicker      
    //               disabledDate={(current) => {
    //                 return current && current < moment()
    //               }}/>
    //         </Form.Item>
    //     </Form>   
    //        :
    //      <Empty description='暂无监测点' image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBottom: 24 }} />
    //   }</>
    // }
    const [legendSelectVal, setLegendSelectVal] = useState([])
    const typeLegendChange = (value) => {
        let data = []
        if (legendSelectVal.includes(value)) { //再次点击
            data = legendSelectVal.filter(item => item != value)
        } else {
            data = [...legendSelectVal, value]
        }
        setLegendSelectVal(data)
        setPageIndex(1); setPageSize(20);
        onFinish(1, 20, { ...queryPar, statusList: data })
    }
    return (
        <div>
            {searchComponents()}
            <Row style={{ paddingBottom: 8 }} align='middle'>
                <span className='red' style={{ paddingRight: 18 }}>
                      <Space>
                      <span>巡检：X</span>
                      <span>校准：J</span>
                      {pointType == 2 && <span>示值误差：S</span>}
                      <span>校验测试：Y</span>
                      </Space>
                      </span>
                {type != 1 && typeLegendData.map((item, index) => <Row align='middle' style={{ cursor: 'pointer', marginRight: 12 }} onClick={() => typeLegendChange(item.value)} >
                    <div style={{ marginRight: 4, width: 32, height: 16, backgroundColor: item.color }}> </div>
                    <span style={{ fontWeight: legendSelectVal.includes(item.value) ? 'bold' : 'normal' }}>{item.title}</span>
                </Row>)}
            </Row>
            <SdlTable
                // resizable
                loading={tableLoading}
                bordered
                dataSource={tableDatas}
                columns={columns()}
                align='center'
                scroll={{ x: (dateCol?.length * 90 || 0) + 260, y: 'calc(100vh - 373px)' }}
                pagination={{
                    total: tableTotal,
                    pageSize: pageSize,
                    current: pageIndex,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: handleTableChange,
                }}
            />
            <AdjustExtendPlanModal
                type={1}
                title='调整计划'
                visible={justVisible}
                onCancel={() => { setJustVisible(false) }}
                adjustPointList={adjustPointList}
                pointType={pointType}
                onFinish={() => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }}
            />
            <Modal
                title="任务详情"
                visible={taskRecordDetailVisible}
                destroyOnClose
                wrapClassName='spreadOverModal'
                footer={null}
                mask={false}
                onCancel={() => {
                    setTaskRecordDetailVisible(false)
                }}

            >
                <TaskRecordDetails
                    match={{ params: { TaskID: taskID, DGIMN: null } }}
                    isHomeModal
                    hideBreadcrumb
                />
            </Modal>
        </div>
    );
};
export default connect(dvaPropsData)(Index);