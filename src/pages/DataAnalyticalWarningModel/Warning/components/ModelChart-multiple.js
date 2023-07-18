/*
 * @Author: JiaQi
 * @Date: 2023-07-18 10:36:00
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-07-18 10:37:30
 * @Description：模型异常特征 - 多图例折线图
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {} from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from '../../styles.less';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const ModelChartMultiple = props => {
  const { chartData, color, WarningTypeCode } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    const { data, title } = chartData;

    // 多Y轴（同一现场借用其他合格监测设备数据，引用错误、虚假的原始信号值 ）
    let isMultipleYAxis =
      WarningTypeCode === 'ab2bf5ec-3ade-43fc-a720-c8fd92ede402' ||
      WarningTypeCode === 'f021147d-e7c6-4c1d-9634-1d814ff9880a';

    let yAxisData = isMultipleYAxis
      ? []
      : {
          type: 'value',
        };

    let seriesData = data.map((item, index) => {
      let yAxisIndex = {};
      if (isMultipleYAxis) {
        yAxisIndex = {
          yAxisIndex: index,
        };
        yAxisData.push({
          type: 'value',
          name: item.PointName || item.pollutantName,
          alignTicks: true,
          nameLocation: 'end',
          axisLine: {
            show: true,
          },
        });
      }
      return {
        name: `${item.PointName || item.pollutantName}`,
        data: item.data,
        type: 'line',
        ...yAxisIndex,
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
        left: 40,
        right: 60,
        bottom: 30,
        top: 70,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        splitLine: {
          show: true,
        },
      },
      yAxis: yAxisData,
      series: seriesData,
    };
  };

  return (
    <div className={styles.chartBox}>
      {chartData.trend && <span className={styles.trend}>趋势相似度 {chartData.trend}</span>}
      <ReactEcharts
        option={getOption()}
        lazyUpdate
        style={{ height: '300px', width: '100%', margin: '10px 0' }}
        // onEvents={onEvents}
      />
    </div>
  );
};

export default connect(dvaPropsData)(ModelChartMultiple);
