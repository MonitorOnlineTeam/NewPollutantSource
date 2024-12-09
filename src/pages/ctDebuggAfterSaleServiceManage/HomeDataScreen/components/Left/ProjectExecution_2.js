import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import { HomeCard, StatisticNumber } from '@/components/HomeComponents';
import moment from 'moment';
import ProjectExecutionModal from '../Modals/ProjectExecutionModal';

const dvaPropsData = ({ loading }) => ({
  loading: loading.effects[`ctDataScreen/GetDeviceInformationAnalysis`],
});

const ProjectExecution = props => {
  const [open, setOpen] = useState(false);
  const [nums, setNums] = useState({
    InstallationNum: 0,
    DebuggingNum: 0,
    AcceptanceNum: 0,
  });

  const { dispatch, loading } = props;
  const [date, setDate] = useState();
  useEffect(() => {}, []);

  const getData = value => {
    dispatch({
      type: 'ctDataScreen/GetProjectExecutionAnalysis',
      payload: {
        bTime: moment(value[0]).format('YYYY-MM-DD HH:mm:ss'),
        eTime: moment(value[1]).format('YYYY-MM-DD HH:mm:ss'),
      },
      callback: res => {
        setDate(value?.[0] && moment(value[0]));
        setNums(res);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard
      style={{ minHeight: '16.25rem' }}
      title="项目执行情况"
      timeTypes={['本月', '本年']}
      onTimeChange={value => {
        getData(value);
      }}
      // bodyStyle={{ display: 'flex' }}
      onClick={onOpenModal}
      loading={loading}
    >
      <div className={styles.ProjectExecutionWrapper}>
        <p style={{ position: 'absolute', right: 0, top: '.625rem', fontFamily: 500 }}>单位：套</p>
        <Row gutter={16} className={`${styles.content} center`} onClick={onOpenModal}>
          <Col span={8}>
            <StatisticNumber value={nums.InstallationNum} text={'安装调试'} uiDisplayType={2} />
          </Col>
          <Col span={8}>
            <StatisticNumber value={nums.DebuggingNum} text={'72小时调试'} uiDisplayType={2} />
          </Col>
          <Col span={8}>
            <StatisticNumber value={nums.AcceptanceNum} text={'待验收'} uiDisplayType={2} />
          </Col>
        </Row>
      </div>

      {open && (
        <ProjectExecutionModal
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
          initDate={date}
        />
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ProjectExecution);
