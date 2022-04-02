

/**
 * 功  能：污染源信息 设备信息
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
    tableDatas: pollutantInfo.verificationTableDatas,
    tableTotal: pollutantInfo.verificationTableTotal,
    tableLoading: loading.effects[`${namespace}/getVerificationItemOfPoint`],
    exportLoading: loading.effects[`${namespace}/exportVerificationItemOfPoint`],
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
        getTableData: (payload) => { //列表
            dispatch({
                type: `${namespace}/getVerificationItemOfPoint`,
                payload: payload,
            })
        },
        exportData: (payload, callback) => { // 导出
            dispatch({
                type: `${namespace}/exportVerificationItemOfPoint`,
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
            dataIndex: 'RegionName',
            key: 'RegionName',
            align: 'center',
        },

        {
            title: '企业名称',
            dataIndex: 'EntName',
            key: 'EntName',
            align: 'center',
        },
        {
            title: '监测点名称',
            dataIndex: 'PointName',
            key: 'PointName',
            align: 'center',
        },
        {
            title: '监测参数',
            dataIndex: 'PollutantTypeName',
            key: 'PollutantTypeName',
            align: 'center',
        },
        {
            title: '设备名称',
            dataIndex: 'RealtimePollutantName',
            key: 'RealtimePollutantName',
            align: 'center',
        },
        {
            title: '设备型号',
            dataIndex: 'HourPollutantName',
            key: 'HourPollutantName',
            align: 'center',
        },
        {
            title: '设备序列号',
            dataIndex: 'PlatformNum',
            key: 'PlatformNum',
            align: 'center',
        },
        {
            title: '设备厂家',
            dataIndex: 'PlatformNum',
            key: 'PlatformNum',
            align: 'center',
        },
        {
            title: '量程',
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
                ManufacturerId: manufacturerId,
                pageIndex: pageIndexs,
                pageSize: pageSizes
            },()=>{
                if( values.pollutantType==2){
                    columns.splice(columns.length-1,0,{
                        title: '配备',
                        dataIndex: 'PlatformNum',
                        key: 'PlatformNum',
                        align: 'center',
                    })
                }else{
                   setColumns(columns.filter(item=>item.Name!='配备'))
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
            pageIndex: undefined,
            pageSize: undefined,
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
            <Form.Item label='行政区' name='RegionCode' >
                <RegionList levelNum={2} />
            </Form.Item>
            <Form.Item label='企业' name='EntName'style={{padding:'0 8px'}}>
             <Input allowClear placeholder='请输入'/>
            </Form.Item>
            <Form.Item label = '监测点类型' name='pollutantType' >
              <Select placeholder='请选择' style={{width:200}}>
                <Option value={1}>废水</Option>
                <Option value={2}>废气</Option>
               </Select>
             </Form.Item>
             <Form.Item label = '监测参数' name='pollutantTypes' style={{padding:'0 8px'}}>
              <Select placeholder='请选择' style={{width:200}}>
                <Option value={1}>废水</Option>
                <Option value={2}>废气</Option>
               </Select>
             </Form.Item>
            </Row>
            <Row style={{  paddingTop:5 }}>
            <Form.Item>
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

