import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
import ReactEcharts from 'echarts-for-react';

let myChart;
const dvaPropsData = ({ loading, common }) => ({
  loading: loading.effects['ctDataScreen/GetInstallationDebuggingAnalysis'],
});

const EquipUptimeRate = props => {
  const { dispatch,  loading } = props;

  useEffect(() => {}, []);

  return (
    <HomeCard
      style={{ minHeight: 320 }}
      title="设备运行完好率"
      timeTypes={['上月', '本年']}
      bodyStyle={{}}
    >
      <div className={styles.EquipUptimeRateWrapper}>
        <Row style={{ width: '100%' }}>
          <Col span={12}>
            <div className={styles.rate}>
              <span>-</span>
            </div>
            <p className={styles.echartsTitle} style={{ marginTop: -6 }}>
              设备完好率
            </p>
          </Col>
          <Col span={12}>
            <div
              className={styles.rate}
              style={{ backgroundImage: 'url(/ctHomeDataScreen/breakdown.png)' }}
            >
              <span style={{ color: '#FFC425' }}>-</span>
            </div>
            <p className={styles.echartsTitle} style={{ marginTop: -6 }}>
              设备故障率
            </p>
          </Col>
        </Row>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(EquipUptimeRate);
