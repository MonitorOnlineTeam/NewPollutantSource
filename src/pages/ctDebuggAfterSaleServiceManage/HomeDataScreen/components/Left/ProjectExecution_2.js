import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
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

  useEffect(() => {}, []);

  const getData = value => {
    dispatch({
      type: 'ctDataScreen/GetProjectExecutionAnalysis',
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
      style={{ minHeight: 260 }}
      title="项目执行情况"
      timeTypes={['本月', '去年']}
      onChange={value => {
        getData(value);
      }}
      bodyStyle={{}}
      onClick={onOpenModal}
      loading={loading}
    >
      <p style={{ textAlign: 'right', lineHeight: '36px', fontFamily: 500 }}>单位：套</p>
      <Row className={`${styles.ProjectExecutionWrapper}`} onClick={onOpenModal}>
        <Col span={8}>
          <div className={styles.number}>{nums.InstallationNum}</div>
          <p>安装调试</p>
        </Col>
        <Col span={8}>
          <div className={styles.number}>{nums.DebuggingNum}</div>
          <p>72小时调试</p>
        </Col>
        <Col span={8}>
          <div className={styles.number}>{nums.AcceptanceNum}</div>
          <p>待验收</p>
        </Col>
      </Row>
      {open && (
        <ProjectExecutionModal
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
        />
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ProjectExecution);
