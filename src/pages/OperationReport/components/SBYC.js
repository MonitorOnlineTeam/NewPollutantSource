/*
 * @Author: JiaQi 
 * @Date: 2023-05-30 14:28:24 
 * @Last Modified by:   JiaQi 
 * @Last Modified time: 2023-05-30 14:28:24 
 * @Description：设备异常统计
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Skeleton } from 'antd';
import styles from '../style.less';
import PieChart from './PieChart';
import ReactEcharts from 'echarts-for-react';

const COLOR = '#5F8CFF';

const data = {
  rate: 95,
  datas: [
    {
      value: 10,
      name: '报警',
    },
    {
      value: 10,
      name: '已核实',
    },
  ],
};

const dvaPropsData = ({ OperationReport, loading }) => ({
  SBYCData: OperationReport.SBYCData,
  loading: loading.effects['OperationReport/GetOpertionExceptionList'],
});

const SBYC = props => {
  const {
    dispatch,
    requestParams,
    loading,
    SBYCData: {
      rate,
      missingDataRate,
      dataConstantRate,
      dataZeroRate,
      faultDataRate,
      systemMaintenanceRate,
    },
  } = props;

  useEffect(() => {
    onQueryData();
  }, [requestParams]);

  // 查询数据
  const onQueryData = () => {
    JSON.stringify(requestParams) !== '{}' &&
      dispatch({
        type: 'OperationReport/GetOpertionExceptionList',
        payload: requestParams,
      });
  };

  // missingDataRate: 0, // 数据缺失率
  // dataConstantRate: 0, // 数据恒定值率
  // dataZeroRate: 0, // 数据零值率
  // faultDataRate: 0, // 设备故障率
  // systemMaintenanceRate: 0, // 系统维护率

  const notValueFormat = (value, result) => {
    if (value === '-') {
      return result;
    } else {
      return value + '%';
    }
  };

  return (
    <Card size="small" title="设备异常统计" bodyStyle={{ height: 230 }}>
      <Skeleton active loading={loading} paragraph={{ rows: 5 }}>
        <div className={styles.statisticItemBox}>
          <div className={styles.leftBox} style={{ padding: '20px 0' }}>
            <PieChart color={COLOR} title="设备异常率" rate={rate} height={'100%'} />
          </div>
          <div className={styles.line}></div>
          <div className={styles.rightBox}>
            <ul className={styles.SBYCItemBox}>
              <li>
                <label>数据缺失</label>
                <div className={styles.progressWrapper}>
                  <div className={styles.progressOuter}>
                    <div className={styles.progressInner}>
                      <div
                        className={styles.progressBg}
                        style={{ width: notValueFormat(missingDataRate, 0) }}
                      ></div>
                    </div>
                  </div>
                  <span className={styles.rateValue}>{notValueFormat(missingDataRate, '-')}</span>
                </div>
              </li>
              <li>
                <label>数据恒定值</label>
                <div className={styles.progressWrapper}>
                  <div className={styles.progressOuter}>
                    <div className={styles.progressInner}>
                      <div
                        className={styles.progressBg}
                        style={{ width: notValueFormat(dataConstantRate, 0) }}
                      ></div>
                    </div>
                  </div>
                  <span className={styles.rateValue}>{notValueFormat(dataConstantRate, '-')}</span>
                </div>
              </li>
              <li>
                <label>数据零值</label>
                <div className={styles.progressWrapper}>
                  <div className={styles.progressOuter}>
                    <div className={styles.progressInner}>
                      <div
                        className={styles.progressBg}
                        style={{ width: notValueFormat(dataZeroRate, 0) }}
                      ></div>
                    </div>
                  </div>
                  <span className={styles.rateValue}>{notValueFormat(dataZeroRate, '-')}</span>
                </div>
              </li>
              <li>
                <label>设备故障</label>
                <div className={styles.progressWrapper}>
                  <div className={styles.progressOuter}>
                    <div className={styles.progressInner}>
                      <div
                        className={styles.progressBg}
                        style={{ width: notValueFormat(faultDataRate, 0) }}
                      ></div>
                    </div>
                  </div>
                  <span className={styles.rateValue}>{notValueFormat(faultDataRate, '-')}</span>
                </div>
              </li>
              <li>
                <label>系统维护</label>
                <div className={styles.progressWrapper}>
                  <div className={styles.progressOuter}>
                    <div className={styles.progressInner}>
                      <div
                        className={styles.progressBg}
                        style={{ width: notValueFormat(systemMaintenanceRate, 0) }}
                      ></div>
                    </div>
                  </div>
                  <span className={styles.rateValue}>
                    {notValueFormat(systemMaintenanceRate, '-')}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Skeleton>
    </Card>
  );
};

export default connect(dvaPropsData)(SBYC);
