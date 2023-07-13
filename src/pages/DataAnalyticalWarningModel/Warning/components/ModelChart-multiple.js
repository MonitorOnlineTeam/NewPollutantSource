import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {} from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from '../../styles.less';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const ModelChart2 = props => {
  const { chartData, color } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    const { data, title } = chartData;

    let seriesData = data.map(item => {
      return {
        name: `${item.PointName || item.pollutantName}`,
        data: item.data,
        type: 'line',
      };
    });

    let xAxisData = data[0].date.map(item => moment(item).format('MM-DD HH:mm'));

    return {
      color: color || ['#5470c6', '#91cc75'],
      title: {
        text: title,
        left: 'left',
      },
      legend: {
        // selectedMode: 'single',
        x: 'center', // 可设定图例在左、右、居中
        y: 'bottom', // 可设定图例在上、下、居中
        padding: [15, 30, 0, 0], // 可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        // data: ['Email'],
      },
      tooltip: { 
        trigger: 'axis',
      },
      grid: {
        left: 20,
        right: 60,
        bottom: 30,
        top: 50,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        splitLine: {
          show: true,
        },
      },
      yAxis: {
        type: 'value',
        // splitLine: {
        //   show: true,
        // },
      },
      series: seriesData,
    };
  };

  return (
    <div className={styles.chartBox}>
      {chartData.trend && <span className={styles.trend}>趋势相似度 {chartData.trend}</span>}
      <ReactEcharts
        option={getOption()}
        lazyUpdate
        style={{ height: '240px', width: '100%', margin: '10px 0' }}
        // onEvents={onEvents}
      />
    </div>
  );
};

export default connect(dvaPropsData)(ModelChart2);
