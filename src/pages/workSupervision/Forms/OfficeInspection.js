/*
 * @Author: JiaQi
 * @Date: 2023-04-20 16:43:45
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-06 09:41:31
 * @Description: 办事处检查任务单填写、编辑
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Divider,
  Space,
  Button,
  Input,
  Select,
  Radio,
  InputNumber,
  Table,
} from 'antd';
import styles from './styles.less';
import TaskAlart from './TaskAlart';

const { TextArea } = Input;
const warehouse_DataSource = [
  {
    key: '1',
    type: '是否上锁',
    dataIndex: 'IsLock',
  },
  {
    key: '2',
    type: '库房整洁度（1-5分）',
    dataIndex: 'StorehouseNeatness',
  },
  {
    key: '3',
    type: '出入库台账规范（1-5分）',
    dataIndex: 'AccountSpecification',
  },
  {
    key: '4',
    type: '呆滞物料情况（1-5分）',
    dataIndex: 'SluggishMaterials',
  },
];
const car_DataSource = [
  {
    key: '1',
    type: '车牌号',
    dataIndex: 'PlateNumber',
  },
  {
    key: '2',
    type: '整洁度（含后备箱）（1-5分）',
    dataIndex: 'CarNeatness',
  },
  {
    key: '3',
    type: '云上管车使用记录（1-5分）',
    dataIndex: 'CarUseRecord',
  },
];

const dvaPropsData = ({ loading, wordSupervision }) => ({
  officeList: wordSupervision.officeList,
  submitLoading: loading.effects['wordSupervision/InsOrUpdOfficeCheck'],
});

const OfficeInspection = props => {
  const [form] = Form.useForm();
  const { taskInfo, editData, officeList, submitLoading, onCancel, onSubmitCallback } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});

  useEffect(() => {
    GetOfficeList();
  }, []);

  // 获取办事处列表
  const GetOfficeList = () => {
    props.dispatch({
      type: 'wordSupervision/GetOfficeList',
      payload: {},
    });
  };

  // 提交任务单
  const onFinish = async () => {
    const values = await form.validateFields();
    console.log('values', values);
    let body = {
      ...values,
      UserGroup_Name: undefined,
      ProvinceName: undefined,
      DailyTaskID: taskInfo.ID,
      ID: editData.ID,
    };
    console.log('body', body);
    // return;
    props.dispatch({
      type: 'wordSupervision/InsOrUpdOfficeCheck',
      payload: body,
      callback: () => {
        onSubmitCallback();
        onCancel();
      },
    });
  };

  // 库房检查列头
  const getWarehouseColumns = () => {
    return [
      {
        title: '库房检查',
        children: [
          {
            title: '检查内容',
            dataIndex: 'type',
            key: 'type',
            width: 200,
            align: 'center',
            className: styles.hideColumn,
            render: text => {
              return <div className={styles.required}>{text}</div>;
            },
          },
          {
            title: '结果',
            dataIndex: 'address',
            key: 'address',
            width: 200,
            align: 'center',
            className: styles.hideColumn,
            render: (text, record) => {
              if (record.dataIndex === 'IsLock') {
                return (
                  <Form.Item
                    name="IsLock"
                    style={{ marginBottom: 0 }}
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={'1'}>是</Radio>
                      <Radio value={'0'}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                );
              }
              return (
                <Form.Item
                  name={record.dataIndex}
                  style={{ marginBottom: 0 }}
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: '不能为空！',
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="1 ~ 5"
                    max={5}
                    min={1}
                    style={{ width: 100, textAlign: 'center' }}
                  />
                </Form.Item>
              );
            },
          },
        ],
      },
    ];
  };

  // 车辆检查列头
  const getCarColumns = () => {
    return [
      {
        title: '车辆检查',
        children: [
          {
            title: '检查内容',
            dataIndex: 'type',
            key: 'type',
            width: 0,
            align: 'center',
            className: styles.hideColumn,
            render: text => {
              return <div className={styles.required}>{text}</div>;
            },
          },
          {
            title: '结果',
            dataIndex: 'address',
            key: 'address',
            width: 0,
            align: 'center',
            className: styles.hideColumn,
            render: (text, record) => {
              if (record.dataIndex === 'PlateNumber') {
                return (
                  <Form.Item
                    name="PlateNumber"
                    style={{ marginBottom: 0 }}
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: '车牌号不能为空',
                      },
                    ]}
                  >
                    <Input placeholder="请输入车牌号" />
                  </Form.Item>
                );
              }
              return (
                <Form.Item
                  name={record.dataIndex}
                  style={{ marginBottom: 0 }}
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: '不能为空！',
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="1 ~ 5"
                    max={5}
                    min={1}
                    style={{ width: 100, textAlign: 'center' }}
                  />
                </Form.Item>
              );
            },
          },
        ],
      },
    ];
  };

  return (
    <>
      <TaskAlart taskInfo={taskInfo} />
      <h2 className={styles.formTitle}>办事处检查任务单</h2>
      <div className={styles.formContent}>
        <Form
          form={form}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          initialValues={{
            BusinessCulture: '1',
            IsLock: '1',
            ...editData,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <Form.Item
                label="大区"
                name="UserGroup_Name"
                rules={[
                  {
                    required: true,
                    message: '大区不能为空！',
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="省份"
                name="ProvinceName"
                rules={[
                  {
                    required: true,
                    message: '省份不能为空！',
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="办事处"
                // style={{ marginBottom: 0 }}
                name="OfficeCode"
                rules={[
                  {
                    required: true,
                    message: '请选择办事处！',
                  },
                ]}
              >
                <Select
                  placeholder="请选择办事处"
                  style={{ width: '100%' }}
                  onChange={(value, option) => {
                    // debugger;
                    // formRef.current.setFieldsValue({
                    // setCustomID(value);
                    form.setFieldsValue({
                      UserGroup_Name: option['data-item'].UserGroup_Name,
                      ProvinceName: option['data-item'].ProvinceName,
                    });
                  }}
                >
                  {officeList.map(item => {
                    return (
                      <Option value={item.ID} key={item.ID} data-item={item}>
                        {item.OfficeName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="办事处整洁度（1-5分）"
                name="OfficeNeatness"
                rules={[
                  {
                    required: true,
                    message: '办事处整洁度为空！',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  max={5}
                  min={1}
                  placeholder="请填写办事处整洁度"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="企业文化是否上墙"
                name="BusinessCulture"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={'1'}>是</Radio>
                  <Radio value={'0'}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Table
            size="small"
            bordered
            dataSource={warehouse_DataSource}
            columns={getWarehouseColumns()}
            pagination={false}
          />
          <Table
            style={{ margin: '20px 0' }}
            size="small"
            bordered
            dataSource={car_DataSource}
            columns={getCarColumns()}
            pagination={false}
          />
          <Col span={24}>
            <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="备注" name="Remark">
              <TextArea rows={3} placeholder="请输入备注" />
            </Form.Item>
          </Col>
          <Divider orientation="right" style={{ color: '#d9d9d9' }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                提交
              </Button>
              <Button onClick={onCancel}>取消</Button>
            </Space>
          </Divider>
        </Form>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(OfficeInspection);
