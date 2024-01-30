import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  PointSumStatus: AbnormalIdentifyModelHome.entPointSumStatus,
  // todoList: wordSupervision.todoList,
  loading: loading.effects['AbnormalIdentifyModelHome/GetEntMapPointList'],
});

const RunState = props => {
  const { dispatch, PointSumStatus, loading } = props;

  useEffect(() => {}, []);

  const getOption = type => {
    let data = [
      { value: PointSumStatus.Normal, name: '正常', rate: PointSumStatus.NormalRate },
      { value: PointSumStatus.Exception, name: '异常', rate: PointSumStatus.ExceptionRate },
      { value: PointSumStatus.Over, name: '超标', rate: PointSumStatus.OverRate },
      { value: PointSumStatus.Stop, name: '离线', rate: PointSumStatus.StopRate },
    ];
    let color = ['#347AED', '#FF4374', '#EDC434', '#CFCFCF'];
    return {
      color: color,
      title: {
        text: '监控点数',
        subtext: '16个',
        left: 'center',
        top: '40%',
        textStyle: {
          color: '#fff',
          fontSize: '18',
          fontWeight: 'bold',
        },
        subtextStyle: {
          color: '#20B6FF',
          fontSize: '16',
          fontWeight: 500,
          lineHeight: '30',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      grid: {
        left: '8%',
        right: '10%',
        top: '18%',
        bottom: '8%',
        containLabel: true,
      },
      // visualMap: {
      //   show: false,
      //   min: 500,
      //   max: 600,
      //   inRange: {
      //     //colorLightness: [0, 1]
      //   },
      // },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['60%', '80%'],
          center: ['50%', '50%'],
          // color: ['rgb(131,249,103)', '#FBFE27', '#FE5050', '#1DB7E5'], //'#FBFE27','rgb(11,228,96)','#FE5050'
          data: data,
          // .sort(function(a, b) {
          //   return a.value - b.value;
          // }),
          roseType: 'radius',

          label: {
            normal: {
              formatter: ['{b|{b}} {b|{d}%}', '{c|{c}个}'].join('\n'),
              position: 'outer',
              alignTo: 'edge',
              margin: 10,
              // paddingBottom: 100,
              edgeDistance: 10,
              rich: {
                c: {
                  color: '#3BBFFE',
                  fontSize: 18,
                  fontWeight: 'bold',
                  lineHeight: 5,
                },
                b: {
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 'bold',
                  height: 40,
                },
              },
            },
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgb(98,137,169)',
              },
              smooth: 0.2,
              length: 10,
              length2: 10,
            },
          },
          itemStyle: {
            normal: {
              shadowColor: 'rgba(0, 0, 0, 0.8)',
              shadowBlur: 50,
            },
          },
        },
      ],
    };
  };
  return (
    <HomeCard title="运行状态分布" loading={loading}>
      <div className={styles.echartsContent} style={{ padding: '0 20px' }}>
        <ReactEcharts
          option={getOption(1)}
          lazyUpdate={true}
          style={{ height: '200px', width: '100%' }}
        />
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(RunState);
