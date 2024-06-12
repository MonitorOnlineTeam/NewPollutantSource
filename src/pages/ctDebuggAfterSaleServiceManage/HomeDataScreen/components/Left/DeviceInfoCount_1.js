import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
import moment from 'moment';
import DeviceInfoCountModal from '../Modals/DeviceInfoCountModal';

let myChart;
const dvaPropsData = ({ loading }) => ({
  loading: loading.effects[`ctDataScreen/GetDeviceInformationAnalysis`],
});

const DeviceInfoCount = props => {
  const [time, setTime] = useState();
  const [open, setOpen] = useState(false);
  const [nums, setNums] = useState({
    EntNum: 0,
    PointNum: 0,
  });

  const { dispatch, loading } = props;

  useEffect(() => {}, []);

  const getData = value => {
    setTime(value);
    dispatch({
      type: 'ctDataScreen/GetDeviceInformationAnalysis',
      payload: {
        bTime: moment(value[0]).format('YYYY-MM-DD HH:mm:ss'),
        eTime: moment(value[1]).format('YYYY-MM-DD HH:mm:ss'),
      },
      callback: res => {
        setNums(res);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard
      style={{ minHeight: 200, flex: '0 1 200px' }}
      title="设备信息总览"
      timeTypes={['本年', '去年']}
      onClick={onOpenModal}
      onChange={value => {
        getData(value);
      }}
      bodyStyle={{}}
      loading={loading}
    >
      <Row className={`${styles.DeviceInfoCountWrapper}`} onClick={onOpenModal}>
        <Col span={12} className={styles.center}>
          <img src="/ctHomeDataScreen/ent_big.png" />
          <div>
            <p className={styles.text}>企业数量</p>
            <p className={styles.number}>{nums.EntNum}个</p>
          </div>
        </Col>
        <Col span={12} className={styles.center}>
          <img src="/ctHomeDataScreen/gas_big.png" />
          <div>
            <p className={styles.text}>废气点位数量</p>
            <p className={styles.number}>{nums.PointNum}个</p>
          </div>
        </Col>
      </Row>
      {open && (
        <DeviceInfoCountModal
          open={open}
          time={time}
          onCancel={() => {
            setOpen(false);
          }}
        />
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
