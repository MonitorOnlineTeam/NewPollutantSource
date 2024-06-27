import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import OverViewRealtime from '@/pages/monitoring/overView/realtime';

let myChart;
const dvaPropsData = ({ sysDashboard, loading }) => ({
  time: sysDashboard.time,
  MonitoringCountAnalysis: sysDashboard.MonitoringCountAnalysis,
  loading: loading.effects[`sysDashboard/GetMapPointList`],
});

const OverviewCard = props => {
  const [open, setOpen] = useState(false);

  const { dispatch, MonitoringCountAnalysis, loading, time } = props;

  useEffect(() => {}, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard title="在线监控总览" style={{ minHeight: 360 }} loading={loading}>
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
            <img src="/SystemDashboard/CT/pointNum1.png" />
            <div className={styles.numberContent}>
              <p className={styles.num}>{MonitoringCountAnalysis.pointCount}</p>
              <p className={styles.text}>排放口数量</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem}>
            <img src="/SystemDashboard/Overview/online.png" />
            <div className={styles.numberContent}>
              <p className={styles.num}>{MonitoringCountAnalysis.normalCount}</p>
              <p className={styles.text}>在线数量</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem}>
            <img src="/SystemDashboard/Overview/over.png" />
            <div className={styles.numberContent}>
              <p className={styles.num}>{MonitoringCountAnalysis.overCount}</p>
              <p className={styles.text}>超标数量</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem} style={{ height: '33.3333%' }}>
            <img src="/SystemDashboard/CT/pointNum4.png" />
            <div className={styles.numberContent}>
              <p className={styles.num}>{MonitoringCountAnalysis.exceptionCount}</p>
              <p className={styles.text}>异常数量</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem} style={{ height: '33.3333%' }}>
            <img src="/SystemDashboard/Overview/stop.png" />
            <div className={styles.numberContent}>
              <p className={styles.num}>{MonitoringCountAnalysis.stopCount}</p>
              <p className={styles.text}>停运数量</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem} style={{ height: '33.3333%' }}>
            <img src="/SystemDashboard/Overview/offline.png" />
            <div className={styles.numberContent}>
              <p className={styles.num}>{MonitoringCountAnalysis.unLineCount}</p>
              <p className={styles.text}>离线数量</p>
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
        bodyStyle={{padding: 0}}
      >
        <OverViewRealtime hideBreadcrumb={true} location={{ query: {} }} />
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(OverviewCard);
