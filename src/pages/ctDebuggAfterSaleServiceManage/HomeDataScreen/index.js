import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { router } from 'umi';
import styles from './styles.less';
import DeviceInfoCount from './components/Left/DeviceInfoCount_1';
import ProjectExecution from './components/Left/ProjectExecution_2';
import TimelyPassRate from './components/Left/TimelyPassRate_3';
import ServiceResponseRate from './components/Left/ServiceResponseRate_4';
import CustomerSatisfaction from './components/Right/CustomerSatisfaction_1';
import InstallDebugRate from './components/Right/InstallDebugRate_2';
import EquipUptimeRate from './components/Right/EquipUptimeRate_3';
import MapContent from './components/Center/MapContent';
import AfterSaleService from './components/Center/AfterSaleService';

const dvaPropsData = ({ loading, user }) => ({});

const HomeDataScreen = props => {
  const { dispatch } = props;

  useEffect(() => { }, []);

  return (
    <div className={styles.CTScreenWrapper}>
      <header className={styles.header}>可视化看板</header>
      <Tooltip title="返回菜单">
        <RollbackOutlined
          style={{
            position: 'absolute',
            zIndex: 1,
            border: '2px solid rgb(49 97 141)',
            fontSize: 16,
            padding: 4,
            cursor: 'pointer',
            fontWeight: 'bold',
            right: 22,
            top: 34,
            color: 'rgb(101, 217, 255)',
          }}
          onClick={() => {
            let meunList = sessionStorage.getItem('menuDatas')
              ? JSON.parse(sessionStorage.getItem('menuDatas'))
              : [];
            if (meunList?.length >= 1) {
              router.push(meunList[1]);
            } else {
              router.push('/ctManage/workbench')
            }
          }}
        />
      </Tooltip>
      <main>
        <Row
          gutter={[8, 8]}
          style={{ marginLeft: 0, width: '100%' }}
          className={styles.contentWrapper}
        >
          <Col style={{ width: '27%', minWidth: 400 }} className={styles.leftWrapper}>
            {/* 设备信息总览 */}
            <DeviceInfoCount />
            {/* 项目执行情况 */}
            <ProjectExecution />
            {/* 服务报告及时合格率 */}
            <TimelyPassRate />
            {/* 服务响应及时率 */}
            <ServiceResponseRate />
          </Col>
          <Col style={{ maxWidth: '46%' }} flex={'auto'} className={styles.centerWrapper}>
            {/* 地图 */}
            <MapContent />
            {/* 售后服务情况 */}
            <AfterSaleService />
          </Col>
          <Col style={{ width: '27%', minWidth: 400 }} className={styles.rightWrapper}>
            {/* 客户满意度 */}
            <CustomerSatisfaction />
            {/* 安装调试达标率 */}
            <InstallDebugRate />
            {/* 设备运行完好率 */}
            <EquipUptimeRate />
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
