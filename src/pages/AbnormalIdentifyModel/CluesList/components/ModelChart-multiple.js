/*
 * @Author: JiaQi
 * @Date: 2023-07-18 10:36:00
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-02-02 14:47:38
 * @Description：模型异常特征 - 多图例折线图
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from '../../styles.less';
import _ from 'lodash';
import ModelChartMultipleMore from './ModelChartMultipleMore';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const ModelChartMultiple = props => {
  const [DGIMNs, setDGIMNs] = useState([]);
  const [pollutantCodes, setPollutantCodes] = useState([]);
  const [PointNames, setPointNames] = useState([]);
  const [date, setDate] = useState([]);
  const [moreModalVisible, setMoreModalVisible] = useState(false);

  const { chartData, color, WarningTypeCode } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    const { data, title } = chartData;

    // 多Y轴（同一现场借用其他合格监测设备数据，引用错误、虚假的原始信号值 ）
    let isMultipleYAxis =
      WarningTypeCode === 'ab2bf5ec-3ade-43fc-a720-c8fd92ede402' ||
      WarningTypeCode === 'f021147d-e7c6-4c1d-9634-1d814ff9880a';

    let yAxisData = isMultipleYAxis
      ? []
      : {
          type: 'value',
        };

    let seriesData = data.map((item, index) => {
      let yAxisIndex = {};
      if (isMultipleYAxis) {
        yAxisIndex = {
          yAxisIndex: index,
        };
        yAxisData.push({
          type: 'value',
          name: item.PointName || item.pollutantName,
          nameLocation: 'middle',
          nameGap: 35,
          alignTicks: true,
          // nameLocation: 'end',
          axisLine: {
            show: true,
          },
        });
      }
      return {
        name: `${item.PointName || item.pollutantName}`,
        data: item.data,
        type: 'line',
        ...yAxisIndex,
      };
    });

    let xAxisData = data[0].date.map(item => moment(item).format('MM-DD HH:mm'));

    return {
      color: color || ['#5470c6', '#91cc75'],
      title: {
        text: title,
        left: 'left',
      },
      legend: {
        // selectedMode: 'single',
        x: 'center', // 可设定图例在左、右、居中
        y: 'bottom', // 可设定图例在上、下、居中
        padding: [15, 30, 0, 0], // 可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: 60,
        right: 60,
        bottom: 30,
        top: 70,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        splitLine: {
          show: true,
        },
      },
      yAxis: yAxisData,
      series: seriesData,
    };
  };

  const onEvents = {
    click: e => onShowMoreDataModal(e),
  };

  // 双排口可点击
  const onShowMoreDataModal = e => {
    let DGIMNs = [],
      pollutantCodes = [],
      date = [],
      PointNames = [];
    chartData.data.map(item => {
      DGIMNs.push(item.DGIMN);
      pollutantCodes.push(item.pollutantCode);
      PointNames.push(item.PointName);
      date = [item.date[0], item.date.slice(-1)[0]];
    });
    if (_.uniq(DGIMNs).length > 1) {
      setDGIMNs(DGIMNs);
      setPollutantCodes(pollutantCodes);
      setPointNames(_.uniq(PointNames));
      setDate(date);
      setMoreModalVisible(true);
      console.log('DGIMNs', _.uniq(DGIMNs));
      console.log('pollutantCodes', _.uniq(pollutantCodes));
      console.log('date', date);
    }
  };
  console.log('chartData', chartData);
  return (
    <>
      <div className={styles.chartBox}>
        {/* <Tooltip title="点击放大图表" onClick={() => onShowMoreDataModal()}>
          <div style={{ height: 34, width: '100%', position: 'absolute', zIndex: 1 }}></div>
        </Tooltip> */}
        {/* {chartData.trend && <span className={styles.trend}>趋势相似度 {chartData.trend}</span>} */}
        <ReactEcharts
          option={getOption()}
          lazyUpdate
          style={{ height: '300px', width: '100%', margin: '10px 0' }}
          // onEvents={onEvents}
        />
      </div>
      {moreModalVisible && (
        <ModelChartMultipleMore
          title={chartData.title}
          visible={moreModalVisible}
          PointNames={PointNames}
          WarningTypeCode={WarningTypeCode}
          params={{
            DGIMNs: DGIMNs,
            pollutantCodes: pollutantCodes,
            date: date,
          }}
          onCancel={() => {
            setMoreModalVisible(false);
          }}
        />
      )}
    </>
  );
};

export default connect(dvaPropsData)(ModelChartMultiple);
