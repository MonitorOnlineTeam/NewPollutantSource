import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  requestParams: AbnormalIdentifyModelHome.requestParams,
  ClueStatisticsData: AbnormalIdentifyModelHome.ClueStatisticsData,
  loading: loading.effects['AbnormalIdentifyModelHome/GetAbnormalClueStatistics'],
});

const ClueStatistics = props => {
  const {
    dispatch,
    loading,
    requestParams,
    ClueStatisticsData: { CountList, ModelGroupList },
  } = props;
  const [barData, setBarData] = useState({
    xData: [],
    seriesData: [],
  });

  useEffect(() => {
    GetAbnormalClueStatistics();
  }, [requestParams]);

  // 获取异常线索统计
  const GetAbnormalClueStatistics = () => {
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetAbnormalClueStatistics',
      payload: {},
      callback: res => {
        handleBarData(res.CountList);
      },
    });
  };

  // 处理柱状图数据
  const handleBarData = data => {
    let xData = [],
      seriesData = [];
    data.map(item => {
      xData.push(item.key);
      seriesData.push(item.val);
    });
    setBarData({
      xData,
      seriesData,
    });
  };

  // 线索统计饼图
  const getOption = () => {
    let data = ModelGroupList.map(item => {
      return { value: item.count, name: item.name };
    });
    var colors = [
      '#5e81ec',
      '#ffc855',
      '#98e79b',
      '#00d695',
      '#00b29a',
      '#5470c6',
      '#91cc75',
      '#fac858',
      '#ee6666',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
      '#ea7ccc',
    ];

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      color: colors,
      series: [
        {
          type: 'pie',
          radius: ['30%', '65%'],
          center: ['50%', '50%'],
          roseType: 'radius',
          label: {
            show: true,
            color: '#FEFEFF',
            position: 'outer',
            alignTo: 'edge',
            margin: 2,
            minMargin: 5,
            edgeDistance: 10,
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{b}: {c}条 {d}%',
          },
          labelLine: {
            length: 1,
            length2: 20,
            // length: 15,
            // length2: 0,
            // maxSurfaceAngle: 80,
            smooth: true,
          },
          // labelLayout: function(params) {
          //   const isLeft = params.labelRect.x < 300 / 2;
          //   const points = params.labelLinePoints;
          //   // Update the end point.
          //   points[2][0] = isLeft
          //     ? params.labelRect.x
          //     : params.labelRect.x + params.labelRect.width;
          //   return {
          //     labelLinePoints: points,
          //   };
          // },
          data: data,
        },
      ],
    };
  };

  // 柱状图
  const getBarOption = () => {
    return {
      color: '#2894EF',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      grid: {
        left: '8%',
        right: '10%',
        top: '18%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'value',
          axisPointer: {
            type: 'shadow',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#3A708C',
              type: 'dashed',
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#c3bfbf',
            },
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
      ],
      yAxis: {
        type: 'category',
        data: barData.xData,
        name: '单位（条）',
        nameTextStyle: {
          color: '#8BEEFF',
          fontSize: 14,
          fontWeight: 'bold',
          padding: 6,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#c3bfbf',
          fontSize: 14,
          fontWeight: 'bold',
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#3A708C',
            type: 'dashed',
          },
        },
      },
      series: [
        {
          data: barData.seriesData,
          type: 'bar',
          barMaxWidth: 20,
          label: {
            show: true,
            position: 'right',
            fontWeight: 'bold',
            color: '#4EE1FF',
          },
        },
      ],
    };
  };

  // 饼图点击事件 - 分类点击
  const onClickEchartsPie = e => {
    const { dataIndex } = e;
    let currentData = ModelGroupList[dataIndex].childList;
    handleBarData(currentData);
  };
  return (
    <HomeCard
      title="异常线索统计"
      loading={loading}
      bodyStyle={{
        height: 'calc(100% - 110px)',
      }}
    >
      <div className={styles.ClueStatisticsContent}>
        <div style={{ height: 300 }}>
          <ReactEcharts
            option={getOption()}
            lazyUpdate={true}
            onEvents={{
              click: onClickEchartsPie,
            }}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
        <div className={styles.BarBox}>
          <ReactEcharts
            option={getBarOption()}
            lazyUpdate={true}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ClueStatistics);