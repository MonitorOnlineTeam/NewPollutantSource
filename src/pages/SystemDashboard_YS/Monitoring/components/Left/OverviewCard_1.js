import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard_YS/styles.less';
import HomeCard from '@/pages/SystemDashboard_YS/components/HomeCard';
import OverViewRealtime from '@/pages/monitoring/overView/realtime';

const colors = ['#00a3ff', '#2EEB9D', '#FF3737', '#FFCC00', '#836bfb', '#C9C9C9'];

const dvaPropsData = ({ sysDashboard, loading }) => ({
  level: sysDashboard.level,
  time: sysDashboard.time,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  MonitoringCountAnalysis: sysDashboard.MonitoringCountAnalysis,
  loading: loading.effects[`sysDashboard/GetMapPointList`],
});

const OverviewCard = props => {
  const [open, setOpen] = useState(false);

  const { level, MonitoringCountAnalysis, loading, regionCode, entCode } = props;

  useEffect(() => {}, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard title="在线监控总览" style={{ }} loading={loading}>
      <Row
        className={`${styles.CTOverviewCard} ${styles.MonitoringOverview}`}
        onClick={onOpenModal}
      >
        <div className={styles.statisticsNum}>
          <span className={styles.text}>排污单位数量</span>
          <span className={styles.number}>{MonitoringCountAnalysis.entCount}家</span>
        </div>
        <Row className={styles.pointClassifyContent}>
          <Col span={12} className={styles.pointClassifyItem}>
            <img src="/SystemDashboard/installAndDebugger/pointNum1.png" />
            <div className={styles.numberContent}>
              <p className={styles.num} style={{ color: colors[0] }}>
                {MonitoringCountAnalysis.pointCount}
                <span className={styles.overViewUnit}>个</span>
              </p>
              <p className={styles.text}>排口数量</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem}>
            <img src="/SystemDashboard/Overview/online.png" />
            <div className={styles.numberContent}>
              <p className={styles.num} style={{ color: colors[1] }}>
                {MonitoringCountAnalysis.normalCount}
                <span className={styles.overViewUnit}>个</span>
              </p>
              <p className={styles.text}>在线排口</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem}>
            <img src="/SystemDashboard/Overview/over.png" />
            <div className={styles.numberContent}>
              <p className={styles.num} style={{ color: colors[2] }}>
                {MonitoringCountAnalysis.overCount}
                <span className={styles.overViewUnit}>个</span>
              </p>
              <p className={styles.text}>超标排口</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem} style={{ height: '33.3333%' }}>
            <img src="/SystemDashboard/installAndDebugger/pointNum4.png" />
            <div className={styles.numberContent}>
              <p className={styles.num} style={{ color: colors[3] }}>
                {MonitoringCountAnalysis.exceptionCount}
                <span className={styles.overViewUnit}>个</span>
              </p>
              <p className={styles.text}>异常排口</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem} style={{ height: '33.3333%' }}>
            <img src="/SystemDashboard/Overview/stop.png" />
            <div className={styles.numberContent}>
              <p className={styles.num} style={{ color: colors[4] }}>
                {MonitoringCountAnalysis.stopCount}
                <span className={styles.overViewUnit}>个</span>
              </p>
              <p className={styles.text}>停运排口</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem} style={{ height: '33.3333%' }}>
            <img src="/SystemDashboard/Overview/offline.png" />
            <div className={styles.numberContent}>
              <p className={styles.num} style={{ color: colors[5] }}>
                {MonitoringCountAnalysis.unLineCount}
                <span className={styles.overViewUnit}>个</span>
              </p>
              <p className={styles.text}>离线排口</p>
            </div>
          </Col>
        </Row>
      </Row>
      <Modal
        title="监控总览"
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        bodyStyle={{ padding: 0 }}
      >
        <OverViewRealtime
          hideBreadcrumb={true}
          location={{ query: {} }}
          regionCode={level == 2 ? regionCode : undefined}
          entCode={level == 3 ? entCode : undefined}
        />
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(OverviewCard);
