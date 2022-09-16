

/**
 * 功  能：调试检测 - 污染源查询 CEMS设备信息
 * 创建人：jab
 * 创建时间：2022.07.20
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

const namespace = 'pollutantQuery'




const dvaPropsData = ({ loading, pollutantQuery, global,point }) => ({
    tableDatas: pollutantQuery.testPointEquipmentTableDatas,
    tableTotal: pollutantQuery.testPointEquipmentTableTotal,
    tableLoading: loading.effects[`${namespace}/getTestPointEquipmentList`],
    exportLoading: loading.effects[`${namespace}/exportTestPointEquipmentList`],
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
                type: `${namespace}/getTestPointEquipmentList`,
                payload: payload,
                callback:callback
            })
        },
        exportData: (payload, callback) => { // 导出
            dispatch({
                type: `${namespace}/exportTestPointEquipmentList`,
                payload: payload,
                callback: callback
            })

        },


    }
}
const Index = (props) => {



    const [form] = Form.useForm();

    const [manufacturerId, setManufacturerId] = useState(undefined)

    const { tableDatas, tableTotal, tableLoading, exportLoading,pollutantTypeList,pollutantByIdLoading,pollutantTypeList2,loadingGetPollutantById2 } = props;


    useEffect(() => {
          onFinish(pageIndex, pageSize);    


      
    }, []);
    
    const [columns,setColumns]= useState([
        {
            title: '序号',
            dataIndex: 'Sort',
            key: 'Sort',
            align: 'center',
            width: 50,
            ellipsis:true,
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
            title: '监测参数',
            dataIndex: 'pollutantName',
            key: 'pollutantName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '生产厂家',
            dataIndex: 'manufactorName',
            key: 'manufactorName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '设备型号',
            dataIndex: 'equipmentModel',
            key: 'equipmentModel',
            align: 'center',
            ellipsis:true,
        },
        {
            title: 'CEMS测试原理',
            dataIndex: 'equipmentModel',
            key: 'equipmentModel',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '出厂编号',
            dataIndex: 'factoryNumber',
            key: 'factoryNumber',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '量程',
            dataIndex: 'Range',
            key: 'Range',
            align: 'center',
            ellipsis:true,
            render:(text,record)=>{
               if(record.minRange || record.maxRange){
                return `${record.minRange}~${record.maxRange}`
               }
            }
        },
        {
            title: '量程校准标气/标准装置值',
            dataIndex: 'rangeCalibration',
            key: 'rangeCalibration',
            align: 'center',
            width:200,
            ellipsis:true,
        },
        {
            title: '计量单位',
            dataIndex: 'unit',
            key: 'unit',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '评价依据',
            dataIndex: 'evaluationBasis',
            key: 'evaluationBasis',
            align: 'center',
            ellipsis:true,
        },
    ])



    const onFinish = async (pageIndexs, pageSizes) => {  //查询
        
        try {
            const values = await form.validateFields();
             setPageIndex(pageIndexs)
            props.getTableData({
                ...values,
                ManufacturerId: manufacturerId,
                pageIndex: pageIndexs,
                pageSize: pageSizes
            },()=>{
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
    const onValuesChange = (hangedValues, allValues)=>{
      }
    
    const [pageSize, setPageSize] = useState(20)
    const [pageIndex, setPageIndex] = useState(1)

    const searchComponents = () => {
        return <><Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish(1, pageSize) }}
            onValuesChange={onValuesChange}
            layout='inline'
        >  
           <Form.Item label='企业名称' name='entName'>
             <Input allowClear placeholder='请输入'/>
            </Form.Item>
        
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

