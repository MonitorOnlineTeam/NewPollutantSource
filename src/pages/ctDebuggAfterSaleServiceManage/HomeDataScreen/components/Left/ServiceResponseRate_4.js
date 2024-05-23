import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
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
      style={{ minHeight: 250 }}
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
          <p className={styles.count}>{ServiceResponse.rate}%</p>
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
