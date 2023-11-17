/*
 * @Author: JiaQi
 * @Date: 2023-05-23 17:00:59
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-25 11:04:23
 * @Description：专家管理
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Input, Select, Space, Tooltip, Divider, Popconfirm } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import HandleManagementModal from './HandleManagementModal';
import { DelIcon, EditIcon } from '@/utils/icon';

const dvaPropsData = ({ loading, completeSetManage }) => ({
  regionalList: completeSetManage.regionalList,
  loading: loading.effects['completeSetManage/GetExpertList'],
});

const Management = props => {
  const [form] = Form.useForm();
  const { regionalList, loading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentEditData, setCurrentEditData] = useState({});

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => {
        return {
          children: text,
          props: { rowSpan: record.rowSpan },
        };
      },
    },
    {
      title: '型号',
      dataIndex: 'Model',
      key: 'model',
      render: (text, record, index) => {
        return {
          children: <b>{text}</b>,
          props: { rowSpan: record.rowSpan },
        };
      },
    },
    {
      title: '大区',
      dataIndex: 'UserGroup_Name',
      key: 'userGroup_Name',
    },
    {
      title: '专家姓名',
      dataIndex: 'ExpertName',
      key: 'expertName',
    },
    {
      title: '联系方式',
      dataIndex: 'Phone',
      key: 'phone',
    },
    {
      title: '操作',
      key: 'handle',
      render: (text, record) => {
        return (
          <>
            <Tooltip title="编辑">
              <a
                onClick={() => {
                  onEdit(record);
                }}
              >
                <EditIcon />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="删除">
              <Popconfirm
                placement="left"
                title="确认是否删除?"
                onConfirm={() => {
                  onDeleteExpert(record.ID);
                }}
                okText="是"
                cancelText="否"
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

  useEffect(() => {
    GetAllRegionalList();
    onFinish();
  }, []);

  // 获取大区
  const GetAllRegionalList = () => {
    props.dispatch({
      type: 'completeSetManage/GetAllRegionalList',
      payload: {},
    });
  };

  // 查询数据
  const onFinish = () => {
    const values = form.getFieldsValue();
    props.dispatch({
      type: 'completeSetManage/GetExpertList',
      payload: {
        ...values,
        UserGroup_ID: values.UserGroup_ID.toString(),
      },
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // 刪除专家
  const onDeleteExpert = ID => {
    const values = form.getFieldsValue();
    props.dispatch({
      type: 'completeSetManage/DeleteExpert',
      payload: {
        ID,
      },
      callback: () => {
        onFinish();
      },
    });
  };

  // 編輯
  const onEdit = record => {
    setCurrentEditData(record);
    setVisible(true);
  };

  return (
    <BreadcrumbWrapper>
      <Card>
        <Form
          name="basic"
          form={form}
          layout="inline"
          style={{ marginBottom: '20px' }}
          initialValues={{ UserGroup_ID: [] }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="大区" name="UserGroup_ID">
            <Select style={{ width: 200 }} placeholder="请选择大区">
              {regionalList.map(item => {
                return (
                  <Option key={item.UserGroup_ID} value={item.UserGroup_ID}>
                    {item.UserGroup_Name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="设备型号" name="Model">
            <Input style={{ width: 300 }} placeholder="请输入设备型号" />
          </Form.Item>
          <Form.Item label="专家" name="ExpertName">
            <Input style={{ width: 300 }} placeholder="请输入专家姓名" />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>
            <Button
              onClick={() => {
                setCurrentEditData({});
                setVisible(true);
              }}
            >
              添加
            </Button>
          </Space>
        </Form>
        <SdlTable
          loading={loading}
          align="center"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Card>
      {/* {visible && ( */}
      <HandleManagementModal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        editData={currentEditData}
        reloadDataList={() => {
          onFinish();
          setVisible(false);
        }}
      />
      {/* )} */}
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Management);
