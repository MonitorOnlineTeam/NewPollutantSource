import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '../HomeCard';
import TimelyRate from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/timelyRate';
import moment from 'moment';

const dvaPropsData = ({ loading, sysDashboard }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  loading: loading.effects['ctDataScreen/GetTimelyRateAnalysis'],
});

const ServiceResponseRate = props => {
  const [open, setOpen] = useState(false);
  const [ServiceResponse, setServiceResponse] = useState({
    timelyCount: 0,
    nottimelyCount: 0,
    rate: '0.00',
  });

  const { dispatch, time, loading, level, regionCode, entCode } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  // 服务响应及时率
  const getData = value => {
    dispatch({
      type: 'ctDataScreen/GetTimelyRateAnalysis',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        bTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        eTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        setServiceResponse(res.ServiceResponse);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard
      title="服务响应及时分析"
      style={{ minHeight: 260, flex: 3 }}
      bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      loading={loading}
    >
      <div className={styles.ServiceResponseRateWrapper} onClick={onOpenModal}>
        <div className={styles.center} style={{ width: 100, height: 84 }}>
          <p className={styles.count}>
            {ServiceResponse.nottimelyCount}
            <span>次</span>
          </p>
          <p className={styles.text}>响应次数</p>
        </div>
        <div style={{ width: 30, height: 25, position: 'relative', top: -108 }}></div>
        <div
          className={styles.center}
          style={{
            width: 160,
            height: 134,
            backgroundImage: 'url(/ctHomeDataScreen/ServiceResponseRate_1.png)',
          }}
        >
          <p className={styles.count} style={{ color: '#F1A240' }}>
            {ServiceResponse.rate}%
          </p>
          <p className={styles.text}>响应及时率</p>
        </div>
        <div style={{ width: 30, height: 25, position: 'relative', top: -124 }}></div>
        <div className={styles.center} style={{ width: 100, height: 84 }}>
          <p className={styles.count}>
            {ServiceResponse.timelyCount}
            <span>次</span>
          </p>
          <p className={styles.text}>及时次数</p>
        </div>
      </div>
      <Modal
        title={`服务响应及时分析`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        bodyStyle={{ padding: 0 }}
      >
        {open && <TimelyRate hideBreadcrumb modalWrapClassName="fullScreenModal" />}
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ServiceResponseRate);
