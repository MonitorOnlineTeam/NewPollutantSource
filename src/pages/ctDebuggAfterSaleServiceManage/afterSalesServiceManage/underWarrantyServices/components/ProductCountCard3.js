import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

const dvaPropsData = ({ loading, reportsAndViews }) => ({
  underWarrantyServicesData: reportsAndViews.underWarrantyServicesData,
  loading: loading.effects['reportsAndViews/GetWarrantyServiceAnalysis'],
});

const ProductCountCard3 = props => {
  const [echarts, setEcharts] = useState();

  const {
    loading,
    title,
    underWarrantyServicesData: { WarrantyAnalysis },
    type,
  } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    if (!echarts) {
      return {};
    }

    let xData = [],
      numSeriesData = [],
      timesSeriesData = [];

    WarrantyAnalysis.map(item => {
      xData.push(item.ReasonName);
      numSeriesData.push(item.Num);
      timesSeriesData.push(item.Times);
    });

    let option = {
      baseOption: {
        timeline: {
          show: false,
          top: 0,
          data: [],
        },
        grid: [
          {
            show: false,
            left: '3%',
            top: '10%',
            bottom: '6%',
            width: '41%',
          },
          {
            show: false,
            left: '51%',
            top: '10%',
            bottom: '6%',
            width: '0%',
          },
          {
            show: false,
            right: '3%',
            top: '10%',
            bottom: '6%',
            width: '41%',
          },
        ],
        xAxis: [
          {
            type: 'value',
            inverse: true,
            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E7E7E7',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#666',
              },
            },
          },
          {
            gridIndex: 1,
            inverse: true,
            show: false,
            // type: 'value',
            // inverse: true,
            // splitLine: {
            //   show: false,
            // },
            // axisLine: {
            //   show: true,
            //   lineStyle: {
            //     color: '#E7E7E7',
            //   },
            // },
            // axisLabel: {
            //   textStyle: {
            //     color: '#666',
            //   },
            // },
          },
          {
            type: 'value',
            gridIndex: 2,
            inverse: false,
            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E7E7E7',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#666',
              },
            },
          },
        ],
        yAxis: [
          {
            name: '服务次数（次）',
            nameTextStyle: {
              color: '#333333',
              padding: [0, type==1? 86 : 100, 0, 0],
              fontWeight: 500,
            },
            nameLocation: 'start',
            position: 'right',
            type: 'category',
            inverse: true,
            // position: 'right',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E7E7E7',
              },
            },
            axisLabel: {
              show: false,
              fontSize: 14,
              color: 'rgba(65,250,240,0.7)',
            },
            data: xData,
          },
          {
            name: type === 1 ? '产品类别' : '服务原因',
            nameTextStyle: {
              color: '#333333',
              padding: [0, 18, 0, 0],
              fontSize: 13,
              fontWeight: 500,
            },
            nameLocation: 'start',
            gridIndex: 1,
            type: 'category',
            inverse: true,
            position: 'center',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              width: '100%',
              padding: [0, 10, 0, 10],
              textStyle: {
                color: '#333333',
              },
              ellipsis: '...',
              align: 'center',
            },
            data: xData.map(function(value) {
              let str = value.length > 6 ? value.substring(0, 6) + '...' : value;
              return {
                value: value,
                textStyle: {
                  align: 'center',
                },
              };
            }),
          },
          {
            name: '工作时长（小时）',
            nameTextStyle: {
              color: '#333333',
              padding: [0, 0, 0, type==1? 86 : 100],
              fontWeight: 500,
            },
            nameLocation: 'start',
            gridIndex: 2,
            type: 'category',
            inverse: true,
            position: 'left',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E7E7E7',
              },
            },
            axisLabel: {
              show: false,
            },
            data: xData,
          },
        ],
        series: [],
      },
      options: [],
    };

    option.options.push({
      series: [
        {
          name: '服务次数(次)',
          showBackground: true,
          type: 'bar',
          barWidth: 15,
          // stack: '1',
          itemStyle: {
            normal: {
              // barBorderRadius: [10, 10, 10, 10],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#2BE5A1',
                },
                {
                  offset: 1,
                  color: '#83FFD2',
                },
              ]),
            },
          },
          label: {
            normal: {
              position: 'left',
              show: true,
              // fontSize: 14,
              color: '#0DC07E',
            },
          },
          data: numSeriesData,
        },
        {
          name: '工作时长（小时）',
          showBackground: true,
          type: 'bar',
          stack: '2',
          barWidth: 15,
          xAxisIndex: 2,
          yAxisIndex: 2,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0,
                  color: '#399FF5',
                },
                {
                  offset: 1,
                  color: '#89C9FF',
                },
              ]),
            },
          },
          label: {
            normal: {
              position: 'right',
              show: true,
              // fontSize: 14,
              color: '#268EE6',
            },
          },
          data: timesSeriesData,
          animationEasing: 'elasticOut',
        },
      ],
    });

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
  }, [WarrantyAnalysis, echarts]);

  return (
    <Card title={title} size="small" bodyStyle={{ height: 640 }} loading={loading}>
      {renderEcharts}
    </Card>
  );
};

export default connect(dvaPropsData)(ProductCountCard3);
