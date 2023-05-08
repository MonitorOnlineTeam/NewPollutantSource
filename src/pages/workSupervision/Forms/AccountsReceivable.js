/*
 * @Author: JiaQi
 * @Date: 2023-04-26 09:54:05
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-04-26 15:28:32
 * @Description：应收账款催收
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
  Popconfirm,
  Alert,
  Tag,
  Popover,
} from 'antd';
import styles from './styles.less';
import TaskAlart from './TaskAlart';
import { checkRules } from '@/utils/validator';
import { taskType } from '../workSupervisionUtils';
import SdlTable from '@/components/SdlTable';
import TaskAlartManual from './TaskAlartManual';

const { TextArea } = Input;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  IndustryList: wordSupervision.IndustryList,
  GetProjectInfoListLoading: loading.effects['wordSupervision/GetProjectInfoList'],
  submitLoading: loading.effects['wordSupervision/InsOrUpdOfficeCheck'],
});

const AccountsReceivable = props => {
  const [form] = Form.useForm();
  const { taskInfo, IndustryList, submitLoading, onCancel, GetProjectInfoListLoading } = props;
  const [projectInfoList, setProjectInfoList] = useState({});
  const [projectNum, setProjectNum] = useState('');
  const [popVisible, setPopVisible] = useState(false);
  const [isProjectSelect, setIsProjectSelect] = useState(false);

  useEffect(() => {
    GetIndustryList();
  }, []);

  // 获取行业
  const GetIndustryList = () => {
    props.dispatch({
      type: 'wordSupervision/GetPollutantTypeList',
      payload: {},
    });
  };

  // 获取项目
  const GetProjectInfoList = () => {
    props.dispatch({
      type: 'wordSupervision/GetProjectInfoList',
      payload: {
        ProjectCode: projectNum,
      },
      callback: res => {
        setProjectInfoList(res);
      },
    });
  };

  // 提交任务单
  const onFinish = async () => {
    const values = await form.validateFields();
    console.log('values', values);
    let body = {
      ...values,
      DailyTaskID: taskInfo.ID,
      // ID: editData.ID,
    };
    console.log('body', body);
    // return;
    props.dispatch({
      type: 'wordSupervision/InsOrUpdAccountsReceivable',
      payload: body,
      callback: () => {
        // onSubmitCallback();
        onCancel();
      },
    });
  };

  const projectNumCol = [
    {
      title: '合同名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '卖方公司名称',
      dataIndex: 'SellCompanyName',
      key: 'SellCompanyName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维起始日期',
      dataIndex: 'BeginTime',
      key: 'BeginTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维结束日期',
      dataIndex: 'EndTime',
      key: 'EndTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return (
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setPorjectInfo(record);
            }}
          >
            选择
          </Button>
        );
      },
    },
  ];

  const setPorjectInfo = record => {
    form.setFieldsValue({
      ProjectNo: record.ID,
      ProjectCode: record.ProjectCode,
      ProjectName: record.ProjectName,
    });
    // setChoiceData(record.ProjectCode);
    setPopVisible(false);
  };

  const Industry = form.getFieldValue('Industry');

  //
  const renderProjectNoSelect = () => {
    const ProjectCode = form.getFieldValue('ProjectCode');
    return (
      <Form.Item
        label="项目编号"
        name="ProjectCode"
        rules={[{ required: true, message: '请输入项目编号!' }]}
      >
        {isProjectSelect ? (
          <Popover
            content={
              <>
                <Row>
                  <Form.Item style={{ marginRight: 8 }} label="项目编号">
                    <Input
                      allowClear
                      placeholder="请输入项目编号"
                      onChange={e => {
                        setProjectNum(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        GetProjectInfoList();
                      }}
                    >
                      查询
                    </Button>
                  </Form.Item>
                </Row>
                <SdlTable
                  resizable
                  scroll={{ y: 'calc(100vh - 500px)' }}
                  style={{ width: 800 }}
                  loading={GetProjectInfoListLoading}
                  bordered
                  dataSource={projectInfoList}
                  columns={projectNumCol}
                />
              </>
            }
            title=""
            trigger="click"
            visible={popVisible}
            onVisibleChange={visible => {
              console.log('visible', visible);
              setPopVisible(visible);
            }}
            placement="bottom"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Select
              // onChange={onClearChoice}
              allowClear
              showSearch={false}
              value={ProjectCode}
              dropdownClassName={styles.projectNumSty}
              placeholder="请选择项目编号"
            ></Select>
          </Popover>
        ) : (
          <Input placeholder="请输入项目编号" />
        )}
      </Form.Item>
    );
  };

  console.log('Industry', Industry);
  return (
    <>
      <TaskAlartManual taskInfo={taskInfo} onCancel={() => onCancel()} />
      <h2 className={styles.formTitle}>应收账款催收</h2>
      <div className={styles.formContent}>
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          initialValues={{}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <Form.Item
                label="行业"
                // style={{ marginBottom: 0 }}
                name="Industry"
                rules={[
                  {
                    required: true,
                    message: '请选择行业！',
                  },
                ]}
              >
                <Select
                  placeholder="请选择行业"
                  style={{ width: '100%' }}
                  onChange={(value, option) => {
                    if (value === 1 || value === 2) {
                      setIsProjectSelect(true);
                      GetProjectInfoList();
                    } else {
                      setIsProjectSelect(false);
                    }
                  }}
                >
                  {IndustryList.map(item => {
                    return (
                      <Option value={item.PollutantTypeCode} key={item.PollutantTypeCode}>
                        {item.PollutantTypeName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12} style={{ display: 'none' }}>
              <Form.Item
                label="项目ID"
                name="ProjectNo"
                rules={[
                  {
                    required: true,
                    message: '项目ID不能为空！',
                  },
                ]}
              >
                <Input placeholder="请填写项目ID" />
              </Form.Item>
            </Col>
            <Col span={12}>{renderProjectNoSelect()}</Col>
            <Col span={12}>
              <Form.Item
                label="项目接洽人"
                name="UserName"
                rules={[
                  {
                    required: true,
                    message: '项目接洽人不能为空！',
                  },
                ]}
              >
                <Input placeholder="请填写项目接洽人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="项目名称"
                name="ProjectName"
                rules={[
                  {
                    required: true,
                    message: '项目名称不能为空！',
                  },
                ]}
              >
                <Input disabled={isProjectSelect} placeholder="请填写项目名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="接洽人职务"
                name="UserPost"
                rules={[
                  {
                    required: true,
                    message: '接洽人职务不能为空！',
                  },
                ]}
              >
                <Input placeholder="请填写接洽人职务" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="接洽人联系电话"
                name="UserPhone"
                rules={[
                  {
                    required: true,
                    message: '接洽人联系电话不能为空！',
                  },
                  checkRules['mobile'],
                ]}
              >
                <Input placeholder="请填写接洽人联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="欠款金额"
                name="AmountInArear"
                rules={[
                  {
                    required: true,
                    message: '欠款金额不能为空！',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请填写欠款金额" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="催收完成金额"
                name="CompletionAmount"
                rules={[
                  {
                    required: true,
                    message: '催收完成金额不能为空！',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请填写催收完成金额" />
              </Form.Item>
            </Col>
          </Row>
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

export default connect(dvaPropsData)(AccountsReceivable);
