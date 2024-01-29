import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
  EmissionStatisticsData: AbnormalIdentifyModelHome.EmissionStatisticsData,
  loading: loading.effects['AbnormalIdentifyModelHome/GetPollutantDischargeGapStatistics'],
});

const EmissionGap = props => {
  const { dispatch, entRequestParams, EmissionStatisticsData, loading } = props;
  const [echarts, setEcharts] = useState();

  useEffect(() => {
    GetPollutantDischargeGapStatistics();
  }, [entRequestParams]);

  // 获取排污缺口
  const GetPollutantDischargeGapStatistics = () => {
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetPollutantDischargeGapStatistics',
      payload: {},
    });
  };

  const getOption = (type, name) => {
    let data1 = [
      {
        name: '排放量',
        value: 20,
      },
      // {
      //   name: '排污缺口',
      //   value: 30,
      // },
    ];

    let data2 = [
      {
        name: '排污缺口超',
        value: 30,
        itemStyle: {
          color: 'red',
        },
      },
      {
        name: '余量',
        value: 40,
        itemStyle: {
          color: 'transparent',
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
      },
    ];

    let option = {
      color: ['#00A8FF', '#00D7E9'],
      title: {
        text: name,
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#fff',
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '47%'],
          data: data1,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: false,
            position: 'outer',
            alignTo: 'edge',
            margin: 10,
            formatter: function(params) {
              let percent = 80;
              if (params.name !== '') {
                // return params.name + '\n' + percent + '%';
                return (
                  '{value|' +
                  params.value +
                  '}(kg)' +
                  '\n' +
                  '{name|' +
                  params.name +
                  '}' +
                  '{percent|' +
                  percent +
                  '%}'
                );
              } else {
                return '';
              }
            },
            padding: [0, 20],
            rich: {
              value: {
                fontSize: 20,
                color: '#14B0FF',
                padding: [0, 10],
                fontWeight: 'bold',
              },
              name: {
                fontSize: 13,
                padding: [0, 10],
                color: '#fff',
                fontWeight: 'bold',
                // align: 'left',
              },
              percent: {
                fontSize: 14,
                // align: 'left',
                color: '#fff',
                padding: [5, 0],
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            length: 40,
            length2: 70,
            show: false,
            smooth: true,
          },
        },
        {
          name: 'Access From',
          type: 'pie',
          radius: ['48%', '54%'],
          startAngle: -90,
          // data: [],
          data: data2,
          // emphasis: {
          //   itemStyle: {
          //     shadowBlur: 10,
          //     shadowOffsetX: 0,
          //     shadowColor: 'rgba(0, 0, 0, 0.5)',
          //   },
          // },
          label: {
            show: false,
            position: 'outer',
            alignTo: 'edge',
            margin: 10,
            formatter: function(params) {
              let percent = 80;
              if (params.name !== '') {
                // return params.name + '\n' + percent + '%';
                return '{text|排污缺口超：}{value|' + params.value + '}(kg)';
              } else {
                return '';
              }
            },
            padding: [20, 0],
            // padding: [0, 0, 100, 40],
            rich: {
              value: {
                fontSize: 20,
                color: '#FF4374',
                // padding: [0, 10],
                fontWeight: 'bold',
              },
              text: {
                fontSize: 13,
                // padding: [0, 10],
                color: '#FF4374',
                fontWeight: 'bold',
                // align: 'left',
              },
            },
          },
          labelLine: {
            length: 10,
            length2: 20,
            show: false,
            smooth: true,
          },
        },
      ],
    };

    return option;
  };
  console.log('EmissionStatisticsData222', EmissionStatisticsData);

  return (
    <HomeCard
      title="排污缺口统计"
      loading={loading}
      bodyStyle={{
        height: 'calc(100% - 110px)',
      }}
    >
      <Row style={{ height: '100%' }}>
        <Col span={8}>
          <ReactEcharts
            ref={echart => {
              setEcharts(echart);
            }}
            option={getOption(2, 'NOx')}
            style={{ height: '100%', width: '100%' }}
            theme="my_theme"
          />
        </Col>
        <Col span={8}>
          <ReactEcharts
            ref={echart => {
              setEcharts(echart);
            }}
            option={getOption(2, 'SO2')}
            style={{ height: '100%', width: '100%' }}
            theme="my_theme"
          />
        </Col>
        <Col span={8}>
          <ReactEcharts
            ref={echart => {
              setEcharts(echart);
            }}
            option={getOption(2, '烟尘')}
            style={{ height: '100%', width: '100%' }}
            theme="my_theme"
          />
        </Col>
      </Row>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(EmissionGap);
