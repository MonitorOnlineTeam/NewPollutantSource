import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from './UserLayout3.less';
import { getSysName } from '@/utils/utils';

const dvaPropsData = ({ loading, sysDashboard }) => ({});

const UserLayout2 = props => {
  const port = location.port;

  const { dispatch, children, LevelList, entCode, regionCode, time } = props;

  useEffect(() => {}, []);

  // const sysName = JSON.parse(conf);
  // const { NODE_ENV } = process.env;

  // return sysName[port] ? sysName[port] : sysName[-1];
  // let isShowSysName =

  // const isShowSysName = configInfo.SystemName !== '污染源智慧监测管理系统';
  // console.log('configInfo', configInfo)
  const isShowSysName = configInfo.SystemNameKey !== -1;

  let imgSrc = `url(/newLogin2/bg.jpg)`;
  return (
    <Row className={styles.userLayoutWrapper}>
      <Col className={styles.content} xl={24} lg={24}>
        {/* <div className={styles.childrenContent}> */}
        <div className={styles.sysName}>
          <img style={{ marginRight: 10 }} src="/newLogin2/sdl.png" />
          {configInfo.SystemName}
        </div>
        <Row className={styles.featureImg}>
          <Col span={13} className="center">
            <img src="/newLogin2/feature.png" />
          </Col>
        </Row>
        <Row className={styles.loginContent}>
          <Col span={13}></Col>
          <Col span={11}>
            <div className={styles.loginFormContent}>
              <h1>用户登录</h1>
              {children}
            </div>
          </Col>
        </Row>
        {/* </div> */}
      </Col>
    </Row>
  );
};

export default connect(dvaPropsData)(UserLayout2);
