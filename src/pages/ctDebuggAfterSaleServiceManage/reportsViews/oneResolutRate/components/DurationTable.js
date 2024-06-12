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
  Radio,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from '../index.less';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const dvaPropsData = ({ loading, oneResolutRate }) => ({
  disposableRateList: oneResolutRate.disposableRateList,
  disposableDate: oneResolutRate.disposableDate,
  loading: loading.effects[`oneResolutRate/GetDisposableRateList`],
  basicsLoading: loading.effects[`oneResolutRate/GetDisposableServiceInfo`],
  exportDisposableRateLopading: loading.effects[`oneResolutRate/ExportDisposableRateList`],
  exportDisposableServiceLoading: loading.effects[`oneResolutRate/ExportDisposableServiceInfo`],
});

const Index = props => {
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
    disposableRateList,
    disposableDate,
    exportDisposableRateLopading,
    exportDisposableServiceLoading,
  } = props;

  useEffect(() => {
  }, []);

  // 获取一次解决率基础数据
  const GetDisposableServiceInfo = (_pageIndex, _pageSize, _sort) => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'oneResolutRate/GetDisposableServiceInfo',
      payload: {
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
        analysisDate: disposableDate,
        sort: _sort || sort,
        ...values,
        beginTime: values.time&&values.time[0].format('YYYY-MM-DD 00:00:00'),
        endTime:  values.time&&values.time[1].format('YYYY-MM-DD 23:59:59'),
        time:undefined
      },
      callback: res => {
        setBasicsDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };



  // 导出
  const onExport = () => {
    dispatch({
      type: 'oneResolutRate/ExportDisposableRateList',
      payload: {
        analysisDate: disposableDate,
      },
    });
  };

  // 导出基础服务
  const onBasicsExport = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'oneResolutRate/ExportDisposableServiceInfo',
      payload: {
        analysisDate: disposableDate,
        sort: 2,
        ...values,
        beginTime: values.time&&values.time[0].format('YYYY-MM-DD 00:00:00'),
        endTime:  values.time&&values.time[1].format('YYYY-MM-DD 23:59:59'),
        time:undefined
      },
    });
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const getColumns = () => {
    let columnList = disposableRateList?.ColumnList? disposableRateList.ColumnList.map(item => {
      return {
        title: item.LargeRegion,
        children: [
          {
            title: '总次数',
            dataIndex: `count${item.ID}`,
            key: `count${item.ID}`,
            width: 120,
            align: 'center',
          },
          {
            title: '已解决次数',
            dataIndex: `solveCount${item.ID}`,
            key: `solveCount${item.ID}`,
            width: 120,
            align: 'center',
          },
          {
            title: '未解决次数',
            dataIndex: `notSolveCount${item.ID}`,
            key: `notSolveCount${item.ID}`,
            width: 120,
            align: 'center',
          },
          {
            title: '一次解决率',
            dataIndex: `rate${item.ID}`,
            key: `rate${item.ID}`,
            width: 120,
            align: 'center',
          },
        ],
      };
    }) : [];
    return [
      {
        title: '年度',
        dataIndex: 'year',
        key: 'year',
        width: 80,
        fixed: 'left',
        className: styles.bg_white,
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
        fixed: 'left',
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: text === '总计' ? 2 : 1 },
          };
        },
      },
      {
        title: '服务产品类别',
        dataIndex: 'reasonName',
        key: 'reasonName',
        width: 200,
        fixed: 'left',
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: text === '总计' ? 0 : 1 },
          };
        },
      },
      {
        title: '总计',
        children: [
          {
            title: '总次数',
            dataIndex: 'allCount',
            key: 'allCount',
            width: 120,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '已解决次数',
            dataIndex: 'allSolveCount',
            key: 'allSolveCount',
            width: 120,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '未解决次数',
            dataIndex: 'allNotSolveCount',
            key: 'allNotSolveCount',
            width: 120,
            align: 'center',
            fixed: 'left',
          },
          {
            title: '一次解决率',
            dataIndex: 'allRate',
            key: 'allRate',
            width: 120,
            align: 'center',
            fixed: 'left',
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
        title: '派工单号',
        dataIndex: 'num',
        key: 'num',
        ellipsis: true,
      },
      {
        title: '项目编号',
        dataIndex: 'projectCode',
        key: 'projectCode',
        ellipsis: true,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        key: 'projectName',
        ellipsis: true,
        width: 180,
      },
      {
        title: '服务大区',
        dataIndex: 'serviceAreaName',
        key: 'serviceAreaName',
        ellipsis: true,
      },
      {
        title: '服务工程师',
        dataIndex: 'workerName',
        key: 'workerName',
        ellipsis: true,
      },
      {
        title: '服务产品类别',
        dataIndex: 'questionName',
        key: 'questionName',
        ellipsis: true,
      },
      {
        title: '服务次数',
        dataIndex: 'level',
        key: 'level',
        ellipsis: true,
      },
      {
        title: '问题解决状态',
        dataIndex: 'solveStatusName',
        key: 'solveStatusName',
        ellipsis: true,
        render: (text, record, index) => {
        return text=='未解决'? <span className='red'>{text}</span> : text;
        },
      },
      {
        title: '未解决原因',
        dataIndex: 'remark',
        key: 'remark',
        ellipsis: true,
      },
      {
        title: '离开现场时间',
        dataIndex: 'leaveDate',
        key: 'leaveDate',
        ellipsis: true,
      },
    ];

    return columns;
  };

  //分页
  const handleTableChange = (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    GetDisposableServiceInfo(PageIndex, PageSize);
  };

  // 排序、分页
  const onTableChange = (pagination, filters, sorter) => {
    const { pageSize, current } = pagination;
    setPageSize(pageSize);
    setPageIndex(current);
    let order = sorter.order === 'ascend' ? 1 : sorter.order === 'descend' ? 2 : 0;
    setSort(order);
    GetDisposableServiceInfo(current, pageSize, order + '');
  };

  return (
    <Card
      title={
        <Space>
          <span>{`${moment(disposableDate).format('YYYY年')}质保内服务一次解决率`}</span>
          <Button
            loading={exportDisposableRateLopading}
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
              setIsModalOpen(true);
              form.resetFields();
              handleTableChange(1, 20);
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
        dataSource={disposableRateList?.TableList || []}
        columns={getColumns()}
        align="center"
        scroll={{
          y: 500,
        }}
        pagination={false}
      />

      <Modal
        title={`${disposableDate&&moment(disposableDate).format('YYYY年')}质保内服务一次解决率基础数据`}
        wrapClassName={`spreadOverModal ${styles.modalSty}` }
        visible={isModalOpen}
        destroyOnClose
        footer={null}
        onCancel={() => {
          onCancel();
        }}
      >
        <Form
          id="searchForm"
          form={form}
          initialValues={{
            time: [moment().startOf('month'), moment()],
            solveStatus:'',
          }}
          autoComplete="off"
          style={{ marginTop: 10, marginBottom: 10 }}
        >
            <Row>
            <Col span={8}>
              <Form.Item name='time' label='离开现场时间' style={{paddingRight:8}}>
                <RangePicker_ style={{ width: '100%' }}
                  allowClear={false}
                  showTime={false}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
              </Col>
              <Col span={8} >
                <Form.Item name='projectCode' label='项目编号' style={{paddingRight:8}}>
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col span={8} >
                <Form.Item name='projectName' label='项目名称' style={{paddingRight:8}}>
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name='solveStatus' label='解决状态' className='minWidth' >
                  <Radio.Group>
                    <Radio value={''}>全部</Radio>
                    <Radio value={1}>已解决</Radio>
                    <Radio value={0}>未解决</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col>
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
                    <Button  loading={exportDisposableServiceLoading}  icon={<ExportOutlined />}  onClick={() => onBasicsExport()}>
                      导出
                </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
           
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
          }}
        />
      </Modal>
    </Card>
  );
};

export default connect(dvaPropsData)(Index);
