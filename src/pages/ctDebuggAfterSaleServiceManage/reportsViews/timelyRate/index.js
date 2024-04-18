import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Space, Row, Col, Radio } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from './index.less';
import moment from 'moment';
import YearDatePicker from '@/components/RangePicker/YearDatePicker';
import NumAndRateChart from './components/NumAndRateChart';
import TableCard from './components/TableCard';
import UserStatistics from './components/UserStatistics';

const dvaPropsData = ({ loading, timelyRate }) => ({
  timelyRateList: timelyRate.timelyRateList,
});

const Comp = props => {
  const [date, setDate] = useState(moment());
  const [type, setType] = useState(1);

  const {
    dispatch,
    timelyRateList: { largeRegionAnalysis },
  } = props;

  useEffect(() => {
    GetTimelyRateList();
  }, [date]);

  // 按大区统计
  const GetTimelyRateList = () => {
    dispatch({
      type: 'timelyRate/GetTimelyRateList',
      payload: {
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  const onDateChange = (date, dateString) => {
    setDate(date);
  };

  const onTypeChange = e => {
    setType(e.target.value);
    if (e.target.value === 1) {
      GetTimelyRateList();
    }
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.pageWrapper}>
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
                  <NumAndRateChart
                    title={`${date.format('YYYY年')}大区服务响应及时率`}
                    data={largeRegionAnalysis}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <TableCard title={`${date.format('YYYY年')}服务响应及时率`} date={date} />
                </Col>
              </Row>
            </>
          ) : (
            // 按人员统计
            <UserStatistics date={largeRegionAnalysis} />
          )}
        </Space>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Comp);
