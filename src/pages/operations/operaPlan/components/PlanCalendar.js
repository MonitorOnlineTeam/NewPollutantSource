/**
 * 功  能：预测性维护 运维计划  制定运维计划
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm,Empty, Checkbox,Skeleton, Spin, Tag, Tabs, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
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
const { Option } = Select;

const namespace = 'operaPlan'


const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    dateCol: operaPlan.operationPlanCalendarCol,
    tableDatas: operaPlan.operationPlanCalendarList,
    tableTotal: operaPlan.operationPlanCalendarTotal,
    tableLoading: loading.effects[`${namespace}/GetOperationPlanCalendar`],
    queryPar: operaPlan.operationPlanCalendarQueryPar,
    operationPlanInfoRefreshId: operaPlan.operationPlanInfoRefreshId,
    exportLoading: loading.effects[`${namespace}/ExportOperationPlanCalendar`],
    formulatePointListLoading: loading.effects[`${namespace}/GetFormulatePointList`],
    adjustmentOperationPlanLoading: loading.effects[`${namespace}/AdjustmentOperationPlan`],
})

const Index = (props) => {



    const [form] = Form.useForm();
    const [form2] = Form.useForm();



    const {type,pointType,commonSearchComponents,operationPlanInfoRefreshId,  tableDatas, tableTotal, tableLoading,queryPar, exportLoading } = props;
    const [recordType, setRecordType] = useState(pointType == 2 ? '1' : '7')
    const [justVisible, setJustVisible] = useState(false)
    const [adjustPointList, setAdjustPointList] = useState({xjPointList:[],jzPointList:[]})


    useEffect(() => {
        if(operationPlanInfoRefreshId){
        onFinish(pageIndex, pageSize);
       }else{
        props.dispatch({ type: `${namespace}/updateState`, payload: { operationPlanCalendarList: [] } });
       }
    }, []);

    useEffect(() => {
        if(operationPlanInfoRefreshId && justVisible){
        props.dispatch({
            type: `${namespace}/GetFormulatePointList`,
            payload: {
                id:operationPlanInfoRefreshId,
            },
            callback:res=>{
                setAdjustPointList({xjPointList:res?.xjList,jzPointList:res?.jzList})
            }
        });
       }
    }, [justVisible]);

   const justResData = () =>{
    form2.resetFields();
    setIndeterminate(false);
    setCheckAll(false) 
   }


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
                                    width: 70,
                                    align:'center',
                                }]
                        }]
                     
                    }
                })
          col.push(...colList)
        }
        return col;
    }

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
            type: `${namespace}/ExportQuestionList`,
            payload: queryPar,
        });
    };

    const adjustPlan = () => { //调整计划
        setJustVisible(true)
    }
    const adjustPlanOk = () => {
        form2.validateFields().then((values)=>{
           const par = {recordType: recordType,...values,tzDate:values.tzDate&&moment(values.tzDate).format('YYYY-MM-DD 00:00:00')}
           props.dispatch({
                type: `${namespace}/AdjustmentOperationPlan`,
                payload: {id:operationPlanInfoRefreshId,...par},
                callback:()=>{
                    setJustVisible(false);
                    setPageIndex(1);setPageSize(20);onFinish(1,20);
                    justResData();
                }
            });
            }).catch((errorInfo) => {
                console.log('Failed:', errorInfo);
            });
    }
    const searchComponents = () => {

        const resDataHandle = () => {  setPageIndex(1); setPageSize(20); onFinish(1, 20) }
        return <Form
            name="advanced_search"
            className={'ant-advanced-search-form'}
            form={form}
            layout='inline'
            onFinish={resDataHandle}
        >
        {commonSearchComponents&&commonSearchComponents(1)}
            <Form.Item style={{ marginBottom: 4 }}>
                <Space>
                    <Button type="primary" htmlType="submit" loading={tableLoading}>
                        查询
                                 </Button>
                    <Button loading={tableLoading} onClick={()=>{ form.resetFields();resDataHandle}}   >
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
    const AdJustPlanComponents = () => {
        return props.formulatePointListLoading ? <Skeleton active style={{ height: 158 }} /> :
           <>{dataList?.length ?  <Form
            form={form2}
            name="advanced_search_plancontent_form"
            className={'ant-advanced-search-form'}
            labelCol={{ flex: '108px' }}
        >
                <Checkbox style={{ paddingLeft: 108 }} indeterminate={indeterminate} onChange={(e) => onCheckAllChange(e, dataList)} checked={checkAll}>
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
            <Form.Item
                name='tzDate'
                label='调整起始日期'
                rules={[{ required: true, message: '请选择调整起始日期！' }]}
                >
                <DatePicker      
                  disabledDate={(current) => {
                    return current && current < moment()
                  }}/>
            </Form.Item>
        </Form>   
           :
         <Empty description='暂无监测点' image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBottom: 24 }} />
      }</>
    }
    const [legendSelectIndex, setLegendSelectIndex] = useState([])
    const typeLegendChange = (index) => {

        let data = []
        if (legendSelectIndex.includes(index)) { //再次点击
            data = legendSelectIndex.filter(item => item != index)
        } else {
            data = [...legendSelectIndex, index]
        }
        setLegendSelectIndex(data)
    }
    const typeLegendData = [{ title: '按计划完成', color: '#1890ff' }, { title: '超时完成', color: '#faad14' }, { title: '超时未完成', color: '#f5222d' }]
    const dataList = recordType == '1' || recordType == '7' ? adjustPointList?.xjPointList : adjustPointList?.jzPointList
    return (
        <div>
            {searchComponents()}
             <Row style={{ paddingBottom: 8 }} align='middle'>
                <span className='red' style={{ paddingRight: 18 }}> 巡检:X&nbsp;&nbsp;校准:J </span>
                {type != 1 && typeLegendData.map((item, index) => <Row align='middle' style={{ cursor: 'pointer', marginRight: 12 }} onClick={() => typeLegendChange(index)} >
                    <div style={{ marginRight: 4, width: 32, height: 16, backgroundColor: item.color }}> </div>
                    <span style={{ fontWeight: legendSelectIndex.includes(index) ? 'bold' : 'normal' }}>{item.title}</span>
                </Row>)}
            </Row>
            <SdlTable
                resizable
                loading={tableLoading}
                bordered
                dataSource={tableDatas}
                columns={columns()}
                align='center'
                scroll={{y:'calc(100vh - 200px)'}}
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
                visible={justVisible}
                title={'调整计划'}
                onCancel={() => { setJustVisible(false);justResData(); }}
                destroyOnClose
                wrapClassName={`spreadOverModal  ${styles.formulateModalSty}`}
                mask={false}
                footer={dataList?.length>0? [<Button  onClick={() => {justResData()}}>
                    重置
                   </Button>,
                  <Button type="primary" loading={props.adjustmentOperationPlanLoading} onClick={adjustPlanOk}>
                    提交
                   </Button>] : null}
            >
                <Tabs
                    defaultActiveKey="1"
                    type='card'
                    onChange={(key) => {
                        form2.resetFields()
                        setCheckAll(false)
                        setIndeterminate(false)
                        setRecordType(key)
                    }}
                    items={[
                        {
                            label: `巡检`,
                            key: pointType == 2 ? '1' : '7',
                            children: <AdJustPlanComponents />,
                        },
                        {
                            label: pointType == 2 ? '校准' : '标样核查及校准',
                            key: pointType == 2 ? '3' : '9',
                            children: <AdJustPlanComponents />,
                        },
                    ]}
                />
            </Modal>
        </div>
    );
};
export default connect(dvaPropsData)(Index);