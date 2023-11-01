import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select, Badge, Tooltip } from 'antd';
import styles from '../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntAtmoList from '@/components/EntAtmoList';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { getCurrentUserId } from '@/utils/utils';
import OperationInspectoUserList from '@/components/OperationInspectoUserList';
import { router } from 'umi';
import { FileProtectOutlined,RollbackOutlined } from '@ant-design/icons';
import {  ModalNameConversion } from '../CONST';

const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, dataModel }) => ({
  // todoList: wordSupervision.todoList,
  loading: loading.effects['dataModel/GetMyModelExceptionByPManager'],
});

const Tode = props => {
  const [form] = Form.useForm();
  const { dispatch, loading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [pointLoading, setPointLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const currentUserId = getCurrentUserId();
  let par = props.history?.location?.query?.par && JSON.parse(props.history.location.query.par)

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = (_pageIndex, _pageSize) => {
    const values = form.getFieldsValue();
    let DGIMN = values.DGIMN ? [values.DGIMN] : [];
    if (values.EntCode && !values.DGIMN) {
      DGIMN = pointList.map(item => item.DGIMN);
    }

    let body = {
      ...values,
      date: undefined,
      DGIMN: DGIMN,
      BeginTime: moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss'),
      EndTime: moment(values.date[1]).format('YYYY-MM-DD HH:mm:ss'),
      PageSize: _pageSize || pageSize,
      PageIndex: _pageIndex || pageIndex,
    };
    props.dispatch({
      type: 'dataModel/GetMyModelExceptionByPManager',
      payload: body,
      callback: res => {
        setTotal(res.Total);
        setDataSource(res.Datas);
      },
    });
  };

  // 根据企业获取排口
  const getPointListByEntCode = value => {
    if (!value) {
      //清空时 不走请求
      form.setFieldsValue({ DGIMN: undefined });
      setPointList([]);
      return;
    }
    setPointLoading(true);
    dispatch({
      type: 'dataModel/getPointByEntCode',
      payload: {
        EntCode: value,
      },
      callback: res => {
        setPointList(res);
        setPointLoading(false);
      },
    });
  };

  const getColumns = () => {
    return [
      {
        title: '编号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        ellipsis: true,
        render: (text, record, index) => {
          return (pageIndex - 1) * pageSize + index + 1;
        },
      },
      {
        title: '企业',
        dataIndex: 'ParentName',
        key: 'ParentName',
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
        title: '场景类型',
        dataIndex: 'ModelName',
        key: 'ModelName',
        width: 180,
        ellipsis: true,
        render: (text, record) => {
          let _text = ModalNameConversion(text);
          return (
            <Tooltip title={_text}>
              <span className={styles.textOverflow}>{_text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '核实状态',
        dataIndex: 'Status',
        key: 'Status',
        width: 120,
      },
      {
        title: '运维人核实结果',
        dataIndex: 'CheckedResult',
        key: 'CheckedResult',
        width: 120,
      },
      {
        title: '异常原因',
        dataIndex: 'UntruthReason',
        key: 'UntruthReason',
        width: 200,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span style={textStyle}>{text || '-'}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '描述',
        dataIndex: 'CheckedDes',
        key: 'CheckedDes',
        width: 200,
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
        title: '核实人',
        dataIndex: 'User_Name',
        key: 'User_Name',
        width: 180,
        ellipsis: true,
      },
      {
        title: '核实时间',
        dataIndex: 'CheckedTime',
        key: 'CheckedTime',
        width: 180,
        ellipsis: true,
        sorter: (a, b) => moment(a.CheckedTime).valueOf() - moment(b.CheckedTime).valueOf(),
      },
      {
        title: '发现线索时间',
        dataIndex: 'WarningTime',
        key: 'WarningTime',
        width: 180,
        ellipsis: true,
        sorter: (a, b) => moment(a.WarningTime).valueOf() - moment(b.WarningTime).valueOf(),
      },
      {
        title: '操作',
        key: 'handle',
        width: 100,
        render: (text, record) => {
          return (
            <Tooltip title="复核">
              <a
                onClick={e => {
                  router.push(
                    `/DataAnalyticalWarningModel/ReCheck/Details/${record.ModelCheckedGuid}`,
                  );
                }}
              >
                <FileProtectOutlined style={{ fontSize: 16 }} />
                {/* 复核 */}
              </a>
            </Tooltip>
          );
        },
      },
    ];
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
  };

  const onTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex);
    setPageSize(PageSize);
    loadData(PageIndex, PageSize);
  };

  return (
    <BreadcrumbWrapper>
      <Card className={styles.warningWrapper}>
        <Form
          name="basic"
          form={form}
          layout="inline"
          style={{ padding: '10px 0' }}
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
          onValuesChange={(changedFields, allFields) => {
            const fieldName = Object.keys(changedFields).join();
            const value = allFields[fieldName];
            if (fieldName === 'EntCode') {
              getPointListByEntCode(value);
            }
          }}
        >
          <Form.Item label="日期" name="date">
            <RangePicker_
              allowClear={false}
              dataType="day"
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="企业" name="EntCode">
            <EntAtmoList noFilter style={{ width: 200 }} />
          </Form.Item>
          <Spin spinning={pointLoading} size="small" style={{ top: -10 }}>
            <Form.Item label="点位名称" name="DGIMN">
              <Select
                placeholder="请选择"
                allowClear
                showSearch
                optionFilterProp="children"
                style={{ width: 200 }}
              >
                {pointList[0] &&
                  pointList.map(item => {
                    return (
                      <Option key={item.DGIMN} value={item.DGIMN}>
                        {item.PointName}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Spin>
          <Form.Item label="核实人" name="CheckUserID">
            <OperationInspectoUserList style={{ width: 150 }} />
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
              <Button onClick={() => onReset()}>重置</Button>
              {par&&<Button onClick={() => router.goBack()}>
                <RollbackOutlined />
                返回上级
              </Button>}
            </Space>
          </Form.Item>
        </Form>
        <SdlTable
          rowKey="ModelWarningGuid"
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          loading={loading}
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

export default connect(dvaPropsData)(Tode);
