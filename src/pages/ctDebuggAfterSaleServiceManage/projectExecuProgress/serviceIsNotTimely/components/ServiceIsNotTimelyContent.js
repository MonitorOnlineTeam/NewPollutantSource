/*
 * @Author: JiaQi
 * @Date: 2024-03-21 13:47:44
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-04-26 11:29:32
 * @Description:  服务不及时页面
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
  message,
  Divider,
} from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import RegistrationModal from './RegistrationModal';
import AllViewModal from './AllViewModal';

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`serviceIsNotTimely/GetServiceSetList`],
});

const ServiceIsNotTimely = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllViewModalOpen, setIsAllViewModalOpen] = useState(false);

  const { dispatch, serviceType, queryLoading, isAll } = props;

  useEffect(() => {
    getTableDataSource();
  }, []);

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      time2:undefined,
      registerBeginTime: values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      registerEndTime: values.time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      LeaveBtime: values.time2?.[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      LeaveEtime: values.time2?.[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      serviceType: serviceType,
      isAll: isAll ? 0 : 1,
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'serviceIsNotTimely/GetServiceSetList',
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

  // 删除
  const onDelete = id => {
    dispatch({
      type: 'serviceIsNotTimely/DeleteServiceSetStatus',
      payload: {
        serviceType: serviceType,
        id: id,
      },
      callback: res => {
        handleTableChange(1, 20);
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'serviceIsNotTimely/ExportServiceSetList',
      payload: {
        ...body,
        isExport: 1,
      },
      callback: res => {
        handleTableChange(1, 20);
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
        title: '客户服务需求时间',
        dataIndex: 'NeedDate',
        key: 'NeedDate',
        ellipsis: true,
        width: 180,
      },
      {
        title: '变更后服务需求时间',
        dataIndex: 'ServiceChangeDate',
        key: 'ServiceChangeDate',
        ellipsis: true,
        width: 180,
      },
      {
        title: '状态',
        dataIndex: 'ServiceType',
        key: 'ServiceType',
        ellipsis: true,
      },
      {
        title: '备注',
        dataIndex: 'Remark',
        key: 'Remark',
        ellipsis: true,
        width: 240,
        render: (text, record) => {
          return <Tooltip placement='left' title={text}>{text}</Tooltip>;
        },
      },
      {
        title: '登记人',
        dataIndex: 'RegisterUserName',
        key: 'RegisterUserName',
        ellipsis: true,
      },
      {
        title: '登记时间',
        dataIndex: 'RegisterDate',
        key: 'RegisterDate',
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
            <Tooltip title="删除">
              <Popconfirm
                placement="left"
                title="确定要删除吗？"
                onConfirm={() => onDelete(record.ID)}
                okText="是"
                cancelText="否"
              >
                <a>
                  <DeleteOutlined style={{ fontSize: 16 }} />
                </a>
              </Popconfirm>
            </Tooltip>
          );
        },
      },
    ];

    // 查看全部过滤掉操作列
    if (isAll) {
      columns = columns.filter(item => item.dataIndex !== 'handle');
      // 服务时间变更：查看全部不显示“客户服务需求时间”
      if (serviceType === 2) {
        columns = columns.filter(item => item.dataIndex !== 'NeedDate');
      }
    }
    // 服务时间变更 - 不显示状态
    if (serviceType === 2) {
      columns = columns.filter(item => item.dataIndex !== 'ServiceType');
    } else {
      // 服务不及时、不参与统计不显示“客户服务需求时间”和“变更后服务需求时间”列
      columns = columns.filter(
        item => item.dataIndex !== 'NeedDate' && item.dataIndex !== 'ServiceChangeDate',
      );
    }

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
            time: [
              moment().startOf('month'),
              moment()
                // .add(-1, 'day')
                .endOf('day'),
            ],
          }}
          autoComplete="off"
          // labelCol={{ span: 5 }}
          // wrapperCol={{ span: 18 }}
          labelCol={{
            flex: '108px',
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
              <Form.Item name="projectCode" label="合同编号">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="itemCode" label="立项号">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="projectName" label="项目名称">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>

            {// 只有查看全部时显示
            isAll && (
              <Col span={8}>
                <Form.Item name="RegisterUserName" label="登记人">
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
            )}
            <Col span={8}>
              <Form.Item name="time" label="登记时间">
                <RangePicker_
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  // showTime={{
                  //   format: 'YYYY-MM-DD',
                  //   defaultValue: [
                  //     moment(' 00:00:00', ' HH:mm:ss'),
                  //     moment(' 23:59:59', ' HH:mm:ss'),
                  //   ],
                  // }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="time2" label="离开现场时间">
                <RangePicker_
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
                </Form.Item>
              </Col>
          </Row>
        </Form>
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
          {!isAll && (
            <Button
              type="primary"
              // icon={<ExportOutlined />}
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              登记
            </Button>
          )}

          <Button
            icon={<ExportOutlined />}
            loading={false}
            onClick={() => {
              onExport();
            }}
          >
            导出
          </Button>
          {!isAll && (
            <Button
              type="primary"
              // icon={<ExportOutlined />}
              onClick={() => {
                setIsAllViewModalOpen(true);
              }}
            >
              查看全部
            </Button>
          )}
          {/* 文字说明 */}
          {serviceType === 0 && (
            <span style={{ color: '#f5222d' }}>
              1. 如同一客户联系人反馈未及时到达的视为不及时。2.
              因公司原因、不可抗力导致不及时的视为不及时。请在此页面登记。
            </span>
          )}
          {serviceType === 1 && (
            <span style={{ color: '#f5222d' }}>
              因客户原因导致不及时的，不参与统计，请在此处登记。
            </span>
          )}
          {serviceType === 2 && (
            <span style={{ color: '#f5222d' }}>如客户变更服务需求时间，请在此处登记。</span>
          )}
        </Space>
        <Divider />
      </div>
    );
  };
  return (
    <div style={{ marginRight: 20 }}>
      <SearchComponents />
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
      {isModalOpen && (
        <RegistrationModal
          title={
            serviceType === 0 ? '服务不及时' : serviceType === 1 ? '不参与统计' : '服务时间变更'
          }
          serviceType={serviceType}
          isModalOpen={isModalOpen}
          onCancel={flag => {
            flag && getTableDataSource(1, 20);
            setIsModalOpen(false);
          }}
        />
      )}
      {isAllViewModalOpen && (
        <AllViewModal
          title={
            serviceType === 0 ? '服务不及时' : serviceType === 1 ? '不参与统计' : '服务时间变更'
          }
          serviceType={serviceType}
          isModalOpen={isAllViewModalOpen}
          onCancel={() => {
            setIsAllViewModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default connect(dvaPropsData)(ServiceIsNotTimely);
