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

const { Step } = Steps;
const { TextArea } = Input;

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`reportSpotCheck/GetServiceReportList`],
});

const AuditModalPage = props => {
  const [form1] = Form.useForm();

  const [stepCurrent, setStepCurrent] = useState(0);
  const [serviceReportData, setServiceReportData] = useState([]);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);
  // const [uid, setUid] = useState(cuid());
  const [currentNum, setCurrentNum] = useState();

  const { dispatch, id, CheckStatus,isModalOpen, onCancel, reloadPageData } = props;

  useEffect(() => {
    GetDealOpinions();
  }, []);

  // 获取服务详情
  const GetDealOpinions = () => {
    dispatch({
      type: 'reportAudit/GetDealOpinions',
      payload: {
        id,
      },
      callback: res => {
        setServiceReportData(res.Datas);
      },
    });
  };

  // 提交审核
  const AddCheckServiceReport = () => {
    form1.validateFields().then(values => {
      console.log('values', values);
      // return;
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

  // 查看图片
  const ViewUploadComponents = ({ fileList }) => {
    return (
      <>
        <Upload
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
          fileList={fileList}
          onPreview={file => {
            setIsImageViewOpen(true);
            setImageIndex(file.uid);
            setImageList(fileList.map(item => item.url));
          }}
        >
          {/* {fileList.length >= 8 ? null : uploadButton} */}
        </Upload>
      </>
    );
  };

  // 第一步内容
  const getStep1Content = () => {
    return (
      <div style={{ marginTop: 20, display: stepCurrent === 0 ? 'block' : 'none' }}>
        {/* <TitleComponents text="基础信息-发起人填写" /> */}
        {serviceReportData.map(item => {
          let serviceData = item.ServiceList[0];
          let fileList = serviceData.FileList;
          let imgList = fileList.ImgList.map((img, index) => {
            return {
              uid: index,
              status: 'done',
              url: `/${img}`,
            };
          });
          return (
            <Descriptions title={item.ServiceName}>
              <Descriptions.Item label="验收服务报告照片">
                <ViewUploadComponents fileList={imgList} />
              </Descriptions.Item>
              <Descriptions.Item label="照片上传日期">{serviceData.CreateTime}</Descriptions.Item>
              <Descriptions.Item label="备注">{serviceData.Remark || '-'}</Descriptions.Item>
            </Descriptions>
          );
        })}
        <Row justify="center">
          <Space>
            <Button onClick={() => setStepCurrent(0)}>上一步</Button>
            <Button type="primary" onClick={() => setStepCurrent(1)}>
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
          title="操作完成，已推送消息给服务工程师进行整改!"
          extra={[
            <Button type="primary" onClick={() => onResult()}>
              完成
            </Button>,
          ]}
        />
      </div>
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
    // switch (stepCurrent) {
    //   case 0:
    //     return getStep1Content();
    //   case 1:
    //     return getStep2Content();
    //   case 2:
    //     return getStep3Content();
    //   case 3:
    //     return getStep4Content();
    // }

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
