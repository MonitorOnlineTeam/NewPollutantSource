/*
 * @Author: JiaQi
 * @Date: 2024-03-25 15:29:55
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-26 14:31:56
 * @Description:  大区重复服务次数
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

const RepeatCount = props => {
  const [echarts, setEcharts] = useState();

  const {
    date,
    loading,
    repeatServicesData: { LargeRegionAnalysis },
  } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    const max = LargeRegionAnalysis.length ? _.maxBy(LargeRegionAnalysis, 'Times').Times : 0;
    let seriesData2 = [],
      xData = [];
    let seriesData = LargeRegionAnalysis.map(item => {
      xData.push(item.LargeRegionName);
      seriesData2.push(max + 1);
      return item.Times;
    });

    if (!echarts) {
      return {};
    }
    var color = ['#20E229', '#A8FD03'];
    let series = [
      {
        type: 'pictorialBar',
        symbol: 'path://M35,0L35,70L0,70z M35,0L35,70L70,70z',
        data: seriesData,
        symbolOffset: [0, -10],
        z: 99,
        barMaxWidth: 40,
        label: {
          show: true,
          position: 'top',
          color: '#2F9AFF',
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#168FFF',
              },
              {
                offset: 1,
                color: 'rgba(22, 143, 255, 0)',
              },
            ]),
            opacity: 1,
          },
        },
      },
      {
        data: seriesData2,
        type: 'bar',
        barMaxWidth: 40,
        barGap: '-100%',
        zlevel: -1,
        itemStyle: {
          color: '#F6FBFF',
        },
      },
    ];
    let option = {
      // tooltip: {
      //   show: true,
      //   // formatter: '{c}' + '个人',
      // },
      // toolbox: {
      //   show: true,
      //   top: 10,
      //   right: 10,
      // },
      
      grid: {
        borderWidth: 0,
        bottom: 40,
        right: 40,
        left: 60,
        // textStyle: {
        //   color: '#fff',
        // },
      },
      xAxis: [
        {
          type: 'category',
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
            // formatter: function(value, index) {
            //   if (index == 0) {
            //     return `{clickItem|${value}}`;
            //   } else {
            //     return `{defalutItem|${value}}`;
            //   }
            // },
            textStyle: {
              // fontSize: 14,
              color: '#383838',
            },
          },
          data: xData,
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
          // axisLabel: {
          //   textStyle: {
          //     color: '#666',
          //     fontSize: 16,
          //   },
          // },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f9f9f9',
            },
          },
        },
      ],
      series,
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
  }, [LargeRegionAnalysis, echarts]);

  return (
    <Card title="大区重复服务次数" size="small" bodyStyle={{ height: 300 }} loading={loading}>
      {renderEcharts}
    </Card>
  );
};

export default connect(dvaPropsData)(RepeatCount);
