/*
 * @Author: JiaQi
 * @Date: 2023-04-18 16:58:27
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-02-18 10:04:41
 * @Description: 客户操作页面
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Button, Modal, Form, Input, Select, Tooltip, Divider, Popconfirm, Cascader } from 'antd';
import SdlTable from '@/components/SdlTable';
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon';
import Cookie from 'js-cookie';
import moment from 'moment';

const dvaPropsData = ({ loading, wordSupervision, ctCommon }) => ({
  TYPE: wordSupervision.TYPE,
  otherCustomerList: wordSupervision.otherCustomerList,
  RegionalAndProvince: wordSupervision.RegionalAndProvince,
  largeRegionListLoading: loading.effects[`ctCommon/GetLargeRegionList`],
  regionalAndProvinceLoading: loading.effects[`wordSupervision/GetRegionalAndProvince`],

  // messageList: wordSupervision.messageList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  // messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const HandleCustomer = props => {
  const [form] = Form.useForm();
  const {
    otherCustomerList,
    RegionalAndProvince,
    CustomID,
    onOk,
    RegionCode,
    TYPE,
    regionalAndProvinceLoading,
    largeRegionListLoading,
  } = props;
  const [visible, setVisible] = useState(false);
  const [addOrEditVisible, setAddOrEditVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRowData, setEditRowData] = useState({});
  const [selectRow, setSelectRow] = useState([]);

  const [largeRegionList, setLargeRegionList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  useEffect(() => {
    // setSelectedRowKeys([CustomID]);
    getOtherCustomerList();
  }, []);

  const getColumns = () => {
    return [
      // {
      //   title: '客户全称',
      //   dataIndex: 'CustomFullName',
      //   key: 'customFullName',
      //   align: 'center',
      // },
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
        title: '城市',
        dataIndex: 'CityName',
        key: 'CityName',
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
                    onHandleClick(record.Province);
                    form.setFieldsValue({ ...record });
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
                    <DelIcon />
                  </a>
                </Popconfirm>
              </Tooltip>
            </>
          );
        },
      },
    ];
  };

  // 获取维护的客户
  const getOtherCustomerList = () => {
    props.dispatch({
      type: 'wordSupervision/getOtherCustomerList',
      payload: {
        type: TYPE == 1 ? '2' : '1', // 1：运维 2：成套
        // ReionCode: RegionCode,
      },
    });
  };

  // 获取客户
  const getCustomerList = () => {
    props.dispatch({
      type: 'wordSupervision/getCustomerList',
      payload: {
        type: TYPE == 1 ? '2' : '1', // 1：运维 2：成套
        // ReionCode: RegionCode,
      },
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
        getOtherCustomerList();
      },
    });
  };

  // 获取已配置的省区和大区
  const getRegionalAndProvince = regionCode => {
    props.dispatch({
      type: 'wordSupervision/GetRegionalAndProvince',
      payload: {},
      callback: res => {
        let current = regionCode
          ? res.Datas.find(item => item.Province === regionCode)
          : res.Datas.find(item => item.Province === RegionCode);
        props.dispatch({
          type: 'ctCommon/GetLargeRegionList',
          payload: {},
          callback: res => {
            // setLargeRegionList(res.Datas);
            // const data = largeRegData?.filter(item => item.ID == current.UserGroup_ID)?.[0]
            //   ?.ChildList;
            // setRegionList(data || []);
            // setTimeout(() => {
            //   form.setFieldsValue(
            //     {
            //       Province: current.Province,
            //       UserGroup_ID: current.UserGroup_ID,
            //     },
            //     200,
            //   );
            // });
          },
        });
      },
    });
  };

  //
  const onHandleClick = regionCode => {
    setAddOrEditVisible(true);
    getRegionalAndProvince(regionCode);
  };

  // 添加、编辑客户
  const InsOrUpdOtherCustomer = () => {
    const currentUserStr = Cookie.get('currentUser');
    let currentUser = {};
    if (currentUserStr) {
      currentUser = JSON.parse(currentUserStr);
    }

    form.validateFields().then(values => {
      props.dispatch({
        type: 'wordSupervision/InsOrUpdOtherCustomer',
        payload: {
          ID: editRowData.ID,
          CreateUser: editRowData.CreateUser || currentUser.UserId,
          CreateTime: editRowData.CreateTime || moment().format('YYYY-MM-DD HH:mm:ss'),
          UpdateUser: currentUser.UserId,
          UpdateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          ...values,
          Province: values.Province.toString(),
        },
        callback: () => {
          setAddOrEditVisible(false);
          form.setFieldsValue({ CustomName: undefined });
          getOtherCustomerList();
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

  useEffect(() => {
    if (!addOrEditVisible) {
      setLargeRegionList([]);
      setRegionList([]);
      form.setFieldsValue({
        Province: undefined,
        UserGroup_ID: undefined,
      });
    }
  }, [addOrEditVisible]);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        客户列表
      </Button>

      <Modal
        width={800}
        title="客户信息"
        // footer={false}
        destroyOnClose
        visible={visible}
        onCancel={() => {
          getCustomerList();
          setVisible(false);
          setSelectedRowKeys([]);
        }}
        onOk={() => {
          setVisible(false);
          getCustomerList();
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
          dataSource={otherCustomerList}
          pagination={false}
          scroll={{ y: 'calc(100vh - 365px)' }}
        />
      </Modal>

      <Modal
        title="添加/编辑客户"
        visible={addOrEditVisible}
        destroyOnClose
        onOk={() => InsOrUpdOtherCustomer()}
        onCancel={() => {
          getColumns();
          form.setFieldsValue({ CustomName: undefined });
          setAddOrEditVisible(false);
        }}
      >
        <Form
          form={form}
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
            label="大区"
            name="UserGroup_ID"
            rules={[
              {
                required: true,
                message: '请选择大区!',
              },
            ]}
          >
            <Select
              placeholder="请选择大区"
              loading={regionalAndProvinceLoading || largeRegionListLoading}
              onChange={(value, option) => {
                form.setFieldsValue({ Province: undefined });
                // const data = largeRegionList.filter(item => item.ID == value)?.[0]?.ChildList;
                setRegionList(option['data-childList']);
              }}
            >
              {RegionalAndProvince.map((item, index) => {
                return (
                  <Option
                    value={item.RegionCode}
                    key={item.RegionCode}
                    data-childList={item.ChildList}
                  >
                    {item.RegionName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="省/市"
            name="Province"
            rules={[
              {
                required: true,
                message: '请选择省/市!',
              },
            ]}
          >
            <Cascader
              loading={regionalAndProvinceLoading || largeRegionListLoading}
              options={regionList}
              placeholder="请选择省/市!"
              fieldNames={{ label: 'RegionName', value: 'RegionCode', children: 'ChildList' }}
            />

            {/* <Select
              // disabled
              loading={regionalAndProvinceLoading || largeRegionListLoading}
              placeholder="请选择省/市"
              // onChange={(value, option) => {
              //   form.setFieldsValue({ UserGroup_ID: option['data-item'].UserGroup_ID });
              // }}
            >
              {regionList.map((item, index) => {
                return (
                  <Option value={item.RegionCode} key={index} data-item={item}>
                    {item.RegionName}
                  </Option>
                );
              })}
            </Select> */}
          </Form.Item>

          {/* <Form.Item
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
          </Form.Item> */}
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
