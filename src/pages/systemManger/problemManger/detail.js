/**
 * 功  能：问题清潭详情
 * 创建人 jab
 * 创建时间：2022.09.23
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

const namespace = 'problemManger'




const dvaPropsData =  ({ loading,problemManger }) => ({
  detailLoading: loading.effects[`${namespace}/getProjectInfo`],
})

const  dvaDispatch = (dispatch) => {
  return {

  }
}
const Index = (props) => {




  const [data, setData] = useState([]);
  

  

  
  useEffect(() => {
  
    setData(JSON.parse(props.location.query.data))
  },[props]);
 


 


  return (
    <div className={styles.problemMangerDetail}>
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
        <Form.Item label="问题名称" >
        {data.ProjectName}
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="一级类别">
        {data.ProjectCode}
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="二级类别" >
        {data.RegionName}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="问题状态">
      {data.SellCompanyName}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
        <Form.Item label="维护人">
        {data.IndustryCode}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="维护时间"  >
        {data.SingName}
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