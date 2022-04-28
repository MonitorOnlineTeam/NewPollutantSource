
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Tag, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';


const { TextArea } = Input;
const { Option } = Select;

const namespace = 'supervisionAnalySumm'




const dvaPropsData = ({ loading, supervisionAnalySumm, global, common }) => ({
    tableDatas: supervisionAnalySumm.operationManageSummaryList,
    tableTotal: supervisionAnalySumm.operationManageSummaryTotal,
    tableLoading: loading.effects[`${namespace}/getOperationManageSummaryList`],
    saveLoading: loading.effects[`${namespace}/addOrEditInspectorTypeItem`],
    inspectorTypeloading: loading.effects[`${namespace}/getInspectorTypeCode`],
    assessmentMethodList: supervisionAnalySumm.assessmentMethodList,
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getOperationManageSummaryList: (payload) => { // 列表
            dispatch({
                type: `${namespace}/getOperationManageSummaryList`,
                payload: payload,
            })
        },
    }
}
const Index = (props) => {

    const [form] = Form.useForm();

    const { tableDatas, tableTotal, tableLoading, exportLoading, } = props;


    useEffect(() => {
        onFinish(pageIndex, pageSize);
    }, []);





    const [tableTitle,setTableTitle] = useState(<span style={{fontWeight:'bold',fontSize:16}}>{moment().format('YYYY年')}督查总结</span>)

    const columns = [
        {
            title: tableTitle,
            align: 'center',
            children: [
                {
                    title: '序号',
                    dataIndex: 'TypeNum',
                    key: 'TypeNum',
                    align: 'center',
                    render: (text, record, index) => {
                        return index + 1
                    }
                },
                {
                    title: '省区',
                    dataIndex: 'provinceName',
                    key: 'provinceName',
                    align: 'center',
                  },
                  {
                    title: '企业名称',
                    dataIndex: 'entName',
                    key: 'entName',
                    align: 'center',
                  },
                  {
                    title: '排口名称',
                    dataIndex: 'pointName',
                    key: 'pointName',
                    align: 'center',
                  },
                  {
                    title: '监测因子',
                    dataIndex: 'pollutantName',
                    key: 'pollutantName',
                    width:200,
                    align: 'center',
                  },
                  {
                    title: '督查人员',
                    dataIndex: 'createUserName',
                    key: 'createUserName',
                    align: 'center',
                  },
                  {
                    title: '运维人员',
                    dataIndex: 'operationName',
                    key: 'operationName',
                    align: 'center',
                  },
                {
                    title: '督查日期',
                    dataIndex: 'dateTime',
                    key: 'dateTime',
                    align: 'center',
                },
                {
                    title: '原则性问题',
                    dataIndex: 'principleProblem',
                    key: 'principleProblem',
                    align: 'center',
                },
                {
                    title: '严重问题',
                    dataIndex: 'importanProblem',
                    key: 'importanProblem',
                    align: 'center',
                },
                {
                    title: '一般问题',
                    dataIndex: 'commonlyProblem',
                    key: 'commonlyProblem',
                    align: 'center',
                },
            ]
        }

    ]


    const onFinish = async (pageIndexs, pageSizes) => {  //查询
        try {
            const values = await form.validateFields();
            props.getOperationManageSummaryList({
                ...values,
                BeginTime: type==3?  values.time&&moment(values.time[0]).format('YYYY-MM-DD 00:00:00') :   type ==1? values.time&&moment(values.time).format('YYYY') : values.time&&moment(values.time).format('YYYY-MM'),
                EndTime:  type==3? values.time&&moment(values.time[1]).format('YYYY-MM-DD 23:59:59') : undefined,
                time:undefined,
                pageIndex: pageIndexs,
                pageSize: pageSizes,
            },()=>{
                if(type==1){
                  setTableTitle(<span style={{fontWeight:'bold',fontSize:16}}>{moment(values.time).format('YYYY年')}督查总结</span>)
                }else if(type==2){
                  setTableTitle(<span style={{fontWeight:'bold',fontSize:16}}>{moment(values.time).format('YYYY年MM月')}督查总结</span>)
                }else{
                  setTableTitle(<span style={{fontWeight:'bold',fontSize:16}}>{moment(values.time[0]).format('YYYY年MM月DD日') } ~ {moment(values.time[1]).format('YYYY年MM月DD日')}督查总结</span>)
                }
              })


        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }



    const exports = () => {

    }


    const [type, setType] = useState(1)
    const onValuesChange = (hangedValues, allValues) => {
        if (Object.keys(hangedValues).join() == 'DataType') {
            setType(hangedValues.DataType)
            if(hangedValues.DataType==3){
                form.setFieldsValue({ time: [moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day")] })
              }else{
                form.setFieldsValue({ time:  moment() })
              }
        }
    }

    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const handleTableChange = (PageIndex, PageSize) => {
        setPageIndex(PageIndex)
        setPageSize(PageSize)
        onFinish(PageIndex, PageSize)
    }
    return (
        <div className={styles.analysisSummarySty}>
            <Card
                title={
                    <Form
                        form={form}
                        name="advanced_search"
                        onFinish={() => { onFinish(pageIndex, pageSize) }}
                        layout='inline'
                        initialValues={{
                            DataType: 1,
                            time: moment(),
                        }}
                        className={styles.queryForm}
                        onValuesChange={onValuesChange}
                    >
                        <Form.Item label='统计方式' name='DataType'>
                            <Select placeholder='请选择' style={{ width: 150 }}>
                                <Option value={1}>按年统计</Option>
                                <Option value={2}>按月统计</Option>
                                <Option value={3}>按日统计</Option>
                            </Select>
                        </Form.Item>
                        {type == 1 ? <Form.Item label='统计年份' name='time' >
                            <DatePicker picker="year" style={{ width: 150 }} allowClear={false}/>
                        </Form.Item>
                            :
                            type == 2 ?
                                <Form.Item label='统计月份' name='time' >
                                    <DatePicker picker="month" style={{ width: 150 }}  allowClear={false}/>
                                </Form.Item>
                                :
                                <Form.Item label='统计日期' name='time' >
                                    <RangePicker_
                                        allowClear={false}
                                        style={{ width: 386 }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        showTime="YYYY-MM-DD HH:mm:ss" />
                                </Form.Item>
                        }
                        <Form.Item>

                            <Button type="primary" loading={tableLoading} htmlType="submit">
                                查询
                               </Button>
                            <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
                                重置
                              </Button>
                            <Button icon={<ExportOutlined />} onClick={() => { exports() }} loading={exportLoading}>
                                导出
                            </Button>
                        </Form.Item>
                    </Form>}>
                <SdlTable
                    loading={tableLoading}
                    bordered
                    dataSource={tableDatas}
                    columns={columns}
                    scroll={{ y: 'calc(100vh - 500px)' }}
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
        </div>

    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);