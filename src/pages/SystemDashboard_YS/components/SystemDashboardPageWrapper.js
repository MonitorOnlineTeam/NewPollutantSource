import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Spin } from 'antd';
import { router } from 'umi';
import styles from '../styles.less';
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown.jsx';
import FullscreenToggle from './FullscreenToggle';
import { allSysList, dateRangeList } from '../CONST';
import CustomTimeModal from './CustomTimeModal';
import moment from 'moment';
import { setRem } from '@/utils/utils.js';

const dvaPropsData = ({ loading, sysDashboard, user }) => ({
  time: sysDashboard.time,
  timeLabel: sysDashboard.timeLabel,
  currentMenu: user.currentMenu,
  loading: loading.effects['sysDashboard/GetSysList'],
});

const SystemDashboardPageWrapper = props => {
  const containerRef = useRef(null);

  const [sysList, setSysList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [current, setCurrent] = useState({});
  const [customTimeModalOpen, setCustomTimeModalOpen] = useState(false);

  const { dispatch, timeLabel, children, pageName, currentMenu, time, loading } = props;

  // rem等比适配配置文件
  useEffect(() => {
    setRem();
    // 监听窗口大小变化
    window.addEventListener('resize', setRem);
    return () => {
      window.removeEventListener('resize', setRem);
    };
  }, []);

  useEffect(() => {
    pageName.includes('运维') &&
      dispatch({
        //获取运维基础配置
        type: 'global/getOperationSetting',
        payload: {},
      });

    //获取行政区列表
    dispatch({
      type: 'autoForm/getRegions',
      payload: { PointMark: '2', RegionCode: '' },
    });

    // 获取菜单
    dispatch({
      type: 'user/fetchCurrent',
      payload: {},
    });

    return () => {
      // 销毁时：重置state
      dispatch({
        type: 'sysDashboard/onResetState',
      });
    };
  }, []);

  function getFirstChildDeepestPath(item) {
    // 递归函数，用于获取最深层的path
    if (item.children && item.children.length > 0) {
      return getFirstChildDeepestPath(item.children[0]);
    } else {
      return item.path;
    }
  }

  // 获取第一个子节点的最深层的路由
  function getPathFromData(data) {
    // 确保数据在索引 1 的位置存在
    if (data[1]) {
      if (data[1].children && data[1].children.length > 0) {
        // 如果有子节点，获取第一个子节点的最深层 path
        return getFirstChildDeepestPath(data[1].children[0]);
      } else {
        // 如果没有子节点，直接返回当前节点的 path
        return data[1].path;
      }
    }
    return null; // 如果不存在可返回 null 或其他默认值
  }

  // 返回系统
  const gobackSys = () => {
    const deepestPath = getPathFromData(currentMenu);
    router.push(deepestPath);
  };

  // 改变时间
  const onChangeDateTime = data => {
    if (data.key === timeLabel && data.key !== '自定义') {
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
    <div className={`${styles.dashboardPageWrapper} ${styles.ysWrapper}`} ref={containerRef} style={{ ...props.style }}>
      {/* <header className={styles.header}>{pageName}</header> */}
      <header className={styles.header}>智慧运维监管平台</header>
      <div className={styles.leftContent}>
        <div className={styles.menuSelectContent}>
          <div
            className={`${styles.selectedName}  ${
              location.pathname === '/SystemDashboard_YS/MonitoringAnalysis' ? styles.active : ''
            }`}
            onClick={() => {
              router.push('/SystemDashboard_YS/MonitoringAnalysis');
            }}
          >
            监管分析
          </div>
        </div>
        <div className={styles.menuSelectContent}>
          <div
            className={`${styles.selectedName} ${
              location.pathname === '/systemDashboard_YS/Monitoring' ? styles.active : ''
            }`}
            onClick={() => {
              router.push('/systemDashboard_YS/Monitoring');
            }}
          >
            实时监控
          </div>
        </div>
        <div className={styles.menuSelectContent}>
          <div
            className={`${styles.selectedName} ${
              location.pathname === '/SystemDashboard_YS/Operation' ? styles.active : ''
            }`}
            onClick={() => {
              router.push('/SystemDashboard_YS/Operation');
            }}
          >
            智慧运维
          </div>
        </div>
      </div>
      <div className={styles.rightContent}>
        <div className={styles.menuSelectContent}>
          {/* <div className={styles.selectedName}>统计周期</div> */}
          {!props.noDate && (
            <>
              <div className={`${styles.selectedName} ${styles.showList}`}>
                {timeLabel !== '自定义' ? (
                  timeLabel
                ) : (
                  <p className="textOverflow" style={{ fontSize: 12 }}>{`${moment(time[0]).format(
                    'YYYY/MM/DD',
                  )}-${moment(time[1]).format('YYYY/MM/DD')}`}</p>
                )}
              </div>
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
                <li
                  className={timeLabel === '自定义' ? styles.active : ''}
                  onClick={() => {
                    setCustomTimeModalOpen(true);
                  }}
                >
                  自定义
                </li>
              </ul>
            </>
          )}
        </div>
        <div className={styles.menuSelectContent} style={{ marginRight: 10, marginTop: 4 }}>
          <>
            <div className={`${styles.selectedName} ${styles.showList}`} style={{ width: '7.5rem' }}>
              <p className="textOverflow">
                废气
              </p>
            </div>
            <ul>
              <li className={styles.active}>废气</li>
              <li>废水</li>
            </ul>
          </>
        </div>
        <FullscreenToggle
          containerRef={containerRef}
          className={styles.fullscreenToggle}
          style={{ marginRight: 10, marginTop: 4 }}
        />
        <div className={styles.goSystem}>
          <span onClick={gobackSys}>系统入口</span>
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

      <CustomTimeModal
        open={customTimeModalOpen}
        onCancel={() => setCustomTimeModalOpen(false)}
        onDateChange={data => {
          console.log('data', data);
          onChangeDateTime(data);
          setCustomTimeModalOpen(false);
        }}
      />
    </div>
  );
};

export default connect(dvaPropsData)(SystemDashboardPageWrapper);
