import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
import ReactEcharts from 'echarts-for-react';

let myChart;
const dvaPropsData = ({ loading }) => ({});

const InstallDebugRate = props => {
  // const runChart = useRef();
  // const overChart = useRef();
  // let runChart, overChart;
  const [echarts, setEcharts] = useState();

  useEffect(() => {}, []);

  const getOption = () => {
    if (!echarts) {
      return {};
    }

    let seriesData = [
      { value: 5, name: '优秀' },
      { value: 5, name: '合格' },
      { value: 1, name: '不合格' },
      { value: 4, name: '无照片' },
      { value: 12, name: '/' },
    ];
    let rate = 88;

    console.log('seriesData2', seriesData);
    let option = {
      color: [
        '#5CDC9F',
        '#488CF7',
        '#F46848',
        '#E0D52B',
        '#4EEFEF',
        '#2358DC',
        '#AFD7DE',
        '#EAA017',
        '#6c76f1',
      ],
      tooltip: {
        trigger: 'item',
        valueFormatter: function(value) {
          return value + '%';
        },
        // formatter: '{a} <br/>{b} ： {c} ({d}%)',
      },
      title: {
        text: '{val|' + rate + '%}',
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            val: {
              fontSize: 24,
              fontWeight: 500,
              color: '#0693EF',
            },
          },
        },
      },
      series: [
        {
          name: '服务时长占比',
          type: 'pie',
          radius: [60, 100],
          roseType: 'area',
          itemStyle: {
            normal: {
              shadowBlur: 10,
              shadowColor: 'rgba(44,44,44,0.2)',
            },
          },
          label: {
            show: true,
            position: 'outside',
            color: 'inherit', //继承饼图颜色
            formatter: function(params) {
              return '{b|' + params.name + '：}{c|' + params.value + '套}\n{hr|●}';
            },
            // padding: [0, -90],
            rich: {
              // a: {
              //   fontSize: 18,
              //   padding: [18, 0, 0, 0],
              // },
              b: {
                fontFamily: 'Source Han Sans CN',
                fontWeight: 500,
                fontSize: 15,
                color: '#fff',
                padding: [-10, 0, 0, 6],
              },
              c: {
                fontFamily: 'Microsoft YaHei',
                fontWeight: 500,
                fontSize: 15,
                padding: [-10, 20, 0, 0],
                align: 'left',
                // color: '#0055FE',
              },
              hr: {
                color: 'inherit',
                // borderRadius: 100,
                width: 4,
                height: 4,
                verticalAlign: 'top',
                lineHeight: -20,
                padding: [-5, -10, 0, -10],
                // shadowColor: 'inherit',
                // shadowBlur: 1,
                // shadowOffsetX: '0',
                // shadowOffsetY: '-26',
              },
            },
          },
          labelLine: {
            length: 2,
            length2: 30,
            lineStyle: {
              width: 2, // 引导线宽度
            },
          },
          data: seriesData,
        },
      ],
    };

    return option;
  };

  return (
    <HomeCard
      style={{ minHeight: 320 }}
      title="安装调试达标率"
      bodyStyle={
        {
          // height: 'calc(100% - 110px)',
          // padding: '10px',
          // overflowY: 'auto',
        }
      }
    >
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart.echarts);
        }}
        option={getOption(1, 82.71)}
        lazyUpdate={true}
        style={{ height: '100%', width: '100%' }}
      />
    </HomeCard>
  );
};

export default connect(dvaPropsData)(InstallDebugRate);
