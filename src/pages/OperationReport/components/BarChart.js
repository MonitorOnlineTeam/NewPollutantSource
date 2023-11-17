/*
 * @Author: JiaQi 
 * @Date: 2023-05-30 14:26:09 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-30 14:26:33
 * @Description: 柱状图
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';

const dvaPropsData = ({ OperationReport, loading }) => ({});

const BarChart = props => {
  const { chartData } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    let option = {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: 40,
        right: 20,
        bottom: 10,
        top: 20,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: chartData.xAxisData,
        axisLine: {
          //x轴
          lineStyle: {
            color: '#eeeeee',
            width: 1,
          },
        },
        axisTick: {
          //x轴 去掉刻度
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#333333',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false }, //y轴
        axisTick: { show: false },
        splitLine: {
          //x轴分割线
          lineStyle: {
            color: '#f5f5f5',
          },
        },
      },
      series: [
        {
          data: chartData.seriesData,
          type: 'bar',
          barWidth: 30,
          itemStyle: {
            normal: {
              color: {
                type: 'linear', // 线性渐变
                //  x: 0,  y: 0, x2: 1, y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: '#28CBFA', // 0%处的颜色为红色
                  },
                  {
                    offset: 1,
                    color: '#64B0FD', // 100%处的颜色为蓝
                  },
                ],
              },
            },
          },
        },
      ],
    };
    return option;
  };

  return <ReactEcharts option={getOption()} style={{ height: '100%', width: '100%' }} />;
};

export default connect(dvaPropsData)(BarChart);
