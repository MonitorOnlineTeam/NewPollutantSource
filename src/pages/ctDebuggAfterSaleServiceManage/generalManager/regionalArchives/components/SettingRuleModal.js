import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Modal,
  Tooltip,
  Popconfirm,
  Card,
  Row,
  Col,
  Select,
  Input,
  Button,
  Divider,
} from 'antd';
import { DelIcon, EditIcon } from '@/utils/icon';
import Setting from './Setting';
import SdlTable from '@/components/SdlTable';

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`generalManager/GetProvinceManagementRulesList`],
});

const SettingRuleModal = props => {
  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState([]);
  const [handleOpen, setHandleOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});

  const { dispatch, onCancel, open, managerList, queryLoading, onSettingCallback } = props;

  useEffect(() => {
    getPageData();
  }, []);

  // 获取数据
  const getPageData = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'generalManager/GetProvinceManagementRulesList',
      payload: {
        ...values,
      },
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // 删除数据
  const onDelete = id => {
    dispatch({
      type: 'generalManager/DeleteProvinceManagementRules',
      payload: {
        id,
      },
      callback: res => {
        getPageData();
      },
    });
  };

  let columns = [
    {
      title: '序号',
      align: 'center',
    },
    {
      title: '行业',
      dataIndex: 'Industry',
      key: 'Industry',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '成套/运维',
      dataIndex: 'CTOperation',
      key: 'CTOperation',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '执行大区',
      dataIndex: 'LargeRegion',
      key: 'LargeRegion',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目使用地',
      dataIndex: 'ProjectRegion',
      key: 'ProjectRegion',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省区经理',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '现场检查',
      children: [
        {
          title: '覆盖检测点数',
          dataIndex: 'PointNum',
          key: 'PointNum',
          align: 'center',
          ellipsis: true,
          width: 160,
          render: (text, row) => {
            return text ? text + '个/月' : '-';
          },
        },
        {
          title: '覆盖运维人员数量',
          dataIndex: 'OperationNum',
          key: 'OperationNum',
          align: 'center',
          ellipsis: true,
          width: 160,
          render: (text, row) => {
            return text ? text + '人/月' : '-';
          },
        },
      ],
    },
    {
      title: '回访客户次数',
      dataIndex: 'CustomersNum',
      key: 'CustomersNum',
      align: 'center',
      ellipsis: true,
      width: 160,
      render: (text, row) => {
        return text ? text + '次/月' : '-';
      },
    },
    {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      align: 'center',
      ellipsis: true,
      render: (text, row) => {
        return (
          <>
            <Tooltip title="编辑">
              <a
                onClick={() => {
                  setHandleOpen(true);
                  setCurrentRow(row);
                }}
              >
                <EditIcon />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="删除">
              <Popconfirm
                placement="left"
                title="确定要删除吗？"
                onConfirm={() => onDelete(row.ID)}
              >
                <a>
                  <DelIcon />
                </a>
              </Popconfirm>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const searchComponents = () => {
    return (
      <Form form={form} name="advanced_search" className={'ant-advanced-search-form'}>
        <Row align="middle" gutter={16}>
          <Col span={8}>
            <Form.Item name="ctOperation" label="成套/运维">
              <Select placeholder="请选择" allowClear>
                {managerList?.CTOperations?.map(item => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="largeRegion" label="执行大区">
              <Input placeholder="请填写" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="projectRegion" label="项目所在地">
              <Input placeholder="请填写" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="userName" label="省区经理">
              <Input placeholder="请填写" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Button type="primary" onClick={getPageData} loading={queryLoading}>
                查询
              </Button>
              <Button
                style={{ margin: '0 8px' }}
                loading={queryLoading}
                onClick={() => {
                  form.resetFields();
                  getPageData();
                }}
              >
                重置
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };
  console.log('dataSource', dataSource);
  return (
    <Modal
      title="设置省区经理日常管理规则"
      open={open}
      wrapClassName="spreadOverModal"
      footer={false}
      destroyOnClose
      onCancel={() => {
        onCancel();
      }}
    >
      <Card title={searchComponents()} bordered={false}>
        <SdlTable
          resizable
          loading={queryLoading}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </Card>

      <Setting
        data={currentRow}
        open={handleOpen}
        onCancel={() => {
          setHandleOpen(false);
        }}
        onSuccessCallback={res => {
          setHandleOpen(false);
          getPageData();
          onSettingCallback();
        }}
      />
    </Modal>
  );
};

export default connect(dvaPropsData)(SettingRuleModal);
