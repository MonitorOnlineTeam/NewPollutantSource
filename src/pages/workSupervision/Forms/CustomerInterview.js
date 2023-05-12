/*
 * @Author: JiaQi
 * @Date: 2023-04-18 16:57:50
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-12 09:13:27
 * @Description: 回访客户任务单
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Alert,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  InputNumber,
  Divider,
  Row,
  Col,
  Space,
  Table,
} from 'antd';
import styles from './styles.less';
import HandleCustomer from './HandleCustomer';
import Cookie from 'js-cookie';
import moment from 'moment';
import { taskType } from '../workSupervisionUtils';

const dataSource = [
  {
    key: '1',
    type: '服务态度',
    dataIndex: 'ServeManner',
  },
  {
    key: '2',
    type: '技术水平',
    dataIndex: 'TechnicalLevel',
  },
  {
    key: '3',
    type: '服务响应',
    dataIndex: 'ServiceResponse',
  },
  {
    key: '4',
    type: '问题解决效率',
    dataIndex: 'ProblemSolvingEfficiency',
  },
];

const { TextArea } = Input;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  customerList: wordSupervision.customerList,
  allUser: wordSupervision.allUser,
  // messageList: wordSupervision.messageList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  submitLoading: loading.effects['wordSupervision/InsOrUpdOtherCustomer'],
});

const CustomerInterview = props => {
  const { customerList, submitLoading, taskInfo, onCancel, editData, onSubmitCallback, allUser } = props;
  const [form] = Form.useForm();
  // const formRef = React.createRef();

  const [customID, setCustomID] = useState();

  useEffect(() => {
    getCustomerList();
    GetAllUser();
  }, []);

  // 获取客户
  const getCustomerList = () => {
    props.dispatch({
      type: 'wordSupervision/getCustomerList',
      payload: {},
    });
  };

  // 获取所有客户
  const GetAllUser = () => {
    props.dispatch({
      type: 'wordSupervision/GetAllUser',
      payload: {},
    });
  };

  const getColumns = () => {
    return [
      {
        title: '客户满意度（1-5）',
        children: [
          {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 200,
            align: 'center',
            render: text => {
              return <div className={styles.required}>{text}</div>;
            },
          },
          {
            title: '满意度',
            dataIndex: 'address',
            key: 'address',
            width: 200,
            align: 'center',
            render: (text, record) => {
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

  //
  const onFinish = async () => {
    const values = await form.validateFields();
    console.log('values', values);
    let body = {
      ...values,
      ReturnTime: moment(values.ReturnTime).format('YYYY-MM-DD 00:00:00'),
      UserGroup_Name: undefined,
      ProvinceName: undefined,
      DailyTaskID: taskInfo.ID,
      // ReturnUser: JSON.parse(userCookie).UserId,
      ID: editData.ID,
    };
    console.log('body', body);
    // return;
    props.dispatch({
      type: 'wordSupervision/InsOrUpdReturnVisitCustomers',
      payload: body,
      callback: () => {
        onSubmitCallback();
        onCancel();
      },
    });
  };

  const userCookie = Cookie.get('currentUser');
  if (userCookie) {
    form.setFieldsValue({ ReturnUser: JSON.parse(userCookie).UserId });
  }

  return (
    <>
      {taskInfo.CreateTime && (
        <Alert
          message={`任务类型：${taskType[taskInfo.TaskType]}，${taskInfo.CreateTime} 开始，于${
            taskInfo.EndTime
          } 结束，每个工单最少有（${taskInfo.standNum}次/月）记录。`}
          type="info"
          showIcon
          style={{ marginRight: 30 }}
        />
      )}
      <h2 className={styles.formTitle}>回访客户记录表</h2>
      <div className={styles.formContent}>
        <Form
          // name="basic"
          // layout="inline"
          form={form}
          // ref={formRef}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          // labelCol={{
          //   span: 12,
          // }}
          // wrapperCol={{
          //   span: 10,
          // }}
          initialValues={{
            ...editData,
            ReturnTime: moment(editData.ReturnTime),
            // ServiceResponse: 1,
            // TechnicalLevel: 2,
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
              <Form.Item label="客户名称" style={{ marginBottom: 0 }}>
                <Row gutter={8}>
                  <Col span={14}>
                    <Form.Item
                      name="CustomID"
                      rules={[
                        {
                          required: true,
                          message: '请选择客户名称！',
                        },
                      ]}
                    >
                      <Select
                        placeholder="请选择客户名称"
                        style={{ width: '100%' }}
                        showSearch
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(value, option) => {
                          // debugger;
                          // formRef.current.setFieldsValue({
                          setCustomID(value);
                          form.setFieldsValue({
                            UserGroup_Name: option['data-item'].UserGroup_Name,
                            ProvinceName: option['data-item'].ProvinceName,
                          });
                        }}
                      >
                        {customerList.map(item => {
                          return (
                            <Option value={item.ID} key={item.ID} data-item={item}>
                              {item.CustomName}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  {console.log('customID.', customID)}
                  <Col span={10}>
                    <HandleCustomer
                      CustomID={customID}
                      onOk={data => {
                        setCustomID(data.ID);
                        form.setFieldsValue({
                          CustomID: data.ID,
                          UserGroup_Name: data.UserGroup_Name,
                          ProvinceName: data.ProvinceName,
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="部门"
                name="Depart"
                rules={[
                  {
                    required: true,
                    message: '部门不能为空！',
                  },
                ]}
              >
                <Input placeholder="请填写部门" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="职务"
                name="Post"
                rules={[
                  {
                    required: true,
                    message: '职务不能为空！',
                  },
                ]}
              >
                <Input placeholder="请填写职务" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系方式"
                name="Phone"
                rules={[
                  {
                    required: true,
                    message: '联系方式不能为空！',
                  },
                ]}
              >
                <Input placeholder="请填写联系方式" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="回访人"
                name="ReturnUser"
                rules={[
                  {
                    required: true,
                    message: '请选择回访人！',
                  },
                ]}
              >
                <Select
                  placeholder="请选择回访人！"
                  style={{ width: '100%' }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {allUser.map(item => {
                    return (
                      <Option value={item.key} key={item.key}>
                        {item.User_Name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="回访日期"
                name="ReturnTime"
                rules={[
                  {
                    required: true,
                    message: '请选择回访日期！',
                  },
                ]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Table
            size="small"
            bordered
            dataSource={dataSource}
            columns={getColumns()}
            pagination={false}
          />
          <Col span={24} style={{ marginTop: 20 }}>
            <Form.Item
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 19 }}
              label="问题及建议"
              name="ProblemsAndAdvice"
            >
              <TextArea rows={3} placeholder="请输入问题及建议" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 19 }} label="备注" name="Remark">
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

export default connect(dvaPropsData)(CustomerInterview);
