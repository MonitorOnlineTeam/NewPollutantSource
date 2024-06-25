import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import styles from '../styles.less';
import SystemDashboardPageWrapper from '@/pages/SystemDashboard/components/SystemDashboardPageWrapper.js';
import MapContent from './components/Center/MapContent';
import OverviewCard from './components/Left/OverviewCard_1';
import ConnectionRate from './components/Left/ConnectionRate_2';
import Calibration from './components/Left/Calibration_3';
import ResponseAnalysis from './components/Right/ResponseAnalysis_1';
import ReplacementAnalysis from './components/Right/ReplacementAnalysis_2';
import DeviceDiagnostics from './components/Right/DeviceDiagnostics_3';

const dvaPropsData = ({ loading, sysDashboard }) => ({});

const HomeDataScreen = props => {
  return (
    <SystemDashboardPageWrapper pageName="监控预警">
      <Col style={{ width: '27%', minWidth: 400 }} className={styles.leftWrapper}>
        <OverviewCard />
        <ConnectionRate />
        <Calibration />
      </Col>
      <Col style={{ maxWidth: '46%' }} flex={'auto'} className={styles.centerWrapper}>
        {/* 地图 */}
        <MapContent />
      </Col>
      <Col style={{ width: '27%', minWidth: 400 }} className={styles.rightWrapper}>
        {/* <ResponseAnalysis />
        <ReplacementAnalysis />
        <DeviceDiagnostics /> */}
      </Col>
    </SystemDashboardPageWrapper>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
