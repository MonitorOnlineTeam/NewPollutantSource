/**
 * 功  能：项目管理
 * 创建人：贾安波
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




  const [data, setData] = useState([]);
  

  

  
  useEffect(() => {
  
    setData(JSON.parse(props.location.query.data))
  },[props]);
 


 


  return (
    <div className={styles.projectManagerDetail}>
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
        <Form.Item label="合同名称" >
        {data.ProjectName}
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="项目编号">
        {data.ProjectCode}
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="客户所在地" >
        {data.RegionName}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="卖方公司">
      {data.SellCompanyName}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
        <Form.Item label="行业">
        {data.IndustryCode}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="签订人"  >
        {data.SingName}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
        <Form.Item label="运营起始日期"  >
        {data.BeginTime}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="运营结束日期" >
      {data.EndTime}
      </Form.Item>
      </Col>
      </Row>


      <Row>
        <Col span={12}>
        <Form.Item label="运营套数" >
        {data.OperationCount}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="运营月数"  >
      {data.OperationMonth}
      </Form.Item>
      </Col>
      </Row>

      <Row align='middle'>
        {/* <Col span={12}>

      <Form.Item label="合同总金额(万)"  >
      {data.Money}
      </Form.Item>
      </Col> */}
      <Col span={12}>

      <Form.Item label="所属运维单位"  >
      {data.operationCompanyName}
      </Form.Item>
      </Col> 
        <Col span={12}>
        <Form.Item label="备注"  >
        {data.Remark}
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