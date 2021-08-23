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
  tableDatas:projectManager.tableDatas,
  detailLoading: loading.effects[`${namespace}/getParametersInfo`],
})

const  dvaDispatch = (dispatch) => {
  return {
    getEquipmentParametersInfo : (payload,callback) =>{ //修改 or 添加
      dispatch({
        type: `${namespace}/addOrUpdateEquipmentParametersInfo`,
        payload:payload,
      })
      
    },

  }
}
const Index = (props) => {




  const [data, setData] = useState([]);


  
  const isEditing = (record) => record.key === editingKey;
  
  const  { tableDatas,detailLoading } = props; 
  useEffect(() => {
      getEquipmentParametersInfo({DGIMN:props.DGIMN})

    
  },[props.DGIMN]);
 
  const getEquipmentParametersInfo=()=>{
    props.getEquipmentParametersInfo({PolltantType:1})
  }


 


  return (
    <div className={styles.projectManagerDetail}>
    <BreadcrumbWrapper>
    <Card title={
     <Row justify='space-between'>
        <span>详情</span>
        <Button onClick={() => {props.history.go(-1);   }} ><RollbackOutlined />返回</Button>
     </Row>
    }>
    {detailLoading?
    <PageLoading />
   :
    <Form
      name="detail"
    >
      <Row>
        <Col span={12}>
        <Form.Item label="合同名称" >
        {}
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="项目编号">
        {}
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="客户所在地" >
         {}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="卖方公司">
       {}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
        <Form.Item label="行业">
         {}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="签订人"  >
        {}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
        <Form.Item label="运营起始日期"  >
        {}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="运营结束日期" >
      {}
      </Form.Item>
      </Col>
      </Row>


      <Row>
        <Col span={12}>
        <Form.Item label="运营套数" >
         {}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="运营月数"  >
      {}
      </Form.Item>
      </Col>
      </Row>

      <Row align='middle'>
        <Col span={12}>

      <Form.Item label="合同总金额(万)"  >
        {}
      </Form.Item>
      </Col>
        <Col span={12}>
        <Form.Item label="备注"  >
        {}
      </Form.Item>
       </Col>
      </Row> 
    </Form>
  }
   </Card>
   </BreadcrumbWrapper>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);