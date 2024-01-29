import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';
import 'echarts-liquidfill';

const titleBottomStyle = {
  // width: 100,
  // borderBottom: '100px solid #0D97EB',
  // borderTop: '100px solid transparent',
  // borderLeft: '50px solid transparent',
  // borderRight: '50px solid transparent',

  width: 70,
  borderWidth: '3px 11px',
  borderStyle: 'solid',
  borderColor: 'transparent transparent rgb(13, 151, 235)',
};

let myChart;
const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  // todoList: wordSupervision.todoList,
  requestParams: AbnormalIdentifyModelHome.entPointSumStatus,
  OverRate: AbnormalIdentifyModelHome.EntOverRate,
  RunRate: AbnormalIdentifyModelHome.EntRunRate,
  loading: loading.effects['AbnormalIdentifyModelHome/GetEntOperationsAnalysis'],
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
      type: 'AbnormalIdentifyModelHome/GetEntOperationsAnalysis',
      payload: {},
    });
  };

  const getOption = (type, data) => {
    let echarts,
      colors = [],
      bgColor = '';
    if (type === 1) {
      echarts = runChart;
      colors = ['#1C92F6', 'rgba(28,146,246, 1)'];
      // colors = ['#1E83FF', '#53F5FF'];
    } else {
      echarts = overChart;
      colors = ['#FFCB00', 'rgba(255,203, 0, 1)'];
      // colors = ['#FCB12E', '#F5FF53'];
    }
    if (echarts) {
      return {
        series: [
          {
            type: 'liquidFill',
            data: [data / 100],
            color: [colors[0]],
            radius: '60%', //水球的半径
            center: ['50%', '50%'],
            // silent: true,
            minAngle: 100,
            itemStyle: {
              shadowBlur: 0,
            },
            outline: {
              borderDistance: 0, //内环padding值
              color: 'none',
              itemStyle: {
                //外环
                borderWidth: 5, //圆边线宽度
                shadowBlur: 10,
                shadowColor: colors[1],
                borderColor: {
                  //线性渐变，多用于折线柱形图，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，
                  type: 'linear',
                  x: 0, //（x,y），（x2， y2）分别表示线性渐变的起始点和结束点，globalCoord 为true 表示两个坐标点是绝对坐标
                  y: 0,
                  x2: 0.2,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0.5,
                      color: colors[0], // 50% 处的颜色
                    },
                    {
                      offset: 0,
                      color: ['#263249'], // 100% 处的颜色
                    },
                  ],
                  globalCoord: true, // 缺省为 false
                },
              },
            },
            backgroundStyle: {
              //内环
              borderWidth: 5,
              borderColor: '#263249',
              color: 'none',
            },
            label: {
              normal: {
                color: '#fff',
                fontWeight: 'bold',
                formatter: function(name) {
                  let val = name.value == '-' ? '-' : name.value.toFixed(2);
                  return val == '-' ? '-' : `{val|${val}%}`;
                },
                rich: {
                  //富文本 对字体进一步设置样式。val对应的 value
                  val: {
                    fontSize: 20,
                    fontWeight: 'bold',
                  },
                },
              },
            },
          },
        ],
      };
    }

    return {};
  };
  console.log('runChart', runChart);
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
          <div
            className={styles.echartsTitle}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            运行率
            <div style={titleBottomStyle}></div>
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
          <div
            className={styles.echartsTitle}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            超标率
            <div style={titleBottomStyle}></div>
          </div>
        </div>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(RanAnalysis);
