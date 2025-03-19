import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard.js';
import QCAType from './QCAType';


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


  return (
    <HomeCard title="质控类别合格情况" bodyStyle={{}} loading={loading}>
      <QCAType />
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
