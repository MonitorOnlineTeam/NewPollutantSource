import React, { useState,useEffect  } from 'react';

import { Form, Input, Button, Checkbox,Divider,Row,Col, InputNumber,Card  } from 'antd';

import styles from '../style.less'
import { connect } from "dva";
import PageLoading from '@/components/PageLoading'

const { TextArea } = Input;
const namespace = 'equipmentParmars'

const dvaPropsData =  ({ loading,equipmentParmars }) => ({
   formLoading:loading.effects[`${namespace}/getEquipmentParameters`]
  })
  
const  dvaDispatch = (dispatch) => {
    return {
      addOrUpdateEquipmentParameters : (payload) =>{ //添加 or 修改 设定参数
        dispatch({
          type: `${namespace}/addOrUpdateEquipmentParameters`,
          payload:payload,
        })
        
      },
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
  const [setform] = Form.useForm();
  const { DGIMN, formLoading} = props;
    
    useEffect(() => {
    if(DGIMN){


      props.getEquipmentParameters({DGIMN:DGIMN},(res)=>{

        res&&setform.setFieldsValue({
        ID:res.ID,
        PitotCoefficient: res.PitotCoefficient,
        VelocityCoefficient: res.VelocityCoefficient,
        FlueCoefficient: res.FlueCoefficient,
        Slope: res.Slope,
        Intercept: res.Intercept,
        Atmos: res.Atmos,
        AirCoefficient: res.AirCoefficient,
        Remark: res.Remark
       })

      })
    }

    
  },[props.DGIMN]);
   const onFinish = (values) => {
    props.addOrUpdateEquipmentParameters({...values,DGIMN:props.DGIMN})
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Form
      className='smokeSetUpForm'
      name="basic"
      initialValues={{
        remember: true,
      }}
      layout='vertical'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={setform}
    >  
     {formLoading? <PageLoading /> : <div>
        <>
        <div className={styles.title}>烟气流量设定</div>
        <div className={styles.divider}> </div>
        </>
        <Row gutter={[40,24]}>
        <Col  span={8}>
      <Form.Item label="皮托管系数" name="PitotCoefficient" rules={[{ required: true,message: '请输入皮托管系数!', } ]}>
        <InputNumber placeholder='请输入皮托管系数' />
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="速度场系数" name="VelocityCoefficient" rules={[{ required: true,message: '请输入速度场系数!', } ]}>
        <InputNumber placeholder='请输入速度场系数'/>
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="烟道截面积(㎡)" name="FlueCoefficient" rules={[{ required: true,message: '请输入烟道截面积!', } ]}>
        <InputNumber placeholder='请输入烟道截面积'/>
      </Form.Item>
      </Col>
      </Row>

      <>
        <div className={styles.title}>颗粒物参数设定</div>
        <div className={styles.divider}> </div>
        </>
        <Row gutter={[40,24]}>
        <Col  span={8}>
      <Form.Item label="斜率" name="Slope" rules={[{ required: true,message: '请输入斜率!', } ]}>
        <InputNumber placeholder='请输入斜率'/>
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="截距" name="Intercept" rules={[{ required: true,message: '请输入截距!', } ]}>
        <InputNumber  placeholder='请输入截距'/>
      </Form.Item>
      </Col>
      </Row>
      <>
        <div className={styles.title}>其他参数设定</div>
        <div className={styles.divider}> </div>
        </>
      <Row gutter={[40,24]}>
        <Col  span={8}>
      <Form.Item label="当地大气压(Pa)" name="Atmos" rules={[{ required: true,message: '请输入当地大气压!', } ]}>
        <InputNumber />
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item label="标准过量空气系数" name="AirCoefficient" rules={[{ required: true,message: '请输入标准过量空气系数!', } ]}>
        <InputNumber />
      </Form.Item>
      </Col>
      <Col>
       <Form.Item label="" name="ID">
        <Input type='hidden' />
      </Form.Item> 
      </Col>
      </Row>

      <>
        <div className={styles.title}>其他情况说明</div>
        <div className={styles.divider}> </div>
        </>
      <Row gutter={[16,24]} style={{paddingBottom:35}}>
        <Col  span={24}>
      <Form.Item label="" name="Remark" >
        <TextArea placeholder='备注' rows={2} />
      </Form.Item>
      </Col>
      </Row>

      <div className={styles.submitCard}>
      {/* <Form.Item> */}
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      {/* </Form.Item> */}
      </div>
     </div>}
    </Form>
  );
};

export default connect(dvaPropsData,dvaDispatch)(SmokeSetUpForm);