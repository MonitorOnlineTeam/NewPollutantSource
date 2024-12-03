/*
 * @Author: JiaQi
 * @Date: 2024-09-18 14:36:43
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-11-28 16:01:37
 * @Description:  暂停线索时段
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntAtmoList from '@/components/EntAtmoList';
import SdlTable from '@/components/SdlTable';
import { API } from '@config/API';
import moment from 'moment';
import ModelTree from '@/components/ModelTree/index.js';
import { convertTextByConfig } from '@/utils/utils';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  queryLoading: loading.effects['AbnormalIdentifyModel/GetCheckedRectificationList'],
  pointListLoading: loading.effects['AbnormalIdentifyModel/GetNoFilterPointByEntCode'],
});

const PauseModelWarning = props => {
  const [form] = Form.useForm();

  const { dispatch, pointListLoading, queryLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(false);

  useEffect(() => {
    getPageData(1, 20);
  }, []);

  // 获取页面数据
  const getPageData = (_pageIndex, _pageSize, _sortField, _order) => {
    const values = form.getFieldsValue();
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetPauseWarningList,
      payload: {
        ...values,
        flagCode: values.flagCode ? values.flagCode.toString() : '',
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
        title: convertTextByConfig('企业'),
        dataIndex: 'ParentName',
        key: 'ParentName',
        width: 180,
        ellipsis: true,
      },
      {
        title: '排口',
        dataIndex: 'PointName',
        key: 'PointName',
        width: 180,
        ellipsis: true,
      },
      {
        title: '场景',
        dataIndex: 'FlagName',
        key: 'FlagName',
        ellipsis: true,
        width: 230,
        render: text => {
          return text || '-';
        },
      },
      {
        title: '暂停报警开始时间',
        dataIndex: 'StopAlarmBeginTime',
        key: 'StopAlarmBeginTime',
        ellipsis: true,
        // width: 140,
        sorter: (a, b) => moment(a.StopAlarmBeginTime) - moment(b.StopAlarmBeginTime),
        render: text => {
          return text || '-';
        },
      },
      {
        title: '暂定报警截止时间',
        dataIndex: 'StopAlarmEndTime',
        key: 'StopAlarmEndTime',
        ellipsis: true,
        // width: 140,
        sorter: (a, b) => moment(a.StopAlarmEndTime) - moment(b.StopAlarmEndTime),
        render: text => {
          return text || '-';
        },
      },
      {
        title: '创建人',
        dataIndex: 'User_Name',
        key: 'User_Name',
        ellipsis: true,
        width: 140,
      },
      {
        title: '创建时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        ellipsis: true,
        // width: 140,
        sorter: (a, b) => moment(a.CreateTime) - moment(b.CreateTime),
        render: text => {
          return text || '-';
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
            <Form.Item label="场景类别" name="flagCode">
              <ModelTree type="action" />
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

export default connect(dvaPropsData)(PauseModelWarning);
