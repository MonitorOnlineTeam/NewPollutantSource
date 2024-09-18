import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Divider,
  Modal,
  Card,
  Spin,
  Button,
  Space,
  Select,
  InputNumber,
  Typography,
  message,
  Row,
  Radio,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntAtmoList from '@/components/EntAtmoList';
import SdlTable from '@/components/SdlTable';
import { API } from '@config/API';
import moment from 'moment';
import AssistDataAnalysis from '@/pages/AbnormalIdentifyModel/AssistDataAnalysis';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  queryLoading: loading.effects['AbnormalIdentifyModel/GetCheckedRectificationList'],
  pointListLoading: loading.effects['AbnormalIdentifyModel/GetNoFilterPointByEntCode'],
});

const CombustionProcess = props => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const { dispatch, onOk, open, onCancel, currentRow } = props;
  const [PmCemsSupplier, setPmCemsSupplier] = useState([]);
  const [qualityStatus, setQualityStatus] = useState();

  useEffect(() => {
    GetPmCemsSupplierCode();
  }, []);

  // 获取燃烧工艺
  const GetPmCemsSupplierCode = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetPmCemsSupplierCode,
      payload: {},
      callback: res => {
        setPmCemsSupplier(res.Datas);
      },
    });
  };

  // 提交配置
  const onFinish = async () => {
    const values = await form2.validateFields();
    props.dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.UpdatePmCemsSupplier,
      payload: {
        ...values,
        dgimn: currentRow.DGIMN,
      },
      callback: () => {
        message.success('操作成功！');
        onOk();
      },
    });
  };

  return (
    <Modal
      title={`选择燃烧工艺`}
      open={open}
      onCancel={() => onCancel()}
      onOk={() => {
        onFinish();
      }}
      destroyOnClose
    >
      <Form
        form={form2}
        initialValues={{
          ...currentRow,
          qualityStatus: 1,
        }}
        autoComplete="off"
        labelCol={{ flex: '120px' }}
        wrapperCol={{ flex: 1 }}
      >
        <Form.Item label="企业">
          <Text>{currentRow.entName}</Text>
        </Form.Item>
        <Form.Item label="排口">
          <Text>{currentRow.pointName}</Text>
        </Form.Item>
        <Form.Item
          label="燃烧工艺"
          name="pmCemsSupplier"
          // rules={[
          //   {
          //     required: true,
          //     message: '不能为空',
          //   },
          // ]}
        >
          <Select
            placeholder="请选择"
            showSearch
            allowClear
            optionFilterProp="children"
            // disabled={qualityStatus != 1}
          >
            {PmCemsSupplier.map(item => {
              return (
                <Option key={item.ID} value={item.ID}>
                  {item.Name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="重新选配模型"
          name="qualityStatus"
          rules={[
            {
              required: true,
              message: '不能为空',
            },
          ]}
        >
          <Radio.Group
            onChange={e => {
              // setQualityStatus(e.target.value);
            }}
          >
            <Radio value={2}>是</Radio>
            <Radio value={1}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Row align="middle" style={{ marginLeft: 20 }}>
          <Text type="danger">
            <InfoCircleOutlined style={{ marginRight: 4 }} />
            修改燃烧工艺后是否根据燃烧工艺自动修改点位关联模型
          </Text>
        </Row>
      </Form>
    </Modal>
  );
};

export default connect(dvaPropsData)(CombustionProcess);
