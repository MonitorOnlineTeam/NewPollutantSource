import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';

let myChart;
const dvaPropsData = ({ loading }) => ({});

const ProjectExecution = props => {
  // const runChart = useRef();
  // const overChart = useRef();
  // let runChart, overChart;

  useEffect(() => {}, []);

  return (
    <HomeCard style={{ minHeight: 260 }} title="项目执行情况" bodyStyle={{}}>
      <p style={{ textAlign: 'right', lineHeight: '36px', fontFamily: 500 }}>单位：套</p>
      <Row className={`${styles.ProjectExecutionWrapper}`}>
        <Col span={8}>
          <div className={styles.number}>5</div>
          <p>安装调试</p>
        </Col>
        <Col span={8}>
          <div className={styles.number}>15</div>
          <p>72小时调试</p>
        </Col>
        <Col span={8}>
          <div className={styles.number}>10</div>
          <p>待验收</p>
        </Col>
      </Row>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ProjectExecution);
