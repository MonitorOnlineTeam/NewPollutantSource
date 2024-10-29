import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Progress } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import moment from 'moment';
import _ from 'lodash';
import AbnormalData from '@/pages/dataSearch/abnormalData/index.js';

const dvaPropsData = ({ loading, sysDashboard }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  regionInfo: sysDashboard.regionInfo,
  entInfo: sysDashboard.entInfo,
  time: sysDashboard.time,
  loading: loading.effects['sysDashboard/GetExceptionDataAnalysis'],
});

const AbnormalAlarm_3 = props => {
  const [echarts, setEcharts] = useState();
  const [counts, setCounts] = useState({
    zeroCount: 0,
    overLimitCount: 0,
    continuousCount: 0,
    zeroRate: 0,
    overLimitRate: 0,
    continuousRate: 0,
  });
  const [open, setOpen] = useState(false);

  const { dispatch, loading, time, level, regionCode, entCode, regionInfo, entInfo } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetExceptionDataAnalysis',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        let max = _.max([res.zeroCount, res.overLimitCount, res.continuousCount]);
        setCounts({
          ...res,
          zeroRate: (res.zeroCount / max) * 100,
          overLimitRate: (res.overLimitCount / max) * 100,
          continuousRate: (res.continuousCount / max) * 100,
        });
      },
    });
  };

  const onOpenModal = () => {
    dispatch({
      type: 'abnormalData/updateState',
      payload: {
        abnormalDataTime: time,
      },
    });
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
      modalParams.regionName = regionInfo.regionName;
      modalParams.entCode = entCode;
    }
  }

  return (
    <HomeCard title="异常数据分析" bodyStyle={{}} loading={loading}>
      <div className={styles.AbnormalAlarmWrapper} onClick={onOpenModal}>
        <div className={styles.legendInfo}>
          <p class={styles.title}>零值数量</p>
          <div className={styles.content}>
            <Progress
              style={{ width: '100%' }}
              strokeWidth={'.9375rem'}
              percent={counts.zeroRate}
              steps={40}
              showInfo={false}
              strokeColor={{
                from: '#18FEFE',
                to: '#18FEFE',
              }}
              trailColor="transparent"
            />

            {/* <Progress style={{ width: '100%' }} percent={50} steps={3} /> */}
          </div>
          <span className={styles.num}>{counts.zeroCount}个</span>
        </div>
        <div className={styles.legendInfo}>
          <p class={styles.title}>超量程数量</p>
          <div className={styles.content}>
            <Progress
              style={{ width: '100%' }}
              strokeWidth={'.9375rem'}
              percent={counts.overLimitRate}
              steps={40}
              showInfo={false}
              strokeColor={{
                from: '#18FEFE',
                to: '#18FEFE',
              }}
              trailColor="transparent"
            />
          </div>
          <span className={styles.num}>{counts.overLimitCount}个</span>
        </div>
        <div className={styles.legendInfo}>
          <p class={styles.title}>恒定值数量</p>
          <div className={styles.content}>
            <Progress
              style={{ width: '100%' }}
              strokeWidth={'.9375rem'}
              percent={counts.continuousRate}
              steps={40}
              showInfo={false}
              strokeColor={{
                from: '#18FEFE',
                to: '#18FEFE',
              }}
              trailColor="transparent"
            />
          </div>
          <span className={styles.num}>{counts.continuousCount}个</span>
        </div>
      </div>
      <Modal
        title={`异常数据分析${extraTitle}`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          dispatch({
            type: 'abnormalData/updateState',
            payload: {
              abnormalDataTime: [
                moment()
                  .subtract(1, 'days')
                  .startOf('day'),
                moment().endOf('day'),
              ],
            },
          });
          setOpen(false);
        }}
        bodyStyle={{ padding: 0 }}
      >
        <AbnormalData hideBreadcrumb={true} location={{ query: {} }} {...modalParams} />
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(AbnormalAlarm_3);
