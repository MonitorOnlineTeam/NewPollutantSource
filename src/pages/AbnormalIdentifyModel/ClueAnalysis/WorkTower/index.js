/*
 * @Author: jab
 * @Date: 2024-01-22 
 * @Description：工作台
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select, Badge, Tooltip, Row, Col, Tag, Pagination, Empty } from 'antd';
import styles from '../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import { DetailIcon } from '@/utils/icon';
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
  } = props;
  const [pointList, setPointList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState();

  useEffect(() => {
    if (type == 2) {  //从生成核查任务返回
      onFinish(pageIndex, pageSize);
    } else {//首次进入
      onTableChange(1, 12)
    }
  }, []);


  const history = useHistory();  
  useEffect(() => {  
    const handleRouteChange = (location) => {  
      // 在这里执行你需要在路由变化时执行的代码  
      const path = location.pathname
      const detailPath = '/AbnormalIdentifyModel/CluesList/ClueAnalysis/GenerateVerificationTake'
      const currentPath = '/AbnormalIdentifyModel/ClueAnalysis/WorkTower'
      if((path !== detailPath && path !== currentPath) || (path === detailPath && !location.search)){
        dispatch({
          type: 'AbnormalIdentifyModel/updateState',
          payload: { workTowerData: {pageIndex:1,pageSize:12, type: 1} },
        })
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
        beginTime: values.date ? values.date[0].format('YYYY-MM-DD 00:00:00') : undefined,
        endTime: values.date ? values.date[1].format('YYYY-MM-DD 23:59:59') : undefined,
        date: undefined,
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTotal(res.Total);
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
  const getPointList = EntCode => {
    dispatch({
      type: 'common/getPointByEntCode',
      payload: {
        EntCode,
      },
      callback: res => {
        setPointList(res);
      },
    });
  };
  return (
    <div className={styles.workTowerWrapper}>
      <BreadcrumbWrapper>
        <Card title={
          <Form
            name="basic"
            form={form}
            layout="inline"
            style={{ padding: '10px 0' }}
            initialValues={{
              date: [moment().add(-1, 'months'), moment()]
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
            <Spin spinning={!!entListLoading} size="small" >
              <Form.Item label="企业" name="entCode">
                <EntAtmoList
                  style={{ width: 200 }}
                  onChange={value => {
                    if (!value) {
                      form.setFieldsValue({ DGIMN: undefined });
                      setPointList([])
                    } else {
                      form.setFieldsValue({ DGIMN: undefined });
                      getPointList(value);
                    }
                  }}
                  placeholder='请选择'
                />
              </Form.Item>
            </Spin>
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
                  }
                  }

                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        }>
          <Spin spinning={queryLoading} >
            <Row>
              {total && total > 0 ? dataSource.map(item =>
                <Col span={8}>
                  <div title={`${item.EntName} - ${item.PointName}`} className='title' style={textStyle}>{`${item.EntName} - ${item.PointName}`}</div>
                  <div>
                    {item.WarningDatas.map(typeItem => <Tag
                      onClick={() => {
                        const data = {beginTime:queryPar?.beginTime,endTime:queryPar?.endTime, entCode: item.EntCode, dgimn: item.DGIMN, warningCode: typeItem.WarningCode }
                        props.dispatch({
                          type: 'AbnormalIdentifyModel/updateState',
                          payload: { generateVerificationTakeData: { ...generateVerificationTakeData, type: 1 } },
                        });
                        router.push(`/AbnormalIdentifyModel/CluesList/ClueAnalysis/GenerateVerificationTake?data=${JSON.stringify(data)}`);
                      }}
                      color="default" style={{ marginTop: 4 }}>监测样品为<span>{typeItem.WarningName}</span>  <span style={{ paddingLeft: 6 }}>{typeItem.WarningCount}</span>个</Tag>)}
                  </div>
                </Col>)
                :
                <Empty style={{ width: '100%', height: 'calc(100vh - 260px)', textAlign: 'center' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </Row>
          </Spin>
        </Card>
      </BreadcrumbWrapper>
      {total && total > 0 ? <div style={{ textAlign: 'right', marginTop: 12 }}>
        <Pagination
          showSizeChanger
          total={total}
          current={pageIndex}
          pageSize={pageSize}
          onChange={onTableChange}
          pageSizeOptions={['12']}
        />
      </div> : null}
    </div>
  );
};

export default connect(dvaPropsData)(WorkTower);
