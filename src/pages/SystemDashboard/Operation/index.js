import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal, Space } from 'antd';
import { router } from 'umi';
import Cookie from 'js-cookie';
import styles from './styles.less';
import MapContent from './components/Center/MapContent';
import DeviceInfoCount from './components/Left/DeviceInfoCount_1';
import Inspection from './components/Left/Inspection_2';
import Calibration from './components/Left/Calibration_3';
import ResponseAnalysis from './components/Right/ResponseAnalysis_1';
import ReplacementAnalysis from './components/Right/ReplacementAnalysis_2';
import DeviceDiagnostics from './components/Right/DeviceDiagnostics_3';
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown.jsx';
import FullscreenToggle from './components/FullscreenToggle';
import moment from 'moment';

const currentYear = moment().year(); // 获取当前年份
const dateRangeList = [
  {
    key: '本月',
    value: [moment().startOf('month'), moment()],
  },
  {
    key: '本年',
    value: [moment().startOf('year'), moment()],
  },
  {
    key: '上半年',
    value: [
      moment()
        .startOf('year')
        .subtract(6, 'months'),
      moment()
        .startOf('year')
        .subtract(1, 'days'),
    ],
  },
  {
    key: '下半年',
    value: [
      moment()
        .startOf('year')
        .add(6, 'month'),
      moment().endOf('year'),
    ],
  },
  {
    key: '第一季度',
    value: [
      moment(`${currentYear}-01-01`).startOf('quarter'),
      moment(`${currentYear}-03-31`).endOf('quarter'),
    ],
  },
  {
    key: '第二季度',
    value: [
      moment(`${currentYear}-04-01`).startOf('quarter'),
      moment(`${currentYear}-06-30`).endOf('quarter'),
    ],
  },
  {
    key: '第三季度',
    value: [
      moment(`${currentYear}-07-01`).startOf('quarter'),
      moment(`${currentYear}-09-30`).endOf('quarter'),
    ],
  },
  {
    key: '第四季度',
    value: [
      moment(`${currentYear}-10-01`).startOf('quarter'),
      moment(`${currentYear}-12-31`).endOf('quarter'),
    ],
  },
];

const sysList = [
  {
    key: '监控预警',
    value: '',
  },
  {
    key: '异常数据识别',
    value: '',
  },
  {
    key: '智慧运维',
    value: '/SystemDashboard/Operation',
    title: '污染源智慧运维',
  },
  {
    key: '安装调试',
    value: '',
  },
  {
    key: '监督核查',
    value: '',
  },
];

const dvaPropsData = ({ loading, OperationSysDashboard }) => ({
  timeLabel: OperationSysDashboard.timeLabel,
});

const HomeDataScreen = props => {
  const containerRef = useRef(null);

  const [pageTitle, setPageTitle] = useState('污染源智慧运维');

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
        //获取运维基础配置
        type: 'OperationSysDashboard/updateState',
        payload: {
          level: 1,
          timeLabel: '本月',
          time: [moment().startOf('month'), moment()],
          regionCode: '',
          entCode: '',
        },
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
      type: 'OperationSysDashboard/updateState',
      payload: {
        timeLabel: data.key,
        time: data.value,
      },
    });
  };

  return (
    <div className={styles.dashboardPageWrapper} ref={containerRef}>
      <header className={styles.header}>{pageTitle}</header>
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
          <div className={styles.selectedName}>智慧运维</div>
          <ul>
            {sysList.map(item => {
              return (
                <li
                  className={'智慧运维' === item.key ? styles.active : ''}
                  key={item.key}
                  onClick={() => {
                    // setPageTitle(item.title);
                    window.open(item.value);
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
        <img src="/SystemDashboard/Operation/infoIcon.png" className={styles.message} />
        <div className={styles.userInfoContent}>
          <AvatarDropdown menu style={{ position: 'absolute', right: 20, top: 30 }} />
        </div>
      </div>
      {/* <Tooltip title="返回菜单">
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
              router.push('/ctManage/workbench');
            }
          }}
        />
      </Tooltip> */}
      <main>
        <Row
          gutter={[8, 8]}
          style={{ marginLeft: 0, width: '100%' }}
          className={styles.contentWrapper}
        >
          <Col style={{ width: '27%', minWidth: 400 }} className={styles.leftWrapper}>
            <DeviceInfoCount />
            <Inspection />
            <Calibration />
          </Col>
          <Col style={{ maxWidth: '46%' }} flex={'auto'} className={styles.centerWrapper}>
            {/* 地图 */}
            <MapContent />
          </Col>
          <Col style={{ width: '27%', minWidth: 400 }} className={styles.rightWrapper}>
            <ResponseAnalysis />
            <ReplacementAnalysis />
            <DeviceDiagnostics />
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default connect(dvaPropsData)(HomeDataScreen);
