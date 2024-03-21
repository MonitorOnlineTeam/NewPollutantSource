/**
 * 功  能：项目查询详情  成套
 * 创建人：jab
 * 创建时间：2021.08.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import PageLoading from '@/components/PageLoading'

import styles from "./style.less"
const { Option } = Select;

const namespace = 'projectManager'




const dvaPropsData =  ({ loading,projectManager }) => ({
  detailLoading: loading.effects[`${namespace}/getProjectInfo`],
})

const  dvaDispatch = (dispatch) => {
  return {
    getProjectInfo : (payload,callback) =>{ 
      dispatch({
        type: `${namespace}/getProjectInfo`,
        payload:payload,
      })
      
    },

  }
}
const Index = (props) => {




  
  const {data} = props;
  

  
  useEffect(() => {


  },[]);
 


 


  return (
    <Form>
      <Row>
        <Col span={8}>
        <Form.Item label="服务流水号" >
        {data.SerialNum}
      </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="项目名称">
        {data.ProjectName}
      </Form.Item>
      </Col>
        <Col span={8}>
        <Form.Item label="合同编号" >
        {data.ProjectCode}
      </Form.Item>
      </Col>
      <Col span={8}>
      <Form.Item label="合同签订人">
      {data.SignName}
      </Form.Item>
      </Col>
        <Col span={8}>
        <Form.Item label="立项号">
        {data.ItemCode}
      </Form.Item>
      </Col>
      <Col span={8}>
      <Form.Item label="签约客户名称"  >
        {data.CustomName}
      </Form.Item>
      </Col>
        <Col span={8}>
        <Form.Item label="最终用户单位"  >
        {data.CustomEnt}
      </Form.Item>
      </Col>
      <Col span={8}>
      <Form.Item label="合同类型" >
      {data.ProjectType}
      </Form.Item>
      </Col>
        <Col span={8}>
        <Form.Item label="项目所在省" >
        {data.Province}
      </Form.Item>
      </Col>
      <Col span={8}>
      <Form.Item label="提供服务大区"  >
      {data.Region}
      </Form.Item>
      </Col>
      <Col span={8}>
      <Form.Item label="项目负责人"  >
      {data.Director}
      </Form.Item>
      </Col> 
        <Col span={8}>
        <Form.Item label="项目所属行业"  >
        {data.Industry}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="合同服务天数"  >
        {data.ProjectDays}
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
        {data.count}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="创建人"  >
        {data.CreateUser}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="创建时间"  >
        {data.CreateTime}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="更新人"  >
        {data.UpdateUser}
      </Form.Item>
       </Col>
       <Col span={8}>
        <Form.Item label="更新时间"  >
        {data.UpdateTime}
      </Form.Item>
       </Col>
      </Row> 
    </Form>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);