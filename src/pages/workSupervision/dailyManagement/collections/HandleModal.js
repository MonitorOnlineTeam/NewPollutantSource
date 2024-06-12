/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:54:18
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-15 20:33:12
 * @Description：部门内其他工作事项
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Select,
  Form,
  Modal,
  Row,
  Col,
  Input,
  Popover,
  Button,
  InputNumber,
  Divider,
  Space,
} from 'antd';
import moment from 'moment';
import LargeRegionSelect from '@/pages/workSupervision/dailyManagement/components/LargeRegionSelect';
import SdlTable from '@/components/SdlTable';
import styles from '../../styles.less';
import { checkRules } from '@/utils/validator';

const { TextArea } = Input;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  IndustryList: wordSupervision.IndustryList,
  GetProjectInfoListLoading: loading.effects['wordSupervision/GetProjectInfoList'],
  submitLoading: loading.effects['wordSupervision/InsOrUpdAccountsReceivable'],
});

const HandleModal = props => {
  const [form] = Form.useForm();
  const [projectNum, setProjectNum] = useState('');
  const [projectInfoList, setProjectInfoList] = useState([]);
  const [popVisible, setPopVisible] = useState(false);

  const {
    editData,
    onCancel,
    onSubmitCallback,
    open,
    WorkType,
    IndustryList,
    GetProjectInfoListLoading,
    submitLoading,
  } = props;

  useEffect(() => {
    GetProjectInfoList();
    // GetIndustryList();
    form.setFieldsValue({
      ...editData,
    });
  }, [editData]);

  // 获取行业
  // const GetIndustryList = () => {
  //   props.dispatch({
  //     type: 'wordSupervision/GetPollutantTypeList',
  //     payload: {pollutantType:'1,2'},
  //   });
  // };

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
      ID: editData.ID,
      CreateTime: editData.CreateTime,
      CreateUser: editData.CreateUser,
    };
    console.log('body', body);
    // return;
    props.dispatch({
      type: 'wordSupervision/InsOrUpdAccountsReceivable',
      payload: body,
      callback: () => {
        onCancel();
        onSubmitCallback();
        form.resetFields();
      },
    });
  };
  console.log('editData', editData);

  const setPorjectInfo = record => {
    form.setFieldsValue({
      ProjectNo: record.ProjectCode,
      ProjectName: record.ProjectName,
      RegionCode: record.Province ? record.Province.split(',')[0] : undefined,
    });
    // setChoiceData(record.ProjectCode);
    setPopVisible(false);
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

  //
  const renderProjectNoSelect = () => {
    const ProjectNo = form.getFieldValue('ProjectNo');
    return (
      <Form.Item
        label="项目编号"
        name="ProjectNo"
        rules={[{ required: true, message: '请输入项目编号!' }]}
      >
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
            setPopVisible(visible);
          }}
          placement="bottom"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Select
            // onChange={onClearChoice}
            // allowClear
            showSearch={false}
            value={ProjectNo}
            dropdownStyle={{ display: 'none' }}
            placeholder="请选择项目编号"
          ></Select>
        </Popover>
      </Form.Item>
    );
  };

  return (
    <>
      <Modal
        title={editData.ID ? '编辑' : '添加'}
        // wrapClassName={`spreadOverModal`}
        width={1000}
        open={open}
        destroyOnClose
        onOk={() => {
          onFinish();
        }}
        onCancel={() => {
          form.resetFields();
          onCancel();
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          initialValues={{}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row style={{ width: '100%' }}>
            <Col span={12}>{renderProjectNoSelect()}</Col>
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
                <Input placeholder="请填写项目名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="最终用户名称"
                name="FinalUserName"
                rules={[
                  {
                    required: true,
                    message: '最终用户名称不能为空！',
                  },
                ]}
              >
                <Input placeholder="请填写最终用户名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <LargeRegionSelect
                required
                label="项目所在省"
                name="RegionCode"
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={12}>
              <Form.Item
                label="项目接洽人姓名"
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
                label="项目接洽人职务"
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
                label="项目接洽人联系电话"
                name="UserPhone"
                rules={[
                  {
                    required: true,
                    message: '项目接洽人联系电话不能为空！',
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
                <InputNumber
                  style={{ width: '100%' }}
                  addonBefore="¥"
                  addonAfter="RMB"
                  placeholder="请填写欠款金额"
                />
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
                <InputNumber
                  addonBefore="¥"
                  addonAfter="RMB"
                  style={{ width: '100%' }}
                  placeholder="请填写催收完成金额"
                />
              </Form.Item>
            </Col>
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
                <Select placeholder="请选择行业" style={{ width: '100%' }}>
                  <Option value={2} key={2}>  废气 </Option>
                  <Option value={1} key={1}>  废水 </Option>
                  {/* {IndustryList.map(item => {
                    return (
                      <Option value={item.PollutantTypeCode} key={item.PollutantTypeCode}>
                        {item.PollutantTypeName}
                      </Option>
                    );
                  })} */}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default connect(dvaPropsData)(HandleModal);
