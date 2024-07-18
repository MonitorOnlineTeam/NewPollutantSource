import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

const dvaPropsData = ({ loading, reportsAndViews }) => ({
  underWarrantyServicesData: reportsAndViews.underWarrantyServicesData,
  loading: loading.effects['reportsAndViews/GetWarrantyServiceAnalysis'],
});

const RegionalCountCard1 = props => {
  const [echarts, setEcharts] = useState();

  const {
    title,
    loading,
    underWarrantyServicesData: { LargeRegionAnalysis },
    windowWidth,
    minWidth,
  } = props;
  const windowWidthFlag = windowWidth<=minWidth&&windowWidth>=920

  useEffect(() => {}, []);

  const getOption = () => {
    if (!echarts) {
      return {};
    }

    let xData = [],
      numSeriesData = [],
      timesSeriesData = [];

    LargeRegionAnalysis.map(item => {
      xData.push(item.LargeRegionName);
      numSeriesData.push(item.Num);
      timesSeriesData.push(item.Times);
    });
    let option = {
      // color: ['#26d0d4'],
      tooltip: {
        // valueFormatter: function(value) {
        //   return value + '小时';
        // },
        trigger: 'axis',
        formatter: params => {
          let content = `${params?.[0].name}<br />`;
          params?.[0]
            ? (content += `${params?.[0]?.marker} ${params?.[0]?.seriesName}：${params?.[0]?.value}次 <br />`)
            : '';
          params?.[3]
            ? (content += `${params?.[3]?.marker} ${params?.[3]?.seriesName}：${params?.[3]?.value}小时 <br />`)
            : '';
          return content;
        },
      },
      legend: {},
      grid: {
        borderWidth: 0,
        top: 60,
        bottom: 10,
        right: 20,
        left: 40,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisLine: {
            lineStyle: {
              color: '#EAEAEA',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: windowWidthFlag ? 0 :  30, // 或者其他角度,
            textStyle: {
              // fontSize: 14,
              color: '#333333',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '（次）',
          nameTextStyle: {
            padding: [0, 50, 0, 0],
            color: '#666',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f9f9f9',
            },
          },
        },
        {
          type: 'value',
          name: '（小时）',
          nameTextStyle: {
            padding: [0, 50, 0, 0],
            color: '#666',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f9f9f9',
            },
          },
        },
      ],
      series: [
        {
          name: '服务次数',
          type: 'bar',
          itemStyle: {
            opacity: 0.7,
          },
          barWidth: '20',
          symbolOffset: [0, 5],
          data: numSeriesData,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#33FAFF',
              },
              {
                offset: 1,
                color: '#21C3C6',
              },
            ]),
            opacity: 1,
          },
        },
        {
          name: '服务次数',
          type: 'pictorialBar',
          symbol: 'diamond',
          symbolSize: [22, 8],
          symbolOffset: [0, -5],
          symbolPosition: 'end',
          z: 12,
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#21C3C6',
              fontWeight: 'bold',
              // formatter: '{c}%',
            },
          },
          color: '#2de4e8',
          data: numSeriesData,
        },
        {
          name: '服务次数',
          type: 'pictorialBar',
          symbol: 'diamond',
          symbolSize: [22, 6],
          symbolOffset: [0, 4],
          z: 12,
          color: '#21C3C6',
          data: numSeriesData,
        },

        {
          name: '工作时长',
          data: timesSeriesData,
          type: 'line',
          z: 12,
          yAxisIndex: 1,
          showAllSymbol: true,
          smooth: true,
          symbolSize: 8,
          symbol: 'circle',
          label: {
            show: true,
            position: 'top',
            color: '#F6A821',
            fontWeight: 'bold',
            // formatter: '{c}%',
          },
          itemStyle: {
            color: '#F6A821',
          },
        },
      ],
    };

    return option;
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
  }, [LargeRegionAnalysis, echarts,windowWidth]);

  return (
    <Card title={title} size="small" bodyStyle={{ height: 340 }} loading={loading}>
      {renderEcharts}
    </Card>
  );
};

export default connect(dvaPropsData)(RegionalCountCard1);
