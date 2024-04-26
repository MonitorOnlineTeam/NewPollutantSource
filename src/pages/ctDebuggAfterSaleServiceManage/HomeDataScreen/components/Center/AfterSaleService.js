import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
import ReactSeamlessScroll from 'rc-seamless-scroll';

let dataList = [
  {
    name: '设备类型',
    count: 10,
    countRate: '32%',
    hour: 120,
    hourRate: '12%',
  },
  {
    name: '设备类型',
    count: 10,
    countRate: '32%',
    hour: 120,
    hourRate: '12%',
  },
  {
    name: '设备类型',
    count: 10,
    countRate: '32%',
    hour: 120,
    hourRate: '12%',
  },
  {
    name: '设备类型',
    count: 10,
    countRate: '32%',
    hour: 120,
    hourRate: '12%',
  },
  {
    name: '设备类型',
    count: 10,
    countRate: '32%',
    hour: 120,
    hourRate: '12%',
  },
  {
    name: '设备类型',
    count: 10,
    countRate: '32%',
    hour: 120,
    hourRate: '12%',
  },
  {
    name: '设备类型',
    count: 10,
    countRate: '32%',
    hour: 120,
    hourRate: '12%',
  },
  {
    name: '设备类型',
    count: 10,
    countRate: '32%',
    hour: 120,
    hourRate: '12%',
  },
  {
    name: '设备类型',
    count: 10,
    countRate: '32%',
    hour: 120,
    hourRate: '12%',
  },
];
const dvaPropsData = ({ loading }) => ({});

const AfterSaleService = props => {
  // const runChart = useRef();
  // const overChart = useRef();
  // let runChart, overChart;
  const [echarts, setEcharts] = useState();

  useEffect(() => {}, []);

  return (
    <HomeCard
      style={{ flex: 1, minHeight: 320 }}
      title="售后服务情况"
      bodyStyle={{
        height: 'calc(100% - 41px)',
        // padding: '10px',
        // overflowY: 'auto',
      }}
    >
      <Row className={styles.AfterSaleServiceWrapper}>
        <Col span={12} style={{ height: '100%' }}>
          <div className={styles.title}>质保内服务产品类别</div>
          <div className={styles.listWrapper}>
            <Row className={styles.header}>
              <Col flex={2}>设备类别</Col>
              <Col flex={1}>次数</Col>
              <Col flex={1}>占比</Col>
              <Col flex={1}>工时</Col>
              <Col flex={1}>占比</Col>
            </Row>

            <div className={styles.listContent}>
              <ReactSeamlessScroll
                list={dataList}
                style={{ width: '100%', height: '100%' }}
                wrapperClassName={styles.RankingSeamlessScrollContent}
                hover={true}
                step={0.3}
                limitScrollNum={6}
              >
                {dataList.map(item => {
                  return (
                    <Row className={styles.listItem}>
                      <Col flex={2}>设备类别</Col>
                      <Col flex={1}>10</Col>
                      <Col flex={1}>32%</Col>
                      <Col flex={1}>120</Col>
                      <Col flex={1}>12%</Col>
                    </Row>
                  );
                })}
              </ReactSeamlessScroll>
            </div>
          </div>
        </Col>
        <Col span={12} style={{ height: '100%' }}>
          <div className={styles.title}>质保内服务原因</div>
          <div className={styles.listWrapper}>
            <Row className={styles.header}>
              <Col flex={2}>服务原因</Col>
              <Col flex={1}>次数</Col>
              <Col flex={1}>占比</Col>
              <Col flex={1}>工时</Col>
              <Col flex={1}>占比</Col>
            </Row>

            <div className={styles.listContent}>
              <ReactSeamlessScroll
                list={dataList}
                style={{ width: '100%', height: '100%' }}
                wrapperClassName={styles.RankingSeamlessScrollContent}
                hover={true}
                step={0.3}
                limitScrollNum={6}
              >
                {dataList.map(item => {
                  return (
                    <Row className={styles.listItem}>
                      <Col flex={2}>服务原因</Col>
                      <Col flex={1}>10</Col>
                      <Col flex={1}>32%</Col>
                      <Col flex={1}>120</Col>
                      <Col flex={1}>12%</Col>
                    </Row>
                  );
                })}
              </ReactSeamlessScroll>
            </div>
          </div>
        </Col>
      </Row>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(AfterSaleService);
