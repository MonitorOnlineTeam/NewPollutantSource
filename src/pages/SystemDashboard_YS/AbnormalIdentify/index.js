import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import MapContent from './components/Center/MapContent';
import OverviewCard from './components/Left/OverviewCard_1';
import LevelCard from './components/Left/LevelCard_2';
import TypeCard from './components/Left/TypeCard_3';
import BehaviorAnalysis from './components/Right/BehaviorAnalysis_1';
import AnomalyRate from './components/Right/AnomalyRate_2';
import EmphasisEnt from './components/Right/EmphasisEnt_3';
import AlarmOver from './components/Right/AlarmOver_1';
import QCATypeCard from './components/Left/QCATypeCard';
import SystemDashboardPageWrapper from '@/pages/SystemDashboard/components/SystemDashboardPageWrapper.js';

const dvaPropsData = ({ loading, sysDashboard }) => ({
  timeLabel: sysDashboard.timeLabel,
});

const HomeDataScreen = props => {
  const [fullScreen, setFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isGroupEnt = props.location.query.isGroupEnt;

  useEffect(() => {
    // 处理集团项目
    if (isGroupEnt) {
      window.configInfo.isGroupEnt = true;
      window.configInfo.isShowRegion = false;
    } else {
      window.configInfo.isGroupEnt = false;
      window.configInfo.isShowRegion = true;
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <SystemDashboardPageWrapper pageName={'异常识别监管'}>
      <Col
        style={{ width: '27%', display: fullScreen ? 'none' : 'flex' }}
        className={styles.leftWrapper}
      >
        {/* 总览 */}
        <OverviewCard />
        {/* 分级 */}
        {/* <LevelCard /> */}
        {/* 分类 */}
        <TypeCard />
        <QCATypeCard />
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
        <AlarmOver />
        {/* 异常行为分析 */}
        {/* <BehaviorAnalysis /> */}
        {/* 疑似异常率分析 */}
        <AnomalyRate />
        {/* 重点关注企业 */}
        <EmphasisEnt />
      </Col>
    </SystemDashboardPageWrapper>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
