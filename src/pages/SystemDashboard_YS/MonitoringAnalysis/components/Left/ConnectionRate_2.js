import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tag, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard_YS/styles.less';
import HomeCard from '@/pages/SystemDashboard_YS/components/HomeCard';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import NetworkRateStatisticsModal from '@/pages/newestHome/components/springModal/networkRateStatistics';
import { fontSizeFn } from '@/pages/SystemDashboard_YS/CONST.js';
import CustomIcon from '@/components/CustomIcon';
const COLOR = ['#2998FF', '#21ECBB', '#DFE06D'];

const dvaPropsData = ({ sysDashboard, loading }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  loading: loading.effects[`sysDashboard/GetVisualDashBoardNetworkingRate`],
});

const ConnectionRate = props => {
  const [open, setOpen] = useState(false);
  const [echarts, setEcharts] = useState();
  const [rates, setRates] = useState({
    NetworkingRate: '0.00',
    NetworkingCount: 0,
    OffLineCount: 0,
  });

  const { dispatch, time, loading, level, regionCode, entCode } = props;

  useEffect(() => {
    // getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetVisualDashBoardNetworkingRate',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        setRates(res);
      },
    });
  };

  const rankDataList = [
    { key: '***发电有限公司', val: 8.32 },
    { key: '***热电有限责任公司', val: 8.22 },
    { key: '***电热有限责任公司', val: 8.12 },
    { key: '***节能有限公司', val: 8.02 },
    { key: '***新材料科技有限公司', val: 7.92 },
    { key: '***冶炼有限公司', val: 7.82 },
    { key: '***生物科技有限公司', val: 7.72 },
  ];

  return (
    <HomeCard title="企业排名" loading={loading}>
      <div className={styles.rankContainer}>
        <div className={styles.header}>
          <ul>
            <li>排名</li>
            <li className={styles.rankName}>企业</li>
            <li className={styles.rankVal}>异常率</li>
          </ul>
        </div>
        <div className={styles.rankContent}>
          {/* <ReactSeamlessScroll speed={20} style={{ width: '100%', height: '100%' }}> */}
          {rankDataList.map((item, index) => {
            return (
              <ul>
                <li className={styles.rankNum}>
                  {index === 0 && <CustomIcon type="icon-guanjun" className={styles.rankIcon} />}
                  {index === 1 && <CustomIcon type="icon-yajun" className={styles.rankIcon} />}
                  {index === 2 && <CustomIcon type="icon-jijun" className={styles.rankIcon} />}
                  {index > 2 && <span>{index + 1}</span>}
                </li>
                <li className={styles.rankName}>{item.key}</li>
                <li className={styles.rankVal}>{item.val}%</li>
              </ul>
            );
          })}
        </div>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ConnectionRate);
