import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, InputNumber } from 'antd';

const dvaPropsData = ({ loading }) => ({
  addProvinceManagementRulesLoading: loading.effects[`generalManager/AddProvinceManagementRules`],
});

const Setting = props => {
  const [form] = Form.useForm();

  const [showType, setShowType] = useState('chart');

  const { dispatch, open, onCancel, data, onSuccessCallback } = props;

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);

  // 设置省区经理日常规则
  const AddProvinceManagementRules = () => {
    form.validateFields().then(values => {
      dispatch({
        type: 'generalManager/AddProvinceManagementRules',
        payload: {
          id: data.ProvinceManagementRulesId,
          Industry: data.Industry,
          CTOperation: data.CTOperation,
          LargeRegion: data.LargeRegion,
          ProjectRegion: data.ProjectRegion,
          ...values,
        },
        callback: res => {
          onSuccessCallback();
        },
      });
    });
  };

  return (
    <Modal
      title={`${data.ProvinceManager || data.UserName}（${data.CTOperation}）`}
      open={open}
      keyboard={false}
      destroyOnClose
      confirmLoading={props.addProvinceManagementRulesLoading}
      onOk={() => {
        AddProvinceManagementRules();
      }}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        form={form}
        name="advanced_search"
        labelCol={{
          flex: '300px',
        }}
        wrapperCol={{
          flex: 1,
        }}
      >
        <Form.Item
          name="PointNum"
          label="（现场检查）覆盖监测点个数（个/月）"
          rules={[
            {
              required: true,
              message: '不能为空',
            },
          ]}
        >
          <InputNumber placeholder="请输入" style={{ width: 120 }} />
        </Form.Item>
        <Form.Item
          name="OperationNum"
          label="（现场检查）覆盖运维人员数量（人/月）"
          rules={[
            {
              required: true,
              message: '不能为空',
            },
          ]}
        >
          <InputNumber placeholder="请输入" style={{ width: 120 }} />
        </Form.Item>
        <Form.Item
          name="CustomersNum"
          label="回访客户次数（次/月）"
          rules={[
            {
              required: true,
              message: '不能为空',
            },
          ]}
        >
          <InputNumber placeholder="请输入" style={{ width: 120 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(dvaPropsData)(Setting);
