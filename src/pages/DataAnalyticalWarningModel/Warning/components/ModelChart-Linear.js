import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {} from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from '../../styles.less';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const ModelChartLinear = props => {
  const { chartData } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    const { startPoint, endPoint, data } = chartData;
    let minArr = _.min(data);
    console.log('minArr', minArr);
    const markLineOpt = {
      animation: false,
      label: {
        formatter: `R² = ${chartData.linear}`,
        align: 'right',
        padding: [0, 0, 20, 0],
        fontSize: 14,
      },
      lineStyle: {
        type: 'solid',
      },
      tooltip: {
        formatter: `R² = ${chartData.linear}`,
      },
      data: [
        [
          {
            coord: startPoint,
            symbol: 'none',
          },
          {
            coord: endPoint,
            symbol: 'none',
          },
        ],
      ],
    };
    return {
      title: {
        text: chartData.title,
        left: 'left',
        top: 0,
      },
      // grid: [{ left: '7%', top: '7%', width: '38%', height: '38%' }],
      tooltip: {
        formatter: ' {a}: ({c})',
      },
      xAxis: [
        {
          name: chartData.names[0],
          nameLocation: 'middle',
          nameGap: 35,
          gridIndex: 0,
          min: startPoint[0],
          // min: Math.floor(minArr[0]),
          max: endPoint[0],
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          name: chartData.names[1],
          nameLocation: 'middle',
          nameGap: 35,
          gridIndex: 0,
          // min: Math.floor(minArr[1]),
          min: startPoint[1] < 0 ? startPoint[1] - 5 : startPoint[1],
          max: endPoint[1],
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: chartData.names.join('，'),
          type: 'scatter',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: chartData.data,
          markLine: markLineOpt,
        },
      ],
    };
  };

  return (
    <div className={styles.chartBox}>
      <ReactEcharts
        option={getOption()}
        lazyUpdate
        style={{ height: '300px', width: '100%', margin: '10px 0' }}
        // onEvents={onEvents}
      />
    </div>
  );
};

export default connect(dvaPropsData)(ModelChartLinear);
