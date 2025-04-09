/**
 * 功能：首页
 * 创建人：jab
 * 创建时间：2021.11.03
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Card,
  Button,
  Select,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
  Popover,
  Radio,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon';
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading';
import moment from 'moment';
import styles from './style.less';
const { Option } = Select;
import WasteWater from './wasteWater';
import WasteGas from './wasteGas';
import SurfaceWater from './surfaceWater';
import ActoryBoundary from './actoryBoundary';
import Air from './air';
import { setRem } from '@/utils/utils.js';
import SystemDashboardPageWrapper from '@/pages/SystemDashboard/components/SystemDashboardPageWrapper.js';

const namespace = 'newestHome';

const dvaPropsData = ({ loading, newestHome }) => ({
  tabType: newestHome.tabType,
});

const dvaDispatch = dispatch => {
  return {
    getnewestHomeList: (payload, callback) => {
      dispatch({
        type: `${namespace}/getnewestHomeList`,
        payload: payload,
        callback: callback,
      });
    },
    updateState: payload => {
      //更新代码
      dispatch({
        type: `${namespace}/updateState`,
        payload: { ...payload },
      });
    },
  };
};
const Index = props => {
  // rem等比适配配置文件
  useEffect(() => {
    setRem();
    // 监听窗口大小变化
    window.addEventListener('resize', setRem);
    return () => {
      window.removeEventListener('resize', setRem);
    };
  }, []);

  const pollutantCode = Number(sessionStorage.getItem('sysPollutantCodes'));

  let tabList = [
    { text: '废气', val: 2 },
    { text: '废水', val: 1 },
    // {text:'空气站',val:"air"},
    // {text:'地表水',val:"surfaceWater"},
    // {text:'厂界',val:"actoryBoundary"},
  ];
  if (pollutantCode) {
    tabList = tabList?.filter(item => item.val == pollutantCode);
  }

  const [type, setType] = useState(tabList?.[0]?.val);

  const [selectkey, SetSelectkey] = useState(tabList?.[0]?.val);

  const tabClick = val => {
    SetSelectkey(val);
    setTimeout(() => { 
      setType(val);
    }, 200);
  };

  const typeObj = {
    1: <WasteWater {...props}/>,
    2: <WasteGas  {...props}/>,
    surfaceWater: <SurfaceWater />,
    air: <Air />,
    actoryBoundary: <ActoryBoundary />,
  };
  return (
    <SystemDashboardPageWrapper
      pageName={type === 1 ? '废水运维' : '废气运维'}
      noDate
      style={{ backgroundImage: 'url(/StandardScreen/bg.jpg)' }}
    >
      <div className={styles.homeContent}>
        {tabList?.length > 1 && (
          <div className={styles.headerTabSty}>
            {tabList.map(item => {
              return (
                <span
                  key={item.val}
                  className={selectkey === item.val ? `${styles.selectSty}` : `${styles.normalSty}`}
                  onClick={() => {
                    tabClick(item.val);
                  }}
                >
                  {item.text}
                </span>
              );
            })}
          </div>
        )}
        {typeObj[type]}
      </div>
    </SystemDashboardPageWrapper>
  );
};
export default connect(
  dvaPropsData,
  dvaDispatch,
)(Index);
