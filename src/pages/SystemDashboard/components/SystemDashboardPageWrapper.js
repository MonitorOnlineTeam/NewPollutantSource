import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
import { router } from 'umi';
import styles from '../styles.less';
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown.jsx';
import FullscreenToggle from './FullscreenToggle';
import { sysList, dateRangeList } from '../CONST';

const dvaPropsData = ({ loading, sysDashboard }) => ({
  timeLabel: sysDashboard.timeLabel,
});

const HomeDataScreen = props => {
  const containerRef = useRef(null);

  const { dispatch, timeLabel, children, pageName } = props;

  const pageInfo = sysList.find(item => item.key === pageName);

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
      <header className={styles.header}>{pageInfo.title}</header>
      <div className={styles.leftContent}>
        <div className={styles.menuSelectContent}>
          {/* <div className={styles.selectedName}>统计周期</div> */}
          <div className={styles.selectedName}>{timeLabel}</div>
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
          <div className={styles.selectedName}>{pageInfo.key}</div>
          <ul>
            {sysList.map(item => {
              return (
                <li
                  className={pageInfo.key === item.key ? styles.active : ''}
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
          {children}
        </Row>
      </main>
    </div>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
