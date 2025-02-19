import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Progress } from 'antd';
import styles from '@/pages/SystemDashboard_YS/styles.less';
import HomeCard from '@/pages/SystemDashboard_YS/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import TransmissionefficiencyModal from '@/pages/IntelligentAnalysis/newTransmissionefficiency/EntIndexModal';
import { fontSizeFn } from '@/pages/SystemDashboard_YS/CONST.js';

const dvaPropsData = ({ loading, sysDashboard }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  regionInfo: sysDashboard.regionInfo,
  entInfo: sysDashboard.entInfo,
  time: sysDashboard.time,
  loading: loading.effects['sysDashboard/GetEffectiveTransmissionRate'],
});

const EffectiveRate_2 = props => {
  const [echarts, setEcharts] = useState();
  const [rates, setRates] = useState({
    EfficiencyRate: 0,
    TransmissionRate: 0,
    TransmissionEfficiencyRate: 0,
  });
  const [open, setOpen] = useState(false);

  const { dispatch, loading, time, level, regionCode, entCode, regionInfo, entInfo } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetEffectiveTransmissionRate',
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

  const onOpenModal = () => {
    setOpen(true);
  };
  const rankDataList = [
    { key: '***环保股份有限公司', val: 8.51 },
    { key: '***检测有限公司', val: 8.49 },
    { key: '***环境检测有限公司', val: 8.42 },
    { key: '***环保科技有限公司', val: 8.41 },
    { key: '***运维环保设备有限公司', val: 8.36 },
    { key: '***环保技术有限公司', val: 8.35 },
    { key: '***环境责任有限公司', val: 8.34 },
  ];
  return (
    <HomeCard title="运维公司排名" bodyStyle={{}} loading={loading}>
      <div className={styles.EffectiveRateWrapper} style={{ padding: '8px 0' }}>
        <div className={styles.RankingContent} style={{ overflowY: 'auto' }}>
          <>
            <Row className={styles.rankHeader}>
              <Col flex="100px">排名</Col>
              <Col
                flex="auto"
                style={{
                  maxWidth: 'calc(100% - 200px)',
                  // width: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                运维公司
              </Col>
              <Col flex="100px">异常率</Col>
            </Row>
            {rankDataList.map((item, index) => {
              return (
                <Row className={styles.RankListContent}>
                  <Col flex="100px">
                    <span
                      className={styles.number}
                      style={{
                        backgroundImage: `url(/AbnormalIdentifyModel/rank/${
                          index < 3 ? index + 1 : 'number'
                        }.png)`,
                      }}
                    >
                      {index < 9 ? '0' + (index + 1) : index + 1}
                    </span>
                  </Col>
                  <Col
                    flex="auto"
                    style={{
                      maxWidth: 'calc(100% - 200px)',
                      // width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.key}
                  </Col>
                  <Col flex="100px">{item.val}%</Col>
                </Row>
              );
            })}
          </>
        </div>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(EffectiveRate_2);
