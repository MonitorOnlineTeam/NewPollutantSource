import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from './UserLayout2.less';
import { getSysName } from '@/utils/utils';

const dvaPropsData = ({ loading, sysDashboard }) => ({});

const UserLayout2 = props => {
  const [echarts, setEcharts] = useState();
  const [dataType, setDataType] = useState('Hours');
  const [open, setOpen] = useState(false);

  const port = location.port;

  const { dispatch, children, LevelList, entCode, regionCode, time } = props;

  useEffect(() => {
    console.log('configInfo', configInfo);
  }, []);

  const onOpenModal = () => {};

  return (
    <Row
      className={styles.userLayoutWrapper}
      style={{ backgroundImage: `url(/newLogin/${-1}.jpg)` }}
    >
      <Col className={styles.content} xl={14} lg={24}>
        <div className={styles.logo}></div>
        <div className={styles.sysName}>{configInfo.SystemName || '污染源监测监控软件'}</div>
        <div className={styles.childrenContent}>
          <h1>账号密码登录</h1>
          {children}
        </div>
      </Col>
      <Col xl={10} lg={0}></Col>
    </Row>
  );
};

export default connect(dvaPropsData)(UserLayout2);
