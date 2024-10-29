import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
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
});

const SystemDashboardPageWrapper = props => {
  const containerRef = useRef(null);

  const [sysList, setSysList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [current, setCurrent] = useState({});
  const [customTimeModalOpen, setCustomTimeModalOpen] = useState(false);

  const { dispatch, timeLabel, children, pageName, currentMenu, time } = props;

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
    pageName === '智慧运维' &&
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

    // 获取中间页
    dispatch({
      type: 'sysDashboard/GetSysList',
      payload: {},
      callback: res => {
        let sysList = mergeData(allSysList, res);
        setSysList(sysList);
        const pageInfo = sysList.find(item => item.key === pageName);
        setPageInfo(pageInfo);
        setCurrent(pageInfo.key);
      },
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

  // 匹配中间页数据
  const mergeData = (arrAll, sysList) => {
    let mergedList = [];

    sysList.forEach(sysItem => {
      const matchingAllItem = arrAll.find(allItem => allItem.ID === sysItem.ID);
      if (matchingAllItem) {
        mergedList.push({
          ...matchingAllItem,
          data: { ...sysItem },
        });
      }
    });

    return mergedList;
  };

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

  // 切换项目
  const UpdateUserProject = projectCode => {
    dispatch({
      type: 'projectManage/UpdateUserProject',
      payload: {
        projectCode,
      },
    });
  };

  return (
    <div className={`${styles.dashboardPageWrapper}`} ref={containerRef}>
      <header className={styles.header}>{pageInfo.title}</header>
      <div className={styles.leftContent}>
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
        {sysList.length > 1 ? (
          <div className={styles.menuSelectContent}>
            <div className={`${styles.selectedName} ${styles.showList}`}>{pageInfo.key}</div>
            <ul>
              {sysList.map(item => {
                return (
                  <li
                    className={pageInfo.key === item.key ? styles.active : ''}
                    key={item.key}
                    onClick={() => {
                      // window.open(`/sessionMiddlePage?sysInfo=${JSON.stringify(item.data)}`);
                      if (current !== item.key) {
                        setCurrent(item.key);
                        UpdateUserProject(undefined);
                        router.push(`/sessionMiddlePage?sysInfo=${JSON.stringify(item.data)}`);
                      }
                    }}
                  >
                    {item.key}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          ''
        )}
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
