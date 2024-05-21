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


const { Option } = Select;

const namespace = 'operaPlan'



const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    commonCol: operaPlan.commonCol,
    operationPlanQueryRefreshType: operaPlan.operationPlanQueryRefreshType,
    tableLoading: loading.effects[`${namespace}/GetOperationPlanList`] ,
    tableDatas2: operaPlan.tableDatas2,
    tableTotal2: operaPlan.tableTotal2,
    queryPar2: operaPlan.queryPar2,
    tableDatas3: operaPlan.tableDatas3,
    tableTotal3: operaPlan.tableTotal3,
    queryPar3: operaPlan.queryPar3,
    tableDatas4: operaPlan.tableDatas4,
    tableTotal4: operaPlan.tableTotal4,
    queryPar4: operaPlan.queryPar4,
    exportLoading: loading.effects[`${namespace}/ExportOperationPlanList`],
    configInfo: global.configInfo,
})

const Index = (props) => {



    const [form] = Form.useForm();






    const { planType,commonCol,operateCol, operationPlanQueryRefreshType,tableLoading, tableDatas2, tableTotal2, queryPar2,tableDatas3, tableTotal3, queryPar3,tableDatas4, tableTotal4, queryPar4, exportLoading, } = props;



    useEffect(() => {
        onFinish(pageIndex, pageSize);

    }, []);

    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    useEffect(() => {
        if(operationPlanQueryRefreshType){
            if(operationPlanQueryRefreshType==1){
                onFinish(pageIndex, pageSize);
            }else{
                setPageIndex(1)
                setPageSize(20)
                onFinish(1, 20);
            }
            props.dispatch({
                type: `${namespace}/updateState`,
                payload: { operationPlanQueryRefreshType: '' },
            });
        }
    }, [operationPlanQueryRefreshType]);
    
    const columns = [

        ...commonCol(1,pageIndex,pageSize),
        ...operateCol,
    ];












    const onFinish = async (PageIndex, PageSize, queryPar) => {  
        try {
            const values = await form.validateFields();
            const par = queryPar ? { ...queryPar, pageIndex: PageIndex, pageSize: PageSize, } : {
                ...values,
                planType:planType,
                beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
                endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
                time: undefined,
                pageIndex: PageIndex,
                pageSize: PageSize,
            }
            props.dispatch({
                type: `${namespace}/GetOperationPlanList`,
                payload: {
                    ...par,
                },

            });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    const handleTableChange = async (PageIndex, PageSize) => { //分页
        setPageSize(PageSize)
        setPageIndex(PageIndex)
        onFinish(PageIndex, PageSize, planType==2? queryPar2 : planType==3? queryPar3 : queryPar4)
    }

    const exportData = () => {
        const queryParData = planType==2? queryPar2 : planType==3? queryPar3 : queryPar4
        props.dispatch({
            type: `${namespace}/ExportOperationPlanList`,
            payload: {...queryParData,pageIndex:undefined,pageSize:undefined},
        });
    };

    const searchComponents = () => {
        const resDataHandle = () => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }
        return <Form
            name="advanced_search"
            className={'ant-advanced-search-form'}
            form={form}
            onFinish={resDataHandle}
            initialValues={{
                pollutantType:''
            }}
        >
            <Row>
                <Col span={8}>
                    <Form.Item name='projectCode' label='合同编号'>
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='operationEnt' label='运维单位'>
                      <OperationCompanyList />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='entCode' label='污染源企业'>
                    <EntAtmoList enable placeholder="请选择"  style={{width:'100%'}}/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='pollutantType' label='点位类型'>
                        <Radio.Group>
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
                        <Button loading={tableLoading} onClick={()=>{ form.resetFields();resDataHandle}}  >
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
                        dataSource={planType==2? tableDatas2 : planType==3? tableDatas3 : tableDatas4 }
                        columns={columns}
                        align='center'
                        pagination={{
                            total: planType==2? tableTotal2 : planType==3? tableTotal3 : tableTotal4,
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