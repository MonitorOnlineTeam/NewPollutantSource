/*
 * @Author: jab
 * @Date: 2024-01-22
 * @Description：工作台
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Spin,
  Button,
  Space,
  Select,
  Badge,
  Tooltip,
  Row,
  TreeSelect,
  Tag,
  Pagination,
  Empty,
} from 'antd';
import styles from '../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import EntAtmoList from '@/components/EntAtmoList';
import { transformData } from '@/pages/AbnormalIdentifyModel/CONST.js';
import { router } from 'umi';
import { useHistory } from 'react-router-dom';
const textStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  queryLoading: loading.effects['AbnormalIdentifyModel/GetClueDatas'],
  pointListLoading: loading.effects['common/getPointByEntCode'],
  entListLoading: loading.effects['common/GetEntByRegion'],
  modelListLoading: loading.effects['AbnormalIdentifyModel/GetModelList'],
  generateVerificationTakeData: AbnormalIdentifyModel.generateVerificationTakeData,
  workTowerData: AbnormalIdentifyModel.workTowerData,
  queryPar: AbnormalIdentifyModel.workTowerQueryPar,
});

const WorkTower = props => {
  const [form] = Form.useForm();
  const {
    dispatch,
    queryLoading,
    pointListLoading,
    entListLoading,
    generateVerificationTakeData,
    workTowerData,
    workTowerData: { pageIndex, pageSize, type },
    queryPar,
    modelListLoading,
  } = props;
  const [pointList, setPointList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState();
  const [statisticsInfo, setStatisticsInfo] = useState('');
  const [modelList, setModelList] = useState([]);

  useEffect(() => {
    GetModelList();
    console.log(type, queryPar);
    if (type == 2) {
      //从生成核查任务返回
      let data = queryPar;
      form.setFieldsValue({
        entCode: data?.entCode,
        date: data.beginTime && data.endTime ? [moment(data.beginTime), moment(data.endTime)] : [],
      });
      if (data?.entCode) {
        getPointList(data?.entCode, () => {
          form.setFieldsValue({ dgimn: data?.dgimn });
          onFinish(pageIndex, pageSize);
        });
      } else {
        onFinish(pageIndex, pageSize);
      }
    } else {
      //首次进入
      onTableChange(1, 12);
    }
  }, []);

  const history = useHistory();
  useEffect(() => {
    const handleRouteChange = location => {
      // 在这里执行你需要在路由变化时执行的代码
      const path = location.pathname;
      const detailPath = '/AbnormalIdentifyModel/CluesList/ClueAnalysis/GenerateVerificationTake';
      const currentPath = '/AbnormalIdentifyModel/CluesList/ClueAnalysis/WorkTower';
      if (
        (path !== detailPath && path !== currentPath) ||
        (path === detailPath && !location.search)
      ) {
        dispatch({
          type: 'AbnormalIdentifyModel/updateState',
          payload: { workTowerData: { pageIndex: 1, pageSize: 12, type: 1 } },
        });
      }
    };

    // 添加路由变化监听器
    history.listen(handleRouteChange);
    // // 返回一个清理函数，用于在组件卸载时移除监听器
    // return () => {
    //   history.unlisten(handleRouteChange);
    // };
  }, [history]); // 将history作为依赖项传递给useEffect，以确保监听器只在路由变化时触发

  // 查询数据
  const onFinish = (pageIndex, pageSize) => {
    const values = form.getFieldsValue();
    props.dispatch({
      type: 'AbnormalIdentifyModel/GetClueDatas',
      payload: {
        ...values,
        beginTime:
          values.date && values.date[0] ? values.date[0].format('YYYY-MM-DD 00:00:00') : undefined,
        endTime:
          values.date && values.date[1] ? values.date[1].format('YYYY-MM-DD 23:59:59') : undefined,
        date: undefined,
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
      callback: res => {
        setDataSource(res.Datas.showWarnings);
        setTotal(res.Total);
        setStatisticsInfo(res.Datas.sumInfo);
      },
    });
  };

  // 获取数据模型列表
  const GetModelList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetModelList',
      payload: {
        type: 1, // 过滤掉打标记和数据现象
      },
      callback: (res, unfoldModelList) => {
        let modelList = transformData(res);
        setModelList(modelList);
      },
    });
  };

  // 分页
  const onTableChange = (current, pageSize) => {
    props.dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        workTowerData: {
          ...workTowerData,
          pageIndex: current,
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
        callback && callback();
      },
    });
  };

  const tProps = {
    treeData: modelList,
    treeCheckable: true,
    // showCheckedStrategy: SHOW_PARENT,
    maxTagCount: 3,
    maxTagTextLength: 5,
    maxTagPlaceholder: '...',
    placeholder: '请选择场景类别',
    style: {
      width: '400px',
    },
    treeDefaultExpandAll: true,
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.workTowerWrapper}>
        <Card
          style={{ paddingTop: 0 }}
          bodyStyle={{ background: '#edeff2' }}
          title={
            <Form
              name="basic"
              form={form}
              layout="inline"
              initialValues={{
                date: [moment().add(-1, 'months'), moment()],
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
              {/* <Spin spinning={!!entListLoading} size="small"> */}
              <Form.Item label="企业" name="entCode">
                <EntAtmoList
                  style={{ width: 200 }}
                  onChange={value => {
                    if (!value) {
                      form.setFieldsValue({ dgimn: undefined });
                      setPointList([]);
                    } else {
                      form.setFieldsValue({ dgimn: undefined });
                      getPointList(value);
                    }
                  }}
                  placeholder="请选择"
                />
              </Form.Item>
              {/* </Spin> */}
              <Spin spinning={!!pointListLoading} size="small">
                <Form.Item label="排口" name="dgimn">
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
              <Spin spinning={modelListLoading} size="small">
                <Form.Item label="场景类别" name="warningTypeCode">
                  <TreeSelect {...tProps} allowClear showSearch treeNodeFilterProp="label" />
                </Form.Item>
              </Spin>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    loading={queryLoading}
                    onClick={() => {
                      onTableChange(1, 12);
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      onTableChange(1, 12);
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          }
        >
          <Spin spinning={queryLoading}>
            <Card
              title={
                <div style={{ color: '#3988ff', fontWeight: 'bold' }}>
                  <InfoCircleOutlined style={{ marginRight: 10 }} />
                  {statisticsInfo}
                </div>
              }
              style={{ marginTop: 10 }}
              bodyStyle={{ background: '#fff' }}
              size="small"
              bordered={false}
            >
              {total && total > 0 ? (
                dataSource.map(item => (
                  <Card.Grid className={styles.cardGrid}>
                    <div
                      title={`${item.EntName} - ${item.PointName}`}
                      className="title"
                      style={textStyle}
                    >{`${item.EntName} - ${item.PointName}`}</div>
                    <div>
                      {item.WarningDatas.map(typeItem => (
                        <Tag
                          onClick={() => {
                            const data = {
                              beginTime: queryPar?.beginTime,
                              endTime: queryPar?.endTime,
                              entCode: item.EntCode,
                              dgimn: item.DGIMN,
                              operationUser: item.OperationUser,
                              warningCode: typeItem.WarningCode,
                            };
                            props.dispatch({
                              type: 'AbnormalIdentifyModel/updateState',
                              payload: {
                                generateVerificationTakeData: {
                                  ...generateVerificationTakeData,
                                  type: 1,
                                },
                              },
                            });
                            router.push(
                              `/AbnormalIdentifyModel/CluesList/ClueAnalysis/GenerateVerificationTake?data=${JSON.stringify(
                                data,
                              )}`,
                            );
                          }}
                          // color="default" style={{ marginTop: 4 }}>监测样品为<span>{typeItem.WarningName}</span>  <span style={{ paddingLeft: 6 }}>{typeItem.WarningCount}</span>个</Tag>)}
                          color="default"
                          style={{ marginTop: 4 }}
                        >
                          <span>{typeItem.WarningName}</span>{' '}
                          <span style={{ paddingLeft: 6 }}>{typeItem.WarningCount}</span>个
                        </Tag>
                      ))}
                    </div>
                  </Card.Grid>
                ))
              ) : (
                <Empty
                  style={{ width: '100%', height: 'calc(100vh - 260px)', textAlign: 'center' }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Spin>
        </Card>

        {total && total > 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'right',
              margin: '12px 0px',
              padding: '0 10px',
            }}
          >
            <Pagination
              showSizeChanger
              total={total}
              current={pageIndex}
              pageSize={pageSize}
              onChange={onTableChange}
              pageSizeOptions={['12']}
            />
          </div>
        ) : null}
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(WorkTower);
