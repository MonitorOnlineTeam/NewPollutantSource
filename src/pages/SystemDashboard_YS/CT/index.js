import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import styles from '../styles.less';
import SystemDashboardPageWrapper from '@/pages/SystemDashboard/components/SystemDashboardPageWrapper.js';
import MapContent from './components/Center/MapContent';
import OverviewCard from './components/Left/OverviewCard_1';
import QualifiedAnalysis from './components/Left/Card_2';
import StandardsAnalysis from './components/Left/Card_3';
import ServiceResponseRate from './components/Right/ServiceResponseRate_1';
import CustomerSatisfaction from './components/Right/CustomerSatisfaction_2';
import AfterSaleService from './components/Right/AfterSaleService_3';

const dvaPropsData = ({ loading, sysDashboard }) => ({});

const HomeDataScreen = props => {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <SystemDashboardPageWrapper pageName="安装调试">
      <Col
        style={{ width: '27%',  display: fullScreen ? 'none' : 'flex' }}
        className={styles.leftWrapper}
      >
        {/* 总览 */}
        <OverviewCard />
        {/* 服务报告合格分析 */}
        <QualifiedAnalysis />
        {/* 安装调试达标分析 */}
        <StandardsAnalysis />
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
        style={{ width: '27%',  display: fullScreen ? 'none' : 'flex' }}
        className={styles.rightWrapper}
      >
        {/* 服务响应及时分析 */}
        <ServiceResponseRate />
        {/* 客户满意度分析 */}
        <CustomerSatisfaction />
        {/* 售后服务分析 */}
        <AfterSaleService />
      </Col>
    </SystemDashboardPageWrapper>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
