

/**
 * 功  能：污染源信息 监测点信息
 * 创建人：jab
 * 创建时间：2022.04.02
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
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

const namespace = 'pollutantInfo'




const dvaPropsData = ({ loading, pollutantInfo, global }) => ({
    tableDatas: pollutantInfo.pointListTableDatas,
    tableTotal: pollutantInfo.pointListTableTotal,
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
    
    const [columns,setColumns]= useState([
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
            title: '设备编号(MN)',
            dataIndex: 'DGIMN',
            key: 'DGIMN',
            align: 'center',
        },
        {
            title: '经纬度',
            dataIndex: 'longitude',
            key: 'longitude',
            align: 'center',
            render: (text, record, index) => {
                return `${text},${record.latitude}`
            }
        },
        {
            title: '污染源类型',
            dataIndex: 'pollutantTypeName',
            key: 'pollutantTypeName',
            align: 'center',
            width:130,
        },
        {
            title: '运维状态',
            dataIndex: 'operationStatus',
            key: 'operationStatus',
            align: 'center',
        },
        {
            title: '是否判断缺失数据',
            dataIndex: 'judgeMiss',
            key: 'judgeMiss',
            align: 'center',
        },
        {
            title: '运维负责人',
            dataIndex: 'PlatformNum',
            key: 'PlatformNum',
            align: 'center',
        },
    ])



    const onFinish = async (pageIndexs, pageSizes) => {  //查询
        try {
            const values = await form.validateFields();
            
            props.getTableData({
                ...values,
                pageIndex: pageIndexs,
                pageSize: pageSizes
            },()=>{
                if( values.pollutantType==2){
                    columns.splice(columns.length-3,0,{
                        title: '排口类型',
                        dataIndex: 'outPutType',
                        key: 'outPutType',
                        align: 'center',
                    },{
                        title: 'CEMS监测原理',
                        dataIndex: 'CEMSPrinciple',
                        key: 'CEMSPrinciple',
                        align: 'center',
                    },{
                        title: 'CEMS类型',
                        dataIndex: 'CEMSType',
                        key: 'CEMSType',
                        align: 'center',  
                    })
                }else{
                   setColumns(columns.filter(item=>item.outPutType!='CEMS监测原理'&&item.CEMSPrinciple!='CEMS监测原理'&&item.CEMSType!='CEMS类型'))
                }
            })

           
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }




    const handleTableChange = (PageIndex, PageSize) => {
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
            onFinish={() => { onFinish(pageIndex, pageSize) }}
            initialValues={{
                pollutantType: 1
            }}
        >  
           <Row>

           <Form.Item label='企业名称' name='entName'>
            <Input allowClear placeholder='请输入'/>
           </Form.Item>
            <Form.Item label='行政区' name='regionCode' style={{padding:'0 8px'}}>
                <RegionList levelNum={2} />
            </Form.Item>

            <Form.Item label = '监测点类型' name='pollutantType' >
              <Select placeholder='请选择' style={{width:200}}>
                <Option value={1}>废水</Option>
                <Option value={2}>废气</Option>
               </Select>
             </Form.Item>
            </Row>
            <Row  align='middle' style={{  paddingTop:5 }}>
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
         <span style={{ color: '#f5222d', fontSize: 14,margin: '0 8px' }}>
            下面列表只展示当前在运营的监测点，运营到期的监测点将不再显示。
           </span>
            </Form.Item>
            </Row>
        </Form>

        </>
    }
    return (
        <div className={styles.pollutantInfoSty}>
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
                />
            </Card>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);

