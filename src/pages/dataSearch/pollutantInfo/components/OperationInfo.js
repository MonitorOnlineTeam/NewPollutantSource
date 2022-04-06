/**
 * 功  能：运营信息
 * 创建人：贾安波
 * 创建时间：2022.04.246
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, BarChartOutlined, CodeSandboxCircleFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import RegionList from '@/components/RegionList'
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import styles from "../style.less";
import moment from 'moment';

const { Option } = Select;

const namespace = 'pollutantInfo'




const dvaPropsData = ({ loading, pollutantInfo, autoForm }) => ({
    tableDatas: pollutantInfo.operationInfoTableDatas,
    projectTableDatas: pollutantInfo.operationInfoTableTotal,
    tableLoading: pollutantInfo.projectRelationLoading,
    historyOperationInfo:pollutantInfo.historyOperationInfo,
    historyOperationInfoLoading: pollutantInfo.historyProjectRelationLoading,
})

const dvaDispatch = (dispatch) => {
    return {
        getEntProjectRelationList: (payload) => { //列表
            dispatch({
                type: `${namespace}/getEntProjectRelationList`,
                payload: payload,
            })
        },
        exportEntProjectRelationList: (payload) => { //导出
            dispatch({
                type: `${namespace}/exportEntProjectRelationList`,
                payload: payload
            })
        },

    }
}

const Index = (props) => {



    const [form] = Form.useForm();


    const [fromVisible, setFromVisible] = useState(false)
    const [tableVisible, setTableVisible] = useState(false)
    const [popVisible, setPopVisible] = useState(false)










    const { tableDatas, tableLoading, exportLoading } = props;


    useEffect(() => {

        initData();

    }, [props.DGIMN]);


    const initData = () => {
        onFinish();
    }


    const columns = [
        {
            title: '序号',
            align: 'center',
            width: 50,
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '行政区',
            dataIndex: 'regionName',
            key: 'regionName',
            align: 'center',
        },
        {
            title: '企业名称',
            dataIndex: 'parentName',
            key: 'parentName',
            align: 'center',
        },
        {
            title: '监测点',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center'
        },
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            key: 'projectCode',
            align: 'center',
        },
        {
            title: '运营起始日期',
            dataIndex: 'operationBeginTime',
            key: 'operationBeginTime',
            align: 'center',
            width:150,
        },
        {
            title: '运营结束日期',
            dataIndex: 'operationEndTime',
            key: 'operationEndTime',
            align: 'center',
            width:150,

        },
        {
            title: '实际开始日期',
            dataIndex: 'actualBeginTime',
            key: 'actualBeginTime',
            align: 'center',
            width:150,
        },
        {
            title: '实际结束日期',
            dataIndex: 'actualEndTime',
            key: 'actualEndTime',
            align: 'center',
            width:150,

        },
        {
            title: '巡检频次',
            dataIndex: 'inspectionCycelName',
            key: 'inspectionCycelName',
            align: 'center',
        },

        {
            title: '校准频次',
            dataIndex: 'calibrationCycleName',
            key: 'calibrationCycleName',
            align: 'center',
        },
        {
            title: '参数核对频次',
            dataIndex: 'parameterCheckName',
            key: 'parameterCheckName',
            align: 'center',
        },

        {
            title: <span>操作</span>,
            dataIndex: 'x',
            key: 'x',
            align: 'center',
            render: (text, record) => {
                return <span>
                    <Fragment>
                        <Tooltip title="历史运营详情">
                            <a href="#" onClick={()=>{historyDetail(record)}}>  <BarChartOutlined style={{ fontSize: 16 }} /></a>
                        </Tooltip>
                    </Fragment>
                </span>
            }
        },
    ];


    const columns2 = [
        {
            title: '序号',
            align: 'center',
            width: 50,
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            key: 'projectCode',
            align: 'center',
        },
        {
            title: '运营起始日期',
            dataIndex: 'operationBeginTime',
            key: 'operationBeginTime',
            align: 'center',
            sorter: (a, b) => moment(a.operationBeginTime).valueOf() - moment(b.operationBeginTime).valueOf()
        },
        {
            title: '运营结束日期',
            dataIndex: 'operationEndTime',
            key: 'operationEndTime',
            align: 'center',
            sorter: (a, b) => moment(a.operationEndTime).valueOf() - moment(b.operationEndTime).valueOf()

        },
        {
            title: '实际开始日期',
            dataIndex: 'actualBeginTime',
            key: 'actualBeginTime',
            align: 'center',
            sorter: (a, b) => moment(a.actualBeginTime).valueOf() - moment(b.actualBeginTime).valueOf()
        },
        {
            title: '实际结束日期',
            dataIndex: 'actualEndTime',
            key: 'actualEndTime',
            align: 'center',
            sorter: (a, b) => moment(a.actualEndTime).valueOf() - moment(b.actualEndTime).valueOf()

        },
    ];








    const exports = async () => {
        const values = await form.validateFields();
        props.exportEntProjectRelationList({ ...values })
    };


    const onFinish = async () => {  //查询
        try {
            const values = await form.validateFields();
            const par = {
                ...values,
                OperatTime:undefined,
                ActualTime:undefined,
                OperationBeginTime: values.OperatTime&&moment(values.OperatTime[0]).format("YYYY-MM-DD HH:ss:mm"),
                OperationEndTime : values.OperatTime&&moment(values.OperatTime[1]).format("YYYY-MM-DD HH:ss:mm"),
                BeginTime: values.ActualTime&&moment(values.ActualTime[0]).format("YYYY-MM-DD HH:ss:mm"),
                EndTime : values.ActualTime&&moment(values.ActualTime[1]).format("YYYY-MM-DD HH:ss:mm"),
            }
            props.getEntProjectRelationList({ ...par })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    const historyDetail = (record) =>{
        setVisible(true)
        setEntTitle(`${record.parentName}-${record.pointName}`)
        props.getEntProjectRelationList({EntID:record.entID})
    }

    const searchComponents = () => {
        return <Form
            name="advanced_search"
            form={form}
            onFinish={onFinish}
        >

            <Row>
                <Form.Item name='EntName' label='企业名称' >
                    <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item label='行政区' name='RegionCode' style={{ margin: '0 8px', }}>
                    <RegionList levelNum={2} />
                </Form.Item>

                <Form.Item label='运营日期' name='OperatTime'>
                    <RangePicker_
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime="YYYY-MM-DD HH:mm:ss"
                        style={{minWidth:350}}
                        allowClear />
                </Form.Item>
                <Form.Item label='实际运营日期' name='ActualTime' style={{ marginLeft: 8, }}>
                    <RangePicker_
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime="YYYY-MM-DD HH:mm:ss"
                        style={{minWidth:350}}
                        allowClear />
                </Form.Item>
            </Row>
            <Row align='middle' style={{ paddingTop: 5 }}>
                <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" loading={tableLoading}>
                        查询
          </Button>
                    <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}  >
                        重置
          </Button>
                    <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
                        导出
          </Button>
                </Form.Item>
            </Row>

        </Form>
    }
    const [visible, setVisible] = useState(false)
    const [entTitle, setEntTitle] = useState(null)


    return (
        <div>
            <Card title={searchComponents()}>

                <SdlTable
                    loading={tableLoading}
                    bordered
                    dataSource={tableDatas}
                    columns={columns}
                />
            </Card>

            <Modal
                title={entTitle}
                visible={visible}
                footer={null}
                onCancel={() => { setVisible(false) }}
                destroyOnClose
                width='70%'
            // centered
            >
                <SdlTable
                    loading={props.historyOperationInfoLoading}
                    bordered
                    dataSource={props.historyOperationInfo}
                    columns={columns2}
                />
            </Modal>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);