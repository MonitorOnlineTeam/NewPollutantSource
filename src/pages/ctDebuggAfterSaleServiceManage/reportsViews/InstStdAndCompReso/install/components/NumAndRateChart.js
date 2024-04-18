/*
 * @Author: JiaQi
 * @Date: 2024-04-16 16:37:23
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-04-17 16:10:17
 * @Description:  安装调试达标率图表
 */

import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
const dvaPropsData = ({ loading, instStdAndCompReso }) => ({
  loading: loading.effects[`instStdAndCompReso/GetInstallationDebugRate`],
});

const NumAndRateChart = props => {
  const [echarts, setEcharts] = useState();

  const { title, data, fieldNames, loading } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    const lineColor = '#F6A821';
    const barColor1 = { color1: '#83FFD2', color2: '#2BE5A1' };
    const barColor2 = { color1: '#89C9FF', color2: '#399FF5' };

    const color = [
      ['#2BE5A1', '#83FFD2'],
      ['#faad14', '#ffe58f'],
      ['#ff4d4f', '#ffccc7'],
      ['#c7c6c6', '#d9d9d9'],
    ];

    let xAxisData = [];
    let Excellent = [], // 优秀
      Qualified = [], // 合格
      Unqualified = [], // 不合格
      NoPhotos = []; // 无照片
    let rate = [];
    data?.map(item => {
      xAxisData.push(item[fieldNames.title]);
      Excellent.push(item.Excellent);
      Qualified.push(item.Qualified);
      Unqualified.push(item.Unqualified);
      NoPhotos.push(item.NoPhotos);
      rate.push(item.Rate);
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
          interval: 0,
          rotate: 30,
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
        bottom: 84,
        top: 50,
      },
      series: [
        {
          name: '优秀',
          type: 'bar',
          stack: 'one',
          // showBackground: true,
          data: Excellent,
          barMaxWidth: 40,
          barWidth: '58%',
          label: {
            show: true,
            textStyle: {
              color: '#fff',
              fontWeight: 'bold',
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
          z: 1,
        },
        {
          name: '合格',
          type: 'bar',
          stack: 'one',
          data: Qualified,
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
          z: 2,
        },
        {
          name: '不合格',
          type: 'bar',
          stack: 'one',
          data: Unqualified,
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
                  color: color[2][0], // 开始颜色
                },
                {
                  offset: 1,
                  color: color[2][1], // 结束颜色
                },
              ],
            },
          },
          z: 3,
        },
        {
          name: '无照片',
          type: 'bar',
          stack: 'one',
          data: NoPhotos,
          barWidth: '60%',
          barMaxWidth: 40,
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
                  color: color[3][0], // 开始颜色
                },
                {
                  offset: 1,
                  color: color[3][1], // 结束颜色
                },
              ],
            },
          },
          z: 4,
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
          z: 999,
        },
        // {
        //   type: 'bar', //显示背景图
        //   data: ,
        //   itemStyle: { color: 'rgba(86,182,252,0.05)' },
        //   // itemStyle: { color: 'red' },
        //   barWidth: '84%', // 柱形的宽度
        //   barGap: '-120.8%', // Make series be ove
        //   silent: true, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。  为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面
        //   barMinHeight: 1000,
        //   z: -3,
        // },
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
