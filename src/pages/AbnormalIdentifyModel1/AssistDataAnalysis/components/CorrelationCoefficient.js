/*
 * @Author: JiaQi
 * @Date: 2023-08-07 14:03:36
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-01-16 15:23:21
 * @Description：相关关系表
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Empty } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const CorrelationCoefficient = props => {
  const { dispatch, DGIMN } = props;
  const [chartData, setChartData] = useState({ data: [], name: [] });
  const [option, setOption] = useState({});

  useEffect(() => {
    StatisLinearCoefficient();
  }, [DGIMN]);

  useEffect(() => {
    getOption();
  }, [chartData]);

  // 获取相关系数图数据源
  const StatisLinearCoefficient = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/StatisLinearCoefficient',
      payload: {
        DGIMN: DGIMN,
      },
      callback: res => {
        setChartData(res);
      },
    });
  };



  //
  const getOption = () => {
    let el = document.querySelector('.ant-tabs-tabpane-active');
    let height = 0;
    if (el) height = el.clientHeight - el.clientHeight * 0.2;
    const { name, data } = chartData;
    const xData = name;
    const yData = _.reverse([...name]);
    const seriesData = data;
    let option = {
      // tooltip: {
      //   position: 'top'
      // },
      grid: {
        // height: '50%',
        top: '6%',
        bottom: '10%',
      },
      xAxis: {
        type: 'category',
        data: xData,
        splitArea: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: yData,
        splitArea: {
          show: false,
        },
      },
      visualMap: {
        min: -1,
        max: 1,
        top: '6%',
        left: 'right',
        calculable: true,
        realtime: false,
        precision: 2,
        itemHeight: height,
        // range: [1, 0.75, 0.50, 0.25, 0.00, -0.25, -0.50, -0.75, -1],
        inRange: {
          color: [
            '#407D92',
            '#699AA8',
            '#96B9C2',
            '#C2D4DA',
            '#F0F2F1',
            '#EBC7C2',
            '#DBA394',
            '#CE7C67',
            '#C4543D',
          ],
        },
      },
      series: [
        {
          name: 'Punch Card',
          type: 'heatmap',
          data: seriesData,
          label: {
            show: true,
            color: '#000',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    setOption(option);
  };

  return (
    <Row id="CorrelationCoefficient" style={{ overflowY: 'auto', height: 'calc(100vh - 238px)' }}>
      {chartData.data.length ? (
        <ReactEcharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          className="echarts-for-echarts"
          theme="my_theme"
        />
      ) : (
        <Empty style={{ width: '100%' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Row>
  );
};

export default connect(dvaPropsData)(CorrelationCoefficient);
