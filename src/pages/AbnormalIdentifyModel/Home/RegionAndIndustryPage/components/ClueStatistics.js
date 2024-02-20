import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Row, Col } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';
import _ from 'lodash';

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
  const [barDataMax, setBarDataMax] = useState();
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    GetAbnormalClueStatistics();
  }, [requestParams]);

  // 获取异常线索统计
  const GetAbnormalClueStatistics = () => {
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetAbnormalClueStatistics',
      payload: {},
      callback: res => {
        console.log('res', res);
        // handleBarData(res.CountList);
        res.CountList.length && setBarDataMax(_.maxBy(res.CountList, 'val').val);
        setBarData(res.CountList);
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

    // let data = [
    //   { value: 3214, name: 'a' },
    //   { value: 214, name: 'a1' },
    //   { value: 324, name: 'a2' },
    //   { value: 24, name: 'a3' },
    // ]
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
          radius: ['30%', '50%'],
          center: ['50%', '50%'],
          // roseType: 'radius',
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
            show: false,
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
    // handleBarData(currentData);
    setBarDataMax(_.maxBy(currentData, 'val').val);
    setBarData(currentData);
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
        <p className={styles.unit}>单位：条</p>
        <div className={styles.BarBox}>
          {barData.map(item => {
            return (
              <Row
                className={styles.ClueClassificationWrapper}
                onClick={() => {
                  // 跳转到当前行政区
                  if (!requestParams.regionCode)
                    dispatch({
                      type: 'AbnormalIdentifyModelHome/updateState',
                      payload: {
                        requestParams: {
                          ...requestParams,
                          // name: item.key,
                          // code: item.code,
                          regionCode: item.code,
                          regionName: item.key,
                          pLeve: 2,
                        },
                      },
                    });
                }}
              >
                <Col flex="100px" className={`${styles.label} textOverflow`}>
                  {item.key}
                </Col>
                <Col flex="auto">
                  <div
                    className={styles.ProgressContent}
                    style={{ width: (item.val / barDataMax) * 100 + '%' }}
                  ></div>
                </Col>
                <Col flex="80px" className={`${styles.value} textOverflow`}>
                  {item.val}
                </Col>
              </Row>
            );
          })}
        </div>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ClueStatistics);
