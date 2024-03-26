/*
 * @Author: JiaQi
 * @Date: 2024-03-25 15:30:21
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-26 14:32:09
 * @Description:  重复服务原因次数
 */
import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Row,
  Col,
  message,
  Divider,
} from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

const dvaPropsData = ({ loading, repeatServices }) => ({
  repeatServicesData: repeatServices.repeatServicesData,
  loading: loading.effects[`repeatServices/GetRepeatServiceAnalysis`],
});

const ReasonsCount = props => {
  const [echarts, setEcharts] = useState();

  const {
    date,
    loading,
    repeatServicesData: { TimeoutReasonAnalysis },
  } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    if (!echarts) {
      return {};
    }

    let xData = [];
    let seriesData = TimeoutReasonAnalysis.map(item => {
      xData.push(item.ReasonName);
      return item.Times;
    });
    let option = {
      color: ['#FFAE38'],
      tooltip: {
        valueFormatter: function(value) {
          return value + '次';
        },
      },
      grid: {
        borderWidth: 0,
        top: 40,
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
            rotate: 30,
            textStyle: {
              // fontSize: 14,
              color: '#383838',
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
      ],
      series: [
        {
          name: '',
          type: 'pictorialBar',
          symbolSize: [20, 8],
          symbolOffset: [0, -5],
          symbolPosition: 'end',
          z: 12,
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#EEAA3E',
              // formatter: '{c}%',
            },
          },
          data: seriesData,
        },
        {
          name: '',
          type: 'pictorialBar',
          symbolSize: [20, 6],
          symbolOffset: [0, 0],
          z: 12,
          color: '#F8C958',
          data: seriesData,
        },
        {
          type: 'bar',
          itemStyle: {
            normal: {
              opacity: 0.7,
            },
          },
          barWidth: '20',
          symbolOffset: [0, 5],
          data: seriesData,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#F8C958',
                },
                {
                  offset: 1,
                  color: '#FFAE38',
                },
              ]),
              opacity: 1,
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
          debugger;
          echart && setEcharts(echart.echarts);
        }}
        option={getOption()}
        style={{ height: '100%' }}
        className="echarts-for-echarts"
        theme="my_theme"
      />
    );
  }, [TimeoutReasonAnalysis, echarts]);

  return (
    <Card title="重复服务原因次数" size="small" bodyStyle={{ height: 300 }} loading={loading}>
      {renderEcharts}
    </Card>
  );
};

export default connect(dvaPropsData)(ReasonsCount);
