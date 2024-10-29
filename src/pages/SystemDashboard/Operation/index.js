import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import styles from '../styles.less';
import SystemDashboardPageWrapper from '@/pages/SystemDashboard/components/SystemDashboardPageWrapper.js';
import MapContent from './components/Center/MapContent';
import DeviceInfoCount from './components/Left/DeviceInfoCount_1';
import Inspection from './components/Left/Inspection_2';
import Calibration from './components/Left/Calibration_3';
import ResponseAnalysis from './components/Right/ResponseAnalysis_1';
import ReplacementAnalysis from './components/Right/ReplacementAnalysis_2';
import DeviceDiagnostics from './components/Right/DeviceDiagnostics_3';

const dvaPropsData = ({ loading, sysDashboard }) => ({});

const HomeDataScreen = props => {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <SystemDashboardPageWrapper pageName="智慧运维">
      <Col
        style={{ width: '27%', display: fullScreen ? 'none' : 'flex' }}
        className={styles.leftWrapper}
      >
        <DeviceInfoCount />
        <Inspection />
        <Calibration />
      </Col>
      <Col style={{ maxWidth: '46%' }} flex={'auto'} className={styles.centerWrapper}>
        {/* 地图 */}
        <MapContent
          onFullScreenChange={value => {
            setFullScreen(value);
          }}
        />
      </Col>
      <Col
        style={{ width: '27%', display: fullScreen ? 'none' : 'flex' }}
        className={styles.rightWrapper}
      >
        <ResponseAnalysis />
        <ReplacementAnalysis />
        <DeviceDiagnostics />
      </Col>
    </SystemDashboardPageWrapper>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
