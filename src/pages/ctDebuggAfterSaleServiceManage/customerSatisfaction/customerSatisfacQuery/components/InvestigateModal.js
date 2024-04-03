/**
 * 功  能：客户满意度调查  审核组件
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Radio,Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
const { RangePicker } = DatePicker;
import Cookie from 'js-cookie';
import config from '@/config';
import DispatchDetails from './DispatchDetails';


import { API } from '@config/API';
import cuid from 'cuid';
import styles from "../style.less"
const { Step } = Steps;
const namespace = 'installaEquipment'

const dvaPropsData = ({ loading, installaEquipment, global, }) => ({
  auditPhotoLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  addAuditInfoLoading: loading.effects[`${namespace}/AddAuditInfo`],
  configInfo: global.configInfo,
})

const Index = (props) => {



  const [form2] = Form.useForm();



  const { visible, data,addAuditInfoLoading} = props;
 



  useEffect(() => {
    if(visible){
    SetCurrent(0)
  }
  }, [visible]);





  const InvestigateComponents = () => {
    return <div style={{padding:'14px 18px 0 18px'}}>
      <Form
      form={form2}
      name="advanced_search2"
      className={'ant-advanced-search-form2'}
    >
      <Form.Item name='auditResults' label='审核结果'  rules={[{ required: true, message: '请选择审核结果！' }]}>
        <Radio.Group>
          <Radio value={1}>优秀</Radio>
          <Radio value={2}>合格</Radio>
          <Radio value={3}>不合格</Radio>
          <Radio value={4}>无照片</Radio>
          <Radio value={5}>/</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name='opinion' label='审核意见' rules={[{ required: true, message: '请输入审核意见！' }]}>
        <Input.TextArea rows={2} placeholder="请输入" allowClear />
      </Form.Item>
    </Form>
      </div>
  }



  const steps = ['派单内容', '调查', '完成']
  const [current, SetCurrent] = useState(0)

  const saveNext = async () => { //下一步
    switch (current) {
      case 0: //派单内容
        SetCurrent(current + 1)
        break;
      case 1: //调查
      const values = await form2.validateFields();
      const par = {
          ...values,
          systemModelId: examineData.Col1,
          dispatchId: examineData.DispatchId,
          pointId: examineData.PointId,
          equipmentAuditId: examineData.EquipmentAuditId,
          workerID:examineData.PointId,
          projectCode: examineData.ProjectCode,
          itemCode:  examineData.ItemCode,
          entName:  examineData.EntName,
          pointName:  examineData.PointName,
      }
      props.dispatch({
        type: `${namespace}/AddAuditInfo`,
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
    title="审核完成"
  />
  }
  return (
    <div className={styles.modalSty}>
          <Modal
            visible={visible}
            title={'调查'}
            onCancel={() => { props.onCancel()}}
            destroyOnClose
            mask={false}
            wrapClassName={`spreadOverModal ${styles.modalSty2}`}
            footer={<div className="steps-action">
              {current > 0 && current != steps.length - 1 && (
                <Button
                  onClick={() => prev()}
                >
                  上一步
                </Button>
              )}
              {current <= steps.length - 1 && (
                <Button type="primary" loading={current==1? addAuditInfoLoading : false} onClick={() => saveNext()}>
                  {current < steps.length - 1 ? '下一步' : '完成'}
                </Button>
              )}
            </div>}
          >
            <Steps current={current}>
              {steps.map(item => <Step title={item} />)}
            </Steps>
              <div style={{marginTop:18}}>{current==0? <DispatchDetails data={data}/> : current==1 ? <InvestigateComponents />  : <CompleteComponents /> } </div>
          </Modal>
    </div>
  );
};
export default connect(dvaPropsData)(Index);