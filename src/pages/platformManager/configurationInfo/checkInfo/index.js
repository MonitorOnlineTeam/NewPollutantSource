/**
 * 功  能：核查信息
 * 创建人：贾安波
 * 创建时间：2022.04.13
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Spin   } from 'antd';
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
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'checkInfo'




const dvaPropsData =  ({ loading,checkInfo  }) => ({
  loadingGetData: loading.effects[`${namespace}/getData`],
  loadingSaveConfirm: loading.effects[`${namespace}/saveData`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getData:(payload,callback)=>{ //回显数据
      dispatch({
        type: `${namespace}/getData`,
        payload:payload,
        callback:callback,
      })
    },
    saveData:(payload,callback)=>{ //保存数据
      dispatch({
        type: `${namespace}/saveData`,
        payload:payload,
        callback:callback,
      })
    },
  }
}

const Index = (props) => {

  const [form] = Form.useForm();


  const  { loadingGetData,loadingSaveConfirm } = props; 
  useEffect(() => {
    getData();
  },[]);

 const  save =(values)=>{
   props.saveData({ ...values},()=>{
    getData();
  })
  }

  const getData =()=>{
    props.getData({},(data)=>{
      form.setFieldsValue({aa:data})
    });
  }
  return (
    <div  className={styles.checkInfoSty}>
    <BreadcrumbWrapper>
    <Card title={''}>
    {/* <Spin loading={loadingGetData}> */}
    <Form
      name="basic"
      form={form}
      onFinish={save}
    > 
      <Row align='middle' style={{padding:'15px 0 10px 0'}}>
        <Col span={8}>
      <Form.Item  label='核查标准' name='qq' >
          <InputNumber placeholde='请输入'  style={{width:'100%'}}/>
      </Form.Item> 
      </Col>
      <div style={{paddingBottom:8}}>
      <span style={{padding:'0 15px 0 5px'}}>‰</span>
      <span style={{color:'#f5222d'}}>用于量程、实时数据、设备参数核查电子表单中使用</span>
      </div>
      </Row>
      <Row>
        <Col span={8}>
      <Form.Item   style={{paddingLeft:69}}>
      <Button   type="primary" htmlType='submit' loading={loadingSaveConfirm}>
          保存
     </Button>
      </Form.Item> 
      </Col>
      </Row>
      </Form>
      {/* </Spin> */}
   </Card>
   </BreadcrumbWrapper>
   
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);