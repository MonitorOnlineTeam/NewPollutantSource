import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { router } from 'umi';
import styles from '../styles.less';
import RanAnalysis from './components/RunAnalysis';
import RunState from './components/RunState';
import DataQualityAnalysis from './components/DataQualityAnalysis';
import Ranking from './components/Ranking';
import EmissionGap from './components/EmissionGap';
import MapContent from './components/MapContent';
import { CloseOutlined } from '@ant-design/icons';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  entHomeIsOpen: AbnormalIdentifyModelHome.entHomeIsOpen,
  currentEntName: AbnormalIdentifyModelHome.currentEntName,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const RegionAndIndustryPage = props => {
  const { dispatch, entHomeIsOpen, currentEntName } = props;
  // const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {};

  return (
    <div className={styles.ScreenWrapper}>
      <header className={styles.header}>
        <span className={styles.entName}>{currentEntName}</span>
      </header>
      {/* <Tooltip title="返回">
        <RollbackOutlined
          style={{
            position: 'absolute',
            zIndex: 1,
            border: '2px solid rgb(49 97 141)',
            fontSize: 16,
            padding: 4,
            cursor: 'pointer',
            fontWeight: 'bold',
            right: 22,
            top: 34,
            color: 'rgb(101, 217, 255)',
          }}
          onClick={() => {
            router.push('');
          }}
        />
      </Tooltip> */}
      <main>
        <Row gutter={[8, 8]} style={{ padding: '0 8px' }} className={styles.contentWrapper}>
          <Col style={{ width: '23%', minWidth: 400 }} className={styles.leftWrapper}>
            {/* 运行分析 */}
            <div>
              <RanAnalysis />
            </div>
            <div className={styles.DataQualityAnalysisWrapper}>
              <DataQualityAnalysis />
            </div>
          </Col>
          <Col style={{ maxWidth: '54%' }} flex={'auto'} className={styles.centerWrapper}>
            <div className={styles.mapWrapper}>
              <i className={styles.lt}></i>
              <i className={styles.rt}></i>
              <MapContent />
            </div>
            <div className={styles.emissionsWrapper}>
              <EmissionGap />
            </div>
          </Col>
          <Col style={{ width: '23%', minWidth: 400 }} className={styles.rightWrapper}>
            <div className={styles.ranStateWrapper}>
              <RunState />
            </div>
            <div className={styles.RunkingWrapper}>
              <div className={styles.Runking} style={{ height: '100%' }}>
                <Ranking />
              </div>
            </div>
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default connect(dvaPropsData)(RegionAndIndustryPage);
