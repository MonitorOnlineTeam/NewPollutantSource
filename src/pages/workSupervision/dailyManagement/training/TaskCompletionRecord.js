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
} from 'antd';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
// import LargeRegionSelect from '@/pages/workSupervision/dailyManagement/components/LargeRegionSelect';

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, provinceAllList, common }) => ({
  // provinceAllList: common.CtProvinceList,
  loading: loading.effects[`wordSupervision/GetPersonTrainForRegionInfo`],
  exportLoading: loading.effects[`wordSupervision/ExportPersonTrainForRegionInfo`],
});

const TaskCompletionRecord = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [largeRegionList, setLargeRegionList] = useState([]);
  const [provinceAllList, setProvinceAllList] = useState([]);

  const { dispatch, loading, exportLoading, open, onCancel, time, regionCode, type } = props;

  useEffect(() => {
    type === 'ct' ? getCtLargeRegion() : getLargeRegion();
    getPageData();
  }, []);

  // 获取成套大区及省份
  const getCtLargeRegion = () => {
    dispatch({
      type: 'common/getCTLargeRegion',
      payload: {},
      callback: res => {
        setLargeRegionList(res.CtLargeRegionList);
      },
    });
  };

  // 获取运维大区及省份
  const getLargeRegion = () => {
    dispatch({
      type: 'common/getLargeRegion',
      payload: {},
      callback: res => {
        setProvinceAllList(res.provinceList);
      },
    });
  };

  const renderRegion = () => {
    if (type === 'ct') {
      return (
        <Form.Item name="regionCode" label={'大区'}>
          <Select placeholder="请选择" style={{ width: 140 }} allowClear>
            {largeRegionList.map(item => {
              return (
                <Option value={item.ID} key={item.ID}>
                  {item.LargeRegion}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      );
    } else {
      return (
        <Form.Item name="regionCode" label={'省份'}>
          <Select placeholder="请选择" style={{ width: 140 }} allowClear>
            {provinceAllList.map(item => {
              return (
                <Option value={item.RegionCode} key={item.RegionCode}>
                  {item.RegionName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      );
    }
  };

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      type: type === 'ct' ? '1' : undefined,
      time: undefined,
      beginTime: values.time
        ? values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: values.time
        ? values.time[1].endOf('months').format('YYYY-MM-DD HH:mm:ss')
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
      type: 'wordSupervision/GetPersonTrainForRegionInfo',
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
      type: 'wordSupervision/ExportPersonTrainForRegionInfo',
      payload: body,
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        width: 40,
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
        ellipsis: true,
        width:'auto',
      },
      {
        title: '省份',
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
        width:'auto',
      },
      {
        title: '任务派发时间',
        dataIndex: 'BeginTime',
        key: 'BeginTime',
        ellipsis: true,
        width:'auto',
        // width: 200,
        // render: text => {
        //   return moment(text).format('YYYY-MM-DD');
        // },
      },
      {
        title: '是否完成',
        dataIndex: 'StatusName',
        key: 'StatusName',
        ellipsis: true,
        width:'auto',
        render: (text, row) => {
          return <Text type={text === '是' ? 'default' : 'danger'}>{text}</Text>;
        },
      },
      {
        title: '培训人',
        dataIndex: 'UserName',
        key: 'UserName',
        ellipsis: true,
        width:'auto',
      },
      {
        title: '任务结束时间',
        dataIndex: 'EndTime',
        key: 'EndTime',
        ellipsis: true,
        // width: 200,
        width:'auto',
        render: text => {
          return moment(text).format('YYYY-MM-DD');
        },
      },
    ];

    if (type === 'ct') {
      // 成套不显示省份
      columns = columns.filter(item => item.dataIndex !== 'RegionName');
    }
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
            regionCode: regionCode,
            time: time,
            status: null,
          }}
          autoComplete="off"
        >
          <Space wrap>
            {renderRegion()}
            <Form.Item name="userName" label="培训人">
              <Input style={{ width: 200 }} placeholder="培训人" allowClear />
            </Form.Item>
            <Form.Item name="time" label="任务派发时间">
              <RangePicker_
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
      title={'人员培训任务完成记录'}
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
          scroll={{x:710}}
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
