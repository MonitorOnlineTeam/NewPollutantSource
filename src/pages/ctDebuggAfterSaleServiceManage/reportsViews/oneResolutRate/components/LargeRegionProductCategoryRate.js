/*
 * @Author: jab
 * @Date: 2024-04
 * @Description:  大区质保内服务一次解决率
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
import moment from 'moment';
const dvaPropsData = ({ loading, oneResolutRate }) => ({
  disposableRateList: oneResolutRate.disposableRateList,
  disposableDate: oneResolutRate.disposableDate,
  loading: loading.effects[`oneResolutRate/GetDisposableRateList`],
});

const Index = props => {
  const [echarts, setEcharts] = useState();

  const {
    type,
    disposableRateList,
    loading,
    disposableDate,
  } = props;

  useEffect(() => { }, []);

  const getOption = () => {
    const lineColor = '#F6A821'
    const barColor1 = { color1: '#83FFD2', color2: '#2BE5A1' }
    const barColor2 = { color1: '#89C9FF', color2: '#399FF5' }

    let xAxisData = [];
    let data1 = [];
    let data2 = [];
    let rate = [];
    const data = type == 1 ? disposableRateList?.LargeRegionAnalysis : disposableRateList?.TimeoutReasonAnalysis
    data?.map(item => {
      xAxisData.push(type == 1 ? item.largeRegionName : item.reasonName)
      data1.push(item.solveCount)
      data2.push(item.notSolveCount)
      rate.push(item.rate)
    })
    return {
      legend: {
        data: [
          {
            name: '已解决次数',
            type: 'square',
            itemStyle: {
              color: {
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{
                  offset: 0, color: barColor1.color1  // 开始颜色
                }, {
                  offset: 1, color: barColor1.color2  // 结束颜色
                }]
              }
            }
          },
          {
            name: '未解决次数',
            type: 'square',
            itemStyle: {
              color: {
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{
                  offset: 0, color: barColor2.color1  // 开始颜色
                }, {
                  offset: 1, color: barColor2.color2  // 结束颜色
                }]
              }
            }
          },
          {
            name: '一次解决率',
            type: 'line',

          },
        ]
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: '#E7E7E7'  // 修改 x 轴的轴线颜色
          }
        },
        axisLabel: {
          rotate: 45, // 或者其他角度
          textStyle: {
            color: '#333'  // 修改 x 轴刻度文字的颜色
          }
        },
        axisTick: { //刻度
          show: false,
        },
        axisPointer: {
          type: 'shadow'
        },

      },
      yAxis: [
        {
          type: 'value',
          min: 0,
          minInterval:1,
          axisLabel: {
            formatter: '{value}次'
          },
          axisTick: {
            show: false,
          },
          splitLine: { //网格线
            lineStyle: { //分割线
              color: "#E7E7E7",
              width: 1,
              type: "dashed" //dotted：虚线 solid:实线
            }
          },

        },
        {
          type: 'value',
          min: 0,
          minInterval:1,
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      grid: {
        left: 50,
        right: 70,
        bottom: type==1? 80 : 120,
        top: 40,
      },
      series: [
        {
          name: '已解决次数',
          type: 'bar',
          stack: 'one',//数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加。
          data: data1,
          barWidth: '58%',
          label: {
            show: true,
            textStyle: {
              color: '#fff'
            },
            formatter: function (params) {
              return params.value == 0? '' : params.value;
            },
          },
          itemStyle: {
            color: {
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{
                offset: 0, color: barColor1.color1  // 开始颜色
              }, {
                offset: 1, color: barColor1.color2  // 结束颜色
              }]
            },
          },
          z: 1
        },
        {
          name: '未解决次数',
          type: 'bar',
          stack: 'one',
          data: data2,
          barWidth: '58%',
          label: {
            show: true,
            textStyle: {
              color: '#fff'
            },
            formatter: function (params) {
              return params.value == 0? '' : params.value;
            },
          },
          itemStyle: {
            color: {
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{
                offset: 0, color: barColor2.color1  // 开始颜色
              }, {
                offset: 1, color: barColor2.color2  // 结束颜色
              }]
            }
          },
          z: 2
        },
        {
          name: '一次解决率',
          type: 'line',
          data: rate,
          yAxisIndex: 1,
          itemStyle: {
            color: lineColor,
          },
          label: {
            show: true,
            color: lineColor,
            formatter: function (params) {
              return params.data + "%";
            },
          },
          smooth: true,
          symbol: 'circle',
          z: 3
        },
        {
          type: 'bar', //显示背景图 
          data: data1,
          itemStyle: { color: 'rgba(86,182,252,0.05)' },
          // itemStyle: { color: 'red' },
          barWidth: '84%',  // 柱形的宽度
          barGap: '-120.8%', // Make series be ove
          silent: true, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。  为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面 
          barMinHeight: 1000,
          z: -3,
          tooltip:{
            show:false
          }
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          console.log(params)
          return params[0] && (
            `${params[0].name}<br /> ${params[0].marker} ${params[0].seriesName}：${params[0].value}${ params[0].seriesName?.includes('次数')? '次' : '%'} <br />`
            + (params[1]? `${params[1].marker} ${params[1].seriesName}：${params[1].value}${ params[1].seriesName?.includes('次数')? '次' : '%'} <br />` : '')
            + (params[2]?  `${params[2].marker} ${params[2].seriesName}：${params[2].value}%` : '')
          )
        }
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
  }, [disposableRateList, echarts]);

  return (
    <Card title={`${disposableDate && moment(disposableDate).format('YYYY年')}${type == 1 ? `大区` : '产品类别'}质保内服务一次解决率`} size="small" bodyStyle={{ height: 300 }} loading={loading}>
      {renderEcharts}
    </Card>
  );
};

export default connect(dvaPropsData)(Index);
