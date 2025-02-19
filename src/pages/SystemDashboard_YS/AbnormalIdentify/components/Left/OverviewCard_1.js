import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard.js';
import moment from 'moment';
import OperatingInfo from '@/pages/newestHome/components/springModal/operatingInfo';
import PointDistribute from '@/pages/SystemDashboard/AbnormalIdentify/components/Left/PointDistribute.js';
import PointOverview from '@/pages/SystemDashboard/AbnormalIdentify/components/Left/PointOverview.js';
import ExceptionProblem from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/ExceptionProblem';

let myChart;
const dvaPropsData = ({ sysDashboard, loading }) => ({
  level: sysDashboard.level,
  time: sysDashboard.time,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  modalCountAnalysis: sysDashboard.modalCountAnalysis,
  loading: loading.effects['sysDashboard/GetMapPointInfo'],
});

const DeviceInfoCount = props => {
  const [distributeOpen, setDistributeOpen] = useState(false); //
  const [overviewOpen, setOverviewOpen] = useState(false); //
  const [exceptionPageOpen, setExceptionPageOpen] = useState(false); //
  const [level2Params, setLevel2Params] = useState({}); //

  const { dispatch, modalCountAnalysis, loading, level, entCode, regionCode, time } = props;

  useEffect(() => {}, []);

  const onOpenModal = () => {
    setDistributeOpen(true);
  };

  return (
    <HomeCard title="异常识别总览" bodyStyle={{}} loading={loading}>
      <Row className={`${styles.DeviceInfoCountWrapper}`}>
        <Col
          span={10}
          className={`${styles.center} ${styles.pointCount}`}
          style={{ flexDirection: 'column' }}
          onClick={() => {
            setOverviewOpen(true);
          }}
        >
          <p className={styles.pointNum}>{modalCountAnalysis.EntCount}</p>
          <p className={styles.unit}>（家）</p>
          <img src="/SystemDashboard/opera/pointNum_bg.png" />
          <p className={styles.text}>排污单位数量</p>
        </Col>
        <Col span={14} className={`${styles.center} ${styles.pointClassify}`}>
          <ul>
            <li onClick={onOpenModal}>
              <img src="/SystemDashboard/opera/pointNum1.png" />
              <span className={styles.text}>排放口数量</span>
              <div style={{ position: 'absolute', right: 10 }}>
                <span className={styles.num} style={{ color: '#00A3FF' }}>
                  {modalCountAnalysis.PointCount}
                </span>
                <span className={styles.unit}>个</span>
              </div>
            </li>
            <li onClick={onOpenModal}>
              <img src="/SystemDashboard/opera/pointNum2.png" />
              <span className={styles.text}>正常数量</span>
              <div style={{ position: 'absolute', right: 10 }}>
                <span className={styles.num} style={{ color: '#2EEB9D' }}>
                  {modalCountAnalysis.NormalCount}
                </span>
                <span className={styles.unit}>个</span>
              </div>
            </li>
            <li
              onClick={() => {
                setExceptionPageOpen(true);
              }}
            >
              <img src="/SystemDashboard/opera/pointNum3.png" />
              <span className={styles.text}>异常数量</span>
              <div style={{ position: 'absolute', right: 10 }}>
                <span className={styles.num} style={{ color: '#FFCC00' }}>
                  {modalCountAnalysis.ExcepCount}
                </span>
                <span className={styles.unit}>个</span>
              </div>
            </li>
          </ul>
        </Col>
      </Row>

      {distributeOpen && (
        <PointDistribute // 排口分布
          // wrapClassName="fullScreenModal"
          open={distributeOpen}
          type={'point'}
          onCancel={() => {
            setDistributeOpen(false);
          }}
          time={time}
          regionCode={level == 2 ? regionCode : undefined}
          entCode={level == 3 ? entCode : undefined}
        />
      )}
      {overviewOpen && (
        <PointOverview // 排污单位
          open={overviewOpen}
          type={'point'}
          onCancel={() => {
            setOverviewOpen(false);
          }}
          time={time}
          regionCode={level == 2 ? regionCode : undefined}
          entCode={level == 3 ? entCode : undefined}
        />
      )}
      {exceptionPageOpen && (
        <ExceptionProblem
          // title={level2PageTitle}
          reqParams={{
            regionCode: regionCode,
            entCode: entCode,
            date: time,
          }}
          open={exceptionPageOpen}
          onCancel={() => setExceptionPageOpen(false)}
        />
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
