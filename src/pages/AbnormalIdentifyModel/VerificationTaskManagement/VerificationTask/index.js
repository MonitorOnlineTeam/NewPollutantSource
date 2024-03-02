/*
 * @Author: jab
 * @Date: 2024-01-29
 * @Description：待核查任务 已核查任务
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select, Badge, Tooltip, Input, Radio, Modal, Row, message, Popover, Table, Collapse, Cascader, Upload } from 'antd';
import styles from '../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import Cookie from 'js-cookie';
import { API } from '@config/API';
import { cookieName, uploadPrefix } from '@/config'
import { useHistory } from 'react-router-dom';
const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  verificationTaskData: AbnormalIdentifyModel.verificationTaskData,
  queryLoading: loading.effects['AbnormalIdentifyModel/GetCheckedList'],
  pointListLoading: loading.effects['common/getPointByEntCode'],
  entListLoading: loading.effects['common/GetEntByRegion'],

});

const Index = props => {
  const [form] = Form.useForm();


  const {
    dispatch,
    queryLoading,
    pointListLoading,
    entListLoading,
    verificationTaskData,
    verificationTaskData: { pageIndex, pageSize, scrollTop,rowKey, type },
    location: { pathname },
  } = props;
  const routerType = pathname === '/AbnormalIdentifyModel/VerificationTaskManagement/TobeVerifiedTask' ? 1 : 2
  const [pointList, setPointList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    form.resetFields();
    if (type == 2) {//从详情返回
      onFinish(pageIndex, pageSize);
    } else {
      onTableChange(1, 20)
    }


  }, []);

  const history = useHistory();
  useEffect(() => {
    const handleRouteChange = (location) => {
      // 在这里执行你需要在路由变化时执行的代码  
      const path = location.pathname
      const detailPath = '/AbnormalIdentifyModel/VerificationTaskManagement/VerifiedTaskDetail'
      const currentPath = pathname
      if (path !== detailPath && path !== currentPath) {
        dispatch({
          type: 'AbnormalIdentifyModel/updateState',
          payload: { verificationTaskData: { pageIndex: 1, pageSize: 20,  scrollTop:0,rowKey:undefined, type: 1 } },
        })
      }
    };

    history.listen(handleRouteChange);
  }, [history]);

  const getColumns = () => {
    return [
      {
        title: '编号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        ellipsis: true,
        render: (text, record, index) => {
          return (
            (pageIndex - 1) * pageSize + index + 1
          );
        },
      },
      {
        title: '企业',
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
        title: '行业',
        dataIndex: 'IndustryTypeName',
        key: 'IndustryTypeName',
        width: 120,
        ellipsis: true,
      },
      {
        title: '核查发起时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        width: 150,
        ellipsis: true,
      },
      {
        title: '场景类别',
        dataIndex: 'ModelName',
        key: 'ModelName',
        width: 180,
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
        title: '是否需要核查',
        dataIndex: 'IsRectificationRecordName',
        key: 'IsRectificationRecordName',
        width: 120,
        ellipsis: true,
      },
      {
        title: '核查人',
        dataIndex: 'CheckedUserName',
        key: 'CheckedUserName',
        width: 120,
        ellipsis: true,
      },
      {
        title: '核查状态',
        dataIndex: 'StatusName',
        key: 'StatusName',
        width: 120,
        ellipsis: true,
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
                  let scrollTop = 0;
                  let el = document.querySelector('.ant-table-body');
                  el ? (scrollTop = el.scrollTop) : '';
                  props.dispatch({
                    type: 'AbnormalIdentifyModel/updateState',
                    payload: {
                      verificationTaskData: {
                        ...verificationTaskData,
                        scrollTop: scrollTop,
                        rowKey:record.ID 
                      },
                    },
                  });
                  const data = { id: record.ID }
                  router.push(
                    `/AbnormalIdentifyModel/VerificationTaskManagement/VerifiedTaskDetail?id=${record.ID}&&type=${record.Status}`
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
  const onFinish = (pageIndex, pageSize) => {
    const values = form.getFieldsValue();
    props.dispatch({
      type: 'AbnormalIdentifyModel/GetCheckedList',
      payload: {
        ...values,
        date: undefined,
        beginTime: values.date ? values.date[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: values.date ? values.date[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        pageIndex: pageIndex,
        pageSize: pageSize
      },
      callback: res => {
        const data = routerType == 1 ? res.Datas?.filter(item => item.Status == 1 || item.Status == 2) : res.Datas?.filter(item => item.Status == 3)
        setDataSource(data);
        setTotal(res.Total);
        // 设置滚动条高度，定位到点击详情的行号
        let el = rowKey&&document.querySelector(`[data-row-key='${rowKey}']`);
        let tableBody = document.querySelector('.ant-table-body');
        if (tableBody) {
          el && type==2 ? (tableBody.scrollTop = scrollTop) : (tableBody.scrollTop = 0);
        }
      },
    });
  };


  // 分页
  const onTableChange = (current, pageSize) => {
    props.dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        verificationTaskData: {
          ...verificationTaskData,
          pageSize: pageSize,
          pageIndex: current,
          scrollTop: 0,
          rowKey:undefined,
        },
      },
    });
    onFinish(current, pageSize);
  };

  // 根据企业获取排口
  const getPointList = (EntCode, callback) => {
    dispatch({
      type: 'common/getPointByEntCode',
      payload: {
        EntCode,
      },
      callback: res => {
        setPointList(res);
        callback && callback()
      },
    });
  };


  return (<div className={styles.verificationTakeWrapper}>
    <BreadcrumbWrapper>
      <Card style={{ paddingBottom: 24 }}>
        <Form
          name="basic"
          form={form}
          layout="inline"
          initialValues={{
            date: [moment().add(-1, 'months'), moment()],
            CheckStatus:routerType==2? 3 : undefined,
          }}
        >
          <Form.Item label="日期" name="date">
            <RangePicker_
              allowClear={false}
              dataType="day"
              format="YYYY-MM-DD"
              style={{ width: 250 }}
            />
          </Form.Item>
          <Spin spinning={!!entListLoading} size="small" style={{ background: '#fff' }}>
            <Form.Item label="企业" name="entCode">
              <EntAtmoList
                style={{ width: 200 }}
                onChange={value => {
                  if (!value) {
                    form.setFieldsValue({ dgimn: undefined });
                  } else {
                    form.setFieldsValue({ dgimn: undefined });
                    getPointList(value);
                  }
                }}
              />
            </Form.Item>
          </Spin>
          <Spin spinning={!!pointListLoading} size="small">
            <Form.Item label="监测点名称" name="dgimn">
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
          <Form.Item label="核查状态" name="CheckStatus" hidden={routerType == 2}>
            {routerType == 2 ?
               <Select>
               <Option key={3} value={3}>已完成</Option>
             </Select>
              :
              <Select placeholder='请选择' style={{ width: 100 }} allowClear>
              <Option key={1} value={1}>待核查</Option>
              <Option key={2} value={2}>待确认</Option>
            </Select>
             }
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                loading={queryLoading}
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
      </Card>

      <Card
        title={<span style={{ fontWeight: 'bold' }}>{`${routerType == 1 ? '待核查' : '已核查'}任务单`}</span>}
        style={{ marginTop: 12 }}
      >
        <SdlTable
          rowKey={(record, index) => `${record.ID}`}
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          loading={queryLoading}
          scroll={{ y: 'calc(100vh - 410px)' }}
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
  </div>
  );
};

export default connect(dvaPropsData)(Index);
