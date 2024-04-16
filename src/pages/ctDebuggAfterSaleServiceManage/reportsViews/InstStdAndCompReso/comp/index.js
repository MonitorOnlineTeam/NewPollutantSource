/*
 * @Author: JiaQi
 * @Date: 2024-04-15 14:51:48
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-04-16 09:50:12
 * @Description:  投诉解决率
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Row,
  Col,
  message,
  Divider,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from '../index.less';
import moment from 'moment';
import YearDatePicker from '@/components/RangePicker/YearDatePicker';
import NumAndRateChart from './components/NumAndRateChart';
import TableCard from './components/TableCard'
 
const dvaPropsData = ({ loading, instStdAndCompReso }) => ({
  compPageData: instStdAndCompReso.compPageData,
  loading: loading.effects[`instStdAndCompReso/GetComplaintResolutionRate`],
});

const Comp = props => {
  const [date, setDate] = useState(moment());

  const {
    dispatch,
    compPageData: { LargeRegionAnalysis },
  } = props;

  useEffect(() => {
    getPageData();
  }, [date]);

  // 获取页面数据
  const getPageData = () => {
    dispatch({
      type: 'instStdAndCompReso/GetComplaintResolutionRate',
      payload: {
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  const onDateChange = (date, dateString) => {
    setDate(date);
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.pageWrapper}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10 }} style={{ marginBottom: 0 }}>
            年份：
            <YearDatePicker value={date} onChange={onDateChange} allowClear={false} />
          </Card>
          <Row gutter={8}>
            <Col span={24}>
              <NumAndRateChart
                title={`${date.format('YYYY年')}大区投诉解决率`}
                data={LargeRegionAnalysis}
                fieldNames={{ title: 'LargeRegionName' }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <TableCard
                title={`${date.format('YYYY年')}投诉解决率`}
                date={date}
                match={props.match}
                location={props.location}
              />
            </Col>
          </Row>
        </Space>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Comp);
