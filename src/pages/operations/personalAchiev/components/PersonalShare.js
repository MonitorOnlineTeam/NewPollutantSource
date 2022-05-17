/**
 * 功  能：个人绩效查  个人分摊套数
 * 创建人：jab
 * 创建时间：2022.05.17
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, ProfileOutlined, CodeSandboxCircleFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import RegionList from '@/components/RegionList'
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import styles from "../style.less";
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;

const namespace = 'personalAchiev'




const dvaPropsData = ({ loading, personalAchiev, autoForm }) => ({
    tableTotal: personalAchiev.operationInfoTableTotal,
    tableDatas: personalAchiev.operationInfoTableDatas,
    tableLoading: personalAchiev.projectRelationLoading,
    historyOperationInfo:personalAchiev.historyOperationInfo,
    historyOperationInfoLoading: personalAchiev.historyProjectRelationLoading,
    exportLoading: loading.effects[`${namespace}/exportEntProjectRelationList`],
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










    const {tableTotal, tableDatas, tableLoading, exportLoading } = props;


    useEffect(() => {

        initData();

    }, [props.DGIMN]);


    const initData = () => {
        onFinish(pageIndex,pageSize);
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
            title: '员工编号',
            dataIndex: 'regionName',
            key: 'regionName',
            align: 'center',
        },
        {
            title: '姓名',
            dataIndex: 'parentName',
            key: 'parentName',
            align: 'center',
        },
        {
            title: '污染源水绩效套餐',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center'
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
                            <a href="#" onClick={()=>{detail(record)}}>  <ProfileOutlined style={{ fontSize: 16 }} /></a>
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
            title: '行政区',
            dataIndex: 'regionCode',
            key: 'regionCode',
            align: 'center',
        },
        {
            title: '企业名称',
            dataIndex: 'entName',
            key: 'entName',
            align: 'center',
        },
        {
            title: '监测点名称',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',

        },
        {
            title: '污染源类型',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',
            width:120,
        },
        {
            title: '员工编号',
            dataIndex: 'actualBeginTime',
            key: 'actualBeginTime',
            align: 'center',
        },
        {
            title: '个人分摊套数',
            dataIndex: 'actualEndTime',
            key: 'actualEndTime',
            align: 'center',
            sorter: (a, b) => a.actualEndTime - b.actualEndTime

        },
    ];








    const exports = async () => {
        props.exportEntProjectRelationList({ID:id })
    };


    const onFinish = async (pageIndexs, pageSizes) => {  //查询
        try {
            const values = await form.validateFields();
            const par = {
                ...values,
                pageIndex: pageIndexs,
                pageSize: pageSizes,
                month: values.month&&moment(values.month).format("YYYY-MM-01 00:00:00"),
            }
            props.getEntProjectRelationList({ ...par })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    const [ id,setId ] = useState(null)
    const detail = (record) =>{
        setVisible(true)
        setEntTitle(`${record.parentName}-${record.pointName}`)
        setId(record.ID),
        setPageIndex(1)  
        props.getEntProjectRelationList({ID:record.ID,pageIndex:1,pageSize:pageSize,})
    }

    const [pageSize, setPageSize] = useState(20)
    const [pageIndex, setPageIndex] = useState(1)
    const handleTableChange = (PageIndex, PageSize) => {
        setPageIndex(PageIndex)
        setPageSize(PageSize)
        props.getEntProjectRelationList({ID:id,pageIndex:PageIndex,pageSize:PageSize,})

    }
    const searchComponents = () => {
        return <Form
            name="advanced_search"
            form={form}
            layout='inline'
            onFinish={() => { onFinish(pageIndex, pageSize) }}
        >


                <Form.Item label='统计月份' name='month'>
                    <RangePicker 
                        style={{minWidth:350}}
                        picker="month" 
                        allowClear />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" loading={tableLoading}>
                        查询
          </Button>
                    <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}  >
                        重置
          </Button>
                </Form.Item>

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
                    pagination={false}
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
           <Button style={{marginBottom:10}} icon={<ExportOutlined />}   loading={exportLoading}  onClick={()=>{ exports()} }>
             导出
           </Button> 
                <SdlTable
                    loading={props.historyOperationInfoLoading}
                    bordered
                    dataSource={props.historyOperationInfo}
                    columns={columns2}
                    pagination={{
                        total: tableTotal,
                        pageSize: pageSize,
                        current: pageIndex,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        onChange: handleTableChange,
                    }}
                />
            </Modal>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);