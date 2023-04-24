/*
 * @Author: JiaQi 
 * @Date: 2023-04-18 16:58:27 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-04-18 16:58:53
 * @Description: 客户操作页面
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Button, Modal, Form, Input, Select, Tooltip, Divider, Popconfirm } from 'antd';
import SdlTable from '@/components/SdlTable';
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  customerList: wordSupervision.customerList,
  RegionalAndProvince: wordSupervision.RegionalAndProvince,
  // messageList: wordSupervision.messageList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  // messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const HandleCustomer = props => {
  const { customerList, RegionalAndProvince, CustomID, onOk } = props;
  const [visible, setVisible] = useState(false);
  const [addOrEditVisible, setAddOrEditVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRowData, setEditRowData] = useState({});
  const [selectRow, setSelectRow] = useState([]);

  const formRef = React.createRef();

  // useEffect(() => {
  //   setSelectedRowKeys([CustomID]);
  // }, [CustomID]);

  const getColumns = () => {
    return [
      {
        title: '客户全称',
        dataIndex: 'CustomFullName',
        key: 'customFullName',
        align: 'center',
      },
      {
        title: '客户名称',
        dataIndex: 'CustomName',
        key: 'customName',
        align: 'center',
      },
      {
        title: '省份',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        align: 'center',
      },
      {
        title: '大区',
        dataIndex: 'UserGroup_Name',
        key: 'UserGroup_Name',
        align: 'center',
      },
      {
        title: '操作',
        key: 'handle',
        align: 'center',
        render: (text, record) => {
          return (
            <>
              <Tooltip title="编辑">
                <a
                  onClick={() => {
                    setEditRowData(record);
                    onHandleClick();
                  }}
                >
                  <EditIcon />
                </a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确定要删除此客户吗？"
                  onConfirm={() => onDeleteOtherCustom(record)}
                  okText="是"
                  cancelText="否"
                >
                  <a>
                    {' '}
                    <DelIcon />{' '}
                  </a>
                </Popconfirm>
              </Tooltip>
            </>
          );
        },
      },
    ];
  };

  // 获取客户
  const getCustomerList = () => {
    props.dispatch({
      type: 'wordSupervision/getCustomerList',
      payload: {},
    });
  };

  // 删除客户
  const onDeleteOtherCustom = record => {
    props.dispatch({
      type: 'wordSupervision/DeleteOtherCustom',
      payload: {
        ID: record.ID,
      },
      callback: () => {
        setSelectedRowKeys([]);
        setSelectRow([]);
        getCustomerList();
      },
    });
  };

  // 获取已配置的省区和大区
  const getRegionalAndProvince = () => {
    props.dispatch({
      type: 'wordSupervision/GetRegionalAndProvince',
      payload: {},
    });
  };

  //
  const onHandleClick = () => {
    setAddOrEditVisible(true);
    getRegionalAndProvince();
  };

  // 添加、编辑客户
  const InsOrUpdOtherCustomer = () => {
    formRef.current.validateFields().then(values => {
      props.dispatch({
        type: 'wordSupervision/InsOrUpdOtherCustomer',
        payload: {
          ID: editRowData.ID,
          ...values,
        },
        callback: () => {
          debugger;
          setAddOrEditVisible(false);
          getCustomerList();
        },
      });
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectRow(selectedRows);
    },
  };
  console.log('selectedRowKeys', selectedRowKeys);
  // console.log('CustomID', CustomID);
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        客户列表
      </Button>

      <Modal
        width={800}
        title="客户信息"
        // footer={false}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          setVisible(false);
          onOk(selectRow[0]);
        }}
        okButtonProps={{
          disabled: !selectedRowKeys.length,
        }}
      >
        <Button
          type="primary"
          style={{ marginBottom: 10 }}
          onClick={() => {
            setEditRowData({});
            onHandleClick();
          }}
        >
          添加
        </Button>
        <SdlTable
          rowKey={'ID'}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          columns={getColumns()}
          dataSource={customerList}
          pagination={false}
        />
      </Modal>

      <Modal
        title="添加/编辑客户"
        visible={addOrEditVisible}
        onOk={() => InsOrUpdOtherCustomer()}
        onCancel={() => setAddOrEditVisible(false)}
      >
        <Form
          ref={formRef}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            ...editRowData,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="省份"
            name="Province"
            rules={[
              {
                required: true,
                message: '请选择省份!',
              },
            ]}
          >
            <Select
              placeholder="请选择省份"
              onChange={(value, option) => {
                console.log('value', value);
                console.log('option', option);

                formRef.current.setFieldsValue({ UserGroup_ID: option['data-item'].UserGroup_ID });
              }}
            >
              {RegionalAndProvince.map((item, index) => {
                return (
                  <Option value={item.Province} key={index} data-item={item}>
                    {item.ProvinceName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="大区"
            name="UserGroup_ID"
            rules={[
              {
                required: true,
                message: '请选择大区!',
              },
            ]}
          >
            <Select placeholder="请选择大区" disabled>
              {RegionalAndProvince.map((item, index) => {
                return (
                  <Option value={item.UserGroup_ID} key={index} data-item={item}>
                    {item.UserGroup_Name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="客户全称"
            name="CustomFullName"
            rules={[
              {
                required: true,
                message: '请输入客户全称!',
              },
            ]}
          >
            <Input placeholder="请输入客户全称!" />
          </Form.Item>
          <Form.Item
            label="客户名称"
            name="CustomName"
            rules={[
              {
                required: true,
                message: '请输入客户名称!',
              },
            ]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default connect(dvaPropsData)(HandleCustomer);
