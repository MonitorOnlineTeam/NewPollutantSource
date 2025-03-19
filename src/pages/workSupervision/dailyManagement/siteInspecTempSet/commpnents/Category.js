import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Tag,
  Card,
  Button,
  Select,
  Progress,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
  Radio,
  Spin,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  QuestionCircleOutlined,
  ProfileOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList';
import styles from '../style.less';
import Cookie from 'js-cookie';
import NumTips from '@/components/NumTips';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'siteInspecTempSet';

const dvaPropsData = ({ loading, siteInspecTempSet, global, common }) => ({
  tableDatas: siteInspecTempSet.inspectorTypeItemList,
  tableTotal: siteInspecTempSet.inspectorTypeItemListTotal,
  tableLoading: loading.effects[`${namespace}/GetOnsiteInspectionTypeList`],
  saveLoading: loading.effects[`${namespace}/AddOrUpdateOnsiteInspectionType`],
  getMonitorCategorySystemListLoading: loading.effects[`${namespace}/GetMonitorCategorySystemList`],
  cemsModelNameList: siteInspecTempSet.cemsModelNameList,
  assessmentMethodList: siteInspecTempSet.assessmentMethodList,
  clientHeight: global.clientHeight,
});

const dvaDispatch = dispatch => {
  return {
    updateState: payload => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      });
    },
    GetOnsiteInspectionTypeList: payload => {
      // 列表
      dispatch({
        type: `${namespace}/GetOnsiteInspectionTypeList`,
        payload: payload,
      });
    },
    AddOrUpdateOnsiteInspectionType: (payload, callback) => {
      // 添加 or 编辑
      dispatch({
        type: `${namespace}/AddOrUpdateOnsiteInspectionType`,
        payload: payload,
        callback: callback,
      });
    },

    DeleteOnsiteInspectionType: (payload, callback) => {
      // 删除
      dispatch({
        type: `${namespace}/DeleteOnsiteInspectionType`,
        payload: payload,
        callback: callback,
      });
    },
    ChangeOnsiteInspectionTypeStatus: (payload, callback) => {
      // 更改状态
      dispatch({
        type: `${namespace}/ChangeOnsiteInspectionTypeStatus`,
        payload: payload,
        callback: callback,
      });
    },
  };
};
const Index = props => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [scoreDis, setScoreDis] = useState(false);
  const {
    tableDatas,
    tableTotal,
    tableLoading,
    clientHeight,
    saveLoading,
    getMonitorCategorySystemListLoading,
    cemsModelNameList,
    assessmentMethodList,
  } = props;

  useEffect(() => {
    onFinish(pageIndex, pageSize);
  }, []);

  const [title, setTitle] = useState('添加');

  const columns = [
    {
      title: '序号',
      align: 'center',
    },
    {
      title: 'CEMS型号',
      dataIndex: 'CemsModelName',
      key: 'CemsModelName',
      align: 'center',
    },
    {
      title: '检查项目',
      dataIndex: 'InspectionProject',
      key: 'InspectionProject',
      align: 'center',
    },
    {
      title: '使用状态',
      dataIndex: 'UseStatus',
      key: 'UseStatus',
      align: 'center',
      width: 100,
      render: (text, record) => {
        if (text == 1) {
          return (
            <span
              onClick={() => {
                statusChange(record);
              }}
            >
              <Tag style={{ cursor: 'pointer' }} color="blue">
                启用
              </Tag>
            </span>
          );
        }
        if (text == 0) {
          return (
            <span
              onClick={() => {
                statusChange(record);
              }}
            >
              <Tag style={{ cursor: 'pointer' }} color="red">
                停用
              </Tag>
            </span>
          );
        }
      },
    },
    {
      title: '排序',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      width: 80,
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <>
            <Tooltip title="编辑">
              <a
                onClick={() => {
                  edit(record);
                }}
              >
                <EditOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="删除">
              <Popconfirm
                placement="top"
                title="确定要删除这条数据吗？"
                onConfirm={() => del(record)}
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

  const onFinish = async (pageIndexs, pageSizes) => {
    //查询
    try {
      const values = await form.validateFields();
      props.GetOnsiteInspectionTypeList({
        ...values,
      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const del = row => {
    props.DeleteOnsiteInspectionType({ ID: row.ID }, () => {
      // setPageIndex(1)
      onFinish(1, pageSize);
    });
  };
  const statusChange = row => {
    props.ChangeOnsiteInspectionTypeStatus({ ID: row.ID, UseStatus: row.UseStatus }, () => {
      onFinish(pageIndex, pageSize);
    });
  };

  const edit = row => {
    setVisible(true);
    setTitle('编辑');
    form2.setFieldsValue({ ...row });
  };
  const add = () => {
    setVisible(true);
    form2.resetFields();
    setTitle('添加');
  };

  const save = async () => {
    try {
      const values = await form2.validateFields();
      props.AddOrUpdateOnsiteInspectionType(
        {
          ...values,
        },
        () => {
          title === '编辑'
            ? setVisible(false)
            : // 除CMES型号外，其他字段清空
              form2.setFieldsValue({
                UseStatus: 1,
                InspectionProject: undefined,
                Sort: undefined,
              });
          onFinish(pageIndex, pageSize);
        },
      );
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  };
  const [visible, setVisible] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex);
    setPageSize(PageSize);
    onFinish(PageIndex, PageSize);
  };
  return (
    <div>
      <Form
        form={form}
        name="advanced_search"
        onFinish={() => {
          onFinish(pageIndex, pageSize);
        }}
        initialValues={{}}
        layout="inline"
        style={{ paddingBottom: 8 }}
      >
        <Form.Item label="系统型号" name="cemsModelName">
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item label="检查项目" name="inspectionProject">
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item label="使用状态" name="useStatus">
          <Select placeholder="请选择" allowClear style={{ width: 100 }}>
            <Option value={1}>启用</Option>
            <Option value={2}>停用</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={tableLoading} htmlType="submit">
            查询
          </Button>
          <Button
            style={{ margin: '0 8px' }}
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
          <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: 8 }} onClick={add}>
            添加
          </Button>
        </Form.Item>
      </Form>
      <SdlTable
        loading={tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        resizable
        pagination={false}
        // pagination={{
        //   total: tableTotal,
        //   pageSize: pageSize,
        //   current: pageIndex,
        //   showSizeChanger: true,
        //   showQuickJumper: true,
        //   onChange: handleTableChange,
        // }}
      />
      <Modal
        title={title}
        visible={visible}
        onOk={save}
        okText="保存"
        destroyOnClose={true}
        onCancel={() => {
          setVisible(false);
        }}
        width="50%"
        confirmLoading={saveLoading}
        wrapClassName={styles.categoryModalSty}
      >
        <Form
          form={form2}
          name="advanced_search2"
          initialValues={{
            UseStatus: 1,
          }}
        >
          <Form.Item
            label="CEMS型号"
            name="CemsModel"
            rules={[{ required: true, message: '请选择CEMS型号！' }]}
          >
            <Select
              placeholder="请选择"
              showSearch
              optionFilterProp="Name"
              loading={getMonitorCategorySystemListLoading}
              fieldNames={{ label: 'Name', value: 'ChildID' }}
              options={cemsModelNameList}
            />
          </Form.Item>
          <Form.Item
            label="检查项目"
            name="InspectionProject"
            rules={[{ required: true, message: '请输入检查项目！' }]}
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            label="使用状态"
            name="UseStatus"
            rules={[{ required: true, message: '请选择使用状态！' }]}
          >
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="排序" name="Sort" rules={[{ required: true, message: '请输入排序！' }]}>
            <InputNumber min={0} placeholder="请输入" disabled={scoreDis} />
          </Form.Item>
          <Form.Item name="ID" hidden />
        </Form>
      </Modal>
    </div>
  );
};
export default connect(
  dvaPropsData,
  dvaDispatch,
)(Index);
