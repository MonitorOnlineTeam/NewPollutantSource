import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import DeviceInfoCountModal from '@/pages/ctDebuggAfterSaleServiceManage/HomeDataScreen/components/Modals/DeviceInfoCountModal.js';

let myChart;
const dvaPropsData = ({ sysDashboard, loading }) => ({
  time: sysDashboard.time,
  CTCountAnalysis: sysDashboard.CTCountAnalysis,
  loading: loading.effects[`sysDashboard/GetInstallationDebuggingMap`],
});

const DeviceInfoCount = props => {
  const [open, setOpen] = useState(false);

  const { dispatch, CTCountAnalysis, loading, time } = props;

  useEffect(() => {}, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard title="安装调试总览" bodyStyle={{}} loading={loading}>
      <Row className={`${styles.CTOverviewCard}`} onClick={onOpenModal}>
        <div className={styles.statisticsNum}>
          <span className={styles.text}>排污单位数量</span>
          <span className={styles.number}>{CTCountAnalysis.EntCount}家</span>
        </div>
        <Row className={styles.pointClassifyContent}>
          <Col span={12} className={styles.pointClassifyItem}>
            <img src="/SystemDashboard/CT/pointNum1.png" />
            <div className={styles.numberContent}>
              <p className={styles.num}>{CTCountAnalysis.PointCount}</p>
              <p className={styles.text}>排放口数量</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem}>
            <img src="/SystemDashboard/CT/pointNum2.png" />
            <div className={styles.numberContent}>
              <p className={styles.num}>{CTCountAnalysis.GuideInstallationCount}</p>
              <p className={styles.text}>安装完成数量</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem}>
            <img src="/SystemDashboard/CT/pointNum3.png" />
            <div className={styles.numberContent}>
              <p className={styles.num}>{CTCountAnalysis.DebuggingCount}</p>
              <p className={styles.text}>调试完成数量</p>
            </div>
          </Col>
          <Col span={12} className={styles.pointClassifyItem}>
            <img src="/SystemDashboard/CT/pointNum4.png" />
            <div className={styles.numberContent}>
              <p className={styles.num}>{CTCountAnalysis.CheckedCount}</p>
              <p className={styles.text}>验收完成数量</p>
            </div>
          </Col>
        </Row>
      </Row>
      {open && (
        <DeviceInfoCountModal
          open={open}
          time={time}
          onCancel={() => {
            setOpen(false);
          }}
        />
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
