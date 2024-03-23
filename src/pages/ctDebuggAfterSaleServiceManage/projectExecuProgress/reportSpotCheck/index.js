/*
 * @Author: JiaQi
 * @Date: 2024-03-22 15:39:53
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-23 14:49:26
 * @Description:  服务报告抽查
 */
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
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import AllViewModal from './components/AllViewModal';
import SpotCheckPage from './components/SpotCheckPage';
import ImageLightboxView from '@/components/ImageLightboxView';

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`reportSpotCheck/GetCheckServiceList`],
  exportLoading: loading.effects[`reportSpotCheck/ExportCheckServiceList`],
});

const ServiceIsNotTimely = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isAllViewModalOpen, setIsAllViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAll, queryLoading, dispatch, exportLoading } = props;

  useEffect(() => {
    getTableDataSource();
  }, []);

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      checkBeginTime: values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      checkEndTime: values.time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      isAll: isAll ? 0 : 1,
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'reportSpotCheck/GetCheckServiceList',
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
      type: 'reportSpotCheck/DelteCheckServiceReport',
      payload: {
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
      type: 'reportSpotCheck/ExportCheckServiceList',
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
        dataIndex: 'ProjectID',
        key: 'ProjectID',
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
        title: '提交时间',
        dataIndex: 'CommitDate',
        key: 'CommitDate',
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
        title: '抽查人',
        dataIndex: 'CheckUserNmae',
        key: 'CheckUserNmae',
        ellipsis: true,
      },
      {
        title: '抽查时间',
        dataIndex: 'CheckTime',
        key: 'CheckTime',
        ellipsis: true,
        width: 180,
      },
      {
        title: '抽查结果',
        dataIndex: 'CheckResult',
        key: 'CheckResult',
        ellipsis: true,
      },
      {
        title: '备注',
        dataIndex: 'Remark',
        key: 'Remark',
        ellipsis: true,
        width: 240,
        render: (text, record) => {
          return <Tooltip title={text}>{text}</Tooltip>;
        },
      },
      {
        title: '附件照片',
        dataIndex: 'FileList',
        key: 'FileList',
        ellipsis: true,
        render: (text, record) => {
          let fileList = record.FileList.ImgList;
          if (!fileList.length) {
            return '-';
          }
          return <ImageLightboxView images={fileList} />;
        },
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

    // 查看全部过滤掉操作列和“离开现场时间”
    if (isAll) {
      columns = columns.filter(
        item => item.dataIndex !== 'handle' && item.dataIndex !== 'LeaveDate',
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
          labelCol={{
            flex: '90px',
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
            <Col span={8}>
              <Form.Item name="time" label="抽查时间">
                <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="CheckResult" label="抽查结果">
                <Select
                  allowClear
                  placeholder="请选择"
                  options={[
                    {
                      value: 0,
                      label: '合格',
                    },
                    {
                      value: 1,
                      label: '不合格',
                    },
                  ]}
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
              抽查
            </Button>
          )}

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
        </Space>
        <Divider />
      </div>
    );
  };

  const getPageContent = () => {
    return (
      <Card bordered={isAll ? false : true}>
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
        <AllViewModal
          isModalOpen={isAllViewModalOpen}
          onCancel={() => {
            setIsAllViewModalOpen(false);
          }}
        />
      </Card>
    );
  };

  if (isAll) {
    return getPageContent();
  }

  return (
    <BreadcrumbWrapper>
      {getPageContent()}
      {isModalOpen && (
        <SpotCheckPage
          isModalOpen={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          reloadPageData={() => {
            getTableDataSource();
          }}
        />
      )}
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(ServiceIsNotTimely);
