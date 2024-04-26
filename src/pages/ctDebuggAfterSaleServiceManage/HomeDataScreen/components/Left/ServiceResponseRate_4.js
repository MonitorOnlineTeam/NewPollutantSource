import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';

let myChart;
const dvaPropsData = ({ loading }) => ({});

const ServiceResponseRate = props => {
  useEffect(() => {}, []);

  return (
    <HomeCard
      style={{ minHeight: 250 }}
      title="服务响应及时率"
      bodyStyle={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className={styles.ServiceResponseRateWrapper}>
        <div className={styles.center} style={{ width: 100, height: 84 }}>
          <p className={styles.count}>
            10<span>次</span>
          </p>
          <p className={styles.text}>响应次数</p>
        </div>
        <div style={{ width: 30, height: 25, position: 'relative', top: -108 }}></div>
        <div
          className={styles.center}
          style={{
            width: 160,
            height: 134,
            backgroundImage: 'url(/ctHomeDataScreen/ServiceResponseRate_1.png)',
          }}
        >
          <p className={styles.count}>60%</p>
          <p className={styles.text}>响应及时率</p>
        </div>
        <div style={{ width: 30, height: 25, position: 'relative', top: -124 }}></div>
        <div className={styles.center} style={{ width: 100, height: 84 }}>
          <p className={styles.count}>
            6<span>次</span>
          </p>
          <p className={styles.text}>及时次数</p>
        </div>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ServiceResponseRate);
