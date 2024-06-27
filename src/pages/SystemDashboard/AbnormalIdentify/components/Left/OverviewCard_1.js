import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '../HomeCard';
import moment from 'moment';
import OperatingInfo from '@/pages/newestHome/components/springModal/operatingInfo';

let myChart;
const dvaPropsData = ({ sysDashboard, loading }) => ({
  modalCountAnalysis: sysDashboard.modalCountAnalysis,
  loading: loading.effects['sysDashboard/GetMapPointInfo'],
});

const DeviceInfoCount = props => {
  const [open, setOpen] = useState(false);

  const { dispatch, modalCountAnalysis, loading } = props;

  useEffect(() => {}, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard title="异常识别总览" bodyStyle={{}} loading={loading}>
      <Row className={`${styles.DeviceInfoCountWrapper}`} onClick={onOpenModal}>
        <Col
          span={10}
          className={`${styles.center} ${styles.pointCount}`}
          style={{ flexDirection: 'column' }}
        >
          <p className={styles.pointNum}>{modalCountAnalysis.EntCount}</p>
          <p className={styles.unit}>（家）</p>
          <img src="/SystemDashboard/opera/pointNum_bg.png" />
          <p className={styles.text}>排污单位数量</p>
        </Col>
        <Col span={14} className={`${styles.center} ${styles.pointClassify}`}>
          <ul>
            <li>
              <img src="/SystemDashboard/opera/pointNum1.png" />
              <span className={styles.text}>排放口数量</span>
              <div style={{ position: 'absolute', right: 10 }}>
                <span className={styles.num} style={{ color: '#00A3FF' }}>
                  {modalCountAnalysis.PointCount}
                </span>
                <span className={styles.unit}>个</span>
              </div>
            </li>
            <li>
              <img src="/SystemDashboard/opera/pointNum2.png" />
              <span className={styles.text}>正常数量</span>
              <div style={{ position: 'absolute', right: 10 }}>
                <span className={styles.num} style={{ color: '#2EEB9D' }}>
                  {modalCountAnalysis.NormalCount}
                </span>
                <span className={styles.unit}>个</span>
              </div>
            </li>
            <li>
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
      {/* {open && (
        <OperatingInfo //运维信息总览
          // wrapClassName="fullScreenModal"
          visible={open}
          type={'point'}
          onCancel={() => {
            setOpen(false);
          }}
          pollutantType={undefined}
          operatingStatus={undefined}
          outputType={0}
        />
      )} */}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
