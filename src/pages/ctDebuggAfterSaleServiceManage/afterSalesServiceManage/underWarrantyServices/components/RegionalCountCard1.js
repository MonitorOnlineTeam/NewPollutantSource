import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import {
  Card,
} from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

const dvaPropsData = ({ loading, ctAfterSalesServiceManagement }) => ({
  underWarrantyServicesData: ctAfterSalesServiceManagement.underWarrantyServicesData,
  loading: loading.effects['ctAfterSalesServiceManagement/GetWarrantyServiceAnalysis'],
});

const RegionalCountCard1 = props => {
  const [echarts, setEcharts] = useState();

  const {
    date,
    loading,
    underWarrantyServicesData: { LargeRegionAnalysis },
  } = props;

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
        formatter: (params) => {
          console.log('params', params)
          return (
            `${params?.[0].name}<br />
            ${params?.[0]?.marker} ${params?.[0]?.seriesName}：${params?.[0]?.value}次 <br />` +
            `${params?.[3]?.marker} ${params?.[3]?.seriesName}：${params?.[3]?.value}小时 <br />`
          )
        }
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
            // interval: 0,
            // rotate: 30,
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
            normal: {
              opacity: 0.7,
            },
          },
          barWidth: '20',
          symbolOffset: [0, 5],
          data: numSeriesData,
          itemStyle: {
            normal: {
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
          itemStyle: {
            normal: {
              color: '#F6A821',
            },
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
  }, [LargeRegionAnalysis, echarts]);

  return (
    <Card title="大区服务次数，时长" size="small" bodyStyle={{ height: 340 }} loading={loading}>
      {renderEcharts}
    </Card>
  );
};

export default connect(dvaPropsData)(RegionalCountCard1);
