/*
 * @Author: JiaQi
 * @Date: 2024-04-15 14:51:48
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-21 14:46:04
 * @Description:  安装调试达标率
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Space, Row, Col } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from '../index.less';
import moment from 'moment';
import YearDatePicker from '@/components/RangePicker/YearDatePicker';
import NumAndRateChart from './components/NumAndRateChart';
import TableCard from './components/TableCard';

const dvaPropsData = ({ loading, reportsAndViews }) => ({
  installPageData: reportsAndViews.installPageData,
  loading: loading.effects[`reportsAndViews/GetInstallationDebugRate`],
});

const Install = props => {
  const [date, setDate] = useState(moment());

  const {
    dispatch,
    installPageData: { LargeRegionAnalysis, CategoryAnalysis },
    hideBreadcrumb,
    modalWrapClassName,
  } = props;

  useEffect(() => {
    getPageData();
  }, [date]);

  // 获取页面数据
  const getPageData = () => {
    dispatch({
      type: 'reportsAndViews/GetInstallationDebugRate',
      payload: {
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  const onDateChange = (date, dateString) => {
    setDate(date);
  };

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
  
    useEffect(() => {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  // const maxWidth = 1900
  // const minWidth = 1652
  const maxWidth = 2100
  const minWidth = 1950
  return (
    <BreadcrumbWrapper hideBreadcrumb={hideBreadcrumb}>
      <div className={styles.pageWrapper}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10 }} style={{ marginBottom: 0 }}>
            年份：
            <YearDatePicker value={date} onChange={onDateChange} allowClear={false} />
          </Card>
          <Row gutter={8}>
            <Col  span={windowWidth>=maxWidth? 8 : windowWidth>=minWidth? 6 : 24}>
              <NumAndRateChart
                type={1}
                title={`${date.format('YYYY年')}大区安装调试达标率`}
                data={LargeRegionAnalysis}
                fieldNames={{ title: 'LargeRegionName' }}
                windowWidth={windowWidth}
                minWidth={minWidth}
              />
            </Col>
            <Col style={{paddingTop:windowWidth>=minWidth? 0 : 8}} span={windowWidth>=maxWidth? 16 : windowWidth>=minWidth? 18 : 24}>
              <NumAndRateChart
                type={2}
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
                modalWrapClassName={modalWrapClassName}
              />
            </Col>
          </Row>
        </Space>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Install);
