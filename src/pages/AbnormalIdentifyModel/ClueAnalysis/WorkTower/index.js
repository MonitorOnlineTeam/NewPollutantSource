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
import RegionList from '@/components/RegionList';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
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
  workTowerForm: AbnormalIdentifyModel.workTowerForm,
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
    workTowerForm,
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
        warningTypeCode: values.warningTypeCode.toString(),
        beginTime:
          values.date && values.date[0] ? values.date[0].format('YYYY-MM-DD 00:00:00') : undefined,
        endTime:
          values.date && values.date[1] ? values.date[1].format('YYYY-MM-DD 23:59:59') : undefined,
        date: undefined,
        pageIndex: pageIndex,
        pageSize: pageSize,
        IsReal: 1, // 只查询实时数据
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
              name="searchForm"
              // name="basic"
              form={form}
              layout="inline"
              initialValues={{
                ...workTowerForm,
              }}
              onValuesChange={(changedFields, allFields) => {
                let entCode = allFields.entCode;
                let dgimn = allFields.dgimn;

                // 行政区联动企业
                if (changedFields.hasOwnProperty('RegionCode')) {
                  form.setFieldsValue({ entCode: undefined, dgimn: undefined });
                  entCode = undefined;
                  dgimn = undefined;
                  setPointList([]);
                }

                // 企业联动排口
                if (changedFields.hasOwnProperty('entCode')) {
                  if (!changedFields.entCode) {
                    form.setFieldsValue({ dgimn: undefined });
                    setPointList([]);
                    dgimn = undefined;
                  } else {
                    form.setFieldsValue({ dgimn: undefined });
                    getPointList(changedFields.entCode);
                  }
                }

                dispatch({
                  type: 'AbnormalIdentifyModel/updateState',
                  payload: {
                    workTowerForm: {
                      ...workTowerForm,
                      ...changedFields,
                      entCode,
                      dgimn,
                    },
                  },
                });
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
              <Form.Item label="行业" name="IndustryType">
                <SearchSelect
                  placeholder="排口所属行业"
                  style={{ width: 130 }}
                  configId={'IndustryType'}
                  itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
                  itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
                />
              </Form.Item>
              <Form.Item label="行政区" name="RegionCode">
                <RegionList
                  noFilter
                  style={{ width: 140 }}
                  // onChange={value => {
                  //   // form.setFieldsValue({ entCode: undefined, dgimn: undefined });
                  // }}
                />
              </Form.Item>
              {/* <Spin spinning={!!entListLoading} size="small"> */}
              <Form.Item label="企业" name="entCode">
                <EntAtmoList
                  regionCode={form.getFieldValue('RegionCode')}
                  style={{ width: 200 }}
                  // onChange={value => {
                  //   if (!value) {
                  //     form.setFieldsValue({ dgimn: undefined });
                  //     setPointList([]);
                  //   } else {
                  //     form.setFieldsValue({ dgimn: undefined });
                  //     getPointList(value);
                  //   }
                  // }}
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
                      // form.resetFields();
                      dispatch({
                        type: 'AbnormalIdentifyModel/onResetWorkTowerForm',
                        payload: {},
                      }).then(() => {
                        form.resetFields();
                        onTableChange(1, 12);
                      });
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
