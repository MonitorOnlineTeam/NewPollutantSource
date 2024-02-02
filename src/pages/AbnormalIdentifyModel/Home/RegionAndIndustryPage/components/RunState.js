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
  const [echarts, setEcharts] = useState();

  useEffect(() => {}, []);

  const getOption = type => {
    if (!echarts) {
      return {};
    }

    let data = [
      { value: PointSumStatus.Normal, name: '正常', rate: PointSumStatus.NormalRate },
      { value: PointSumStatus.Exception, name: '异常', rate: PointSumStatus.ExceptionRate },
      { value: PointSumStatus.Over, name: '超标', rate: PointSumStatus.OverRate },
      { value: PointSumStatus.Stop, name: '停运', rate: PointSumStatus.StopRate },
    ];
    let color = ['#2899F6', '#E3AB15', '#FF4374', '#CACACA'];
    return {
      color: color,
      // title: [
      //   {
      //     text: '状态分布',
      //     x: '19.5%',
      //     y: 'center',
      //     textStyle: {
      //       fontSize: '18',
      //       color: '#fff',
      //       // fontFamily: 'DINAlternate-Bold, DINAlternate',
      //       fontWeight: '600',
      //     },
      //   },
      // ],
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
          console.log('name', name)
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
        {
          type: 'pie',
          radius: ['30%', '36%'],
          center: ['50%', '50%'],
          width: '55%',
          height: '55%',
          top: 'center',
          color: ['#ffffff', 'red'],
          startAngle: 105,
          tooltip: {
            show: false
          },
          data: [
            {
              value: 30,
              name: '',
              itemStyle: {
                normal: {
                  color: 'transparent',
                },
              },
            },
            {
              value: 5,
              name: '',
              itemStyle: {
                normal: {
                  color: 'transparent',
                },
              },
            },
            {
              value: 65,
              name: '',
              itemStyle: {
                normal: {
                  color: '#00C7FE',
                },
              },
            },
          ],
          labelLine: {
            normal: {
              show: false,
            },
          },
          label: {
            normal: {
              show: false,
            },
          },
        },
        {
          type: 'pie',
          radius: [0, '44%'],
          // center: ['19%', '50%'],

          // radius: ['20%', '36%'],
          center: ['50%', '50%'],
          width: '55%',
          height: '55%',
          top: 'center',
          startAngle: 90,
          tooltip: {
            show: false
          },
          data: [
            {
              value: 25,
              name: '',
              itemStyle: {
                normal: {
                  color: 'transparent',
                  borderWidth: 2,
                  borderColor: '#00C7FE',
                },
              },
            },

            {
              value: 75,
              name: '',
              itemStyle: {
                normal: {
                  color: 'transparent',
                },
              },
            },
          ],
          selectedOffset: 10,

          labelLine: {
            normal: {
              show: false,
            },
          },
          label: {
            normal: {
              show: false,
            },
          },
        },
        {
          type: 'pie',
          zlevel: 0,
          silent: true,
          // radius: ['14%', '6%'],
          radius: ['80%', '90%'],
          // radius: [0, '46%'],
          // center: ['19%', '50%'],

          // radius: ['20%', '36%'],
          center: ['50%', '50%'],
          width: '55%',
          height: '55%',
          top: 'center',
          z: 10,
          startAngle: 90,
          label: {
            normal: {
              show: false,
            },
          },
          color: ['red', 'blue', 'red', 'blue'],
          labelLine: {
            normal: {
              show: false,
            },
          },

          data: [
            {
              name: '',
              value: 25,
              itemStyle: {
                normal: {
                  color: new echarts.echartsLib.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: 'rgba(51,149,191,0.5)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(51,149,191,0)',
                    },
                  ]),
                },
              },
            },
            {
              name: '',
              value: 25,
              itemStyle: {
                normal: {
                  color: new echarts.echartsLib.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: 'rgba(0,0,0,0)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(51,149,191,0.5)',
                    },
                  ]),
                },
              },
            },
            {
              name: '',
              value: 25,
              itemStyle: {
                normal: {
                  color: new echarts.echartsLib.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: 'rgba(51,149,191,0)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(51,149,191,0.5)',
                    },
                  ]),
                },
              },
            },
            {
              name: '',
              value: 25,
              itemStyle: {
                normal: {
                  color: new echarts.echartsLib.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: 'rgba(51,149,191,0.5)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,0,0,0)',
                    },
                  ]),
                },
              },
            },
          ],
        },
      ],
    };
  };
  return (
    <HomeCard title="运行状态分布" loading={loading}>
      <div className={styles.echartsContent}>
        <ReactEcharts
          ref={echart => {
            setEcharts(echart);
          }}
          option={getOption(1)}
          lazyUpdate={true}
          style={{ height: '200px', width: '100%' }}
        />
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(RunState);
