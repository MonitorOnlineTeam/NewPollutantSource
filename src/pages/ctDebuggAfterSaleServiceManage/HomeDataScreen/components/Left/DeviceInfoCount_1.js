import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import { HomeCard, StatisticNumber } from '@/components/HomeComponents';
import moment from 'moment';
import DeviceInfoCountModal from '../Modals/DeviceInfoCountModal';
import homeStyles from '@/pages/screenStyle.less';

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
      style={{ minHeight: '12.5rem', flex: '0 1 12.5rem' }}
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
          <StatisticNumber value={nums.EntNum} text={'企业数量(个)'} uiDisplayType={1} />
        </Col>
        <Col span={12} className={styles.center}>
          <StatisticNumber value={nums.PointNum} text={'废气点位数量(个)'} uiDisplayType={1} />
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
