/*
 * @Author: JiaQi
 * @Date: 2023-04-18 16:57:50
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-02-24 09:07:23
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
  Radio,
  message,
} from 'antd';
import styles from './styles.less';
import HandleCustomer from './HandleCustomer';
import Cookie from 'js-cookie';
import moment from 'moment';
import RegionList from '@/components/RegionList';
import SdlCascader from '@/pages/AutoFormManager/SdlCascader';
import { checkRules } from '@/utils/validator';

const dataSource = [
  {
    key: '1',
    type: '问题解决能力',
    dataIndex: 'ServiceResponse',
  },
  {
    key: '2',
    type: '沟通能力',
    dataIndex: 'ProblemSolvingEfficiency',
  },
  {
    key: '3',
    type: '响应速度',
    dataIndex: 'TechnicalLevel',
  },
];

const { TextArea } = Input;

const dvaPropsData = ({ loading, common, wordSupervision }) => ({
  TYPE: wordSupervision.TYPE, // 1: 成套 ""：运维
  customerList: wordSupervision.customerList,
  allUser: common.allUser,
  // otherCustomerList: wordSupervision.otherCustomerList,
  // messageList: wordSupervision.messageList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  getAlluserLoading: loading.effects[`common/getAlluser`],
  submitLoading: loading.effects['wordSupervision/InsOrUpdOtherCustomer'],
  largeRegionListLoading: loading.effects[`ctCommon/GetLargeRegionList`],
  visitEnvironmentalParameterLoading:
    loading.effects['wordSupervision/GetVisitEnvironmentalParameter'],
});

const CustomerInterview = props => {
  const {
    customerList,
    submitLoading,
    onCancel,
    editData,
    onSubmitCallback,
    TYPE,
    taskInfo,
    visitEnvironmentalParameterLoading,
  } = props;
  const [form] = Form.useForm();

  const [customID, setCustomID] = useState();
  const [provinceList, setProvinceList] = useState([]);

  useEffect(() => {
    GetUserInfo();
    getCustomerList();
    getVisitEnvironmentalParameter();
    return () => {
      form.resetFields();
    };
  }, []);

  // 获取客户
  const getCustomerList = () => {
    props.dispatch({
      type: 'wordSupervision/getCustomerList',
      payload: {
        type: TYPE == 1 ? '2' : '1', // 1：运维 2：成套
        ReionCode: taskInfo.RegionCode || editData.RegionCode,
      },
    });
  };

  // 获取用户信息
  const GetUserInfo = () => {
    props.dispatch({
      type: `common/getAlluser`,
      payload: {},
    });
  };

  // // 获取维护的客户
  // const getOtherCustomerList = () => {
  //   props.dispatch({
  //     type: 'wordSupervision/getOtherCustomerList',
  //     payload: {},
  //   });
  // };

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
                <Row justify="center">
                  <Form.Item
                    // label={record.type}
                    name={record.dataIndex}
                    style={{ marginBottom: 0 }}
                    // labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: `请选择${record.type}满意度！`,
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={1}>非常满意</Radio>
                      <Radio value={2}>满意</Radio>
                      <Radio value={3}>不满意</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Row>
              );
            },
          },
        ],
      },
    ];
  };

  //
  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      console.log('values', values);
      let body = {
        ...values,
        Province: values.Province.toString(),
        ReturnTime: moment(values.ReturnTime).format('YYYY-MM-DD 00:00:00'),
        UserGroup_Name: undefined,
        ProvinceName: undefined,
        DailyTaskID: taskInfo.ID || editData.DailyTaskID,
        Visiter: JSON.parse(userCookie).UserId,
        ID: editData.ID,
      };
      props.dispatch({
        type: 'wordSupervision/InsOrUpdReturnVisitCustomers',
        payload: body,
        callback: () => {
          onSubmitCallback();
          onCancel();
        },
      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      // 获取第一个错误字段的错误信息并显示
      const firstError = errorInfo.errorFields?.[0];
      if (firstError) {
        message.error(firstError.errors[0]);
      }
    }
  };

  const [achievingResultsList, setAchievingResultsList] = useState([]);
  const [purposeVisitValue, setPurposeVisitValue] = useState(); //拜访目的
  // 获取拜访目的下拉
  const getVisitEnvironmentalParameter = () => {
    props.dispatch({
      type: 'wordSupervision/GetVisitEnvironmentalParameter',
      payload: {},
      callback: res => {
        setAchievingResultsList(res?.Datas || []);
        setPurposeVisitValue(editData?.VisitPurpose);
      },
    });
  };

  const userCookie = Cookie.get('currentUser');
  if (userCookie) {
    form.setFieldsValue({ Visiter: JSON.parse(userCookie).UserName });
  }

  const getLargeRegionListRequest = option => {
    props.dispatch({
      type: `ctCommon/GetLargeRegionList`,
      payload: {},
      callback: res => {
        // const data = [];
        // res.map(item => {
        //   if (item.ChildList?.[0]) {
        //     item.ChildList.map(childListItem => {
        //       data.push(childListItem);
        //     });
        //   }
        // });
        // const currentProvinceData = option['data-item'].UserGroup_ID
        //   ? data.filter(item => item.ID == option['data-item'].UserGroup_ID)
        //   : [];
        // setProvinceList(currentProvinceData);
        // setTimeout(() => {
        //   form.setFieldsValue({
        //     Province: option['data-item']?.Province,
        //   });
        // });
      },
    });
  };

  return (
    <>
      {/* {taskInfo.CreateTime && (
        <Alert
          message={`任务类型：${taskType[taskInfo.TaskType]}，${taskInfo.CreateTime} 开始，于${
            taskInfo.EndTime
          } 结束，每个工单最少有（${taskInfo.standNum}次/月）记录。`}
          type="info"
          showIcon
          style={{ marginRight: 30 }}
        />
      )} */}
      <h2 className={styles.formTitle}>回访客户记录表</h2>
      <div className={styles.formContent}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={{
            ...editData,
            UserGroup_Name: editData.LargeRegion,
            Province: editData.Province?.split(','),
            ReturnTime: moment(editData.ReturnTime),
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row style={{ width: '100%' }}>
            <Form.Item name="RegionalArea" style={{ display: 'none' }}>
              {/* 大区id */}
              <Input disabled />
            </Form.Item>
            {/* <Form.Item name="Province" style={{ display: 'none' }}> */}
            {/* 省份id */}
            {/* <Input disabled /> */}
            {/* </Form.Item> */}
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
                <Input disabled placeholder="请先选择客户名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="省/市"
                name="Province"
                rules={[
                  {
                    required: true,
                    message: '省份不能为空！',
                  },
                ]}
              >
                <SdlCascader noFilter selectType="2,否" />
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
                <DatePicker
                  disabledDate={current => {
                    return current && current > moment().endOf('day');
                  }}
                  style={{ width: '100%' }}
                />
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
                        optionFilterProp="children"
                        // filterOption={(input, option) =>
                        //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                        onChange={(value, option) => {
                          setCustomID(value);
                          form.setFieldsValue({
                            RegionalArea: option['data-item']?.UserGroup_ID,
                            UserGroup_Name: option['data-item']?.UserGroup_Name,
                            Province: option['data-item']?.Province.split(',').slice(0, 2),
                          });
                          // getLargeRegionListRequest(option);
                        }}
                      >
                        {customerList.map(item => {
                          return (
                            <Option value={item.ID} key={item.ID} data-item={item}>
                              {item.CustomFullName || item.CustomName}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <HandleCustomer
                      RegionCode={taskInfo.RegionCode || editData.RegionCode}
                      CustomID={customID}
                      onOk={data => {
                        console.log('data', data);
                        setCustomID(data.ID);
                        form.setFieldsValue({
                          CustomID: data.ID,
                          UserGroup_Name: data.UserGroup_Name,
                          RegionalArea: data.UserGroup_ID,
                          Province: data.Province.split(','),
                        });
                        // getLargeRegionListRequest({
                        //   'data-item': { UserGroup_ID: data.UserGroup_ID, Province: data.Province },
                        // });
                      }}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="会谈人姓名"
                name="CustomerName"
                rules={[
                  {
                    required: true,
                    message: '请输入会谈人姓名！',
                  },
                ]}
              >
                <Input placeholder="请输入会谈人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="职位"
                name="Post"
                rules={[
                  {
                    required: true,
                    message: '职位不能为空！',
                  },
                ]}
              >
                <Input placeholder="请填写职位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="手机"
                name="Phone"
                rules={[
                  {
                    required: true,
                    message: '手机不能为空！',
                  },
                  { ...checkRules.mobile },
                  // {
                  //   pattern: /^1[3-9]\d{9}$/,
                  //   message: '请输入正确的手机号码！'
                  // }
                ]}
              >
                <Input placeholder="请填写手机" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="VisitPurpose"
                label="拜访目的"
                rules={[{ required: true, message: '请选择拜访目的！' }]}
              >
                <Select
                  placeholder="请选择拜访目的"
                  loading={visitEnvironmentalParameterLoading}
                  options={achievingResultsList?.EvaluateList}
                  fieldNames={{ label: 'Name', value: 'ChildID' }}
                  showSearch
                  allowClear
                  optionFilterProp="Name"
                  onChange={value => {
                    setPurposeVisitValue(value);
                    form.setFieldValue('Evaluate', undefined);
                    value == 723 && form.setFieldValue('OtherPurpose', undefined);
                  }}
                />
              </Form.Item>
            </Col>
            {purposeVisitValue == 723 && (
              <Col span={12}>
                <Form.Item
                  name="OtherPurpose"
                  label="其他拜访目的"
                  rules={[{ required: true, message: '请输入其他拜访目的！' }]}
                >
                  <Input placeholder="请输入其他拜访目的" allowClear />
                </Form.Item>
              </Col>
            )}
            {purposeVisitValue != 723 && (
              <Col span={12}>
                <Form.Item
                  name="Evaluate"
                  label="取得效果"
                  rules={[{ required: true, message: '请选择取得效果！' }]}
                >
                  <Select
                    placeholder="请选择取得效果"
                    loading={visitEnvironmentalParameterLoading}
                    fieldNames={{ label: 'Name', value: 'ChildID' }}
                    showSearch
                    allowClear
                    optionFilterProp="Name"
                    options={
                      achievingResultsList?.EvaluateList?.filter(
                        item => item.ChildID == purposeVisitValue,
                      )?.[0]?.ChildList || []
                    }
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item
                name="SpecificResults"
                label="具体成果"
                rules={[{ required: true, message: '请输入具体成果！' }]}
              >
                <Input placeholder="请输入具体成果" allowClear />
              </Form.Item>
            </Col>
            <Col span={12} style={{ display: 'none' }}>
              <Form.Item
                label="回访人"
                name="Visiter"
                rules={[
                  {
                    required: true,
                    message: '请填写回访人！',
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="运维人员"
                name="OperationUser"
                rules={[{ required: true, message: '请选择服务人员姓名' }]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="请输入"
                  optionFilterProp="User_Name"
                  fieldNames={{ label: 'User_Name', value: 'User_ID' }}
                  loading={props.getAlluserLoading}
                  options={props.allUser}
                />
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
