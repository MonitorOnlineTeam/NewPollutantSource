/**
 * 功  能：运维任务报告
 * 创建人：jab
 * 创建时间：2023.05.23
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload, Tag, Tabs, Pagination, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ImportOutlined, ProfileOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import moment from 'moment'
import EntAtmoList from '@/components/EntAtmoList'
import styles from '../styles.less'

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;



const namespace = 'operaTaskReportManager'
const dvaPropsData = ({ loading, operaTaskReportManager, global }) => ({
    tableDatas: operaTaskReportManager.tableDatas,
    tableTotal: operaTaskReportManager.tableTotal,
    tableLoading: loading.effects[`${namespace}/getOperationReportList`],
    queryPar: operaTaskReportManager.queryPar,
    exportLoading: loading.effects[`${namespace}/exportOperationReport`],
    clientHeight: global.clientHeight,

})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getOperationReportList: (payload) => { //运维任务报告 列表
            dispatch({
                type: `${namespace}/getOperationReportList`,
                payload: payload,
            })
        },
        exportOperationReport: (payload) => { //生成报告
            dispatch({
                type: `${namespace}/exportOperationReport`,
                payload: payload,
            })
        },
    }
}


const Index = (props) => {
    const [form] = Form.useForm();

    const { tableDatas, tableTotal, tableLoading, queryPar, exportLoading,} = props;

    useEffect(() => {

    }, [])
    const columns = [
        {
            title: '省',
            align: 'center',
            dataIndex: 'provinceName',
            key: 'provinceName',
            width: 150,
            ellipsis: true,
        },
        {
            title: '市',
            dataIndex: 'cityName',
            key: 'cityName',
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '企业',
            dataIndex: 'entName',
            key: 'entName',
            align: 'left',
            width: 150,
            ellipsis: true,
        },
        {
            title: '合同名称',
            dataIndex: 'projectName',
            key: 'projectName',
            align: 'left',
            width: 150,
            ellipsis: true,
        },
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            key: 'projectCode',
            align: 'center',
            width: 150,
        },
        {
            title: '运维合同起始日期',
            dataIndex: 'beginTime',
            key: 'beginTime',
            align: 'center',
            width: 140,
        },
        {
            title: '运维合同结束日期',
            dataIndex: 'entTime',
            key: 'entTime',
            align: 'center',
            width: 140,
        },
        {
            title: '操作',
            align: 'center',
            width: 70,
            render: (text, record) => {
                return <Spin spinning={exportLoading || false} size='small'>
                            <a onClick={() => { generateReport(record) }}>生成报告</a>
                       </Spin>
            }
        },
    ];


    const onFinish = async (pageIndexs, pageSizes, queryPar) => {  //查询 积分信息查询
        try {
            const values = await form.validateFields();
            setPageIndex(pageIndexs);
            const par = {
                ...values,
                ReportDate:moment(values.ReportDate).format('YYYY-MM-01 00:00:00'),
                pageIndex: pageIndexs,
                pageSize: pageSizes,
            }
            props.getOperationReportList(queryPar ?  {...queryPar,pageIndex:pageIndexs,pageSize:pageSizes} : par )
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }


    const generateReport =  (record) =>{
        props.exportOperationReport({
            ...queryPar,
            EntID:record.EntID,
            ProjectID: record.projectID,
        })
    }
  

    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const handleTableChange = (PageIndex, PageSize) => { //积分信息查询 分页
        setPageIndex(PageIndex)
        setPageSize(PageSize)
        onFinish(PageIndex, PageSize, queryPar)

    }




    const searchComponents = () => {
        return <Form
            name="advanced_search"
            form={form}
            className={styles['form_query_sty']}
            layout='inline'
            onFinish={() => { onFinish(1, pageSize) }}
            initialValues={{
                ReportDate: moment().add(-1, 'month'),
            }}
        >
            <Form.Item label='企业名称' name='EntID' rules={[{ required: true, message: '请选择企业名称' }]}>
              <EntAtmoList style={{width:300}} noFilterEntList/>
            </Form.Item>
            <Form.Item label='报告时间' name='ReportDate'>
                <DatePicker picker="month" allowClear={false} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={tableLoading} style={{ marginRight: 8, }} >
                    查询
                </Button>
                <Button onClick={() => { form.resetFields(); }}  >
                    重置
                 </Button>
            </Form.Item>

        </Form>
    }


    return (
        <div>
            <BreadcrumbWrapper>
                <Card title={searchComponents()}>
                    <SdlTable
                        loading={tableLoading}
                        bordered
                        dataSource={tableDatas}
                        columns={columns}
                        pagination={{
                            total: tableTotal,
                            pageSize: pageSize,
                            current: pageIndex,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            onChange: handleTableChange,
                        }}
                        scroll={{ x: 'calc(680px - 48px - 24px)', }}
                    />
                </Card>
            </BreadcrumbWrapper>


        </div >
    );
};


export default connect(dvaPropsData, dvaDispatch)(Index);