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

  console.log('chartData', chartData);
  useEffect(() => {}, []);

  const getOption = () => {
    const { date, data, pollutantName, standardUpper, standardLower, max, min } = chartData.data[
      legendIndex
    ];

    let seriesMarkLine = [];
    if (standardLower !== null) {
      seriesMarkLine.push({
        yAxis: standardLower,
      });
    }
    if (standardUpper !== null) {
      seriesMarkLine.push({
        yAxis: standardUpper,
      });
    }
    let xAxisData = date.map(item => moment(item).format('MM-DD HH:mm'));
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
