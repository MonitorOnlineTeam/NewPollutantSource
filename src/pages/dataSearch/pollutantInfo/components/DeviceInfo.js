

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




const dvaPropsData = ({ loading, pollutantInfo, global,point }) => ({
    tableDatas: pollutantInfo.verificationTableDatas,
    tableTotal: pollutantInfo.verificationTableTotal,
    tableLoading: loading.effects[`${namespace}/getEquipmentParametersOfPont`],
    exportLoading: loading.effects[`${namespace}/exportEquipmentParametersOfPont`],
    clientHeight: global.clientHeight,
    pollutantTypeList:pollutantInfo.pollutantTypeList,
    pollutantByIdLoading: loading.effects[`${namespace}/getPollutantById`] || false,
    pollutantTypeList2: point.pollutantTypeList2,
    loadingGetPollutantById2: loading.effects[`point/getPollutantById2`] || false,
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
                type: `${namespace}/getEquipmentParametersOfPont`,
                payload: payload,
            })
        },
        exportData: (payload, callback) => { // 导出
            dispatch({
                type: `${namespace}/exportEquipmentParametersOfPont`,
                payload: payload,
                callback: callback
            })

        },
        getPollutantById: (payload,callback) => { //监测类型
            dispatch({
              type: `${namespace}/getPollutantById`,
              payload: payload,
              callback:callback,
            })
          },
          getPollutantById2: (payload,callback) => { //监测类别
            dispatch({
              type: `point/getPollutantById2`,
              payload: payload,
              callback:callback
            })
          },

    }
}
const Index = (props) => {



    const [form] = Form.useForm();

    const [manufacturerId, setManufacturerId] = useState(undefined)

    const { tableDatas, tableTotal, tableLoading, exportLoading,pollutantTypeList,pollutantByIdLoading,pollutantTypeList2,loadingGetPollutantById2 } = props;


    useEffect(() => {
            props.getPollutantById({id:undefined},(res)=>{
                if(res){
                    form.setFieldsValue({PollutantType:res?res[1].ID:undefined})
                    props.getPollutantById2({id:res?res[1].ID:'',type:1},()=>{
                        form.setFieldsValue({PollutantCode:undefined})
                        onFinish(pageIndex, pageSize);
                      }) //监测类别
                }

            })
            

      
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
    const onValuesChange = (hangedValues, allValues)=>{
        if(Object.keys(hangedValues).join() == 'PollutantType'){
          props.getPollutantById2({id:hangedValues.PollutantType,type:1},()=>{
            form.setFieldsValue({PollutantCode:undefined})

          }) //监测类别
        }
      }
    
    const [pageSize, setPageSize] = useState(20)
    const [pageIndex, setPageIndex] = useState(1)

    const searchComponents = () => {
        return <><Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish(pageIndex, pageSize) }}
            onValuesChange={onValuesChange}
        >  
           <Row>
           <Form.Item label='企业名称' name='EntName'>
             <Input allowClear placeholder='请输入'/>
            </Form.Item>
            <Form.Item label='行政区' name='RegionCode' style={{padding:'0 8px'}}>
                <RegionList levelNum={2} />
            </Form.Item>
            <Spin spinning={pollutantByIdLoading} size='small' style={{ top: -5, left: 20 }}>
            <Form.Item label = '监测点类型' name='PollutantType' >
              <Select placeholder='请选择' style={{width:200}}>
              {
                  pollutantTypeList[0] && pollutantTypeList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
                  })
                }
               </Select>
             </Form.Item>
             </Spin> 
             <Spin spinning={loadingGetPollutantById2} size='small' style={{ top: -5, left: 20 }}>
              <Form.Item label='监测参数' name='PollutantCode' style={{marginLeft:8}}>
                <Select placeholder='请选择' showSearch optionFilterProp="children"  style={{width:200}}>

                {
                  pollutantTypeList2[0] && pollutantTypeList2.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
                  })
                }
                </Select>
              </Form.Item>
            </Spin> 
            </Row>
            <Row style={{marginBottom:0,  paddingTop:5 }}>
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
                    scroll={{y:'calc(100vh - 400px)'}}
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

