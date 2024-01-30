import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';

let myChart;
const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  // todoList: wordSupervision.todoList,
  requestParams: AbnormalIdentifyModelHome.requestParams,
  OverRate: AbnormalIdentifyModelHome.OverRate,
  RunRate: AbnormalIdentifyModelHome.RunRate,
  loading: loading.effects['AbnormalIdentifyModelHome/GetOperationsAnalysis'],
});

const RanAnalysis = props => {
  // const runChart = useRef();
  // const overChart = useRef();
  // let runChart, overChart;
  const { dispatch, requestParams, RunRate, OverRate, loading } = props;
  const [runChart, setRunChart] = useState();
  const [overChart, setOverChart] = useState();

  useEffect(() => {
    GetOperationsAnalysis();
  }, [requestParams]);

  // 获取运行分析数据
  const GetOperationsAnalysis = () => {
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetOperationsAnalysis',
      payload: {},
    });
  };

  const getOption = (type, data) => {
    let echarts,
      colors = [];
    if (type === 1) {
      echarts = runChart;
      colors = ['#1E83FF', '#53F5FF'];
    } else {
      echarts = overChart;
      colors = ['#FCB12E', '#F5FF53'];
    }
    if (echarts)
      return {
        title: [
          {
            text: data + '%',
            x: 'center',
            y: 'center',
            textStyle: {
              fontSize: '18',
              color: colors[1],
              // fontFamily: 'DINAlternate-Bold, DINAlternate',
              foontWeight: '600',
            },
          },
        ],
        // backgroundColor: '#111',
        polar: {
          radius: ['52%', '62%'],
          center: ['50%', '50%'],
        },
        angleAxis: {
          max: 100,
          show: false,
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
            name: '',
            type: 'bar',
            roundCap: true,
            barWidth: 30,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(66, 66, 66, .3)',
            },
            data: [data],
            coordinateSystem: 'polar',
            itemStyle: {
              normal: {
                color: new runChart.echartsLib.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colors[0],
                  },
                  {
                    offset: 1,
                    color: colors[1],
                  },
                ]),
              },
            },
          },
        ],
      };

    return {};
  };
  return (
    <HomeCard title="运行分析" loading={loading}>
      <div className={styles.echartsContent}>
        <div className={styles.echartItem}>
          <ReactEcharts
            ref={echart => {
              setRunChart(echart);
            }}
            option={getOption(1, RunRate)}
            lazyUpdate={true}
            style={{ height: '180px', width: '100%' }}
          />
          <div className={styles.echartsTitle} style={{ color: '#53F5FF' }}>
            运行率
          </div>
        </div>
        <div className={styles.echartItem}>
          <ReactEcharts
            ref={echart => {
              setOverChart(echart);
            }}
            option={getOption(2, OverRate)}
            style={{ height: '180px', width: '100%' }}
            theme="my_theme"
          />
          <div className={styles.echartsTitle} style={{ color: '#FCB12E' }}>
            超标率
          </div>
        </div>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(RanAnalysis);
