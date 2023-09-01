/*
 * @Author: JiaQi
 * @Date: 2023-07-31 09:22:06
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-08-21 11:11:36
 * @Description：频数分布直方图
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Empty } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';

const leftImagesOrder = {
  '01': 1, // 实测烟尘、颗粒物
  '02': 2, // 实测so2
  '03': 3, // 实测NOx
  s01: 4, // O2,
  zs01: 5, // 折算烟尘
  zs02: 6, // 折算so2
  zs03: 7, // 折算NOx
};

const rightImagesOrder = {
  s01: 1, // 氧含量
  s02: 2, // 流速
  s03: 3, // 温度
  s05: 4, // 湿度
  s08: 5, // 静压，压力
};

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const Histogram = props => {
  const { dispatch, DGIMN } = props;
  const [histogramData, setHistogramData] = useState([]);
  const [topChartDatas, setTopChartDatas] = useState([]);
  const [leftChartDatas, setLeftChartDatas] = useState([]);
  const [rightChartDatas, setRightChartDatas] = useState([]);

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
        let leftChartDatas = [];
        let rightChartDatas = [];
        res.map(item => {
          if (leftImagesOrder[item.PollutantCode]) {
            leftChartDatas.push({
              Data: item.Data,
              order: leftImagesOrder[item.PollutantCode],
              PollutantName: item.PollutantName,
            });
          } else if (rightImagesOrder[item.PollutantCode]) {
            rightChartDatas.push({
              Data: item.Data,
              order: leftImagesOrder[item.PollutantCode],
              PollutantName: item.PollutantName,
            });
          } else if (item['PollutantCode'] === 'b02') {
            setTopChartDatas([
              {
                Data: item.Data,
                order: leftImagesOrder[item.PollutantCode],
                PollutantName: item.PollutantName,
              },
              // { src: undefined },
            ]);
          } else {
            rightChartDatas.push({
              Data: item.Data,
              order: leftImagesOrder[item.PollutantCode],
              PollutantName: item.PollutantName,
            });
          }
        });

        console.log('topChartDatas', topChartDatas);
        console.log('leftChartDatas', leftChartDatas);
        console.log('rightChartDatas', rightChartDatas);

        setLeftChartDatas(leftChartDatas.sort((a, b) => a.order - b.order));
        setRightChartDatas(rightChartDatas.sort((a, b) => a.order - b.order));
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
          borderWidth: 1,
          borderColor: '#fff',
          // color: colorList[index]
        },
      };
    });
    console.log('data', data)
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

  const renderCharts = (data, span = 24) => {
    return data.map(item => {
      return (
        <Col span={span}>
          <ReactEcharts
            option={getOption(item)}
            style={{ height: '400px' }}
            className="echarts-for-echarts"
            theme="my_theme"
          />
        </Col>
      );
    });
  };

  const getPageContent = () => {
    return (
      <>
        <Col span={24}>
          <Row>
            {renderCharts(topChartDatas, 12)}
            <Col span={12}></Col>
          </Row>
        </Col>
        <Col span={12}>{renderCharts(leftChartDatas)}</Col>
        <Col span={12}>{renderCharts(rightChartDatas)}</Col>
      </>
    );
  };

  return (
    <Row style={{ overflowY: 'auto', height: 'calc(100vh - 238px)' }}>
      {histogramData.length ? (
        getPageContent()
      ) : (
        <Empty style={{ width: '100%' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Row>
  );
};

export default connect(dvaPropsData)(Histogram);
