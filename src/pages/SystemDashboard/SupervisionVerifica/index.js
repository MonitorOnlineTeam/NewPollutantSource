/*
 * @Author: outman0611 jia_anbo@163.com
 * @Date: 2024-07-17 08:40:40
 * @LastEditors: outman0611 jia_anbo@163.com
 * @LastEditTime: 2024-08-08 11:25:23
 * @FilePath: \merged_master\src\pages\SystemDashboard\SupervisionVerifica\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

const homeCardMinHight = '14.125rem';
const HomeDataScreen = props => {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <SystemDashboardPageWrapper pageName="监督核查" noDate>
      <Col
        className={styles.leftWrapper}
        style={{ width: '30.375rem', display: fullScreen ? 'none' : 'flex' }}
      >
        <Overview homeCardMinHight={homeCardMinHight} />
        <KeyAnalysis homeCardMinHight={homeCardMinHight} />
        <ComplianceAnalysis homeCardMinHight={homeCardMinHight} />
        <PassRateAnalysis homeCardMinHight={homeCardMinHight} />
      </Col>
      <Col style={{ width: 'calc(100% - 30.375rem)' }} flex={'auto'} className={styles.centerWrapper}>
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
