import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import moment from 'moment';
import OperatingInfo from '@/pages/newestHome/components/springModal/operatingInfo';

let myChart;
const dvaPropsData = ({ sysDashboard, loading }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  regionInfo: sysDashboard.regionInfo,
  entInfo: sysDashboard.entInfo,
  time: sysDashboard.time,
  loading: loading.effects[`sysDashboard/GetOperationEquipmentOverview`],
});

const DeviceInfoCount = props => {
  const [open, setOpen] = useState(false);
  const [nums, setNums] = useState({
    pointCount: 0,
    normalCount: 0,
    exceptionCount: 0,
  });

  const { dispatch, time, loading, level, regionCode, entCode, regionInfo, entInfo } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetOperationEquipmentOverview',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        setNums(res);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  let extraTitle = '',
    modalParams = {};
  if (level != 1 && (regionCode || entCode)) {
    if (level == 2 && regionCode) {
      extraTitle = `（${regionInfo.regionName}）`;
      modalParams.regionCode = regionCode;
    }
    if (level == 3 && entCode) {
      extraTitle = `（${regionInfo.regionName} - ${entInfo.entName}）`;
      modalParams.regionCode = regionCode;
      modalParams.entCode = entCode;
    }
  }

  return (
    <HomeCard title="设备运维总览" bodyStyle={{}} loading={loading}>
      <Row className={`${styles.DeviceInfoCountWrapper}`} onClick={onOpenModal}>
        <Col
          span={10}
          className={`${styles.center} ${styles.pointCount}`}
          style={{ flexDirection: 'column' }}
        >
          <p className={styles.pointNum}>{nums.entCount}</p>
          <p className={styles.unit}>（家）</p>
          <img src="/SystemDashboard/opera/pointNum_bg.png" />
          <p className={styles.text}>排污单位数量</p>
        </Col>
        <Col span={14} className={`${styles.center} ${styles.pointClassify}`}>
          <ul>
            <li>
              <img src="/SystemDashboard/opera/pointNum1.png" />
              <span className={styles.text}>排口数量</span>
              <div style={{ position: 'absolute', right: 10 }}>
                <span className={styles.num} style={{ color: '#00A3FF' }}>
                  {nums.pointCount}
                </span>
                <span className={styles.unit}>个</span>
              </div>
            </li>
            <li>
              <img src="/SystemDashboard/opera/pointNum2.png" />
              <span className={styles.text}>正常运维排口</span>
              <div style={{ position: 'absolute', right: 10 }}>
                <span className={styles.num} style={{ color: '#2EEB9D' }}>
                  {nums.normalCount}
                </span>
                <span className={styles.unit}>个</span>
              </div>
            </li>
            <li>
              <img src="/SystemDashboard/opera/pointNum3.png" />
              <span className={styles.text}>异常运维排口</span>
              <div style={{ position: 'absolute', right: 10 }}>
                <span className={styles.num} style={{ color: '#FFCC00' }}>
                  {nums.exceptionCount}
                </span>
                <span className={styles.unit}>个</span>
              </div>
            </li>
          </ul>
        </Col>
      </Row>
      {open && (
        <OperatingInfo //运维信息总览
          // wrapClassName="fullScreenModal"
          title={`设备运维总览${extraTitle}`}
          visible={open}
          type={'point'}
          onCancel={() => {
            setOpen(false);
          }}
          pollutantType={undefined}
          operatingStatus={undefined}
          outputType={0}
          {...modalParams}
        />
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
