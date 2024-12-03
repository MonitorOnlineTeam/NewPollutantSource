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
          RulesType: data.RulesType==='0'? data.RulesType : !values.LarPointNum && !values.LarOperationNum && !values.LarCustomersNum && !values.LarVisitNum ? '0' : '1',
          PointNum: data.PointNum,
          OperationNum: data.OperationNum,
          CustomersNum: data.CustomersNum,
          VisitNum: data.VisitNum,
          LarPointNum: data.LarPointNum,
          LarOperationNum: data.LarOperationNum,
          LarCustomersNum: data.LarCustomersNum,
          LarVisitNum: data.LarVisitNum,
          ...values,
        },
        callback: res => {
          onSuccessCallback();
        },
      });
    });
  };
  const rulesType = data.RulesType;

  return (
    <Modal
      title={`${data.ProvinceManager || data.UserName}（  ${rulesType==='0'?  `${data.CTOperation}经理` : `大区经理-${data.CTOperation}`}）`}
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
          name={rulesType==='0' ? "PointNum" : "LarPointNum"}
          label="（现场检查）覆盖监测点个数（个/月）"
          // rules={[
          //   {
          //     required: true,
          //     message: '不能为空',
          //   },
          // ]}
        >
          <InputNumber  min={1} step={1} placeholder="请输入" style={{ width: 120 }} />
        </Form.Item>
        <Form.Item
          name={rulesType==='0' ? "OperationNum" : "LarOperationNum"}
          label="（现场检查）覆盖人员数量（人/月）"
          // rules={[
          //   {
          //     required: true,
          //     message: '不能为空',
          //   },
          // ]}
        >
          <InputNumber  min={1} step={1} placeholder="请输入" style={{ width: 120 }} />
        </Form.Item>
        <Form.Item
          name={rulesType==='0' ? "CustomersNum" : "LarCustomersNum"}
          label="回访客户次数（次/月）"
          // rules={[
          //   {
          //     required: true,
          //     message: '不能为空',
          //   },
          // ]}
        >
          <InputNumber  min={1} step={1} placeholder="请输入" style={{ width: 120 }} />
        </Form.Item>
       {/运维/.test(data.CTOperation) && <Form.Item
          name={rulesType==='0' ? "VisitNum": "LarVisitNum"}
          label="管理部门拜访次数（次/月）"
        >
          <InputNumber  min={1} step={1} placeholder="请输入" style={{ width: 120 }} />
        </Form.Item>}
      </Form>
    </Modal>
  );
};

export default connect(dvaPropsData)(Setting);
