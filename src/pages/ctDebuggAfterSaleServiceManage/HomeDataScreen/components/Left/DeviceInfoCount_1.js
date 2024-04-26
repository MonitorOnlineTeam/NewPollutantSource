import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';

let myChart;
const dvaPropsData = ({ loading }) => ({});

const DeviceInfoCount = props => {
  // const runChart = useRef();
  // const overChart = useRef();
  // let runChart, overChart;
  const { dispatch, requestParams, DataEfficiencyRate, OverRate, loading } = props;

  useEffect(() => {}, []);

  return (
    <HomeCard
      style={{ minHeight: 200, flex: '0 1 200px' }}
      title="设备信息总览"
      showExtra={false}
      bodyStyle={
        {
          // height: 'calc(100% - 110px)',
          // padding: '10px',
          // overflowY: 'auto',
        }
      }
    >
      <Row className={`${styles.DeviceInfoCountWrapper}`}>
        <Col span={12} className={styles.center}>
          <img src="/ctHomeDataScreen/ent_big.png" />
          <div>
            <p className={styles.text}>企业数量</p>
            <p className={styles.number}>100个</p>
          </div>
        </Col>
        <Col span={12} className={styles.center}>
          <img src="/ctHomeDataScreen/gas_big.png" />
          <div>
            <p className={styles.text}>废气点位数量</p>
            <p className={styles.number}>100个</p>
          </div>
        </Col>
      </Row>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
