import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  PointSumStatus: AbnormalIdentifyModelHome.PointSumStatus,
  // todoList: wordSupervision.todoList,
  loading: loading.effects['AbnormalIdentifyModelHome/GetMapPointList'],
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
    let color = ['#2899F6', '#E3AB15', '#FF4374', '#CACACA'];
    return {
      color: color,
      title: [
        {
          text: '状态分布',
          x: '19%',
          y: 'center',
          textStyle: {
            fontSize: '18',
            color: '#fff',
            // fontFamily: 'DINAlternate-Bold, DINAlternate',
            fontWeight: '600',
          },
        },
      ],
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        top: 'center',
        right: '6%',
        textStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold',
        },
        itemGap: 26,
        //图例标记的图形高度
        itemHeight: 10,
        //图例标记的图形宽度
        itemWidth: 20,
        formatter: function(name, option) {
          let current = data.find(item => item.name === name);
          return `${name}: ${current.value}个   ${current.rate}%`;
        },
      },
      series: [
        {
          name: '运行状态分布',
          type: 'pie',
          radius: ['120%', '140%'],
          center: ['50%', '50%'],
          width: '55%',
          height: '55%',
          top: 'center',
          avoidLabelOverlap: false,
          // barWidth: 30,
          roundCap: true,
          itemStyle: {
            // borderRadius: 10,
            // borderColor: '#fff',
            // borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: 20,
          //     fontWeight: 'bold',
          //   },
          // },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    };
  };
  return (
    <HomeCard title="运行状态分布" loading={loading}>
      <div className={styles.echartsContent}>
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
