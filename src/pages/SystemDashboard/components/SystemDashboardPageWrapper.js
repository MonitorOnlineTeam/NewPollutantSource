import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
import { router } from 'umi';
import styles from '../styles.less';
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown.jsx';
import FullscreenToggle from './FullscreenToggle';
import { allSysList, dateRangeList } from '../CONST';

const dvaPropsData = ({ loading, sysDashboard, user }) => ({
  timeLabel: sysDashboard.timeLabel,
  currentMenu: user.currentMenu,
});

const HomeDataScreen = props => {
  const containerRef = useRef(null);

  const [sysList, setSysList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [current, setCurrent] = useState({});

  const { dispatch, timeLabel, children, pageName, currentMenu } = props;

  console.log('currentMenu', currentMenu);
  useEffect(() => {
    pageName === '智慧运维' &&
      dispatch({
        //获取运维基础配置
        type: 'global/getOperationSetting',
        payload: {},
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
        {sysList.length > 1 ? (
          <div className={styles.menuSelectContent}>
            <div className={`${styles.selectedName} ${styles.showList}`}>
              {pageInfo.key}
            </div>
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
    </div>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
