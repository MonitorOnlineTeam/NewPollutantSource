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

import styles from "./style.less"


const { TextArea, Search, } = Input;

const { Option } = Select;

const namespace = 'pollutantMold'


const dvaPropsData = ({ loading, pollutantMold }) => ({
  saveLoading: loading.effects[`${namespace}/getQuestionDetialList`],
  questTypeTreeData: pollutantMold.questTypeTreeData,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getQuestionType: (payload, callback) => { //左侧问题树
      dispatch({
        type: `${namespace}/getQuestionType`,
        payload: payload,
        callback: callback,
      })
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();

  const {DGIMN,saveLoading,} = props;

  useEffect(() => {
    if (DGIMN) {
      props.getQuestionType();
    }

  }, [DGIMN]);

 
  const save = async () => {  //保存
    try {
        const values = await form.validateFields();
        props.getTableData({
            ...values,
            status:'0',
        })
    } catch (errorInfo) {
        console.log('Failed:', errorInfo); 
    }
}

const generateFeatureLib = async () =>{ //生成特征库
    try {
        const values = await form.validateFields();
        props.getTableData({
            ...values,
            status:'0',
        })
    } catch (errorInfo) {
        console.log('Failed:', errorInfo); 
    }
}
  return (
    <div className={styles.pollutantMoldSty}>
        <Card>
        <Form
          name="basic"
          form={form}
          initialValues={{
            Status: 1
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
              <Form.Item label="数据时段" name="aa"  >
              <RangePicker_   />
              </Form.Item>
            </Col>
            <Col span={4}/>
            <Col span={10}>
              <Form.Item label="文件名称" name="bb">
                <Input placeholder='请输入' disabled/>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="数据类型" name="cc" >
                <Radio.Group>
                  <Radio value={1}>实测值</Radio>
                  <Radio value={2}>折算值</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={4}/>
            <Col span={10}>
              <Form.Item label="是否启用" name="dd" >
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="报警间隔" name="ee"  >
                <InputNumber placeholder='请输入' />
              </Form.Item>
            </Col>
            <Col span={4}/>
            <Col span={10}>
              <Form.Item label="是否生成Excl" name="ff" >
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
                    保存
               </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => { generateFeatureLib()}}  >
                    生成特征库
                </Button>
              </Form.Item>
          </Row>
          </Form>
        </Card>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);