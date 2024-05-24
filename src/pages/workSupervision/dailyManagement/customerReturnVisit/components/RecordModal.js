/*
 * @Author: JiaQi
 * @Date: 2024-03-27 16:18:02
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-24 14:58:07
 * @Description:  客户现场回访记录弹窗
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Popconfirm,
  Input,
  Button,
  Tooltip,
  Select,
  Space,
  Row,
  Col,
  Radio,
  Divider,
  Modal,
  DatePicker,
  message,
  Tag,
  InputNumber,
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import LargeRegionSelect from '@/pages/workSupervision/dailyManagement/components/LargeRegionSelect';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, customer }) => ({
  queryLoading: loading.effects[`wordSupervision/GetCustomerVisitList`],
  exportLoading: loading.effects[`wordSupervision/ExportCustomerVisitList`],
});

const RecordModal = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  const { dispatch, open, queryLoading, exportLoading, queryParams, onCancel, systemType } = props;

  useEffect(() => {
    form.setFieldsValue({
      ...queryParams,
      // LargeRegionCode: queryParams.RegionCode,
    });
    setTimeout(() => {
      getTableDataSource();
    }, 0);
  }, []);

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      beginTime: values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.time[1].endOf('months').format('YYYY-MM-DD 23:59:59'),
      dataType: 1,
      systemType: systemType,
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'wordSupervision/GetCustomerVisitList',
      payload: {
        ...body,
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'wordSupervision/ExportCustomerVisitList',
      payload: {
        ...body,
        pageIndex: 0,
        pageSize: 0,
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        width: 40,
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '大区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '省份',
        dataIndex: 'CityName',
        key: 'CityName',
        ellipsis: true,
        width: 200,

      },
      {
        title: '任务派发时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        ellipsis: true,
        width: 200,
      },
      {
        title: '是否完成',
        dataIndex: 'IsCompleteTip',
        key: 'IsCompleteTip',
        ellipsis: true,
        width: 100,
        render: (text, record) => {
          if (text === '是') {
            return <Tag color="success">{text}</Tag>;
          }
          return <Tag color="error">{text}</Tag>;
        },
      },
      {
        title: '回访人',
        dataIndex: 'CheckUserName',
        key: 'CheckUserName',
        ellipsis: true,
        width: 100,
      },
      {
        title: '任务结束时间',
        dataIndex: 'ShowTime',
        key: 'ShowTime',
        ellipsis: true,
        width: 200,
        render: (text, record) => {
          return text || '-';
        },
      },
    ];

    if (systemType === '2') {
      // 成套不显示省份
      columns = columns.filter(item => item.dataIndex !== 'CityName');
    }

    return columns;
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getTableDataSource(PageIndex, PageSize);
  };
  return (
    <Modal
      title="客户现场回访任务完成记录"
      wrapClassName="spreadOverModal"
      visible={open}
      destroyOnClose
      footer={null}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        id="searchForm"
        form={form}
        layout="inline"
        initialValues={{
          ...queryParams,
          isComplete: 0,
        }}
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        <Space wrap style={{ flexWrap: 'wrap' }}>
          {systemType == 2 ? (
            <LargeRegionSelect name={'LargeRegionCode'} type={'ct'} />
          ) : (
            <LargeRegionSelect name={'RegionCode'} type={''} />
          )}
          <Form.Item label="回访人" name="searcahUserName">
            <Input placeholder="请输入回访人" allowClear />
          </Form.Item>
          <Form.Item name="time" label="任务派发时间">
            <RangePicker_
              style={{ width: 220 }}
              picker="month"
              format="YYYY-MM"
              allowClear={false}
            />
          </Form.Item>
          <Form.Item name="isComplete" label="是否完成">
            <Radio.Group style={{ width: 180 }}>
              <Radio value={0}>全部</Radio>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Space style={{ marginLeft: 10 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={queryLoading}
                onClick={() => {
                  handleTableChange(1, 20);
                }}
              >
                查询
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  handleTableChange(1, 20);
                }}
              >
                重置
              </Button>
              <Button
                icon={<ExportOutlined />}
                loading={exportLoading}
                type="primary"
                onClick={() => {
                  onExport();
                }}
              >
                导出
              </Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
      <SdlTable
        loading={queryLoading}
        align="center"
        dataSource={dataSource}
        columns={getColumns()}
        pagination={{
          total: tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />
    </Modal>
  );
};

export default connect(dvaPropsData)(RecordModal);
