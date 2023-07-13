import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {} from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from '../../styles.less';
import _ from 'lodash';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const ModelChart = props => {
  const { chartData, color, WarningTypeCode } = props;
  const [legendIndex, setLegendIndex] = useState(0);

  useEffect(() => {}, []);

  const getOption = () => {
    const {
      date,
      data,
      pollutantName,
      standardUpper,
      standardLower,
      max,
      min,
      defaultValue,
      monitorValue,
      dateHistory,
      dataHistory,
      splitDate,
      splitTime,
    } = chartData.data[legendIndex];

    let seriesMarkLine = [];
    // 下限
    if (standardLower !== null && standardLower !== undefined) {
      seriesMarkLine.push({
        yAxis: standardLower,
      });
    }
    // 上限
    if (standardUpper !== null && standardUpper !== undefined) {
      seriesMarkLine.push({
        yAxis: standardUpper,
      });
    }

    // 预设值
    if (defaultValue !== null && defaultValue !== undefined) {
      seriesMarkLine.push({
        yAxis: defaultValue,
        name: '预设值',
        label: {
          formatter: `预设值 ${defaultValue}`,
        },
      });
    }
    // 标准值
    if (monitorValue !== null && monitorValue !== undefined) {
      seriesMarkLine.push({
        yAxis: monitorValue,
        name: '标准值',
        label: {
          formatter: `标准值 ${monitorValue}`,
        },
      });
    }

    // 获取非正常图表配置
    const abnormalObj = abnormalChartOption();

    // y轴最大值
    let _max = max;
    if (monitorValue && defaultValue) {
      _max = _.max([...data, monitorValue, defaultValue]);
    }

    // 处理x和y轴/grid
    let appendSeries = { type: 'line' };
    let xAxisData = date.map(item => moment(item).format('MM-DD HH:mm'));
    let xAxis = {
      type: 'category',
      data: xAxisData,
      splitLine: {
        show: true,
      },
    };
    let yAxis = {
      type: 'value',
      splitLine: {
        show: true,
      },
      max: _max,
      min: min,
    };

    let grid = {
      left: '5%',
      right: '10%',
      bottom: 30,
      top: 50,
      containLabel: true,
    };
    // 双x轴图表
    if (dateHistory && dataHistory) {
      xAxis = [
        {
          type: 'category',
          splitLine: {
            show: true,
          },
          data: xAxisData,
        },
        {
          gridIndex: 1,
          type: 'category',
          splitLine: {
            show: true,
          },
          data: dateHistory.map(item => moment(item).format('MM-DD HH:mm')),
          position: 'bottom',
        },
      ];

      yAxis = [
        {
          type: 'value',
          splitLine: {
            show: true,
          },
          max: _max,
          min: min,
        },
        {
          gridIndex: 1,
          type: 'value',
          splitLine: {
            show: true,
          },
          max: _max,
          min: min,
        },
      ];

      grid = [
        {
          left: 60,
          right: 50,
          height: '35%',
        },
        {
          left: 60,
          right: 50,
          top: '55%',
          height: '35%',
        },
      ];

      appendSeries = {
        name: pollutantName,
        data: dataHistory,
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
      };
    }

    // 波动范围变小
    if (splitTime) {
      // 获取最大值
      let UpperLimitMax = _.maxBy(splitDate, 'UpperLimit');
      let dataMax = _.max([...data, UpperLimitMax]);

      seriesMarkLine.push([
        {
          // lineStyle: { color: '#ff0000' },
          coord: [moment(splitTime).format('MM-DD HH:mm'), 0],
          symbol: 'none',
          symbolSize: 0,
        },
        {
          coord: [moment(splitTime).format('MM-DD HH:mm'), dataMax],
          symbol: 'arrow',
          symbolSize: 1,
          lineStyle: { color: '#ff0000' },
        },
      ]);
    }

    if (splitDate) {
      splitDate.map((item, index) => {
        let lineColor = ['#ff0000', '#ff00ff'];
        let startIndex = date.findIndex(_ => _ === item.startTime);
        let endIndex = date.findIndex(_ => _ === item.endTime);
        seriesMarkLine.push(
          [
            {
              name: '波动上限',
              lineStyle: { color: lineColor[index] },
              // [坐标轴]
              coord: [startIndex, item.UpperLimit],
            },
            {
              coord: [endIndex, item.UpperLimit],
            },
          ],
          [
            {
              name: '波动下限',
              lineStyle: { color: lineColor[index] },
              coord: [startIndex, item.LowLimit],
            },
            {
              coord: [endIndex, item.LowLimit],
            },
          ],
        );
      });
    }

    console.log('yAxis', yAxis);
    console.log('xAxis', xAxis);
    console.log('appendSeries', appendSeries);
    console.log('seriesMarkLine', seriesMarkLine);
    return {
      color: color,
      title: {
        text: chartData.title,
        left: 'left',
      },
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
      ...abnormalObj.optionObj,
      grid: grid,
      xAxis: xAxis,
      yAxis: yAxis,
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
          ...abnormalObj.seriesObj,
        },
        { ...appendSeries },
      ],
    };
  };

  // 获取非正常图表配置
  const abnormalChartOption = () => {
    const {
      dataFlagName,
      workingFlagName,
      unit,
      defaultValue,
      monitorValue,
      dateHistory,
      dataHistory,
    } = chartData.data[legendIndex];
    // 判断是否是非正常标记图表
    let abnormalObj = { seriesObj: {}, tooltipFormatter: {}, optionObj: {} };
    if (dataFlagName && workingFlagName) {
      // 数据异常标记为三角形
      abnormalObj.seriesObj = {
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
            return 6;
          } else {
            return 16;
          }
        },
      };

      // 超出标准值显示红点
      if (defaultValue && monitorValue) {
        abnormalObj.seriesObj.itemStyle = {
          // borderWidth: 3,
          // borderColor: 'yellow',
          color: function(params) {
            let _color = color;
            if (params.data > defaultValue) {
              _color = '#ff0000';
            }
            return _color;
          },
        };
      }

      // 处理显示工况的tooltip
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

    // 双x轴
    if (dateHistory && dataHistory) {
      abnormalObj.optionObj = {
        axisPointer: {
          link: { xAxisIndex: 'all' },
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

  const { trend } = chartData.data[legendIndex];

  return (
    <div className={styles.chartBox}>
      {trend && (
        <span className={styles.trend} style={{ top: 60 }}>
          趋势相似度 {trend}
        </span>
      )}
      <ReactEcharts
        option={getOption()}
        lazyUpdate
        style={{
          height: WarningTypeCode === 'd5dea4cc-bd6c-44fa-a122-a1f44514b465' ? '440px' : '100%',
          width: '100%',
        }}
        // style={{ height: '700px', width: '100%' }}
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
