/*
 * @Author: JiaQi
 * @Date: 2024-04-16 16:36:46
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-23 14:37:07
 * @Description:  投诉解决率 - 图表
 */
import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
const dvaPropsData = ({ loading, reportsAndViews }) => ({
  loading: loading.effects[`reportsAndViews/GetInstallationDebugRate`],
});

const NumAndRateChart = props => {
  const [echarts, setEcharts] = useState();

  const { title, data, fieldNames, loading } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    const lineColor = '#faad14';

    const color = [
      ['#89C9FF', '#399FF5'],
      ['#83FFD2', '#2BE5A1'],
      ['#c7c6c6', '#d9d9d9'],
    ];

    let xAxisData = [];
    let ComplaintsNum = [], // 投诉次数
      NoComplaintsNum = [], // 未解决
      YesComplaintsNum = []; // 已解决
    let rate = [];
    data?.map(item => {
      xAxisData.push(item[fieldNames.title]);
      ComplaintsNum.push(item.ComplaintsNum);
      NoComplaintsNum.push(item.NoComplaintsNum);
      YesComplaintsNum.push(item.YesComplaintsNum);
      rate.push(item.ComplaintsRate.replace('%', ''));
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
          name: '已解决',
          type: 'bar',
          stack: 'one',
          data: YesComplaintsNum,
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
            color: color[0][1],
            // color: {
            //   x: 0,
            //   y: 0,
            //   x2: 0,
            //   y2: 1,
            //   colorStops: [
            //     {
            //       offset: 0,
            //       color: color[0][0], // 开始颜色
            //     },
            //     {
            //       offset: 1,
            //       color: color[0][1], // 结束颜色
            //     },
            //   ],
            // },
          },
          z: 2,
        },
        {
          name: '未解决',
          type: 'bar',
          stack: 'one',
          data: NoComplaintsNum,
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
            color: lineColor,

            // color: {
            //   x: 0,
            //   y: 0,
            //   x2: 0,
            //   y2: 1,
            //   colorStops: [
            //     {
            //       offset: 0,
            //       color: color[1][0], // 开始颜色
            //     },
            //     {
            //       offset: 1,
            //       color: color[1][1], // 结束颜色
            //     },
            //   ],
            // },
          },
          z: 3,
        },
        // {
        //   name: '无照片',
        //   type: 'bar',
        //   stack: 'one',
        //   data: NoPhotos,
        //   barWidth: '60%',
        //   barMaxWidth: 40,
        //   label: {
        //     show: true,
        //     textStyle: {
        //       color: '#fff',
        //     },
        //   },
        //   itemStyle: {
        //     color: {
        //       x: 0,
        //       y: 0,
        //       x2: 0,
        //       y2: 1,
        //       colorStops: [
        //         {
        //           offset: 0,
        //           color: color[3][0], // 开始颜色
        //         },
        //         {
        //           offset: 1,
        //           color: color[3][1], // 结束颜色
        //         },
        //       ],
        //     },
        //   },
        //   z: 4,
        // },
        {
          name: '达标率',
          type: 'line',
          data: rate,
          yAxisIndex: 1,
          itemStyle: {
            color: color[1][1],
          },
          label: {
            show: true,
            textStyle: {
              color: color[1][1],
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
          params?.map((item, index) => {
            content += `${item.marker} ${item.seriesName}：${item.value}${
              item.seriesName?.includes('率')? '%' : '次'
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
