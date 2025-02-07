import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from './UserLayout2.less';
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
  const isShowSysName = configInfo?.SystemNameKey !== -1;

  let imgSrc = isShowSysName
    ? `url(/newLogin/${configInfo?.SystemName}/bg.jpg)`
    : `url(/newLogin/-1.jpg)`;

  return (
    <Row className={styles.userLayoutWrapper} style={{ backgroundImage: imgSrc }}>
      <Col className={styles.content} xl={13} lg={24}>
        <div className={styles.childrenContent}>
          {isShowSysName ? (
            <div className={styles.sysName}>
              <img style={{ marginLeft: -14, marginRight: 10 }} src="/sdl.png" />
              {configInfo?.SystemName}
            </div>
          ) : (
            <div className={styles.logo}></div>
          )}
          <div className={styles.loginFormContent}>
            <h1>账号密码登录</h1>
            {children}
          </div>
        </div>
      </Col>
      <Col xl={11} lg={0}></Col>
    </Row>
  );
};

export default connect(dvaPropsData)(UserLayout2);
