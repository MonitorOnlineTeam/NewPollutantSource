/*
 * @Author: JiaQi
 * @Date: 2023-05-30 14:30:45
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-06-08 16:13:09
 * @Description：报警记录
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select, Badge, Tooltip } from 'antd';
import styles from '../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';

const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, dataModel }) => ({
  modelList: dataModel.modelList,
  modelListLoading: loading.effects['dataModel/GetModelList'],
  queryLoading: loading.effects['dataModel/GetWarningList'],
});

const WarningRecord = props => {
  const [form] = Form.useForm();
  const { dispatch, modelList, modelListLoading, queryLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    onFinish();
    GetModelList();
  }, []);

  // 获取数据模型列表
  const GetModelList = () => {
    dispatch({
      type: 'dataModel/GetModelList',
      payload: {},
    });
  };

  const getColumns = () => {
    return [
      {
        title: '企业',
        dataIndex: 'EntNmae',
        key: 'EntNmae',
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
        title: '报警时间',
        dataIndex: 'WarningTime',
        key: 'WarningTime',
        width: 180,
        ellipsis: true,
      },
      {
        title: '报警类型',
        dataIndex: 'WarningTypeName',
        key: 'WarningTypeName',
        width: 180,
        ellipsis: true,
      },
      {
        title: '报警内容',
        dataIndex: 'WarningContent',
        key: 'WarningContent',
        width: 240,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span style={textStyle}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '核实结果',
        dataIndex: 'CheckedResultCode',
        key: 'CheckedResultCode',
        width: 120,
        render: (text, record) => {
          switch (text) {
            case '3':
              return <Badge status="default" text="未核实" />;
            case '2':
              return <Badge status="success" text="属实" />;
            case '1':
              return <Badge status="error" text="不实" />;
          }
        },
      },
      {
        title: '操作',
        key: 'handle',
        width: 100,
        render: (text, record) => {
          return (
            <Tooltip title="查看">
              <a
                onClick={e => {
                  router.push(
                    '/DataAnalyticalWarningModel/Warning/WarningVerify/' + record.ModelWarningGuid,
                  );
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

  // 查询数据
  const onFinish = (pageIndex = 1, pageSize = 20) => {
    const values = form.getFieldsValue();
    props.dispatch({
      type: 'dataModel/GetWarningList',
      payload: {
        ...values,
        date: undefined,
        beginTime: values.date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.date[1].format('YYYY-MM-DD HH:mm:ss'),
        pageIndex,
        pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTotal(res.Total);
      },
    });
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    onTableChange(1, 20);
  };

  // 分页
  const onTableChange = (current, pageSize) => {
    setPageIndex(current);
    setPageSize(pageSize);
    onFinish(current, pageSize);
  };

  return (
    <BreadcrumbWrapper>
      <Card>
        <Form
          name="basic"
          form={form}
          layout="inline"
          style={{ padding: '10px 0 20px' }}
          initialValues={{
            date: [
              moment()
                .subtract(1, 'month')
                .startOf('day'),
              moment().endOf('day'),
            ],
          }}
          autoComplete="off"
          // onValuesChange={onValuesChange}
        >
          <Form.Item label="日期" name="date">
            <RangePicker_
              allowClear={false}
              dataType="day"
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="行政区" name="regionCode">
            <RegionList
              noFilter
              // levelNum={2}
              style={{ width: 150 }}
              onSelect={(value, node, extra) => {
                // let ragionName = node.parentTitle ? node.parentTitle + node.title : node.title;
                // setCurrentTitleName(ragionName);
              }}
            />
          </Form.Item>
          <Spin spinning={modelListLoading} size="small">
            <Form.Item label="报警类型" name="warningTypeCode">
              <Select
                allowClear
                placeholder="请选择报警类型"
                style={{ width: 200 }}
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {modelList.map(item => {
                  return (
                    <Option key={item.ModelGuid} value={item.ModelGuid}>
                      {item.ModelName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Spin>
          <Form.Item label="核实结果" name="checkedResultCode">
            <Select allowClear style={{ width: 120 }} placeholder="请选择核实结果">
              <Option value="2">属实</Option>
              <Option value="1">不实</Option>
              <Option value="3">未核实</Option>
            </Select>
          </Form.Item>
          <Space>
            <Button
              type="primary"
              loading={queryLoading}
              onClick={() => {
                setPageIndex(1);
                onFinish();
              }}
            >
              查询
            </Button>
            <Button onClick={() => onReset()}>重置</Button>
          </Space>
        </Form>
        <SdlTable
          rowKey="ModelWarningGuid"
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          loading={queryLoading}
          pagination={{
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

export default connect(dvaPropsData)(WarningRecord);
