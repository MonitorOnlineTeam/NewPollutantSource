

/**
 * 功  能：调试检测 - 污染源查询 点位信息
 * 创建人：jab
 * 创建时间：2022.07.20
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag,Space, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined,FilterFilled, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import NumTips from '@/components/NumTips'
import styles from "../style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'pollutantQuery'




const dvaPropsData = ({ loading, pollutantQuery, global }) => ({
    tableDatas: pollutantQuery.pointListTableDatas,
    tableTotal: pollutantQuery.pointListTableTotal,
    tableLoading: loading.effects[`${namespace}/getPointInfoList`],
    exportLoading: loading.effects[`${namespace}/exportPointInfoList`],
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
        getTableData: (payload,callback) => { //列表
            dispatch({
                type: `${namespace}/getPointInfoList`,
                payload: payload,
                callback:callback
            })
        },
        exportData: (payload, callback) => { // 导出
            dispatch({
                type: `${namespace}/exportPointInfoList`,
                payload: payload,
                callback: callback
            })

        },


    }
}
const Index = (props) => {



    const [form] = Form.useForm();

    const [manufacturerId, setManufacturerId] = useState(undefined)

    const { tableDatas, tableTotal, tableLoading, exportLoading } = props;


    useEffect(() => {
        onFinish(pageIndex, pageSize)
    }, []);
  
    const [filteredInfo,setFilteredInfo] = useState(null) 

    const columns = [
        {
            title: '序号',
            align: 'center',
            width: 50,
            ellipsis:true,
            render: (text, record, index) => {
                return  (index + 1) + (pageIndex-1)*pageSize;
            }
        },
        {
            title: '企业名称',
            dataIndex: 'entName',
            key: 'entName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '监测点名称',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '调试次数',
            dataIndex: 'DGIMN',
            key: 'DGIMN',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '测试人员',
            dataIndex: 'longitude',
            key: 'longitude',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '编制人',
            dataIndex: 'pollutantTypeName',
            key: 'pollutantTypeName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '校核人',
            dataIndex: 'operationStatus',
            key: 'operationStatus',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '批准人',
            dataIndex: 'judgeMiss',
            key: 'missData',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '检测开始日期',
            dataIndex: 'operationName',
            key: 'operationUser',
            align: 'center',
            width:150,
            ellipsis:true,
        },
        {
            title: '检测结束日期',
            dataIndex: 'operationName',
            key: 'operationUser',
            align: 'center',
            width:150,
            ellipsis:true,
        },
        {
            title: '检测结束日期',
            dataIndex: 'operationName',
            key: 'operationUser',
            align: 'center',
            width:150,
            ellipsis:true,
        },
        {
            title: '校准颗粒物方法',
            dataIndex: 'operationName',
            key: 'operationUser',
            align: 'center',
            width:150,
            ellipsis:true,
        },
        {
            title: '流速CMS调试检测',
            dataIndex: 'operationName',
            key: 'operationUser',
            align: 'center',
            width:150,
            ellipsis:true,
        },
        {
            title: '检测完成状态',
            dataIndex: 'operationName',
            key: 'operationUser',
            align: 'center',
            width:150,
            ellipsis:true,
        },
        {
            title: '创建人',
            dataIndex: 'operationName',
            key: 'operationUser',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '创建时间',
            dataIndex: 'operationName',
            key: 'operationUser',
            align: 'center',
            ellipsis:true,
        },
    ]



    const onFinish = async (pageIndexs, pageSizes,) => {  //查询
        try {
            const values = await form.validateFields();

            props.getTableData({
                ...values,
                pageIndex: pageIndexs,
                pageSize: pageSizes,
            },()=>{})

           
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }




    const handleTableChange = (PageIndex, PageSize,) => {
        setPageIndex(PageIndex)
        setPageSize(PageSize)
        onFinish(PageIndex, PageSize)
    }

    const exports = async () => {
        const values = await form.validateFields();
        props.exportData({
            ...values,
            PageIndex: undefined,
            PageSize: undefined,
        })

    };
    const [pageSize, setPageSize] = useState(20)
    const [pageIndex, setPageIndex] = useState(1)

    const searchComponents = () => {
        return <><Form
            form={form}
            name="advanced_search"
            onFinish={() => {setPageIndex(1);  onFinish(1, pageSize,filteredInfo) }}
            initialValues={{
                pollutantType: 1
            }}
            layout='inline'
        >  


           <Form.Item label='企业名称' name='entName'>
            <Input allowClear placeholder='请输入'/>
           </Form.Item>

            <Form.Item label = '点位完成状态' name='pollutantType' >
              <Select placeholder='请选择' style={{width:200}}>
               <Option value={2}>废气</Option>
                <Option value={1}>废水</Option>
               
               </Select>
             </Form.Item>
            <Form.Item style={{marginBottom:0}}>
                <Button loading={tableLoading} type="primary" loading={tableLoading} htmlType="submit">
                    查询
       </Button>
                <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
                    重置
        </Button>
                <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
                    导出
         </Button>
            </Form.Item>
        </Form>

        </>
    }
    return (
        <div className={styles.pollutantQuerySty}>
            <Card title={searchComponents()}>
                <SdlTable
                    resizable
                    loading={tableLoading}
                    bordered
                    dataSource={tableDatas}
                    columns={columns}
                    className={styles.pointInfoSty}
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
