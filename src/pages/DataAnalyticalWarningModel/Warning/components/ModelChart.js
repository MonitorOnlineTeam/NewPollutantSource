import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {} from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from '../../styles.less';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const ModelChart = props => {
  const { chartData, color } = props;
  const [legendIndex, setLegendIndex] = useState(0);

  useEffect(() => {}, []);

  const getOption = () => {
    const { date, data, pollutantName, standardUpper, standardLower, max, min } = chartData.data[
      legendIndex
    ];

    let seriesMarkLine = [];
    if (standardLower !== null && standardLower !== undefined) {
      seriesMarkLine.push({
        yAxis: standardLower,
      });
    }
    if (standardUpper !== null && standardUpper !== undefined) {
      seriesMarkLine.push({
        yAxis: standardUpper,
      });
    }
    let xAxisData = date.map(item => moment(item).format('MM-DD HH:mm'));

    // 获取非正常图表配置
    const abnormalObj = abnormalChartOption();

    return {
      color: color,
      title: {
        text: chartData.title,
        left: 'left',
      },
      // legend: {
      //   selectedMode: 'single',
      //   x: 'center', // 可设定图例在左、右、居中
      //   y: 'bottom', // 可设定图例在上、下、居中
      //   padding: [15, 30, 0, 0], // 可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
      //   // data: ['Email'],
      // },
      tooltip: {
        trigger: 'axis',
        ...abnormalObj.tooltipFormatter,
        // axisPointer: {
        //   type: 'cross',
        //   label: {
        //     backgroundColor: '#6a7985',
        //   },
        // },
      },
      grid: {
        left: '5%',
        right: '10%',
        bottom: 30,
        top: 50,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        splitLine: {
          show: true,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
        },
        max: max,
        min: min,
      },
      series: [
        {
          name: pollutantName,
          data: data,
          type: 'line',
          // smooth: true,
          markLine: {
            silent: true,
            data: seriesMarkLine,
          },
          ...abnormalObj.symbolObj,
        },
        // {
        //   name: '上限',
        //   data: [standardUpper],
        //   type: 'line',
        //   // smooth: true,
        //   markLine: {
        //     silent: true,
        //     data: [
        //       {
        //         yAxis: standardUpper,
        //       },
        //     ],
        //   },
        // },
        // {
        //   name: '下限',
        //   data: [standardLower],
        //   type: 'line',
        //   // smooth: true,
        //   markLine: {
        //     silent: true,
        //     data: [
        //       {
        //         yAxis: standardLower,
        //       },
        //     ],
        //   },
        // },
      ],
    };
  };

  // 获取非正常图表配置
  const abnormalChartOption = () => {
    const { dataFlagName, workingFlagName, unit } = chartData.data[legendIndex];
    // 判断是否是非正常标记图表
    let abnormalObj = { symbolObj: {}, tooltipFormatter: {} };
    if (dataFlagName && workingFlagName) {
      // 数据异常标记为三角形
      abnormalObj.symbolObj = {
        symbol: (value, params) => {
          // console.log('params', params);
          let flag = dataFlagName[params.dataIndex];
          if (flag === '正常' || flag === '') {
            return 'circle';
          } else {
            return 'triangle';
          }
        },
        symbolSize: (value, params) => {
          let flag = dataFlagName[params.dataIndex];
          if (flag === '正常' || flag === '') {
            return 4;
          } else {
            return 16;
          }
        },
      };

      // 处理tooltip
      abnormalObj.tooltipFormatter = {
        formatter: function(params) {
          let { axisValue, dataIndex, marker, seriesName, value } = params[0];
          let date = axisValue;
          let WorkCon = `工况：${workingFlagName[dataIndex]}`;
          //内容
          let content = '';
          content = `${marker} ${seriesName}: ${value}${unit}
        (${dataFlagName[dataIndex]})<br />`;
          return date + '<br />' + WorkCon + '<br />' + content;
        },
      };
    }

    return abnormalObj;
  };

  //
  const onChartLegendChange = value => {
    setLegendIndex(value);
  };

  // const onEvents = {
  //   legendselectchanged: onChartLegendChange,
  // };

  return (
    <div className={styles.chartBox}>
      <ReactEcharts
        option={getOption()}
        lazyUpdate
        style={{ height: '100%', width: '100%' }}
        // onEvents={onEvents}
      />
      <div className={styles.legendBox}>
        {chartData.data.map((item, index) => {
          return (
            <div
              key={item.pollutantName}
              className={`${styles.legendItem} ${legendIndex === index ? styles.active : ''}`}
              onClick={() => onChartLegendChange(index)}
            >
              <i style={legendIndex === index ? { background: color } : {}}></i>
              {item.pollutantName}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default connect(dvaPropsData)(ModelChart);
