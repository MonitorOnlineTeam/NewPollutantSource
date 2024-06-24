import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import { router } from 'umi';
import Cookie from 'js-cookie';
import styles from '../styles.less'; 
import MapContent from './components/Center/MapContent';
import OverviewCard from './components/Left/OverviewCard_1';
import QualifiedAnalysis from './components/Left/Card_2';
import StandardsAnalysis from './components/Left/Card_3';
import ServiceResponseRate from './components/Right/ServiceResponseRate_1';
import CustomerSatisfaction from './components/Right/CustomerSatisfaction_2';
import AfterSaleService from './components/Right/AfterSaleService_3';
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown.jsx';
import FullscreenToggle from './components/FullscreenToggle';
import moment from 'moment';
import { sysList, dateRangeList } from '../CONST';

const dvaPropsData = ({ loading, sysDashboard }) => ({
  timeLabel: sysDashboard.timeLabel,
});

const HomeDataScreen = props => {
  const containerRef = useRef(null);

  const currentMenuName = '异常数据识别';
  const pageInfo = sysList.find(item => item.key === currentMenuName);

  const { dispatch, timeLabel } = props;

  useEffect(() => {
    dispatch({
      //获取运维基础配置
      type: 'global/getOperationSetting',
      payload: {},
    });

    return () => {
      // 销毁时：重置state
      dispatch({
        type: 'sysDashboard/onResetState',
      });
    };
  }, []);

  // 返回系统
  const gobackSys = () => {
    let meunList = sessionStorage.getItem('menuDatas')
      ? JSON.parse(sessionStorage.getItem('menuDatas'))
      : [];
    router.push(meunList?.[1] ? meunList?.[1] : '/user/login');
  };

  // 改变时间
  const onChangeDateTime = data => {
    if (data.key === timeLabel) {
      return;
    }
    dispatch({
      type: 'sysDashboard/updateState',
      payload: {
        timeLabel: data.key,
        time: data.value,
      },
    });
  };

  return (
    <div className={`${styles.dashboardPageWrapper} ${styles.operationWrapper}`} ref={containerRef}>
      <header className={styles.header}>{pageInfo.data.Name}</header>
      <div className={styles.leftContent}>
        <div className={styles.menuSelectContent}>
          <div className={styles.selectedName}>统计周期</div>
          <ul>
            {dateRangeList.map(item => {
              return (
                <li
                  className={timeLabel === item.key ? styles.active : ''}
                  key={item.key}
                  onClick={() => {
                    onChangeDateTime(item);
                  }}
                >
                  {item.key}
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.menuSelectContent}>
          <div className={styles.selectedName}>{currentMenuName}</div>
          <ul>
            {sysList.map(item => {
              return (
                <li
                  className={currentMenuName === item.key ? styles.active : ''}
                  key={item.key}
                  onClick={() => {
                    window.open(`/sessionMiddlePage?sysInfo=${JSON.stringify(item.data)}`);
                  }}
                >
                  {item.key}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={styles.rightContent}>
        <FullscreenToggle containerRef={containerRef} style={{ marginRight: 14, marginTop: 4 }} />
        <div className={styles.goSystem} onClick={gobackSys}>
          系统入口
        </div>
        <img src="/SystemDashboard/infoIcon.png" className={styles.message} />
        <div className={styles.userInfoContent}>
          <AvatarDropdown menu style={{ position: 'absolute', right: 20, top: 30 }} />
        </div>
      </div>
      <main>
        <Row
          gutter={[8, 8]}
          style={{ marginLeft: 0, width: '100%' }}
          className={styles.contentWrapper}
        >
          <Col style={{ width: '27%', minWidth: 400 }} className={styles.leftWrapper}>
            {/* 总览 */}
            <OverviewCard />
            {/* 服务报告合格分析 */}
            <QualifiedAnalysis />
            {/* 安装调试达标分析 */}
            <StandardsAnalysis />
          </Col>
          <Col style={{ maxWidth: '46%' }} flex={'auto'} className={styles.centerWrapper}>
            {/* 地图 */}
            <MapContent />
          </Col>
          <Col style={{ width: '27%', minWidth: 400 }} className={styles.rightWrapper}>
            {/* 服务响应及时分析 */}
            <ServiceResponseRate />
            {/* 客户满意度分析 */}
            <CustomerSatisfaction />
            {/* 售后服务分析 */}
            <AfterSaleService />
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
