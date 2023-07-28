import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Empty } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const Histogram = props => {
  const { dispatch, DGIMN } = props;
  const [histogramData, setHistogramData] = useState([]);

  useEffect(() => {
    StatisPolValueNumsByDGIMN();
  }, [DGIMN]);

  // 获取直方图数据源
  const StatisPolValueNumsByDGIMN = () => {
    dispatch({
      type: 'dataModel/StatisPolValueNumsByDGIMN',
      payload: {
        DGIMN: DGIMN,
      },
      callback: res => {
        setHistogramData(res);
      },
    });
  };

  //
  const getOption = chartData => {
    const data = chartData.Data.map(function(item, index) {
      return {
        value: item,
        itemStyle: {
          // color: colorList[index]
        },
      };
    });
    return {
      color: '#546FC5',
      title: {
        text: chartData.PollutantName,
        left: 'center',
        top: 20,
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const { marker, data } = params[0];
          return `${marker} ${data.value[0]}-${data.value[1]}: ${data.value[2]}`;
        },
      },
      xAxis: {
        scale: true,
      },
      yAxis: {},
      series: [
        {
          type: 'custom',
          renderItem: function(params, api) {
            var yValue = api.value(2);
            var start = api.coord([api.value(0), yValue]);
            var size = api.size([api.value(1) - api.value(0), yValue]);
            var style = api.style();
            return {
              type: 'rect',
              shape: {
                x: start[0],
                y: start[1],
                width: size[0],
                height: size[1],
              },
              style: style,
            };
          },
          // label: {
          //   show: true,
          //   position: 'top',
          // },
          dimensions: ['from', 'to', 'profit'],
          encode: {
            x: [0, 1],
            y: 2,
            tooltip: [0, 1, 2],
            itemName: 3,
          },
          data: data,
        },
      ],
    };
  };

  return (
    <Row style={{ overflowY: 'auto', height: 'calc(100vh - 238px)' }}>
      {histogramData.length ? (
        histogramData.map(item => {
          return (
            <Col span={12}>
              <ReactEcharts
                option={getOption(item)}
                style={{ height: '400px' }}
                className="echarts-for-echarts"
                theme="my_theme"
              />
            </Col>
          );
        })
      ) : (
        <Empty style={{ width: '100%' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Row>
  );
};

export default connect(dvaPropsData)(Histogram);
