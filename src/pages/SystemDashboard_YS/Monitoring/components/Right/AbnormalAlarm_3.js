import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Progress } from 'antd';
import styles from '@/pages/SystemDashboard_YS/styles.less';
import HomeCard from '@/pages/SystemDashboard_YS/components/HomeCard';
import moment from 'moment';
import _ from 'lodash';
import AbnormalData from '@/pages/dataSearch/abnormalData/index.js';
import ReactSeamlessScroll from 'react-seamless-scroll';

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

  // XX企业XX排口，在2025-02-10 10:41:31 二氧化氯/氮氧化物（50）/颗粒物（30）的小时数据发生了超标，超标浓度为：
  const warningInfoList = [
    {
      PointName: '*****有限责任公司 - 3#窑头',
      FirstTime: '2025-02-12 22:00:00',
      PollutantName: '二氧化硫',
      value: 50,
    },
    {
      PointName: '*****环保工程有限公司 - 1#脱硫出口',
      FirstTime: '2025-02-12 21:00:00',
      PollutantName: '二氧化硫',
      value: 53,
    },
    {
      PointName: '*****发电有限公司 - 脱硫总排口',
      FirstTime: '2025-02-12 18:00:00',
      PollutantName: '氮氧化物',
      value: 49,
    },
    {
      PointName: '*****冶炼有限公司 - 废气排口',
      FirstTime: '2025-02-12 16:00:00',
      PollutantName: '氮氧化物',
      value: 51,
    },
    {
      PointName: '*****钢铁有限公司 - 2#加热炉煤烟排口',
      FirstTime: '2025-02-12 14:00:00',
      PollutantName: '颗粒物',
      value: 35,
    },
  ];

  return (
    <HomeCard title="超标报警信息" bodyStyle={{}} loading={loading}>
      <div className={styles.AbnormalAlarmWrapper} onClick={onOpenModal}>
        <ReactSeamlessScroll
          speed={40}
          style={{ width: '100%', height: '100%' }}
          hover={true}
          step={0.3}
          limitScrollNum={6}
        >
          {warningInfoList.map(item => {
            return (
              <div className={styles['item-div']}>
                <a className={styles['item-a']}>
                  <div style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>
                    <span style={{ fontWeight: 'bold' }}>{item.PointName}：</span>
                    <br />
                    <div style={{ textIndent: '2em' }}>
                      在<span style={{ color: '#3ccafc' }}>{item.FirstTime}</span>
                      <span style={{ color: '#ffcb5b', margin: '0 2px' }}>{item.PollutantName}</span>
                      的小时数据发生了超标， 超标浓度为：
                      <span style={{ color: '#f30201', fontSize: 16 }}>{item.value}</span> mg/m³。
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </ReactSeamlessScroll>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(AbnormalAlarm_3);
