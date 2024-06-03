/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Skeleton, Menu, Form, Tag, Spin, Empty, Typography, Tree, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import styles from "./style.less"


const { TextArea, Search, } = Input;

const { Option } = Select;

const namespace = 'pollutantMold'


const dvaPropsData = ({ loading, pollutantMold }) => ({
  echoDataLoading: loading.effects[`${namespace}/addAnomalyModle`],
  saveLoading: loading.effects[`${namespace}/addAnomalyModle`],
  createLoading: loading.effects[`${namespace}/createFeatureLibrary`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    addAnomalyModle: (payload, callback) => { //生成模型需要的Excl
      dispatch({
        type: `${namespace}/addAnomalyModle`,
        payload: payload,
        callback: callback,
      })
    },
    createFeatureLibrary: (payload, callback) => { //生成特征库
      dispatch({
        type: `${namespace}/createFeatureLibrary`,
        payload: payload,
        callback: callback,
      })
    },  
  }
}


const Index = (props) => {



  const [form] = Form.useForm();

  const {DGIMN,echoDataLoading,saveLoading,createLoading,} = props;
  const [btnText,setBtnText] = useState('保存');

  useEffect(() => {
    initData(DGIMN)
  }, [DGIMN]);
  
  const initData=(DGIMN)=>{
    if (DGIMN) {
      // props.addAnomalyModle();
      form.setFieldsValue({FileName:DGIMN})
    }

  }
 
  const save = async () => {  //生成模型需要的Excl
    try {
        const values = await form.validateFields();
        props.addAnomalyModle({
            ...values,
            Btime:values.time&&moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            Etime:values.time&&moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            time:undefined,
            DGIMN:DGIMN,
        },()=>{
          initData(DGIMN)
        })
    } catch (errorInfo) {
        console.log('Failed:', errorInfo); 
    }
}

const generateFeatureLib = async () =>{ //生成特征库
    try {
        const values = await form.validateFields();
        props.createFeatureLibrary({
            ...values,
            Btime:values.time&&moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            Etime:values.time&&moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            time:undefined,
            DGIMN:DGIMN,
        })
    } catch (errorInfo) {
        console.log('Failed:', errorInfo); 
    }
}
  return (
    <div className={styles.pollutantMoldSty}>
      <Spin spinning={echoDataLoading||false}>
        <Card>
        <Form
          name="basic"
          form={form}
          initialValues={{
            DataType:1,
            IsUse: 1,
            IsExcl:1,
          }}
          onFinish={() => { save() }}
        >
          <Row>
            <Col span={24}>
              <Form.Item name="ID" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="数据时段" name="time"  >
              <RangePicker_  showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}/>
              </Form.Item>
            </Col>
            <Col span={4}/>
            <Col span={10}>
              <Form.Item label="文件名称" name="FileName">
                <Input placeholder='请输入' allowClear/>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="数据类型" name="DataType" >
                <Radio.Group>
                  <Radio value={1}>实测值</Radio>
                  <Radio value={2}>折算值</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={4}/>
            <Col span={10}>
              <Form.Item label="是否启用" name="IsUse" >
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="报警间隔" name="AlarmInterval"  >
                <InputNumber placeholder='请输入（小时）' />
              </Form.Item>
            </Col>
            <Col span={4}/>
            <Col span={10}>
              <Form.Item label="是否生成Excl" name="IsExcl" >
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row justify='end' style={{paddingTop:20}}>
              <Form.Item>
               <Button loading={saveLoading} type="primary"  htmlType="submit">
                 {btnText}
               </Button>
                {btnText=='修改'&&<Button loading={createLoading}  style={{ marginLeft: 8 }} onClick={() => { generateFeatureLib()}}  >
                    生成特征库
                </Button>}
              </Form.Item>
          </Row>
          </Form>
        </Card>
        </Spin>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);