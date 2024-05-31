import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Modal,
  Select,
  Space,
  Radio,
  Typography,
  message,
  Progress,
  DatePicker
} from 'antd';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
const { RangePicker } = DatePicker;

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, provinceAllList, common }) => ({
  provinceAllList: common.provinceList,
  loading: loading.effects[`wordSupervision/GetSiteInspectionForRegionInfo`],
  exportLoading: loading.effects[`wordSupervision/ExportSiteInspectionForRegionInfo`],
});

const TaskCompletionRecord = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  const {
    dispatch,
    loading,
    exportLoading,
    open,
    onCancel,
    time,
    regionCode,
    provinceAllList,
  } = props;

  useEffect(() => {
    getLargeRegion();
    getPageData();
  }, []);

  // 获取大区及省份
  const getLargeRegion = () => {
    dispatch({
      type: 'common/getLargeRegion',
      payload: {},
    });
  };

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      beginTime: values.time
        ? values.time[0].startOf('month').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: values.time
        ? values.time[1].endOf('month').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    };
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getPageData(PageIndex, PageSize);
  };

  // 获取页面数据
  const getPageData = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'wordSupervision/GetSiteInspectionForRegionInfo',
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
      type: 'wordSupervision/ExportSiteInspectionForRegionInfo',
      payload: body,
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
        ellipsis: true,
      },
      {
        title: '省份',
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
      },
      {
        title: '任务派发时间',
        dataIndex: 'BeginTime',
        key: 'BeginTime',
        ellipsis: true,
        width: 200,
      },
      {
        title: '是否完成',
        dataIndex: 'StatusName',
        key: 'StatusName',
        ellipsis: true,
        render: (text, row) => {
          return <Text type={text === '是' ? 'default' : 'danger'}>{text}</Text>;
        },
      },
      {
        title: '应覆盖监测点数',
        dataIndex: 'InspectEquNum',
        key: 'InspectEquNum',
        width: 160,
      },
      {
        title: '实际覆盖监测点数',
        dataIndex: 'overInspectEquNum',
        key: 'overInspectEquNum',
        width: 160,
      },
      {
        title: '应覆盖运维人员数量',
        dataIndex: 'InspectPersonNum',
        key: 'InspectPersonNum',
        width: 160,
      },
      {
        title: '实际覆盖运维人员数量',
        dataIndex: 'overInspectPersonNum',
        key: 'overInspectPersonNum',
        width: 160,
      },
      {
        title: '检查人',
        dataIndex: 'UserName',
        key: 'UserName',
        ellipsis: true,
      },
      {
        title: '任务结束时间',
        dataIndex: 'EndTime',
        key: 'EndTime',
        ellipsis: true,
        width: 200,
      },
    ];

    return columns;
  };

  // 搜索组件
  const SearchComponents = () => {
    return (
      <div>
        <Form
          id="searchForm"
          form={form}
          layout="inline"
          initialValues={{
            regionCode: regionCode || undefined,
            time: time,
            status: null,
          }}
          autoComplete="off"
        >
          <Space wrap>
            <Form.Item name="regionCode" label="省份">
              <Select placeholder="请选择省份" style={{ width: 140 }} allowClear>
                {provinceAllList.map(item => {
                  return (
                    <Option value={item.RegionCode} key={item.RegionCode}>
                      {item.RegionName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="userName" label="检查人">
              <Input style={{ width: 200 }} placeholder="检查人" allowClear />
            </Form.Item>
            <Form.Item name="time" label="任务派发时间">
              <RangePicker
                style={{ width: '100%' }}
                picker="month"
                format="YYYY-MM"
                allowClear={false}
              />
            </Form.Item>
            <Form.Item name="status" label="是否完成">
              <Radio.Group>
                <Radio value={null}>全部</Radio>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Space style={{ marginLeft: 10 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  onClick={() => {
                    getPageData(1, 20);
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    getPageData(1, 20);
                  }}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  icon={<ExportOutlined />}
                  loading={exportLoading}
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
      </div>
    );
  };

  return (
    <Modal
      title={'现场检查任务完成记录'}
      wrapClassName={`spreadOverModal`}
      open={open}
      destroyOnClose
      footer={null}
      onCancel={() => {
        onCancel();
      }}
    >
      <Card bordered={false} title={<SearchComponents />}>
        <SdlTable
          loading={loading}
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
      </Card>
    </Modal>
  );
};

export default connect(dvaPropsData)(TaskCompletionRecord);
