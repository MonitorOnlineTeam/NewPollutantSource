import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  requestParams: AbnormalIdentifyModelHome.requestParams,
  EmissionStatisticsData: AbnormalIdentifyModelHome.EmissionStatisticsData,
  loading: loading.effects['AbnormalIdentifyModelHome/GetEmissionStatistics'],
});

const Emissions = props => {
  const { dispatch, loading, requestParams, EmissionStatisticsData } = props;
  const [echarts, setEcharts] = useState();

  useEffect(() => {
    GetEmissionStatistics();
  }, [requestParams]);

  // 获取排放量统计及情况
  const GetEmissionStatistics = () => {
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetEmissionStatistics',
      payload: {},
    });
  };

  const getOption = () => {
    if (!echarts || !EmissionStatisticsData.xData.length) {
      return {};
    }
    // let tempPollutantList = EmissionStatisticsData.pollutantList.length
    //   ? EmissionStatisticsData.pollutantList
    //   : ['01', '02', '03'];
    let tempPollutantList = EmissionStatisticsData.pollutantList;
    let seriesData = [];
    for (const key in tempPollutantList) {
      let name = key === '01' ? '颗粒物' : key === '02' ? '二氧化硫' : '氮氧化物';
      let color = key === '01' ? '#0A93F3' : key === '02' ? '#1BFFC7' : '#D388EF';
      seriesData.push({
        name: name,
        type: 'line',
        symbolSize: 0,
        smooth: false,
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function(value) {
            return value + ' kg';
          },
        },
        itemStyle: {
          color: color,
        },
        data: tempPollutantList[key],
      });
    }
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: { show: true },
      //   },
      // },
      legend: {
        top: 20,
        textStyle: {
          color: '#13D8FA',
          fontWeight: 'bold',
        },
      },
      grid: {
        left: '4%',
        right: '4%',
        top: '18%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: EmissionStatisticsData.xData,
          axisPointer: {
            type: 'shadow',
          },
          axisLine: {
            lineStyle: {
              color: '#444F63',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#c3bfbf',
            },
            fontSize: 14,
            fontWeight: 'bold',
          },
          // splitLine: {
          //   show: false,
          //   lineStyle: {
          //     color: '#192a44',
          //   },
          // },
          // axisLine: {
          //   show: false,
          //   lineStyle: {
          //     color: '#233653',
          //   },
          // },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '排污单位',
          nameTextStyle: {
            color: '#8BEEFF',
            fontSize: 14,
            fontWeight: 'bold',
            padding: 6,
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
              color: '#444F63',
            },
          },
        },
        {
          type: 'value',
          name: '排放量（kg）',
          nameTextStyle: {
            color: '#8BEEFF',
            fontSize: 14,
            fontWeight: 'bold',
            padding: 6,
          },
          axisLabel: {
            textStyle: {
              color: '#c3bfbf',
            },
            fontSize: 14,
            fontWeight: 'bold',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#444F63',
            },
          },
        },
      ],
      series: [
        {
          name: '排污单位',
          type: 'bar',
          barMaxWidth: 30,
          yAxisIndex: 0,
          itemStyle: {
            color: new echarts.echartsLib.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          tooltip: {
            valueFormatter: function(value) {
              return value + ' 家';
            },
          },
          data: EmissionStatisticsData.EntCount,
        },
        ...seriesData,
      ],
    };
  };

  return (
    <HomeCard
      title="排放量统计情况"
      loading={loading}
      headerStyle={{
        backgroundSize: '',
      }}
      bodyStyle={{
        height: 'calc(100% - 110px)',
      }}
    >
      {!loading && EmissionStatisticsData.xData.length ? (
        <ReactEcharts
          ref={echart => {
            setEcharts(echart);
          }}
          option={getOption(2)}
          style={{ height: '100%', width: '100%' }}
          theme="my_theme"
        />
      ) : (
        <div className="notData">
          <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
          <p style={{ color: '#d5d9e2', fontSize: 16, fontWeight: 500 }}>暂无数据</p>
        </div>
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(Emissions);
