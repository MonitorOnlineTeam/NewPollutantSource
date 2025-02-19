import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import styles from '../styles.less';
import MapContent from './components/Center/MapContent';
import OverviewCard from './components/Left/OverviewCard_1';
import LevelCard from './components/Left/LevelCard_2';
import TypeCard from './components/Left/TypeCard_3';
import SystemDashboardPageWrapper from '@/pages/SystemDashboard/components/SystemDashboardPageWrapper.js';

const dvaPropsData = ({ loading, sysDashboard }) => ({
  timeLabel: sysDashboard.timeLabel,
});

const HomeDataScreen = props => {
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {}, []);

  return (
    <SystemDashboardPageWrapper pageName="动态质控">
      <Col
        style={{ width: '27%', display: fullScreen ? 'none' : 'flex' }}
        className={styles.leftWrapper}
      >
        {/* 总览 */}
        <OverviewCard />
        {/* 核查任务分析 */}
        <LevelCard />
        {/* 合格率分析 */}
        <TypeCard />
      </Col>
      <Col style={{ maxWidth: '73%' }} flex={'auto'} className={styles.centerWrapper}>
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
