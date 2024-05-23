/**
 * 功  能：客户满意度调查  调查组件
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Rate, Radio, Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
const { RangePicker } = DatePicker;
import Cookie from 'js-cookie';
import config from '@/config';
import DispatchDetails from './DispatchDetails';
import moment from 'moment';
import { API } from '@config/API';
import cuid from 'cuid';
import styles from "../style.less"
const { Step } = Steps;
const namespace = 'customerSatisfacQuery'
import DispatchDetailsBtn from '../../../components/dispatchDetailsBtn';
const dvaPropsData = ({ loading, customerSatisfacQuery, global, }) => ({
  submitSurveyLoading: loading.effects[`${namespace}/SubmitSurvey`],
  configInfo: global.configInfo,
  satisfactionSurveyLoading: loading.effects[`${namespace}/GetSatisfactionSurveyInfo`],
})

const Index = (props) => {



  const [investigateForm] = Form.useForm();



  const { visible, data, submitSurveyLoading, completeFinish,satisfactionSurveyLoading, modalWrapClassName } = props;

  const [customerSuggesVerify, setCustomerSuggesVerify] = useState(false)

  const {parData} = props;
  const [detailData,setDetailData] = useState({});

  useEffect(() => {
    if (visible) {
      SetCurrent(0)
      investigateForm.resetFields()
      if(parData){
        props.dispatch({
          type: `${namespace}/GetSatisfactionSurveyInfo`,
          payload: {...parData},
          callback:(res)=>{
            setDetailData(res?.[0])
          }

        });
      }
    }
  }, [visible]);


  const rateChange = (val) => {
    if(val<5){
      setCustomerSuggesVerify(true)
    }else{
      setCustomerSuggesVerify(false)
    }
  }

  const InvestigateComponents = () => {
    return <div style={{ padding: '14px 18px 0 18px' }}>
      <Form
        form={investigateForm}
        name="advanced_search2"
        className={'investigate-search-form'}
      >
        <Form.Item name='investigationTime' label='调查日期' rules={[{ required: true, message: '请选择调查日期！' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name='serviceAttitude' label='工程师的服务态度' rules={[{ required: true, message: '请选择工程师的服务态度！' }]}>
          <Rate onChange={rateChange} />
        </Form.Item>
        <Form.Item name='technicalLevel' label='工程师的技术水平' rules={[{ required: true, message: '请选择工程师的技术水平！' }]}>
          <Rate onChange={rateChange} />
        </Form.Item>
        <Form.Item name='problem' label='客户问题及建议' rules={[{ required: customerSuggesVerify, message: '请输入客户问题及建议！' }]}>
          <Input.TextArea rows={2} placeholder="请输入" allowClear />
        </Form.Item>
      </Form>
    </div>
  }

  const list = parData? detailData : data;


  const steps = ['派单内容', '调查', '完成']
  const [current, SetCurrent] = useState(0)

  const saveNext = async () => { //下一步
    switch (current) {
      case 0: //派单内容
        SetCurrent(current + 1)
        break;
      case 1: //调查
        const values = await investigateForm.validateFields();
        console.log(list)
        props.dispatch({
          type: `${namespace}/SubmitSurvey`,
          payload: {
            ...values,
            investigationTime:values.investigationTime&&moment(values.investigationTime).format('YYYY-MM-DD HH:mm:ss'),
            id: list?.ID,
            num: list?.Num,
            serviceAreaCode: list?.ServiceAreaCode,
            investigatorName:list?.InvestigatorName,
            msgid:parData?.msgid
          },
          callback:()=>{
            SetCurrent(current + 1)
            completeFinish&&completeFinish()
          }
        });
        break;
      case 2: //完成
        props.onCancel()
        break;
      default:
        SetCurrent(0)
        break;
    }
  }
  const prev = () => { //上一步
    SetCurrent(current - 1)
  }
  const CompleteComponents = () => {
    return <Result
      status="success"
      title="调查完成"
    />
  }

  return (<>
    <Modal
      visible={visible}
      title={<Row justify='space-between'><span>调查</span><DispatchDetailsBtn data={list} /></Row>}
      onCancel={() => { props.onCancel()}}
      destroyOnClose
      wrapClassName={modalWrapClassName || `spreadOverModal ${styles.modalSty}`}
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
          <Button type="primary" loading={current == 1 ? submitSurveyLoading : false} onClick={() => saveNext()}>
            {current < steps.length - 1 ? '下一步' : '完成'}
          </Button>
        )}
      </div>}
    >
      <Steps current={current}>
        {steps.map(item => <Step title={item} />)}
      </Steps>
      <Spin spinning={!!props.satisfactionSurveyLoading}><div style={{ marginTop: 18 }}>{current == 0 ? <DispatchDetails data={list} /> : current == 1 ? <InvestigateComponents /> : <CompleteComponents />} </div></Spin>
    </Modal>
  </>);
};
export default connect(dvaPropsData)(Index);
