import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Row,
  Col,
  message,
  Modal,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from '../index.less';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';

const dvaPropsData = ({ loading, timeoutServices }) => ({
  timeoutServicesData: timeoutServices.timeoutServicesData,
  largeRegionList: timeoutServices.largeRegionList,
  TimeoutServiceReason: timeoutServices.TimeoutServiceReason, // 超时服务原因
  loading: loading.effects[`timeoutServices/GetTimeoutServiceAnalysis`],
  basicsLoading: loading.effects[`timeoutServices/GetTimeoutServiceInfo`],
});

const DurationTable = props => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [basicsDataSource, setBasicsDataSource] = useState([]);
  const [sort, setSort] = useState(0);

  const {
    dispatch,
    loading,
    basicsLoading,
    timeoutServicesData: { ColumnList, TableList },
    largeRegionList,
    date,
    TimeoutServiceReason,
  } = props;

  useEffect(() => {
    // GetTimeoutServiceAnalysis();
  }, []);

  // 获取超时服务基础数据
  const GetTimeoutServiceInfo = (_pageIndex, _pageSize, _sort) => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'timeoutServices/GetTimeoutServiceInfo',
      payload: {
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
        sort: _sort || sort,
        ...values,
      },
      callback: res => {
        setBasicsDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 获取所属大区
  const getLargeRegion = () => {
    dispatch({
      type: 'timeoutServices/getLargeRegion',
      payload: {},
      callback: res => {},
    });
  };

  // 获取超时服务原因与重复服务原因
  const GetReasonList = () => {
    dispatch({
      type: 'timeoutServices/GetReasonList',
      payload: {},
      callback: res => {},
    });
  };

  // 导出
  const onExport = () => {
    dispatch({
      type: 'timeoutServices/ExportTimeoutServiceAnalysis',
      payload: {
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  // 导出基础服务
  const onBasicsExport = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'timeoutServices/ExportTimeoutServiceInfo',
      payload: {
        // pageIndex: _pageIndex || pageIndex,
        // pageSize: _pageSize || pageSize,
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
        sort: 2,
        ...values,
      },
    });
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  //
  const getColumns = () => {
    let columnList = ColumnList.map(item => {
      return {
        title: item.LargeRegion,
        children: [
          {
            title: '超时时长',
            dataIndex: `Times${item.ID}`,
            key: `Times${item.ID}`,
            width: 120,
            align: 'center',
          },
          {
            title: '占比',
            dataIndex: `Rate${item.ID}`,
            key: `Rate${item.ID}`,
            width: 120,
            align: 'center',
          },
        ],
      };
    });
    return [
      {
        title: '年度',
        dataIndex: 'year',
        key: 'year',
        render: (text, record, index) => {
          return {
            children: text,
            props: { rowSpan: record.count > 0 ? record.count + 1 : record.count },
          };
        },
      },
      {
        title: '序号',
        dataIndex: 'sort',
        key: 'sort',
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: text === '总计' ? 2 : 1 },
          };
        },
      },
      {
        title: '超时原因',
        dataIndex: 'ReasonName',
        key: 'ReasonName',
        width: 200,
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: text === '总计' ? 0 : 1 },
          };
        },
        // onCell: (_, index) => {
        //   if (index === 4) {
        //     return {
        //       colSpan: 0,
        //     };
        //   }
        //   return {};
        // },
      },
      {
        title: '总计',
        children: [
          {
            title: '超时时长',
            dataIndex: 'SumTimes',
            key: 'SumTimes',
            width: 120,
            align: 'center',
          },
          {
            title: '占比',
            dataIndex: 'SumRate',
            key: 'SumRate',
            width: 120,
            align: 'center',
          },
        ],
      },
      ...columnList,
    ];
  };

  // 基础数据表头
  const getBasicsColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '所属大区',
        dataIndex: 'ServiceAreaName',
        key: 'ServiceAreaName',
        ellipsis: true,
      },
      {
        title: '项目编号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
        ellipsis: true,
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        ellipsis: true,
        width: 180,
      },
      {
        title: '超时服务原因',
        dataIndex: 'QuestionName',
        key: 'QuestionName',
        ellipsis: true,
      },
      {
        title: '超时时长（H）',
        dataIndex: 'OverTime',
        key: 'OverTime',
        ellipsis: true,
        sorter: true,
        // sorter: (a, b) => a.OverTime - b.OverTime,
      },
    ];

    return columns;
  };

  //分页
  const handleTableChange = (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    GetTimeoutServiceInfo(PageIndex, PageSize);
  };

  // 排序、分页
  const onTableChange = (pagination, filters, sorter) => {
    const { pageSize, pageIndex } = pagination;
    setPageSize(pageSize);
    setPageIndex(pageIndex);
    let order = sorter.order === 'ascend' ? 1 : sorter.order === 'descend' ? 2 : 0;
    setSort(order);
    GetTimeoutServiceInfo(pageIndex, pageSize, order + '');
  };

  return (
    <Card
      title={
        <Space>
          <span>{`${moment(date).format('YYYY年')}超时统计`}</span>
          <Button
            icon={<ExportOutlined />}
            onClick={() => {
              onExport();
            }}
          >
            导出
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleTableChange(1, 20);
              getLargeRegion();
              GetReasonList();
              setIsModalOpen(true);
            }}
          >
            查看基础数据
          </Button>
        </Space>
      }
      size="small"
      bodyStyle={{ paddingBottom: 10 }}
      loading={loading}
    >
      <SdlTable
        dataSource={TableList}
        columns={getColumns()}
        align="center"
        scroll={{
          y: 500,
        }}
        pagination={false}
      />

      <Modal
        title={`${moment(date).format('YYYY年')}超时服务基础数据`}
        wrapClassName="spreadOverModal"
        visible={isModalOpen}
        destroyOnClose
        footer={[]}
        onCancel={() => {
          onCancel();
        }}
      >
        <Form
          id="searchForm"
          form={form}
          layout="inline"
          initialValues={{}}
          autoComplete="off"
          style={{ marginTop: 10, marginBottom: 10 }}
        >
          <Space>
            <Form.Item name="serviceAreaCode" label="所属大区">
              <Select
                showSearch
                allowClear
                placeholder="请选择所属大区"
                style={{ width: 160 }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {largeRegionList.map(item => {
                  return (
                    <Option value={item.ID} key={item.ID}>
                      {item.LargeRegion}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="projectCode" label="项目编号">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item name="projectName" label="项目名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item name="questionID" label="超时服务原因">
              <Select
                allowClear
                placeholder="请选择超时服务原因"
                style={{ width: 160 }}
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {TimeoutServiceReason.map(item => {
                  return (
                    <Option value={item.ChildID} key={item.ChildID}>
                      {item.Name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  loading={basicsLoading}
                  type="primary"
                  onClick={() => handleTableChange(1, 20)}
                >
                  查询
                </Button>
                <Button
                  loading={basicsLoading}
                  onClick={() => {
                    form.resetFields();
                    handleTableChange(1, 20);
                  }}
                >
                  重置
                </Button>
                <Button type="primary" onClick={() => onBasicsExport()}>
                  导出
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
        <SdlTable
          loading={basicsLoading}
          dataSource={basicsDataSource}
          columns={getBasicsColumns()}
          align="center"
          onChange={onTableChange}
          pagination={{
            total: tableTotal,
            pageSize: pageSize,
            current: pageIndex,
            showSizeChanger: true,
            showQuickJumper: true,
            // onChange: handleTableChange,
          }}
        />
      </Modal>
    </Card>
  );
};

export default connect(dvaPropsData)(DurationTable);
