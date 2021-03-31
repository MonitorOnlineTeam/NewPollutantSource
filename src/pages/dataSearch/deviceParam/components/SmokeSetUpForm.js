import React, { useState,useEffect  } from 'react';

import { Form, Input, Button, Checkbox,Divider,Row,Col, InputNumber,Card  } from 'antd';

import styles from '../style.less'
import { connect } from "dva";
import PageLoading from '@/components/PageLoading'

const { TextArea } = Input;
const namespace = 'deviceParam'

const dvaPropsData =  ({ loading,deviceParam }) => ({
   formLoading:loading.effects[`${namespace}/getEquipmentParameters`]
  })
  
const  dvaDispatch = (dispatch) => {
    return {
      getEquipmentParameters : (payload,callback) =>{ //添加 or 修改 设定参数
        dispatch({
          type: `${namespace}/getEquipmentParameters`,
          payload:payload,
          callback:callback
        })
        
      },
      
      
    }
  }

const SmokeSetUpForm = (props) => {
  const [formList,setFormList] = useState({
    ID:'-',
    PitotCoefficient:'-',
    VelocityCoefficient: '-',
    FlueCoefficient: '-',
    Slope: '-',
    Intercept: '-',
    Atmos: '-',
    AirCoefficient: '-',
    Remark: '-'
   });
  const { DGIMN, formLoading} = props;
    
    useEffect(() => {
    if(DGIMN){
      props.getEquipmentParameters({DGIMN:DGIMN},(res)=>{
        res&&setFormList({...res})    
      })
    }

    
  },[DGIMN]);


  const {  PitotCoefficient,VelocityCoefficient,FlueCoefficient,Slope,Intercept, Atmos,AirCoefficient,Remark} = formList;
  return (
    <Form
      className='smokeSetUpForm'
      name="basic"
      initialValues={{
        remember: true,
      }}

    >  
     {formLoading? <PageLoading /> : <div>
        <>
        <div className={styles.title}>烟气流量设定</div>
        <div className={styles.divider}> </div>
        </>
        <Row gutter={[40,24]}>
        <Col  span={8}>
      <Form.Item label="皮托管系数：" name="PitotCoefficient">
        <span> {PitotCoefficient} </span>
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="速度场系数：" name="VelocityCoefficient" >
      <span> {VelocityCoefficient} </span>
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="烟道截面积(㎡)：" name="FlueCoefficient">
      <span> {FlueCoefficient} </span>
      </Form.Item>
      </Col>
      </Row>

      <>
        <div className={styles.title}>颗粒物参数设定</div>
        <div className={styles.divider}> </div>
        </>
        <Row gutter={[40,24]}>
        <Col  span={8}>
      <Form.Item label="斜率：" name="Slope" >
       <span> {Slope} </span>
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="截距：" name="Intercept">
       <span> {Intercept} </span>
      </Form.Item>
      </Col>
      </Row>
      <>
        <div className={styles.title}>其他参数设定</div>
        <div className={styles.divider}> </div>
        </>
      <Row gutter={[40,24]}>
        <Col  span={8}>
      <Form.Item label="当地大气压(Pa)：" name="Atmos">
       <span> {Atmos} </span>
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="标准过量空气系数：" name="AirCoefficient" >
       <span> {AirCoefficient} </span>
      </Form.Item>
      </Col>
      </Row>

      <>
        <div className={styles.title}>其他情况说明</div>
        <div className={styles.divider}> </div>
        </>
      <Row gutter={[16,24]} style={{paddingBottom:10}}>
        <Col  span={24}>
      <Form.Item label="" name="Remark" >
         <span> {Remark} </span>
      </Form.Item>
      </Col>
      </Row>

     </div>}
    </Form>
  );
};

export default connect(dvaPropsData,dvaDispatch)(SmokeSetUpForm);