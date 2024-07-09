/*
 * @Author: JiaQi
 * @Date: 2024-05-20 15:43:07
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-20 16:17:40
 * @Description:  设备信息 - 弹窗
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Button, Card, Select, Space, Row, Col, message, Divider } from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { ExportOutlined } from '@ant-design/icons';

const dvaPropsData = ({ loading, common }) => ({
  largeRegionList: common.CtLargeRegionList,
  provinceAllList: common.CtProvinceList,
  queryLoading: loading.effects[`ctDataScreen/GetDeviceInformationList`],
  exportLoading: loading.effects[`ctDataScreen/ExportDeviceInformationList`],
});

const DeviceInfoCountModal = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [showType, setShowType] = useState('chart');

  const {
    dispatch,
    open,
    onCancel,
    largeRegionList,
    provinceAllList,
    queryLoading,
    exportLoading,
    time,
  } = props;

  useEffect(() => {
    getTableDataSource();
    form.setFieldsValue({
      time: time,
    });
  }, []);

  // // 获取大区及省份
  // const getLargeRegion = () => {
  //   dispatch({
  //     type: 'common/getCTLargeRegion',
  //     payload: {},
  //   });
  // };

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      btime: values.time ? values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      etime: values.time ? values.time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'ctDataScreen/GetDeviceInformationList',
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
      type: 'ctDataScreen/ExportDeviceInformationList',
      payload: {
        ...body,
      },
    });
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getTableDataSource(PageIndex, PageSize);
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        fixed: 'left',
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
        title: '省份',
        dataIndex: 'ProviceName',
        key: 'ProviceName',
        ellipsis: true,
      },
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
        ellipsis: true,
      },
      {
        title: '监测点',
        dataIndex: 'PointName',
        key: 'PointName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '安装调试时间',
        dataIndex: 'LeaveDate',
        key: 'LeaveDate',
        ellipsis: true,
        render: (text, record) => {
          return text ? moment(text).format('YYYY-MM-DD') : '-';
        },
      },
      {
        title: '设备类型',
        dataIndex: 'SystemModelName',
        key: 'SystemModelName',
        ellipsis: true,
      },
    ];
    return columns;
  };

  // 搜索组件
  const SearchComponents = () => {
    return (
      <div>
        <Form
          form={form}
          // layout="inline"
          initialValues={{
            time: time,
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
              <Form.Item name="serviceAreaName" label="所属大区">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="proviceName" label="省份">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="entName" label="企业">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="pointName" label="监测点">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="安装调试时间">
                <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="systemModelName" label="设备类型">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item style={{marginBottom:0}}>
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
            </Col>
          </Row>
        </Form>
        {/* <Divider style={{ margin: 0 }} /> */}
      </div>
    );
  };

  return (
    <Modal
      title={`设备信息总览`}
      wrapClassName="fullScreenModal"
      open={open}
      destroyOnClose
      footer={false}
      onCancel={() => {
        onCancel();
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Card bordered={false} title={<SearchComponents />}>
        <SdlTable
          loading={queryLoading}
          align="center"
          resizable
          dataSource={dataSource}
          columns={getColumns()}
          scroll={{
            y: 'calc(100vh - 338px)',
          }}
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

export default connect(dvaPropsData)(DeviceInfoCountModal);
