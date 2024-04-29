import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Button, Tabs, Select, Space, Row, Col, Card, Divider } from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import SdlTable from '@/components/SdlTable';

const dvaPropsData = ({ common, loading }) => ({
  largeRegionList: common.largeRegionList,
  queryLoading: loading.effects[`reportQuery/GetStatServiceReport`],
  exportLoading: loading.effects[`reportQuery/ExportGetStatServiceReport`],
});

const StatisticsModal = props => {
  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState([]);

  const { dispatch, queryLoading, exportLoading, isModalOpen, onCancel, largeRegionList } = props;

  useEffect(() => {
    GetStatServiceReport();
  }, []);

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

  const GetStatServiceReport = () => {
    const body = getParams();
    dispatch({
      type: 'reportQuery/GetStatServiceReport',
      payload: body,
      callback: res => {
        setDataSource(res.Datas);
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'reportQuery/ExportGetStatServiceReport',
      payload: {
        ...body,
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
      },
      {
        title: '服务大区',
        dataIndex: 'Region',
        key: 'Region',
        ellipsis: true,
      },
      {
        title: '成套经理',
        children: [
          {
            title: '已审核报告数量',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            ellipsis: true,
            width: 180,
            align: 'center',
          },
          {
            title: '待审核报告数量',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            ellipsis: true,
            align: 'center',
            width: 180,
          },
          {
            title: '审核完成率',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            ellipsis: true,
            align: 'center',
            width: 180,
          },
        ],
      },
      {
        title: '助理',
        children: [
          {
            title: '已审核报告数量',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            ellipsis: true,
            align: 'center',
            width: 180,
          },
          {
            title: '待审核报告数量',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            ellipsis: true,
            align: 'center',
            width: 180,
          },
          {
            title: '审核完成率',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            ellipsis: true,
            align: 'center',
            width: 180,
          },
        ],
      },
      {
        title: '工程师',
        children: [
          {
            title: '待审核报告数量',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            ellipsis: true,
            align: 'center',
            width: 180,
          },
        ],
      },
      {
        title: '报告审核完成情况',
        children: [
          {
            title: '已审核报告数量',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            ellipsis: true,
            align: 'center',
            width: 180,
          },
          {
            title: '待审核报告数量',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            ellipsis: true,
            align: 'center',
            width: 180,
          },
          {
            title: '审核完成率',
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            ellipsis: true,
            align: 'center',
            width: 180,
          },
        ],
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
            time: props.time,
          }}
          autoComplete="off"
          // labelCol={{
          //   flex: '110px',
          // }}
          // wrapperCol={{
          //   flex: 1,
          // }}
        >
          <Space align="middle">
            <Form.Item name="region" label="服务大区">
              <Select
                placeholder="请选择服务大区"
                style={{ width: '220px' }}
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
            <Form.Item name="time" label="离开现场时间">
              <RangePicker_ style={{ width: '300px' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item>
              <Space style={{ marginLeft: 10 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={queryLoading}
                  onClick={() => {
                    GetStatServiceReport(1, 20);
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    GetStatServiceReport(1, 20);
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
        />
      </Card>
    );
  };

  return (
    <Modal
      title="验收服务报告审核情况统计"
      wrapClassName="spreadOverModal"
      open={isModalOpen}
      destroyOnClose
      footer={false}
      onCancel={() => {
        onCancel();
      }}
    >
      {getPageContent()}
    </Modal>
  );
};

export default connect(dvaPropsData)(StatisticsModal);
