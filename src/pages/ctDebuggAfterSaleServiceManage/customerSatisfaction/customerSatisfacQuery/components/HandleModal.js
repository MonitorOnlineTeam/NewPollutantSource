/**
 * 功  能：客户满意度调查  审核组件
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm,Rate, Radio,Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
const { RangePicker } = DatePicker;
import Cookie from 'js-cookie';
import config from '@/config';
import DispatchDetails from './DispatchDetails';
import InvestigaContent from './InvestigaContent';


import { API } from '@config/API';
import cuid from 'cuid';
import styles from "../style.less"
const { Step } = Steps;
const namespace = 'installaEquipment'

const dvaPropsData = ({ loading, installaEquipment, global, }) => ({
  submitProcessedLoading: loading.effects[`${namespace}/SubmitProcessed`],
  configInfo: global.configInfo,
})

const Index = (props) => {



  const [form2] = Form.useForm();



  const { visible, data,submitProcessedLoading} = props;
 



  useEffect(() => {
    if(visible){
    SetCurrent(0)
  }
  }, [visible]);





  const HandleComponents = () => {
    return <div style={{padding:'14px 18px 0 18px'}}>
      <Form
      form={form2}
      name="advanced_search2"
      className={'investigate-search-form'}
    >
      <Form.Item name='problem' label='处理办法' rules={[{ required: true, message: '请输入处理办法！' }]}>
        <Input.TextArea rows={4} placeholder="请输入" allowClear />
      </Form.Item>
    </Form>
      </div>
  }



  const steps = ['调查内容', '处理', '完成']
  const [current, SetCurrent] = useState(0)

  const saveNext = async () => { //下一步
    switch (current) {
      case 0: //调查内容
        SetCurrent(current + 1)
        break;
      case 1: //处理
      const values = await form2.validateFields();
      const par = {
          ...values,
          id: data.ID,
          num: data.Num,
          serviceAreaCode: data.ServiceAreaCode,
          investigatorName:data.investigatorName,
      }
      props.dispatch({
        type: `${namespace}/SubmitProcessed`,
        payload: {
         ...par
        },
        callback:()=>{
          SetCurrent(current + 1)
        }
      });  
        break;
      case 2: //完成
        setExamineVisible(false)
        break;
      default:
        SetCurrent(0)
        break;
    }
  }
  const prev = () =>{ //上一步
    SetCurrent(current - 1)
  }
  const CompleteComponents = ()=>{
    return  <Result
    status="success"
    title="处理完成"
  />
  }
  return (
          <Modal
            visible={visible}
            title={'处理'}
            onCancel={() => { props.onCancel()}}
            destroyOnClose
            wrapClassName={`spreadOverModal ${styles.modalSty}`}
            mask={false}
            footer={<div className="steps-action">
              {current > 0 && current != steps.length - 1 && (
                <Button
                  onClick={() => prev()}
                >
                  上一步
                </Button>
              )}
              {current <= steps.length - 1 && (
                <Button type="primary" loading={current==1? submitProcessedLoading : false} onClick={() => saveNext()}>
                  {current < steps.length - 1 ? '下一步' : '完成'}
                </Button>
              )}
            </div>}
          >
            <Steps current={current}>
              {steps.map(item => <Step title={item} />)}
            </Steps>
              <div style={{marginTop:18}}>{current==0? <><DispatchDetails data={data}/> <InvestigaContent data={data}/> </>: current==1 ? <HandleComponents />  : <CompleteComponents /> } </div>
          </Modal>
  );
};
export default connect(dvaPropsData)(Index);