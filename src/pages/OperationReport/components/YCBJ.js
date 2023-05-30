import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Badge, Divider, Skeleton } from 'antd';
import styles from '../style.less';
import PieChart from './PieChart';
import ReactEcharts from 'echarts-for-react';

const COLOR = '#FFCC5F';

const dvaPropsData = ({ OperationReport, loading }) => ({
  loading: loading.effects['OperationReport/GetExceptionReportDataList'],
});

const YCBJ = props => {
  const { dispatch, requestParams, loading } = props;
  // 异常报警响应
  const [YCBJData, setYCBJData] = useState({
    ZeroAlarmCount: '-', // 零值报警次数
    ZeroResponedCount: '-', //  零值响应次数
    ZeroRate: '-', //  零值响应率
    RangeAlarmCount: '-', //   超量程报警次数
    RangeResponedCount: '-', //  超量程响应次数
    RangeRate: '-', //  超量程率
    AllwaysAlarmCount: '-', //  恒定值报警次数
    AllwaysResponedCount: '-', // 恒定值响应次数
    AllwaysRate: '-', //  恒定值率
    ExceptionAlarmCount: '-', //  异常报警次数
    ExceptionResponedCount: '-', //  异常响应次数
    ExceptionRate: '-', //  异常率
  });

  useEffect(() => {
    onQueryData();
  }, [requestParams]);

  // 查询数据
  const onQueryData = () => {
    JSON.stringify(requestParams) !== '{}' &&
      dispatch({
        type: 'OperationReport/GetExceptionReportDataList',
        payload: {
          ...requestParams,
          DGIMN: requestParams.DGIMN ? requestParams.DGIMN.split(',') : [],
        },
        callback: res => {
          setYCBJData(res);
        },
      });
  };

  const getOption = data => {
    let value = data === '-' ? 0 : data;
    const chartData = [
      {
        value: value,
        name: '完成',
      },
      {
        value: 100 - value,
        name: '未完成',
      },
      {
        value: 100,
        itemStyle: {
          // stop the chart from rendering this piece
          color: 'none',
          decal: {
            symbol: 'none',
          },
        },
        label: {
          show: false,
        },
      },
    ];

    let option = {
      color: ['#ffcc5f', '#E8E8E8'],
      tooltip: {
        show: false,
      },
      series: [
        {
          name: '智能质控',
          type: 'pie',
          radius: ['76%', '100%'],
          center: ['50%', '70%'],
          startAngle: 180,
          top: -4,
          bottom: -4,
          left: -4,
          right: -4,
          itemStyle: {
            borderRadius: 20,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            normal: {
              show: true,
              position: 'center',
              padding: [-10, 0, 0, 0],
              textStyle: {
                fontSize: 14,
                color: 'rgba(0, 0, 0, 0.4)',
              },
              formatter: function() {
                const label = data === '-' ? '-' : data + '%';
                return label;
              },
            },
          },
          data: chartData,
        },
      ],
    };
    return option;
  };

  const {
    ZeroAlarmCount,
    ZeroResponedCount,
    ZeroRate,
    RangeAlarmCount,
    RangeResponedCount,
    RangeRate,
    AllwaysAlarmCount,
    AllwaysResponedCount,
    AllwaysRate,
    ExceptionAlarmCount,
    ExceptionResponedCount,
    ExceptionRate,
  } = YCBJData;

  return (
    <Card size="small" title="异常报警响应统计">
      <Skeleton active loading={loading} paragraph={{ rows: 5 }}>
        <div className={styles.statisticItemBox}>
          <div className={styles.leftBox}>
            <PieChart color={COLOR} title="异常报警响应率" rate={ExceptionRate} />
            <Row className={styles.statisticItemValue}>
              <Col span={12}>
                <Badge color={COLOR} text={`报警：${ExceptionAlarmCount}次`} />
              </Col>
              <Col span={12}>
                <Badge color={COLOR} text={`已响应：${ExceptionResponedCount}次`} />
              </Col>
            </Row>
          </div>
          <div className={styles.line}></div>
          <div className={styles.rightBox}>
            <ul className={styles.YCBJItemBox}>
              <li>
                <div className={styles.textInfo}>
                  <p className={styles.title}>
                    <i></i>零值报警响应率
                  </p>
                  <p className={styles.values}>
                    <span>报警:{ZeroAlarmCount}次</span>
                    <Divider type="vertical" />
                    <span>已响应:{ZeroResponedCount}次</span>
                  </p>
                </div>
                <div className={styles.chartBox}>
                  <ReactEcharts
                    option={getOption(ZeroRate)}
                    style={{ height: 'calc(100%)', width: '100%' }}
                  />
                </div>
              </li>
              <li>
                <div className={styles.textInfo}>
                  <p className={styles.title}>
                    <i></i>超量程报警响应率
                  </p>
                  <p className={styles.values}>
                    <span>报警:{RangeAlarmCount}次</span>
                    <Divider type="vertical" />
                    <span>已响应:{RangeResponedCount}次</span>
                  </p>
                </div>
                <div className={styles.chartBox}>
                  <ReactEcharts
                    option={getOption(RangeRate)}
                    style={{ height: 'calc(100%)', width: '100%' }}
                  />
                </div>
              </li>
              <li>
                <div className={styles.textInfo}>
                  <p className={styles.title}>
                    <i></i>恒定值报警响应率
                  </p>
                  <p className={styles.values}>
                    <span>报警:{AllwaysAlarmCount}次</span>
                    <Divider type="vertical" />
                    <span>已响应:{AllwaysResponedCount}次</span>
                  </p>
                </div>
                <div className={styles.chartBox}>
                  <ReactEcharts
                    option={getOption(AllwaysRate)}
                    style={{ height: 'calc(100%)', width: '100%' }}
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Skeleton>
    </Card>
  );
};

export default connect(dvaPropsData)(YCBJ);
