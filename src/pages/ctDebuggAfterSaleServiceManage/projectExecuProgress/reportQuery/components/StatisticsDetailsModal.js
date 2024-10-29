/*
 * @Author: JiaQi
 * @Date: 2024-05-06 09:13:00
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-07 15:07:39
 * @Description:  验收服务报告待完成审核明细
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Button, Tabs, Select, Space, Row, Col, Card, Typography } from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import SdlTable from '@/components/SdlTable';

const { Text } = Typography;

const dvaPropsData = ({ common, loading }) => ({
  largeRegionList: common.CtLargeRegionList,
  queryLoading: loading.effects[`reportQuery/GetServiceReportDesc`],
  exportLoading: loading.effects[`reportQuery/ExportGetServiceReportDesc`],
});

const StatisticsDetailsModal = props => {
  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState([]);
  const [dataTotal, setDataTotal] = useState(0);
  const [pageIndex,setPageIndex] = useState(1)
  const [pageSize,setPageSize] = useState(20)

  const { dispatch, queryLoading, exportLoading, isModalOpen, onCancel, largeRegionList } = props;

  useEffect(() => {
    GetServiceReportDesc(pageIndex,pageSize);
  }, []);

  // 获取请求参数
  const getParams = (pageIndex,pageSize) => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      beginLeaveDate: values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endLeaveDate: values.time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      pageIndex,pageSize
    };
  };

  const GetServiceReportDesc = (pageIndex,pageSize) => {
    const body = getParams(pageIndex,pageSize);
    setPageIndex(pageIndex);
    setPageSize(pageSize);
    dispatch({
      type: 'reportQuery/GetServiceReportDesc',
      payload: body,
      callback: res => {
        setDataSource(res.Datas);
        setDataTotal(res.Total)
      },
    });
  };
  const handleTableChange =  (PageIndex,PageSize )=>{ //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    GetServiceReportDesc(PageIndex, PageSize);
  }
  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'reportQuery/ExportGetServiceReportDesc',
      payload: {
        ...body,
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
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
        title: '审核状态',
        dataIndex: 'CheckStatuTip',
        key: 'CheckStatuTip',
        ellipsis: true,
        render: (text, record) => {
          return <Text type={record.CheckStatus === 2 ? "danger" : 'default'}>{text}</Text>
        }
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
          // layout="inline"
          initialValues={{
            // time: [moment().startOf('month'), moment()],
            region: props.region || undefined,
            time: props.time,
          }}
          autoComplete="off"
        >
          <Space align="middle" size={20}>
            <Form.Item name="region" label="服务大区">
              <Select placeholder="请选择服务大区" style={{ width: '220px' }} allowClear>
                {largeRegionList.map(item => {
                  return (
                    <Option value={item.ID} key={item.ID} data-childList={item.ChildList}>
                      {item.LargeRegion}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="time" label="离开现场时间">
              <RangePicker_ style={{ width: '300px' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="auditStatus" label="审核状态">
              <Select placeholder="请选择审核状态" style={{ width: '180px' }} allowClear>
                {/* 1待经理审核，3待助理审核，2经理待工程师整改,4助理待工程师整改 */}
                <Option value={'1'} key={1}>
                  待经理审核
                </Option>
                <Option value={'3'} key={3}>
                  待助理审核
                </Option>
                <Option value={'2,4'} key={2}>
                  待工程师整改
                </Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={queryLoading}
                  onClick={() => {
                    GetServiceReportDesc(1, 20);
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    GetServiceReportDesc(1, 20);
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
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </div>
    );
  };

  const getPageContent = () => {
    return (
      <Card bordered={false} title={<SearchComponents />}>
        <SdlTable
          loading={queryLoading}
          align="center"
          dataSource={dataSource}
          columns={getColumns()}
          pagination={{
            total:dataTotal,
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
    <Modal
      title="验收服务报告待完成审核明细"
      wrapClassName="spreadOverModal"
      open={isModalOpen}
      destroyOnClose
      footer={false}
      mask={false}
      onCancel={() => {
        onCancel();
      }}
    >
      {getPageContent()}
    </Modal>
  );
};

export default connect(dvaPropsData)(StatisticsDetailsModal);
