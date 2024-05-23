/*
 * @Author: JiaQi
 * @Date: 2024-04-17 17:12:56
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-21 08:58:45
 * @Description:  服务响应及时率 - 图表
 */
import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
const dvaPropsData = ({ loading }) => ({
  loading: loading.effects[`reportsAndViews/GetTimelyRateList`],
});

const NumAndRateChart = props => {
  const [echarts, setEcharts] = useState();

  const { title, data, loading } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    const lineColor = '#F6A821';

    const color = [
      ['#89C9FF', '#399FF5'],
      ['#83FFD2', '#2BE5A1'],
      ['#c7c6c6', '#d9d9d9'],
    ];

    let xAxisData = [];
    let timelyCount = [], // 响应及时
      nottimelyCount = []; // 响应不及时
    let rate = [];
    data?.map(item => {
      xAxisData.push(item.largeRegionName);
      timelyCount.push(item.timelyCount);
      nottimelyCount.push(item.nottimelyCount);
      rate.push(item.rate.replace('%', ''));
    });
    return {
      legend: {},
      tooltip: {},
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: '#E7E7E7', // 修改 x 轴的轴线颜色
          },
        },
        axisLabel: {
          // interval: 0,
          // rotate: 30,
          textStyle: {
            // fontSize: 14,
            color: '#383838',
          },
        },
        axisTick: {
          //刻度
          show: false,
        },
        axisPointer: {
          type: 'shadow',
        },
      },
      yAxis: [
        {
          type: 'value',
          min: 0,
          minInterval: 1,
          axisLabel: {
            formatter: '{value}次',
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            //网格线
            lineStyle: {
              //分割线
              color: '#E7E7E7',
              width: 1,
              type: 'dashed', //dotted：虚线 solid:实线
            },
          },
        },
        {
          type: 'value',
          min: 0,
          minInterval: 1,
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      grid: {
        left: 50,
        right: 70,
        bottom: 40,
        top: 50,
      },
      series: [
        {
          name: '响应及时',
          type: 'bar',
          stack: 'one',
          data: timelyCount,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(86, 182, 252, 0.05)',
          },
          barMaxWidth: 40,
          barWidth: '60%',
          label: {
            show: true,
            textStyle: {
              color: '#fff',
              fontWeight: 'bold',
            },
            formatter: function(param) {
              if (param.value == 0) {
                return '';
              } else {
                return param.value;
              }
            },
          },
          itemStyle: {
            color: {
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: color[0][0], // 开始颜色
                },
                {
                  offset: 1,
                  color: color[0][1], // 结束颜色
                },
              ],
            },
          },
          z: 2,
        },
        {
          name: '响应不及时',
          type: 'bar',
          stack: 'one',
          data: nottimelyCount,
          barMaxWidth: 40,
          barWidth: '60%',
          label: {
            show: true,
            textStyle: {
              color: '#fff',
              fontWeight: 'bold',
            },
            formatter: function(param) {
              if (param.value == 0) {
                return '';
              } else {
                return param.value;
              }
            },
          },
          itemStyle: {
            color: {
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: color[1][0], // 开始颜色
                },
                {
                  offset: 1,
                  color: color[1][1], // 结束颜色
                },
              ],
            },
          },
          z: 3,
        },
        {
          name: '达标率',
          type: 'line',
          data: rate,
          yAxisIndex: 1,
          itemStyle: {
            color: lineColor,
          },
          label: {
            show: true,
            textStyle: {
              color: lineColor,
              fontWeight: 'bold',
            },
            formatter: function(params) {
              return params.data + '%';
            },
          },
          smooth: true,
          symbol: 'circle',
          z: 5,
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let content = `${params?.[0].name}<br />`;
          params.map((item, index) => {
            content += `${item.marker} ${item.seriesName}：${item.value}${
              index === params.length - 1 ? '%' : '次'
            } <br />`;
          });
          return content;
        },
      },
    };
  };

  const renderEcharts = useMemo(() => {
    return (
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart.echarts);
        }}
        option={getOption()}
        style={{ height: '100%' }}
        className="echarts-for-echarts"
        theme="my_theme"
      />
    );
  }, [data, echarts]);

  return (
    <Card title={title} size="small" bodyStyle={{ height: 310 }} loading={loading}>
      {renderEcharts}
    </Card>
  );
};

export default connect(dvaPropsData)(NumAndRateChart);
