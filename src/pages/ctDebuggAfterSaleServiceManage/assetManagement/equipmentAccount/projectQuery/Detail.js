/**
 * 功  能：项目查询详情  成套
 * 创建人：jab
 * 创建时间：2021.08.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Spin,Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import PageLoading from '@/components/PageLoading'

import styles from "./style.less"
const { Option } = Select;

const namespace = 'common'




const dvaPropsData =  ({ loading,projectManager }) => ({
  detailLoading: loading.effects[`${namespace}/getCTProjectList`],
})

const  dvaDispatch = (dispatch) => {
  return {
    getCTProjectList : (payload,callback) =>{ 
      dispatch({
        type: `${namespace}/getCTProjectList`,
        payload:payload,
        callback:callback,
      })
      
    },

  }
}
const Index = (props) => {




  
  const {code} = props;
  

  const [data,setData] = useState({})
  useEffect(() => {
    if(code){
      props.getCTProjectList({
        projectCode:code
      },(res)=>{
        setData(res)
      })
    }else{
      setData(props.data)
    }
   
  },[]);
 


 


  return (
    <Spin spinning={!!props.detailLoading}>
    <Form>
      <Row>
        <Col span={8}>
        <Form.Item label="服务流水号" >
        {data?.SerialNum}
      </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="项目名称">
        {data?.ProjectName}
      </Form.Item>
      </Col>
        <Col span={8}>
        <Form.Item label="合同编号" >
        {data?.ProjectCode}
      </Form.Item>
      </Col>
      <Col span={8}>
      <Form.Item label="合同签订人">
      {data?.SignName}
      </Form.Item>
      </Col>
        <Col span={8}>
        <Form.Item label="立项号">
        {data?.ItemCode}
      </Form.Item>
      </Col>
      <Col span={8}>
      <Form.Item label="签约客户名称"  >
        {data?.CustomName}
      </Form.Item>
      </Col>
        <Col span={8}>
        <Form.Item label="最终用户单位"  >
        {data?.CustomEnt}
      </Form.Item>
      </Col>
      <Col span={8}>
      <Form.Item label="合同类型" >
      {data?.ProjectType}
      </Form.Item>
      </Col>
        <Col span={8}>
        <Form.Item label="项目所在省" >
        {data?.Province}
      </Form.Item>
      </Col>
      <Col span={8}>
      <Form.Item label="提供服务大区"  >
      {data?.Region}
      </Form.Item>
      </Col>
      <Col span={8}>
      <Form.Item label="项目负责人"  >
      {data?.Director}
      </Form.Item>
      </Col> 
        <Col span={8}>
        <Form.Item label="项目所属行业"  >
        {data?.Industry}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="合同服务天数"  >
        {data?.ProjectDays}
      </Form.Item>
       </Col>
       {/* <Col span={8}>
        <Form.Item label="经度"  >
        {data.Longitude}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="纬度"  >
        {data.Latitude}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="电子围栏（KM）"  >
        {data.Range}
      </Form.Item>
       </Col> */}
       <Col span={8}>
        <Form.Item label="项目点位数量"  >
        {data?.count}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="创建人"  >
        {data?.CreateUser}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="创建时间"  >
        {data?.CreateTime}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="更新人"  >
        {data?.UpdateUser}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="更新时间"  >
        {data?.UpdateTime}
      </Form.Item>
       </Col>
      </Row> 
    </Form>
    </Spin>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);