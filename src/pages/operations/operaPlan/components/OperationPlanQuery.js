/**
 * 功  能：预测性维护 运维计划  进行中计划、已完结计划、运维计划查询列表
 * 创建人：jab
 * 创建时间：2024.05
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
    operationPlanQueryRefresh:operaPlan.operationPlanQueryRefresh,
    tableLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    tableDatas: operaPlan.formulateTableDatas,
    tableTotal: operaPlan.formulateTableTotal,
    queryPar: operaPlan.formulateQueryPar,
    exportLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    configInfo: global.configInfo,
})

const Index = (props) => {



    const [form] = Form.useForm();






    const { commonCol,operateCol, operationPlanQueryRefreshType,tableDatas, tableTotal, tableLoading, queryPar, exportLoading, } = props;



    useEffect(() => {
        onFinish(pageIndex, pageSize);

    }, []);

    useEffect(() => {
        if(operationPlanQueryRefreshType){
            if(operationPlanQueryRefreshType==1){
                onFinish(pageIndex, pageSize);
            }else{
                setPageIndex(1)
                setPageSize(20)
                onFinish(1, 20);
            }

        }
    }, [operationPlanQueryRefreshType]);
    
    const columns = [

        ...commonCol(1,pageIndex,pageSize),
        ...operateCol,
    ];












    const onFinish = async (PageIndex, PageSize, queryPar) => {  
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

    const exportData = () => {
        props.dispatch({
            type: `${namespace}/ExportQuestionList`,
            payload: queryPar,
        });
    };

    const searchComponents = () => {
        const resDataHandle = () => { form.resetFields(); setPageIndex(1); setPageSize(20); onFinish(1, 20) }
        return <Form
            name="advanced_search"
            className={'ant-advanced-search-form'}
            form={form}
            onFinish={resDataHandle}
            initialValues={{
                pointType:''
            }}
        >
            <Row>
                <Col span={8}>
                    <Form.Item name='itemCode' label='合同编号'>
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='itemCode' label='运维单位'>
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='itemCode' label='污染源企业'>
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='pointType' label='点位类型'>
                        <Radio.Group onChange={(e) => { setPointType(e.target.value) }}>
                            <Radio value={''}>全部</Radio>
                            <Radio value={'2'}>废气</Radio>
                            <Radio value={'1'}>废水</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='time' label='计划日期'>
                        <RangePicker_ format="YYYY-MM-DD" />
                    </Form.Item>
                </Col>
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
                    </Space>
                </Form.Item>
            </Row>
        </Form>
    }





    return (
        <div className={`queryCriterTitleSty`}>
                <Card title={searchComponents()}>
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
        </div>
    );
};
export default connect(dvaPropsData)(Index);