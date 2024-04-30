import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Popconfirm,
  Select,
  Space,
  Row,
  Col,
  message,
  Divider,
  Tooltip,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { AuditOutlined } from '@ant-design/icons';
import StatisticsModal from './components/StatisticsModal';
import ServiceReportModal from './components/ServiceReportModal';

const dvaPropsData = ({ loading, common }) => ({
  provinceAllList: common.provinceList,
  largeRegionList: common.largeRegionList,
  queryLoading: loading.effects[`reportQuery/GetAlreadyCheckServices`],
  exportLoading: loading.effects[`reportQuery/ExportGetAlreadyCheckServices`],
});

const reportAudit = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provinceList, setProvinceList] = useState([]); // 大区、省份列表
  const [currentRowData, setCurrentRowData] = useState({});
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);

  const { queryLoading, exportLoading, dispatch, largeRegionList, provinceAllList } = props;

  useEffect(() => {
    setProvinceList(provinceAllList);
  }, [provinceAllList]);

  useEffect(() => {
    getLargeRegion();
    getTableDataSource();
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
      beginLeaveDate: values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endLeaveDate: values.time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'reportQuery/GetAlreadyCheckServices',
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
      type: 'reportQuery/GetAlreadyCheckServices',
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
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '派工单号',
        dataIndex: 'Num',
        key: 'Num',
        ellipsis: true,
      },
      {
        title: '合同编号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
        ellipsis: true,
        width: 200,
      },
      {
        title: '立项号',
        dataIndex: 'ItemCode',
        key: 'ItemCode',
        ellipsis: true,
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '合同类型',
        dataIndex: 'ProjectType',
        key: 'ProjectType',
        ellipsis: true,
      },
      {
        title: '最终用户',
        dataIndex: 'CustomEnt',
        key: 'CustomEnt',
        ellipsis: true,
      },
      {
        title: '项目所在省',
        dataIndex: 'Province',
        key: 'Province',
        ellipsis: true,
      },
      {
        title: '服务大区',
        dataIndex: 'Region',
        key: 'Region',
        ellipsis: true,
      },
      {
        title: '服务工程师',
        dataIndex: 'WorkerName',
        key: 'WorkerName',
        ellipsis: true,
      },
      {
        title: '下单日期',
        dataIndex: 'OrderDate',
        key: 'OrderDate',
        ellipsis: true,
        width: 180,
      },
      {
        title: '离开现场时间',
        dataIndex: 'LeaveDate',
        key: 'LeaveDate',
        ellipsis: true,
        width: 180,
      },
      {
        title: '成套经理审核人',
        dataIndex: 'WorkJLName',
        key: 'WorkJLName',
        ellipsis: true,
      },
      {
        title: '助理审核人',
        dataIndex: 'AssistantName',
        key: 'AssistantName',
        ellipsis: true,
        width: 180,
      },
      {
        title: '合格状态',
        dataIndex: 'AuditStatuTip',
        key: 'AuditStatuTip',
        ellipsis: true,
      },
      {
        title: '审核状态',
        dataIndex: 'CheckStatuTip',
        key: 'CheckStatuTip',
        ellipsis: true,
      },
      {
        title: '操作',
        dataIndex: 'handle',
        align: 'center',
        fixed: 'right',
        width: 60,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip title="查看服务报告" placement="left">
              <a
                onClick={() => {
                  setIsModalOpen(true);
                  setCurrentRowData(record);
                }}
              >
                <AuditOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
          );
        },
      },
    ];

    return columns;
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getTableDataSource(PageIndex, PageSize);
  };

  // 搜索组件
  const SearchComponents = () => {
    return (
      <div>
        <Form
          id="searchForm"
          form={form}
          // layout="inline"
          initialValues={{
            time: [moment().startOf('month'), moment()],
          }}
          autoComplete="off"
          labelCol={{
            flex: '110px',
          }}
          wrapperCol={{
            flex: 1,
          }}
        >
          <Row align="middle">
            <Col span={8}>
              <Form.Item name="num" label="派工单号">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="projectCode" label="项目编号">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="projectName" label="项目名称">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="region" label="服务大区">
                <Select
                  placeholder="请选择服务大区"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(value, option) => {
                    if (value) {
                      setProvinceList(option['data-childList']);
                    } else {
                      setProvinceList(provinceAllList);
                    }
                    form.setFieldsValue({ province: undefined });
                  }}
                >
                  {largeRegionList.map(item => {
                    return (
                      <Option value={item.ID} key={item.ID} data-childList={item.ChildList}>
                        {item.LargeRegion}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="province" label="省份">
                <Select placeholder="请选择省份" style={{ width: '100%' }} allowClear>
                  {provinceList.map(item => {
                    return (
                      <Option value={item.RegionCode} key={item.RegionCode}>
                        {item.RegionName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="checkStatus" label="合格状态">
                <Select placeholder="请选择合格状态" style={{ width: '100%' }} allowClear>
                  <Option value={1} key={1}>
                    合格
                  </Option>
                  <Option value={3} key={3}>
                    /
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="离开现场时间">
                <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Form.Item>
              <Space style={{ marginLeft: 10 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={queryLoading}
                  onClick={() => {
                    getTableDataSource(1, 20);
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    getTableDataSource(1, 20);
                  }}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  loading={exportLoading}
                  onClick={() => {
                    onExport();
                  }}
                >
                  导出
                </Button>
                <Button
                  type="primary"
                  // loading={queryLoading}
                  onClick={() => {
                    setIsStatisticsModalOpen(true);
                  }}
                >
                  报告审核情况统计
                </Button>
              </Space>
            </Form.Item>
          </Row>
        </Form>
      </div>
    );
  };

  const getPageContent = () => {
    return (
      <Card title={<SearchComponents />}>
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
      </Card>
    );
  };

  return (
    <BreadcrumbWrapper>
      {getPageContent()}
      <ServiceReportModal
        isModalOpen={isModalOpen}
        data={currentRowData}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      />
      {isStatisticsModalOpen && (
        <StatisticsModal
          time={form.getFieldValue('time')}
          isModalOpen={isStatisticsModalOpen}
          onCancel={() => {
            setIsStatisticsModalOpen(false);
          }}
        />
      )}
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(reportAudit);
