

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
    tableDatas: pollutantInfo.deviceInfoTableDatas,
    tableTotal: pollutantInfo.deviceInfoTableTotal,
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
        getTableData: (payload,callback) => { //列表
            dispatch({
                type: `${namespace}/getEquipmentParametersOfPont`,
                payload: payload,
                callback:callback
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
                    form.setFieldsValue({PollutantType:res[1]?res[1].ID:undefined})
                    onFinish(pageIndex, pageSize);    
                    props.getPollutantById2({id:res[1]?res[1].ID:'',type:1},()=>{
                        form.setFieldsValue({PollutantCode:undefined})
                      }) //监测类别
                }

            })
           

      
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
            title: '行政区',
            dataIndex: 'RegionName',
            key: 'RegionName',
            align: 'center',
            ellipsis:true,
        },

        {
            title: '企业名称',
            dataIndex: 'EntName',
            key: 'EntName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '监测点名称',
            dataIndex: 'PointName',
            key: 'PointName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '监测参数',
            dataIndex: 'PollutantName',
            key: 'PollutantName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '设备名称',
            dataIndex: 'EquipmentName',
            key: 'EquipmentName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '设备型号',
            dataIndex: 'EquipmentType',
            key: 'EquipmentType',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '设备序列号',
            dataIndex: 'EquipmentNumber',
            key: 'EquipmentNumber',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '设备厂家',
            dataIndex: 'ManufacturerName',
            key: 'ManufacturerName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '量程',
            dataIndex: 'Range',
            key: 'Range',
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
                if( values.PollutantType=='31f8f6f9-5700-443b-8570-9229b36fa00c'){ //废气
                    if(!columns.filter(item=>item.title=='配备')[0]){
                        columns.splice(columns.length-1,0,{
                            title: '配备',
                            dataIndex: 'Equipment',
                            key: 'Equipment',
                            align: 'center',
                        })
                    }

                }else{
                   setColumns(columns.filter(item=>item.title!='配备'))
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

          if(Object.keys(hangedValues).join() == 'Sort'){ //设备类型
             onFinish(1,pageSize)
        }
      }
    
    const [pageSize, setPageSize] = useState(20)
    const [pageIndex, setPageIndex] = useState(1)

    const searchComponents = () => {
        return <><Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish(1, pageSize) }}
            onValuesChange={onValuesChange}
        >  
           <Row>
           <Form.Item label='企业名称' name='EntName'>
             <Input allowClear placeholder='请输入'/>
            </Form.Item>
            <Form.Item label='行政区' name='RegionCode' style={{margin:'0 8px'}}>
                <RegionList levelNum={2} style={{width:165}} />
            </Form.Item>
            <Spin spinning={pollutantByIdLoading} size='small' style={{ top: 0, left: 20 }}>
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
             <Spin spinning={loadingGetPollutantById2} size='small' style={{ top: 0, left: 20 }}>
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
            <Form.Item name='Sort' style={{ margin: '0 8px' }}>
            <Radio.Group defaultValue={undefined} buttonStyle="solid">
                 <Radio.Button value={undefined}>全部</Radio.Button>
                 <Radio.Button value="1">已维护设备</Radio.Button>
                 <Radio.Button value="0">未维护设备</Radio.Button>
              </Radio.Group>
              </Form.Item>
            </Row>
        </Form>
        </>
    }
    return (
        <div className={styles.pollutantInfoSty}>
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

