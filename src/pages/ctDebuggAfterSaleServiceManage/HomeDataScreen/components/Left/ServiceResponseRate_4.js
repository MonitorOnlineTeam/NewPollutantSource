import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '../../styles.less';
import { HomeCard, StatisticNumber } from '@/components/HomeComponents';
import TimelyRate from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/timelyRate';
import moment from 'moment';

let myChart;
const dvaPropsData = ({ loading, ctDataScreen }) => ({
  loading: loading.effects['ctDataScreen/GetTimelyRateAnalysis'],
});

const ServiceResponseRate = props => {
  const { dispatch, loading } = props;
  const [open, setOpen] = useState(false);
  const [ServiceResponse, setServiceResponse] = useState({
    timelyCount: 0,
    nottimelyCount: 0,
    rate: '0.00',
  });
  useEffect(() => {}, []);

  // 服务响应及时率
  const getData = value => {
    dispatch({
      type: 'ctDataScreen/GetTimelyRateAnalysis',
      payload: {
        bTime: moment(value[0]).format('YYYY-MM-DD HH:mm:ss'),
        eTime: moment(value[1]).format('YYYY-MM-DD HH:mm:ss'),
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
      style={{ minHeight: '15.625rem' }}
      title="服务响应及时率"
      bodyStyle={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      timeTypes={['上月', '本年']}
      onChange={value => {
        getData(value);
      }}
      onClick={onOpenModal}
      loading={loading}
    >
      <div className={styles.ServiceResponseRateWrapper} onClick={onOpenModal}>
        <div className={styles.center} style={{ width: '6.25rem', height: '5.25rem' }}>
          <p className={styles.count}>
            {ServiceResponse.nottimelyCount}
            <span>次</span>
          </p>
          <p className={styles.text}>响应次数</p>
        </div>
        <div style={{ width: '1.875rem', height: '1.5625rem', position: 'relative', top: '-6.75rem' }}></div>
        <div
          className={styles.center}
          style={{
            width: '10rem',
            height: '8.375rem',
            backgroundImage: 'url(/ctHomeDataScreen/ServiceResponseRate_1.png)',
          }}
        >
          <p className={styles.count} style={{color: '#F89F2B'}}>{ServiceResponse.rate}%</p>
          <p className={styles.text}>响应及时率</p>
        </div>
        <div style={{ width: '1.875rem', height: '1.5625rem', position: 'relative', top: '-7.75rem' }}></div>
        <div className={styles.center} style={{ width: '6.25rem', height: '5.25rem' }}>
          <p className={styles.count}>
            {ServiceResponse.timelyCount}
            <span>次</span>
          </p>
          <p className={styles.text}>及时次数</p>
        </div>
      </div>
      <Modal
        title={`服务响应及时率`}
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
