
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
    tableDatas: supervisionAnalySumm.inspectorTypeItemList,
    tableTotal: supervisionAnalySumm.inspectorTypeItemListTotal,
    tableLoading: loading.effects[`${namespace}/getInspectorTypeItemList`],
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
        getInspectorTypeItemList: (payload) => { // 列表
            dispatch({
                type: `${namespace}/getInspectorTypeItemList`,
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






    const columns = [
        {
            title: <span style={{ fontWeight: 'bold', fontSize: 14 }}>111</span>,
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
                    dataIndex: 'PollutantTypeName',
                    key: 'PollutantTypeName',
                    align: 'center',
                },
                {
                    title: '企业名称',
                    dataIndex: 'InspectorTypeName',
                    key: 'InspectorTypeName',
                    align: 'center',
                },
                {
                    title: '排口名称',
                    dataIndex: 'Fraction',
                    key: 'Fraction',
                    align: 'center',
                },
                {
                    title: '监测因子',
                    dataIndex: 'Fraction',
                    key: 'Fraction',
                    align: 'center',
                },
                {
                    title: '督查人员',
                    dataIndex: 'Fraction',
                    key: 'Fraction',
                    align: 'center',
                },
                {
                    title: '运维人员',
                    dataIndex: 'Fraction',
                    key: 'Fraction',
                    align: 'center',
                },
                {
                    title: '督查日期',
                    dataIndex: 'Fraction',
                    key: 'Fraction',
                    align: 'center',
                },
                {
                    title: '原则性问题',
                    dataIndex: 'Fraction',
                    key: 'Fraction',
                    align: 'center',
                },
                {
                    title: '严重问题',
                    dataIndex: 'Fraction',
                    key: 'Fraction',
                    align: 'center',
                },
                {
                    title: '一般问题',
                    dataIndex: 'Fraction',
                    key: 'Fraction',
                    align: 'center',
                },
            ]
        }

    ]


    const onFinish = async (pageIndexs, pageSizes) => {  //查询
        try {
            const values = await form.validateFields();
            props.getInspectorTypeItemList({
                ...values,
                pageIndex: pageIndexs,
                pageSize: pageSizes
            })


        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }



    const exports = () => {

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
                        initialValues={{
                        }}
                        className={styles.queryForm}
                    >
                        <Row>
                            <Form.Item label='统计方式' name='PollutantType'>
                                <Select placeholder='请选择' allowClear style={{ width: 150 }}>
                                    <Option value={2}>废气</Option>
                                    <Option value={1}>废水</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label='统计年份' name='Status' style={{ margin: '0 16px' }} >
                                <DatePicker picker="year" style={{ width: 150 }} />
                            </Form.Item>
                            <Form.Item label='统计月份' name='Status'>
                                <DatePicker picker="month" style={{ width: 150 }} />
                            </Form.Item>
                        </Row>

                        <Row>



                            <Form.Item label='统计日期' name='Status' >
                                <RangePicker_
                                    style={{ width: 386 }}
                                    allowClear={true}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    showTime="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                            <Form.Item style={{ margin: '0 16px' }}>

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
                        </Row>
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