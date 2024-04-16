/*
 * @Author: JiaQi
 * @Date: 2024-04-15 14:51:48
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-04-16 16:40:29
 * @Description:  安装调试达标率
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Space,
  Row,
  Col,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from '../index.less';
import moment from 'moment';
import YearDatePicker from '@/components/RangePicker/YearDatePicker';
import NumAndRateChart from './components/NumAndRateChart';
import TableCard from './components/TableCard';

const dvaPropsData = ({ loading, instStdAndCompReso }) => ({
  installPageData: instStdAndCompReso.installPageData,
  loading: loading.effects[`instStdAndCompReso/GetInstallationDebugRate`],
});

const Install = props => {
  const [date, setDate] = useState(moment());

  const {
    dispatch,
    installPageData: { LargeRegionAnalysis, CategoryAnalysis },
  } = props;

  useEffect(() => {
    getPageData();
  }, [date]);

  // 获取页面数据
  const getPageData = () => {
    dispatch({
      type: 'instStdAndCompReso/GetInstallationDebugRate',
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
            <Col span={8}>
              <NumAndRateChart
                title={`${date.format('YYYY年')}大区安装调试达标率`}
                data={LargeRegionAnalysis}
                fieldNames={{ title: 'LargeRegionName' }}
              />
            </Col>
            <Col span={16}>
              <NumAndRateChart
                title={`${date.format('YYYY年')}产品类别安装调试达标率`}
                data={CategoryAnalysis}
                fieldNames={{ title: 'CategoryName' }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <TableCard
                title={`${date.format('YYYY年')}安装调试达标率`}
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

export default connect(dvaPropsData)(Install);
