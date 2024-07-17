import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import styles from '../styles.less';
import SystemDashboardPageWrapper from '@/pages/SystemDashboard/components/SystemDashboardPageWrapper.js';
import MapContent from './components/Center/MapContent';
import Overview from './components/Left/Overview';
import KeyAnalysis from './components/Left/Analysis_1';
import ComplianceAnalysis from './components/Left/Analysis_2';
import PassRateAnalysis from './components/Left/Analysis_3';

const dvaPropsData = ({ loading, sysDashboard }) => ({});

const homeCardMinHight = 226;
const HomeDataScreen = props => {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <SystemDashboardPageWrapper pageName="监督核查">
      <Col
        className={styles.leftWrapper}
        style={{ width: 486, display: fullScreen ? 'none' : 'flex' }}
      >
        <Overview homeCardMinHight={homeCardMinHight} />
        <KeyAnalysis homeCardMinHight={homeCardMinHight} />
        <ComplianceAnalysis homeCardMinHight={homeCardMinHight} />
        <PassRateAnalysis homeCardMinHight={homeCardMinHight} />
      </Col>
      <Col style={{ width: 'calc(100% - 486px)' }} flex={'auto'} className={styles.centerWrapper}>
        {/* 地图 */}
        <MapContent
          onFullScreenChange={value => {
            setFullScreen(value);
          }}
        />
      </Col>
    </SystemDashboardPageWrapper>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
