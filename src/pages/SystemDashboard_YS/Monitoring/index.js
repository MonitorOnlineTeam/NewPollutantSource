import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import styles from '../styles.less';
import SystemDashboardPageWrapper from '@/pages/SystemDashboard_YS/components/SystemDashboardPageWrapper.js';
import MapContent from './components/Center/MapContent';
import OverviewCard from './components/Left/OverviewCard_1';
import ConnectionRate from './components/Left/ConnectionRate_2';
import Emissions from './components/Left/Emissions_3';
import AlarmOver from './components/Right/AlarmOver_1';
import EffectiveRate from './components/Right/EffectiveRate_2';
import AbnormalAlarm from './components/Right/AbnormalAlarm_3';

const dvaPropsData = ({ loading, sysDashboard }) => ({});

const HomeDataScreen = props => {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <SystemDashboardPageWrapper pageName="智慧运维监管平台">
      <Col
        style={{ width: '27%',  display: fullScreen ? 'none' : 'flex' }}
        className={`${styles.leftWrapper} ${fullScreen ? styles['fade-out'] : styles['fade-in']}`}
      >
        <OverviewCard />
        {/* <ConnectionRate />   */}
        <Emissions />
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
        className={`${styles.rightWrapper} ${fullScreen ? styles['fade-out'] : styles['fade-in']}`}
      >
        <AlarmOver />
        {/* <EffectiveRate /> */}
        <AbnormalAlarm />
      </Col>
    </SystemDashboardPageWrapper>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
