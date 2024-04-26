import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
import ReactEcharts from 'echarts-for-react';

let myChart;
const dvaPropsData = ({ loading }) => ({});

const TimelyPassRate = props => {
  // const runChart = useRef();
  // const overChart = useRef();
  // let runChart, overChart;
  const [echarts1, setEcharts1] = useState();
  const [echarts2, setEcharts2] = useState();
  const [echarts3, setEcharts3] = useState();

  const { dispatch, requestParams, DataEfficiencyRate, OverRate, loading } = props;

  useEffect(() => {}, []);

  const getOption = (type, data) => {
    let echarts,
      colors = [],
      labelColor = [];
    if (type === 1) {
      echarts = echarts1;
      colors = ['rgba(10,123,219,0.5)', '#008AFF', '#3AA0F6'];
      labelColor = ['#7FC4FF', 'rgba(4,64,117,0.82)'];
    } else if (type === 2) {
      echarts = echarts2;
      colors = ['rgba(211,161,51,0.5)', '#FFA800', '#EAB131'];
      labelColor = ['#FFD16B', 'rgba(156,108,0,0.82)'];
    } else {
      echarts = echarts3;
      colors = ['rgba(56,230,212,0.5)', '#38E6D4', '#38E6D4'];
      labelColor = ['#38E6D4', 'rgba(6,72,94,0.82)'];
    }
    if (echarts)
      return {
        title: [
          {
            text: data + '%',
            x: 'center',
            y: 'center',
            textStyle: {
              fontSize: '16',
              color: colors[2],
              // fontFamily: 'DINAlternate-Bold, DINAlternate',
              foontWeight: '600',
            },
          },
        ],
        // backgroundColor: '#111',
        polar: {
          radius: ['32%', '68%'],
          center: ['50%', '50%'],
        },
        angleAxis: {
          max: 100,
          show: false,
          // startAngle: 225
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            type: 'bar',
            z: 1,
            coordinateSystem: 'polar',
            barWidth: 100,
            name: '警告事件',
            roundCap: true,
            data: [, , data],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: colors[1],
                },
                {
                  offset: 1,
                  color: colors[0],
                },
              ]),
            },
          },
          {
            type: 'pie',
            radius: ['68%', '56%'],
            hoverAnimation: false,
            // startAngle: 225,
            // endAngle: 0,
            data: [
              {
                name: '',
                value: data,
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  color: 'rgba(0,0,0,0)',
                },
              },
              {
                //画中间的图标
                name: '',
                value: 0,
                label: {
                  position: 'inside',
                  offset: [4, 0],
                  backgroundColor: labelColor[0],
                  borderRadius: 6,
                  padding: 6,
                  borderWidth: 0,
                  borderColor: 'blue',

                  shadowColor: labelColor[1],
                  shadowBlur: 10,
                  shadowOffsetY: 4,
                  shadowOffsetX: 4,
                },
              },
              {
                name: '',
                value: 100 - data,
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  color: 'rgba(255,255,255,0)',
                },
              },
            ],
          },
        ],
      };

    return {};
  };

  return (
    <HomeCard
      style={{ minHeight: 250 }}
      title="项目执行情况"
      bodyStyle={
        {
          // height: 'calc(100% - 110px)',
          // padding: '10px',
          // overflowY: 'auto',
        }
      }
    >
      <Row className={`${styles.TimelyPassRateWrapper}`}>
        <Col span={8}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts1(echart.echarts);
            }}
            option={getOption(1, 82.71)}
            lazyUpdate={true}
            style={{ height: '180px', width: '100%' }}
          />
          <p className={styles.echartsTitle}>及时合格率</p>
        </Col>
        <Col span={8}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts2(echart.echarts);
            }}
            option={getOption(2, 82.71)}
            lazyUpdate={true}
            style={{ height: '180px', width: '100%' }}
          />
          <p className={styles.echartsTitle}>及时率</p>
        </Col>
        <Col span={8}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts3(echart.echarts);
            }}
            option={getOption(3, 82.71)}
            lazyUpdate={true}
            style={{ height: '180px', width: '100%' }}
          />
          <p className={styles.echartsTitle}>合格率</p>
        </Col>
      </Row>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(TimelyPassRate);
