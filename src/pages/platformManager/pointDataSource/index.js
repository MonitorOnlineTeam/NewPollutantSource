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
import { API } from '@config/API';
import moment from 'moment';
import RegionList from '@/components/RegionList';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import { convertTextByConfig } from '@/utils/utils';

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

const PointDataSource = props => {
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
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetPointDataBy,
      payload: {
        ...values,
        // isComplete: values.isComplete || '1,2,3',
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setLoading(false);
        setTotal(res.Total);
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
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 160,
        ellipsis: true,
      },
      {
        title: convertTextByConfig('企业'),
        dataIndex: 'ParentName',
        key: 'ParentName',
        width: 220,
        ellipsis: true,
      },
      {
        title: '排口',
        dataIndex: 'PointName',
        key: 'PointName',
        width: 220,
        ellipsis: true,
      },
      {
        title: '数据来源',
        dataIndex: 'DataBy',
        key: 'DataBy',
        ellipsis: true,
        render: text => {
          return text == 1 ? '直传' : '第三方';
        },
      },
      {
        title: '经度',
        dataIndex: 'Longitude',
        key: 'Longitude',
        width: 120,
        ellipsis: true,
      },
      {
        title: '维度',
        dataIndex: 'Latitude',
        key: 'Latitude',
        ellipsis: true,
      },
      {
        title: '所属行业',
        dataIndex: 'IndustryTypeName',
        key: 'IndustryTypeName',
        ellipsis: true,
      },
      {
        title: '验收日期',
        dataIndex: 'YSDate',
        key: 'YSDate',
        width: 160,
        ellipsis: true,
        render: text => {
          return text || '-';
        },
        // sorter: (a, b) => moment(a.CreateTime).valueOf() - moment(b.CreateTime).valueOf(),
      },
      {
        title: '基准氧含量',
        dataIndex: 'AirCoefficient',
        key: 'AirCoefficient',
        ellipsis: true,
      },
      {
        title: '烟道截面积',
        dataIndex: 'FlueCoefficient',
        key: 'FlueCoefficient',
        ellipsis: true,
      },
      {
        title: '当地大气压',
        dataIndex: 'Atmos',
        key: 'Atmos',
        ellipsis: true,
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
            {configInfo.isShowRegion && (
              <Form.Item label="行政区" name="regionCode">
                <RegionList
                  style={{ width: 180 }}
                  onChange={value => {
                    form.setFieldsValue({ EntCode: undefined, DGIMN: undefined });
                    setPointList([]);
                  }}
                />
              </Form.Item>
            )}
            <Form.Item label={convertTextByConfig('企业')} name="EntCode">
              <EntAtmoList
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
              <Form.Item label="监测点" name="DGIMN">
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
            <Form.Item label="行业" name="IndustryType">
              <SearchSelect
                placeholder="排口所属行业"
                style={{ width: 130 }}
                configId={'IndustryType'}
                itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
                itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
              />
            </Form.Item>
            <Form.Item label="数据来源" name="DataBy">
              <Select
                placeholder="请选择"
                showSearch
                allowClear
                optionFilterProp="children"
                style={{ width: 150 }}
              >
                <Option key={1} value={1}>
                  直传
                </Option>
                <Option key={2} value={2}>
                  第三方
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
                    onTableChange(1, 20);
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
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(PointDataSource);
