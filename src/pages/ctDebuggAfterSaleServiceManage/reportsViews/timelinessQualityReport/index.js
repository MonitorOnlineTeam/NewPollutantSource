/*
 * @Author: JiaQi
 * @Date: 2024-05-06 14:26:53
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-21 10:46:00
 * @Description:  报告及时合格率
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Space, Row, Col, Radio } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/timelyRate/index.less';
import moment from 'moment';
import YearDatePicker from '@/components/RangePicker/YearDatePicker';
import RateChart from './components/RateChart';
import TableCard from './components/TableCard';
import UserStatistics from './components/UserStatistics';

const dvaPropsData = ({ loading, timelyRate }) => ({});

const TimelinessQualityReport = props => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(moment());
  const [type, setType] = useState(1);
  const [pageData, setPageData] = useState({
    columnList: [],
    tableList: [],
    rateData: [],
  });

  const { dispatch, hideBreadcrumb, modalWrapClassName } = props;

  useEffect(() => {
    getLargeRegionData();
  }, [date]);

  // 按大区统计
  const getLargeRegionData = () => {
    setLoading(true);
    dispatch({
      type: 'reportsAndViews/GetTimelyPassRateListByArea',
      payload: {
        year: date.format('YYYY'),
        level: '1',
      },
      callback: response => {
        if (response.IsSuccess) {
          let res = response.Datas;
          let columnList = [],
            rateData = [];
          let tableList = res.map((item, index) => {
            let dataItem = {
              LargeRegion: item.LargeRegion,
              LargeRegionCode: item.LargeRegionCode,
            };
            for (const key in item) {
              dataItem[key + 'ReportQualifiedRate'] = item[key]['ReportQualifiedRate'];
              dataItem[key + 'ReportTimelyQualifiedRate'] = item[key]['ReportTimelyQualifiedRate'];
              dataItem[key + 'ReportTimelyRate'] = item[key]['ReportTimelyRate'];
              if (key.indexOf('Month') > -1 && index === 0) {
                let month = key.split('_')[1];
                columnList.push({
                  key: key,
                  name: month + '月',
                });
              }

              if (key === 'Year') {
                rateData.push({
                  largeRegionName: item.LargeRegion,
                  ...item[key],
                });
              }
            }
            return dataItem;
          });

          setPageData({
            columnList,
            tableList,
            rateData,
          });
        }
        setLoading(false);
      },
    });
  };

  const onDateChange = (date, dateString) => {
    setDate(date);
  };

  const onTypeChange = e => {
    setType(e.target.value);
    if (e.target.value === 1) {
      getLargeRegionData();
    }
  };
  return (
    <BreadcrumbWrapper hideBreadcrumb={hideBreadcrumb}>
      <div className={styles.pageWrapper} style={{ height: 'auto' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10 }} style={{ marginBottom: 0 }}>
            <Space>
              {type === 1 && (
                <span>
                  年份：
                  <YearDatePicker value={date} onChange={onDateChange} allowClear={false} />
                </span>
              )}
              <Radio.Group onChange={onTypeChange} defaultValue={1}>
                <Radio.Button value={1}>按大区统计</Radio.Button>
                <Radio.Button value={2}>按人员统计</Radio.Button>
              </Radio.Group>
            </Space>
          </Card>
          {type === 1 ? (
            <>
              <Row gutter={8}>
                <Col span={24}>
                  <RateChart
                    // title={`${date.format('YYYY年')}大区服务响应及时率`}
                    date={date}
                    data={pageData.rateData}
                    loading={loading}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <TableCard
                    date={date}
                    data={pageData}
                    loading={loading}
                    modalWrapClassName={modalWrapClassName}
                  />
                </Col>
              </Row>
            </>
          ) : (
            // 按人员统计
            <UserStatistics  modalWrapClassName={modalWrapClassName}/>
          )}
        </Space>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(TimelinessQualityReport);
