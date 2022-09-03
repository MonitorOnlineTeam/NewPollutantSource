/**
 * 功  能：模板
 * 创建人：jab
 * 创建时间：2022.08.11
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Spin,   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import NumTips from '@/components/NumTips'
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'hourCommissionTest'




const dvaPropsData =  ({ loading,hourCommissionTest,commissionTest, }) => ({
  tableDatas:hourCommissionTest.tableDatas,
  tableLoading:loading.effects[`${namespace}/addSystemModel`],
  tableTotal:hourCommissionTest.tableTotal,

})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getSystemModelList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getSystemModelList`,
        payload:payload,
      })
    },
    
  }
}
const Index = (props) => {



  const [form] = Form.useForm();


  
  const  { tableDatas,tableTotal,tableLoading, } = props; 
  useEffect(() => {
    
  },[]);

  const columns = [
    {
      title: '编号',
      dataIndex: 'Num',
      key:'Num',
      align:'center',
    },
    {
      title: '设备厂家',
      dataIndex: 'ManufactorName',
      key:'ManufactorName',
      align:'center',
    },
    {
      title: '系统名称',
      dataIndex: 'SystemName',
      key:'SystemName',
      align:'center',
    },
    {
      title: '系统型号',
      dataIndex: 'SystemModel',
      key:'SystemModel',
      align:'center',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key:'Status', 
      align:'center',
      render: (text, record) => {
        if (text === 1) {
          return <span><Tag color="blue">启用</Tag></span>;
        }
        if (text === 2) {
          return <span><Tag color="red">停用</Tag></span>;
        }
      },
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      width:180,
      render: (text, record) =>{
        return  <span>
               <Fragment><Tooltip title="编辑"> <a onClick={()=>{edit(record)}} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="确定要删除此条信息吗？"   style={{paddingRight:5}}  onConfirm={()=>{ del(record)}} okText="是" cancelText="否">
                  <a><DelIcon/></a>
               </Popconfirm>
               </Tooltip>
               </Fragment> 
             </span>
      }
    },
  ];


  const edit = async (record) => {
    setFromVisible(true)
    setType('edit')
    form2.resetFields();
    try {
      form2.setFieldsValue({
        ...record,
        SystemName:record.ChildID,
      })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const del =  async(record) => {
    const values = await form.validateFields();
    props.delSystemModel({ID:record.ID},()=>{
      setPageIndex(1)
      props.getSystemModelList({
        pageIndex: 1,
        pageSize: pageSize,
        ...values,
      })
    })
  };



  
  






  const searchComponents = () =>{
    return  <Form
    form={form}
    name="advanced_search"
    initialValues={{ }}
    className={styles["ant-advanced-search-form"]}
  >   
      <Row>
        <Form.Item label="设备厂家" name="ManufactorID" >
             {/* <Select placeholder='请选择设备厂家' allowClear showSearch
             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
             style={{width:200}}>
                {
               manufacturerList[0]&&manufacturerList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.ManufactorName}</Option>
                  })
                } 
              </Select> */}
      </Form.Item>
      <Form.Item label="系统名称" name="SystemName"  style={{margin:'0 16px'}}>
              {/* {systemModelNameListLoading?<Spin size='small'/>
              :
              <Select placeholder='请选择系统名称' allowClear style={{width:200}}>
              {
               systemModelNameList[0]&&systemModelNameList.map(item => {
                 return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
               })
             }   
           </Select>
        } */}
      </Form.Item>

      </Row>
      <Row>
       <Form.Item label="型号" name="SystemModel" >
        <Input placeholder='请输入系统型号' style={{width:200}} allowClear/>

      </Form.Item>
      <Form.Item label="状态" name="Status"   style={{margin:'0 16px'}}  >
       <Select placeholder='请选择状态' allowClear style={{width:200}}>
           <Option key={1} value={1}>启用</Option>
           <Option key={2} value={2}>停用</Option>
        </Select>
      </Form.Item>
      <Form.Item>
      <Button   type="primary" htmlType='submit' style={{marginRight:8}}>
          查询
     </Button>
     <Button   onClick={()=>{ form.resetFields()}} style={{marginRight:8}}>
          重置
     </Button>
     <Button   onClick={()=>{ add()}} >
          添加
     </Button>
     </Form.Item>
     </Row>
     </Form>
  }
  
  return (
    <div  className={styles.hourCommissionTestSty}>
    <Card title={searchComponents()}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={false}
      />
   </Card>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);