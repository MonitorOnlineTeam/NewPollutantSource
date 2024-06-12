import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Modal,
  Input,
  Button,
  Tabs,
  Select,
  Space,
  Steps,
  Row,
  message,
  Divider,
  Descriptions,
  Upload,
  InputNumber,
  Result,
  DatePicker,
} from 'antd';
import ViewComplaintContent from './ViewComplaintContent';
import { checkRules } from '@/utils/validator';

const { Step } = Steps;
const { TextArea } = Input;

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`reportSpotCheck/GetServiceReportList`],
});

const Dispose = props => {
  const [form] = Form.useForm();

  const [stepCurrent, setStepCurrent] = useState(0);
  const [detailsData, setDetailsData] = useState({});

  const { dispatch, isModalOpen, onCancel, id, reloadPageData } = props;

  useEffect(() => {
    GetCustomerComplaintsView();
  }, []);

  // 获取详情
  const GetCustomerComplaintsView = () => {
    dispatch({
      type: 'customer/GetCustomerComplaintsView',
      payload: {
        id,
      },
      callback: res => {
        setDetailsData(res || {});
      },
    });
  };

  // 处理投诉
  const HandleCustomerComplaints = () => {
    form.validateFields().then(values => {
      dispatch({
        type: 'customer/HandleCustomerComplaints',
        payload: {
          id,
          ...values,
        },
        callback: res => {
          setStepCurrent(2);
          reloadPageData();
        },
      });
    });
  };

  // 第一步内容
  const getStep1Content = () => {
    return (
      <>
        <ViewComplaintContent data={detailsData} hideTitle />
        <Row justify="center">
          <Space>
            <Button type="primary" onClick={() => setStepCurrent(1)}>
              下一步
            </Button>
          </Space>
        </Row>
      </>
    );
  };

  // 第二步内容
  const getStep2Content = () => {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}
      >
        <Form
          // id="searchForm"
          form={form}
          initialValues={{}}
          autoComplete="off"
          layout="horizontal"
          style={{ marginBottom: 10, width: '60%' }}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 12,
          }}
        >
          <Form.Item
            name="processingResults"
            label="处理结果"
            rules={[
              {
                required: true,
                message: '请填写处理结果!',
              },
            ]}
          >
            <TextArea rows={2} style={{ width: '100%' }} allowClear={false} />
          </Form.Item>
          <Form.Item
            name="deductionAmount"
            label="扣款金额"
            rules={[
              {
                required: true,
                message: '请填写扣款金额!',
              },
              checkRules['double'],
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入"
              addonBefore="¥"
              addonAfter="RMB"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="preventiveMeasure"
            label="纠正预防措施"
            rules={[
              {
                required: true,
                message: '请填写纠正预防措施!',
              },
            ]}
          >
            <TextArea rows={2} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            name="personnelAssessment"
            label="人员考核"
            rules={[
              {
                required: true,
                message: '请填写人员考核!',
              },
            ]}
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            name="processingTime"
            label="处理时间"
            rules={[
              {
                required: true,
                message: '请填写处理时间!',
              },
            ]}
          >
            <DatePicker style={{ width: '100%' }} allowClear={false} />
          </Form.Item>
        </Form>
        <Row justify="center">
          <Space>
            <Button onClick={() => setStepCurrent(0)}>上一步</Button>
            <Button type="primary" onClick={() => HandleCustomerComplaints()}>
              下一步
            </Button>
          </Space>
        </Row>
      </div>
    );
  };

  // 第三步内容
  const getStep3Content = () => {
    return (
      <Result
        status="success"
        title="处理完成"
        extra={[
          <Button type="primary" onClick={() => onCancel()}>
            完成
          </Button>,
        ]}
      />
    );
  };

  const TitleComponents = props => {
    return (
      <div
        style={{
          display: 'inline-block',
          fontWeight: 'bold',
          marginTop: 4,
          padding: '2px 0',
          marginBottom: 12,
          borderBottom: '1px solid rgba(0,0,0,.1)',
        }}
      >
        {props.text}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (stepCurrent) {
      case 0:
        return getStep1Content();
      case 1:
        return getStep2Content();
      case 2:
        return getStep3Content();
    }
  };

  return (
    <Modal
      title={`投诉处理`}
      wrapClassName="spreadOverModal"
      visible={isModalOpen}
      destroyOnClose
      footer={null}
      onCancel={() => {
        setStepCurrent(0);
        onCancel();
      }}
    >
      <Row justify="center" style={{ padding: '20px 0' }}>
        <Steps current={stepCurrent} style={{ width: '70%' }}>
          <Step title="投诉内容" />
          <Step title="处理" />
          <Step title="完成" />
        </Steps>
      </Row>
      <div style={{ padding: 20 }}>{renderStepContent()}</div>
    </Modal>
  );
};

export default connect(dvaPropsData)(Dispose);
