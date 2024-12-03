import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  TreeSelect,
  Modal,
  Card,
  Spin,
  Button,
  Space,
  Select,
  Input,
  Tooltip,
  message,
  Tag,
  Popconfirm,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import EntAtmoList from '@/components/EntAtmoList';
import SdlTable from '@/components/SdlTable';
import { DetailIcon } from '@/utils/icon';
import { requestPost, requestGet, convertTextByConfig } from '@/utils/utils';
import { API } from '@config/API';
import DetailsModal from './DetailsModal';
import moment from 'moment';

const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  queryLoading: loading.effects['AbnormalIdentifyModel/GetCheckedRectificationList'],
  pointListLoading: loading.effects['AbnormalIdentifyModel/GetNoFilterPointByEntCode'],
});

const RectificationTask = props => {
  const [form] = Form.useForm();

  const { dispatch, pointListLoading, queryLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(false);

  useEffect(() => {
    onTableChange(1, 20);
  }, []);

  // 获取页面数据
  const getPageData = (_pageIndex, _pageSize) => {
    const values = form.getFieldsValue();
    let bTime = moment(values.date[0]).format('YYYY-MM-DD 00:00:00');
    let eTime = moment(values.date[1]).format('YYYY-MM-DD 23:59:59');
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetCheckedRectificationList,
      payload: {
        IsExpert: true,
        ...values,
        isComplete: values.isComplete || '1,2,3',
        date: undefined,
        bTime,
        eTime,
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setLoading(false);
        setTotal(res.total);
      },
    });
  };

  // 根据企业获取排口
  const getPointList = EntCode => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetNoFilterPointByEntCode',
      payload: {
        EntCode,
      },
      callback: res => {
        setPointList(res);
      },
    });
  };

  const getColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        ellipsis: true,
        render: (text, record, index) => {
          return (pageIndex - 1) * pageSize + index + 1;
        },
      },
      {
        title: convertTextByConfig('企业'),
        dataIndex: 'EntName',
        key: 'EntName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '排口',
        dataIndex: 'PointName',
        key: 'PointName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '整改发起日期',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        width: 160,
        ellipsis: true,
        sorter: (a, b) => moment(a.CreateTime).valueOf() - moment(b.CreateTime).valueOf(),
      },
      {
        title: '整改人',
        dataIndex: 'RectificationUserName',
        key: 'RectificationUserName',
        width: 140,
        ellipsis: true,
      },
      {
        title: '整改结论',
        dataIndex: 'CheckedDes',
        key: 'CheckedDes',
        width: 200,
        render: (text, record) => {
          if (text) {
            return (
              <Tooltip title={text}>
                <span style={textStyle}>{text}</span>
              </Tooltip>
            );
          }
          return '-';
        },
      },
      {
        title: '整改状态',
        dataIndex: 'RectificationStatusName',
        key: 'RectificationStatusName',
        width: 140,
        ellipsis: true,
        render: (text, row) => {
          return (
            <Tag
              color={
                row.RectificationStatus == 3
                  ? 'success'
                  : row.RectificationStatus == 2
                  ? 'orange'
                  : 'volcano'
              }
            >
              {text}
            </Tag>
          );
        },
      },
      {
        title: '操作',
        key: 'handle',
        width: 60,
        render: (text, record) => {
          return (
            <Tooltip title="查看">
              <a
                onClick={e => {
                  setCurrentRow(record);
                  setIsDetailsOpen(true);
                }}
              >
                <DetailIcon />
              </a>
            </Tooltip>
          );
        },
      },
    ];
  };

  // 分页
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const onTableChange = (current, pageSize) => {
    setPageIndex(current);
    setPageSize(pageSize);
    getPageData(current, pageSize);
  };

  return (
    <BreadcrumbWrapper>
      <Card
        bodyStyle={{
          padding: 12,
        }}
        title={
          <Form
            form={form}
            layout="inline"
            initialValues={{
              date: [moment().subtract(1, 'month'), moment()],
            }}
            autoComplete="off"
          >
            <Form.Item label="日期" name="date">
              <RangePicker_
                allowClear={false}
                dataType="day"
                format="YYYY-MM-DD"
                style={{ width: 250 }}
              />
            </Form.Item>

            <Form.Item label={convertTextByConfig('企业')} name="EntCode">
              <EntAtmoList
                placeholder="请选择"
                regionCode={form.getFieldValue('regionCode')}
                style={{ width: 200 }}
                onChange={value => {
                  if (!value) {
                    form.setFieldsValue({ DGIMN: undefined });
                    setPointList([]);
                  } else {
                    form.setFieldsValue({ DGIMN: undefined });
                    getPointList(value);
                  }
                }}
              />
            </Form.Item>
            <Spin spinning={!!pointListLoading} size="small" style={{ background: '#fff' }}>
              <Form.Item label="监测点名称" name="DGIMN">
                <Select
                  placeholder="请选择"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  style={{ width: 150 }}
                >
                  {pointList.map(item => {
                    return (
                      <Option key={item.DGIMN} value={item.DGIMN}>
                        {item.PointName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Spin>
            <Form.Item label="整改状态" name="isComplete">
              <Select
                placeholder="请选择"
                showSearch
                allowClear
                optionFilterProp="children"
                style={{ width: 150 }}
              >
                <Option key={1} value={1}>
                  待整改
                </Option>
                <Option key={2} value={2}>
                  待复核
                </Option>
                <Option key={3} value={3}>
                  整改完成
                </Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={() => {
                    onTableChange(1, 20);
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        }
      >
        <SdlTable
          resizable
          rowKey="ID"
          align="center"
          style={{ marginTop: 10 }}
          columns={getColumns()}
          dataSource={dataSource}
          loading={loading}
          // pagination={false}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: pageSize,
            current: pageIndex,
            onChange: onTableChange,
            total: total,
          }}
        />
      </Card>
      {/* 详情 */}
      <DetailsModal
        currentRow={currentRow}
        open={isDetailsOpen}
        onCancel={() => {
          setIsDetailsOpen(false);
        }}
        onHandleSuccess={() => {
          getPageData();
        }}
      />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(RectificationTask);
