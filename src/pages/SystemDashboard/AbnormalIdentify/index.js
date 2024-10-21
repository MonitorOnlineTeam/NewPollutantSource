import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import styles from '../styles.less';
import MapContent from './components/Center/MapContent';
import OverviewCard from './components/Left/OverviewCard_1';
import LevelCard from './components/Left/LevelCard_2';
import TypeCard from './components/Left/TypeCard_3';
import BehaviorAnalysis from './components/Right/BehaviorAnalysis_1';
import AnomalyRate from './components/Right/AnomalyRate_2';
import EmphasisEnt from './components/Right/EmphasisEnt_3';
import SystemDashboardPageWrapper from '@/pages/SystemDashboard/components/SystemDashboardPageWrapper.js';

const dvaPropsData = ({ loading, sysDashboard }) => ({
  timeLabel: sysDashboard.timeLabel,
});

const HomeDataScreen = props => {
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {}, []);

  return (
    <SystemDashboardPageWrapper pageName="异常数据识别">
      <Col
        style={{ width: '27%', display: fullScreen ? 'none' : 'flex' }}
        className={styles.leftWrapper}
      >
        {/* 总览 */}
        <OverviewCard />
        {/* 分级 */}
        <LevelCard />
        {/* 分类 */}
        <TypeCard />
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
        {/* 异常行为分析 */}
        <BehaviorAnalysis />
        {/* 疑似异常率分析 */}
        <AnomalyRate />
        {/* 重点关注企业 */}
        <EmphasisEnt />
      </Col>
    </SystemDashboardPageWrapper>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
