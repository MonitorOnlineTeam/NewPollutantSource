/**
 * 功  能：问题清单详情
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

const namespace = 'noticeManger'




const dvaPropsData =  ({ loading,noticeManger }) => ({
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
    <div className={styles.noticeMangerDetail}>
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
        <Form.Item label="公告标题" >
        {data.NoticeTitle}
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="发布人">
        {data.CreatUserName}
      </Form.Item>
      </Col>
        <Col span={12}>
        <Form.Item label="发布时间" >
        {data.CreateTime}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="生效时间">
      {data.BeginTime}
      </Form.Item>
      </Col>

        <Col span={12}>
        <Form.Item label="失效时间">
        {data.EndTime}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="公告状态"  >
        {data.BeginTime}
      </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label="查看公告单位">
        {data.Company}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="查看公告角色"  >
        {data.Role}
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