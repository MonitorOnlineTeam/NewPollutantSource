/**
 * 功  能：台账填报设置
 * 创建人： jab
 * 创建时间：2022.10.11
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag,Switch, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,SnippetsOutlined,CheckCircleOutlined,CaretLeftFilled,CaretRightFilled, CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import styles from "./style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import NumTips from '@/components/NumTips'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'accountFillingSet'




const dvaPropsData =  ({ loading,accountFillingSet,global }) => ({
  tableDatas:accountFillingSet.tableDatas,
  tableLoading:loading.effects[`${namespace}/getEntAccountTypeList`],
  tableTotal:accountFillingSet.tableTotal,
  tableDetailDatas:accountFillingSet.tableDetailDatas,
  tableDetailTotal:accountFillingSet.tableDetailTotal,
  exportLoading: loading.effects[`${namespace}/exportEntAccountTypeList`],
  renewOrderLoading: loading.effects[`${namespace}/renewOrder`] || false,
  tableDetailLoading: loading.effects[`${namespace}/getStatePointList`],
  entStateList:accountFillingSet.entStateList,
  StateEntID:accountFillingSet.StateEntID,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getPointByEntCode: (payload, callback) => { // 烟气企业名称列表
      dispatch({
        type: `${namespace}/getPointByEntCode`,
        payload: payload,
        callback: callback
      })
    },

    getEntAccountTypeList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getEntAccountTypeList`,
        payload:payload,
      })
    },
    addOrUpaAccountType : (payload,callback) =>{ // 废气点位校准信息填报方式
      dispatch({
        type: `${namespace}/addOrUpaAccountType`,
        payload:payload,
        callback:callback,
      })
      
    },
    exportEntAccountTypeList:(payload,callback)=>{ //导出
      dispatch({
        type: `${namespace}/exportEntAccountTypeList`, 
        payload:payload,
        callback:callback
      }) 
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();



  
  


  const  { tableDatas,tableTotal,tableLoading,exportLoading,} = props; 
  


 
 useEffect(()=>{  
      onFinish();
  },[])
  let columns = [
    {
      title: '序号',
      align:'center',
      ellipsis:true,
      width:70,
      render:(row,text,index)=>{
        return index + 1
      }
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '行政区',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      ellipsis:true,
    },
  
    {
      title: '废气点位校准信息填报方式',
      align: 'center',
      dataIndex: 'type',
      key:'type',
      ellipsis:true,
      render: (text, record) =>{
        return  <span>
               <Switch checkedChildren="电子台账" unCheckedChildren="拍照上传"  defaultChecked={text==1?true : false} onChange={(checked)=>{fillingMethodChange(checked,record)}} />
             </span>
      }
    },
  ];








  const fillingMethodChange = (checked,record) => {
    props.addOrUpaAccountType({ID:record.id,EntID:record.entID,type:checked?1:2},()=>{
      onFinish(pageIndex,pageSize);
    })
  };

  


  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询

    try {
      const values = await form.validateFields();

      if(!(pageIndexs&& typeof  pageIndexs === "number")){ //不是分页的情况
        setPageIndex(1)
      }
      props.getEntAccountTypeList({
        ...values,
        pageIndex:pageIndexs&& typeof  pageIndexs === "number" ?pageIndexs:1,
        pageSize:pageSizes?pageSizes:pageSize
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }




  const exports = async () => {
    const values = await form.getFieldsValue();
    const par = {
      ...values,
    }
    props.exportEntAccountTypeList({...par})
};

  






  const searchComponents = () =>{
    return <Form
    form={form}
    name="advanced_search"
    onFinish={() => { onFinish(pageIndex, pageSize) }}
    initialValues={{
    }}
    className={styles.queryForm}
    layout='inline'
  >
       <Form.Item label='企业名称' name='entName'>
        <Input placeholder='请输入' style={{ width: 200}} allowClear/>
      </Form.Item>
      <Form.Item label='行政区' name='regionCode'>
        <RegionList levelNum={2} style={{ width: 200}}/>
      </Form.Item>
        <Form.Item label='废气点位校准信息填报方式' name='type' >
          <Select placeholder='请选择' allowClear style={{ width: 120}}>
         <Option key={1} value={1} >电子台账</Option>
         <Option key={2} value={2} >拍照上传</Option>
          </Select>
        </Form.Item>
      <Form.Item>
        <Button type="primary" loading={tableLoading} htmlType="submit">
          查询
       </Button>
        <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
          重置
        </Button>
        <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
          导出
       </Button>
      </Form.Item>
      <span className='red'>本页面设置污染源烟气监测点校准台账的填报方式，只针对废气监测点，VOC监测点除外。</span>
  </Form>
  }


const modalSearchComponents = () =>{
   return <Form
    form={form2}
    name="advanced_search"
    onFinish={() => {setPageIndex2(1); onFinish2(1, pageSize2) }}
    layout='inline'
    initialValues={{
    }}
    className={styles.queryForm}
    onValuesChange={onDetailValuesChange}
  >
      <Form.Item label='企业' name='StateEntID'>      
        <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 200}}>
            {
              entStateList[0] && entStateList.map(item => {
                return <Option key={item.EntCode} value={item.EntCode} >{item.EntName}</Option>
              })
            }
          </Select>
      </Form.Item>
      <Spin spinning={pointLoading2} size='small' style={{ top: 0, left: 20 }}>
        <Form.Item label='监测点名称' name='StateID' >

          <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 200}}>
            {
              pointList2[0] && pointList2.map(item => {
                return <Option key={item.PointCode} value={item.PointCode} >{item.PointName}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Spin>
        <Button type="primary" loading={tableDetailLoading} htmlType="submit">
          查询
       </Button>


  </Form>
  }




  const [pageIndex,setPageIndex]=useState(1)
  const [pageSize,setPageSize]=useState(20)
  const handleTableChange = (PageIndex, PageSize) =>{
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex,PageSize)
  }




  const cardComponents = () =>{
    return  <Card title={searchComponents()}>
    <SdlTable
      loading = {tableLoading}
      bordered
      resizable
      dataSource={tableDatas}
      columns={columns}
      pagination={{
        total:tableTotal,
        pageSize: pageSize,
        current: pageIndex,
        onChange: handleTableChange,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
 </Card>
   }
   return (
    <div  className={styles.accountFillingSetSty} >
    <BreadcrumbWrapper>
       {cardComponents()}
   </BreadcrumbWrapper>
 
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);