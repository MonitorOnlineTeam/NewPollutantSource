/*
 * @Author: JiaQi 
 * @Date: 2023-05-30 14:29:45 
 * @Last Modified by:   JiaQi 
 * @Last Modified time: 2023-05-30 14:29:45 
 * @Description：有效传输率
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Skeleton } from 'antd';
import styles from '../style.less';
import PieChart from './PieChart';

const COLOR = '#5F8CFF';

const dvaPropsData = ({ loading }) => ({
  loading: loading.effects['OperationReport/GetEfficiencyReportDataList'],
});

const YXCS = props => {
  const { dispatch, requestParams, loading } = props;
  // 超标报警核实率
  const [YXCSData, setYXCSData] = useState({
    TransmissionEffectiveRate: '-', // 有效传输率
    TransmissionRate: 0, // 传输率和有效率都用这个字段
  });

  useEffect(() => {
    onQueryData();
  }, [requestParams]);

  // 查询数据
  const onQueryData = () => {
    JSON.stringify(requestParams) !== '{}' &&
      dispatch({
        type: 'OperationReport/GetEfficiencyReportDataList',
        payload: requestParams,
        callback: res => {
          setYXCSData(res);
        },
      });
  };
  return (
    <Card size="small" title="有效传输率">
      <Skeleton active loading={loading} paragraph={{ rows: 5 }}>
        <div className={styles.statisticItemBox}>
          <div className={styles.leftBox} style={{ padding: '20px 0' }}>
            <PieChart
              color={COLOR}
              title="有效传输率"
              rate={YXCSData.TransmissionEffectiveRate}
              height={'100%'}
            />
          </div>
          <div className={styles.line}></div>
          <div className={styles.rightBox}>
            <ul className={styles.YXCSItemBox}>
              <li>
                <label>有效率</label>
                <div className={styles.progressWrapper}>
                  <div className={styles.progressOuter}>
                    <div className={styles.progressInner}>
                      <div
                        className={styles.progressBg}
                        style={{
                          backgroundColor: '#23CFEE',
                          width: YXCSData.TransmissionRate + '%',
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className={styles.rateValue}>{YXCSData.TransmissionRate}%</span>
                </div>
              </li>
              <li>
                <label>传输率</label>
                <div className={styles.progressWrapper}>
                  <div className={styles.progressOuter}>
                    <div className={styles.progressInner}>
                      <div
                        className={styles.progressBg}
                        style={{
                          backgroundColor: '#23CFEE',
                          width: YXCSData.TransmissionRate + '%',
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className={styles.rateValue}>{YXCSData.TransmissionRate}%</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Skeleton>
    </Card>
  );
};

export default connect(dvaPropsData)(YXCS);
