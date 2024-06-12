/*
 * @Author: JiaQi
 * @Date: 2024-05-06 15:02:06
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-07 09:54:10
 * @Description:  率 - 图表
 */

import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
const dvaPropsData = ({ loading }) => ({
  // loading: loading.effects[`timelinessQualityReport/GetTimelyPassRateListByArea`],
});

const RateChart = props => {
  const [echarts, setEcharts] = useState();

  const { date, data, loading } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    const lineColor = '#F6A821';

    // const color = [
    //   ['#89C9FF', '#399FF5'],
    //   ['#83FFD2', '#2BE5A1'],
    //   ['#c7c6c6', '#d9d9d9'],
    // ];

    let xAxisData = [];
    let ReportTimelyRate = [], // 及时率
      ReportQualifiedRate = [], // 合格率
      ReportTimelyQualifiedRate = []; // 报告及时合格率
    data?.map(item => {
      xAxisData.push(item.largeRegionName);
      ReportTimelyRate.push(item.ReportTimelyRate);
      ReportQualifiedRate.push(item.ReportQualifiedRate);
      ReportTimelyQualifiedRate.push(item.ReportTimelyQualifiedRate);
    });
    return {
      legend: {},
      tooltip: {},
      color:['#399FF5','#95de64','#2BE5A1'],
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
            formatter: '{value}%',
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
          name: '及时率',
          type: 'line',
          data: ReportTimelyRate,
          smooth: true,
          symbol: 'circle',
        },
        {
          name: '合格率',
          type: 'line',
          data: ReportQualifiedRate,
          smooth: true,
          symbol: 'circle',
        },
        {
          name: '报告及时合格率',
          type: 'line',
          data: ReportTimelyQualifiedRate,
          // yAxisIndex: 1,
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
            content += `${item.marker} ${item.seriesName}：${item.value}${'%'} <br />`;
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
    <Card
      title={`${date.format('YYYY年')}大区验收服务报告及时合格率`}
      size="small"
      bodyStyle={{ height: 310 }}
      loading={loading}
    >
      {renderEcharts}
    </Card>
  );
};

export default connect(dvaPropsData)(RateChart);
