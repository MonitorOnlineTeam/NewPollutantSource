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
  Radio,
  Result,
} from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import styles from '../index.less';
import ImageView from '@/components/ImageView';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';
import cuid from 'cuid';
import ServiceReport from '@/pages/ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchQuery/detail.js';
import HandlingSugges from '@/pages/ctDebuggAfterSaleServiceManage/supervisionInspection/installEquipment/components/HandlingSugges.js';

const { Step } = Steps;
const { TextArea } = Input;

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`reportSpotCheck/GetServiceReportList`],
});

const AuditModalPage = props => {
  const [form1] = Form.useForm();

  const [stepCurrent, setStepCurrent] = useState(0);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);
  // const [uid, setUid] = useState(cuid());
  const [currentNum, setCurrentNum] = useState();

  const { dispatch, id, CheckStatus, isModalOpen, onCancel, reloadPageData } = props;

  useEffect(() => {}, []);

  // 获取处理意见
  const getProcessingOpinions = () => {
    dispatch({
      type: `installEquipment/GetAuditPhoto`,
      payload: {
        equipmentAuditId: id,
      },
    });
  };

  // 提交审核
  const AddCheckServiceReport = () => {
    form1.validateFields().then(values => {
      dispatch({
        type: 'reportAudit/AuditService',
        payload: {
          id,
          CheckStatus: CheckStatus,
          ...values,
        },
        callback: res => {
          setStepCurrent(2);
        },
      }).catch(errorInfo => {
        message.warning('请输入完整的数据');
        return;
      });
    });
  };

  // 完成
  const onResult = () => {
    // form.resetFields();
    form1.resetFields();
    setStepCurrent(0);
    onCancel();
    // 重新加载数据列表
    reloadPageData();
  };

  // 第一步内容
  const getStep1Content = () => {
    return (
      <div style={{ marginTop: 20, display: stepCurrent === 0 ? 'block' : 'none' }}>
        <ServiceReport id={id} shouldOnlyRecordId="9" />
        <Row justify="center" style={{ marginTop: 20 }}>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setStepCurrent(1);
                getProcessingOpinions();
              }}
            >
              下一步
            </Button>
          </Space>
        </Row>
        {/* 查看附件弹窗 */}
        <ImageView
          isOpen={isImageViewOpen}
          images={imageList}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsImageViewOpen(false);
          }}
        />
      </div>
    );
  };

  // 第二步内容
  const getStep2Content = () => {
    return (
      <div style={{ display: stepCurrent === 1 ? 'block' : 'none' }}>
        <Form
          id="searchForm"
          form={form1}
          initialValues={{
            checkResult: 0,
          }}
          autoComplete="off"
          style={{ marginBottom: 10 }}
          // labelCol={{ span: 5 }}
          // wrapperCol={{ span: 18 }}
          labelCol={{
            flex: '90px',
          }}
          wrapperCol={{
            flex: 1,
          }}
        >
          <Form.Item
            name="AuditStatus"
            label="审核结果"
            rules={[
              {
                required: true,
                message: '不能为空！',
              },
            ]}
          >
            <Radio.Group>
              <Radio value={1}>合格</Radio>
              <Radio value={2}>不合格</Radio>
              <Radio value={3}>/</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="Opinion"
            label="备注"
            // rules={[
            //   {
            //     required: true,
            //     message: '备注不能为空！',
            //   },
            // ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="Files"
            label="附件照片"
            // rules={[
            //   {
            //     required: true,
            //     message: '附件照片不能为空！',
            //   },
            // ]}
          >
            <SdlUpload
              accept="image/*"
              cuid={cuid()}
              uploadSuccess={id => {
                form1.setFieldsValue({ Files: id });
              }}
            />
          </Form.Item>
        </Form>
        <HandlingSugges type={1} />
        <Row justify="center">
          <Space>
            <Button onClick={() => setStepCurrent(0)}>上一步</Button>
            <Button type="primary" onClick={() => AddCheckServiceReport()}>
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
      <div style={{ display: stepCurrent === 2 ? 'block' : 'none' }}>
        <Result
          status="success"
          title={<span style={{ fontSize: 18 }}>操作完成，已推送消息给服务工程师进行整改!</span>}
          extra={[
            <Button type="primary" onClick={() => onResult()}>
              完成
            </Button>,
          ]}
        />
      </div>
    );
  };

  const renderStepContent = () => {
    return (
      <>
        {getStep1Content()}
        {getStep2Content()}
        {getStep3Content()}
      </>
    );
  };

  return (
    <Modal
      title={`服务报告抽查`}
      wrapClassName="spreadOverModal"
      open={isModalOpen}
      destroyOnClose
      footer={false}
      onCancel={() => {
        setStepCurrent(0);
        onCancel();
      }}
    >
      <Row justify="center" className={styles.stepsWrapper}>
        <Steps current={stepCurrent} style={{ width: '70%' }}>
          <Step title="查看服务报告" />
          <Step title="审核" />
          <Step title="完成" />
        </Steps>
      </Row>
      <div className={styles.stepsContent}>{renderStepContent()}</div>
    </Modal>
  );
};

export default connect(dvaPropsData)(AuditModalPage);
