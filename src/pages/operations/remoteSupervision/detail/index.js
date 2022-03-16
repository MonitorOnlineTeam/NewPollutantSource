/**
 * 功  能：远程督查 详情
 * 创建人：贾安波
 * 创建时间：2022.3.16
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Card,Row,Col,Button,Form   } from 'antd';

import { RollbackOutlined } from '@ant-design/icons';

import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import styles from "../style.less"



const namespace = 'equipmentFeedback'




const dvaPropsData =  ({ loading,equipmentFeedback,global }) => ({
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },

  }
}
const Index = (props) => {
    const {location:{query:{ detailData}} }= props;

  
  useEffect(() => {

  
  },[]);






 
 let data = JSON.parse(detailData) || [];
 console.log(data)
  return (
    <div className={styles.equipmentFeedbackDetailSty}>
    <BreadcrumbWrapper>
    <Card title={
     <Row justify='space-between'>
        <span>详情</span>
        <Button onClick={() => {props.history.go(-1);   }} ><RollbackOutlined />返回</Button>
     </Row>
    }>
    <Form
      name="detail"
    >
      <Row>
        <Col span={12}>
        <Form.Item label="省/市" >
        {data.RegionName}
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="企业名称">
        {data.ParentName }
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="监测点名称" >
        {data.PointName }
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="故障单元">
      {data.FaultUnitName }
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
        <Form.Item label="故障时间">
        {data.FaultTime }
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="系统型号"  >
        {data.MonitorPointEquipmentName  }
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
        <Form.Item label="主机名称型号"  >
        {data.EquipmentName }
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="主机序列号" >
      {data.EquipmentNumber }
      </Form.Item>
      </Col>
      </Row>


      <Row>
        <Col span={12}>
        <Form.Item label="主机生产厂商" >
        {data.ManufacturerName  }
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="故障现象"  >
      {data.FaultPhenomenon }
      </Form.Item>
      </Col>
      </Row>

      <Row align='middle'>
        <Col span={12}>

      <Form.Item label="原因分析"  >
      {data.CauseAnalysis }
      </Form.Item>
      </Col>
        <Col span={12}>
        <Form.Item label="处理方法"  >
        {data.ProcessingMethod }
      </Form.Item>
       </Col>
      </Row>
      <Row align='middle'>
        <Col span={12}>

      <Form.Item label="处理状态"  >
      {data.IsSolve ==1?'已解决': "待解决"}
      </Form.Item>
      </Col>
        <Col span={12}>
        <Form.Item label="反馈人"  >
        {data.CreatUserName }
      </Form.Item>
       </Col>
      </Row>  

      <Row align='middle'>
        <Col span={12}>

      <Form.Item label="反馈时间"  >
      {data.CreatDateTime }
      </Form.Item>
      </Col>
      </Row>  
    </Form>
   </Card>
   </BreadcrumbWrapper>
        </div>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);