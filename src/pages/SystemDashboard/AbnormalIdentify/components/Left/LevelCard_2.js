import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '../HomeCard';
import ReactEcharts from 'echarts-for-react';
import AbnormalDataAnalysis from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis';
import ToggleRadio from '@/pages/SystemDashboard/components/ToggleRadio.js';
import _ from 'lodash';

let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  LevelList: sysDashboard.modalLevelList,
  loading: loading.effects['sysDashboard/GetMapPointInfo'],
});

const LevelCard = props => {
  const [echarts, setEcharts] = useState();
  const [dataType, setDataType] = useState('Hours');
  const [open, setOpen] = useState(false);

  const { dispatch, loading, LevelList, entCode, regionCode } = props;

  useEffect(() => {}, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  const getOption = () => {
    console.log('LevelList', LevelList);

    if (!echarts || !LevelList.length) {
      return {};
    }
    let max = _.maxBy(LevelList, dataType)[dataType];
    let seriesData = [],
      seriesData2 = [],
      xData = [];

    LevelList.map(item => {
      xData.push(item.key);
      seriesData2.push(max);
      seriesData.push(item[dataType]);
    });

    var color = [
      ['#FF3737', 'rgba(255,55,55,0)'],
      ['#FF6600', 'rgba(255,102,0,0)'],
      ['#FFCC00', 'rgba(255,204,0, 0)'],
      ['#00C0FF', 'rgba(0,192,255,0)'],
      ['#2EEB9D', 'rgba(46,235,157,0)'],
    ];

    let unit = dataType === 'Hours' ? '小时' : '个';
    let series = [
      {
        type: 'pictorialBar',
        symbol: 'path://M35,0L35,70L0,70z M35,0L35,70L70,70z',
        data: seriesData.map((item, index) => ({
          value: item,
          label: {
            color: color[index][0],
          },
        })),
        z: 99,
        barMaxWidth: 40,
        label: {
          show: true,
          position: 'top',
          fontWeight: 'bold',
          // color: params => {
          //   let index = params.dataIndex;
          //   return color[index][0];
          // },
        },
        itemStyle: {
          normal: {
            color: params => {
              let index = params.dataIndex;
              return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: color[index][0],
                },
                {
                  offset: 1,
                  color: color[index][1],
                },
              ]);
            },
            opacity: 1,
          },
        },
      },
      {
        data: seriesData2,
        type: 'bar',
        barMaxWidth: 40,
        barGap: '-100%',
        zlevel: -1,
        itemStyle: {
          color: 'rgba(0,70,126,.1)',
        },
      },
    ];
    let option = {
      // tooltip: {
      //   show: true,
      //   // formatter: '{c}' + '个人',
      // },
      // toolbox: {
      //   show: true,
      //   top: 10,
      //   right: 10,
      // },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          return `${params[0].marker}${params[0].name}：${params[0].value} ${unit}`;
        },
      },
      grid: {
        borderWidth: 0,
        bottom: 40,
        right: 0,
        left: 40,
        // textStyle: {
        //   color: '#fff',
        // },
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#203056',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            // formatter: function(value, index) {
            //   if (index == 0) {
            //     return `{clickItem|${value}}`;
            //   } else {
            //     return `{defalutItem|${value}}`;
            //   }
            // },
            textStyle: {
              // fontSize: 14,
              color: '#dfdfdf',
              fontWeight: 'bold',
            },
          },
          data: xData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: `（${unit}）`,
          nameTextStyle: {
            padding: [0, 50, 0, 0],
            color: '#fff',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#fff',
              fontWeight: 'bold',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#203056',
            },
          },
        },
      ],
      series,
    };

    return option;
  };

  return (
    <HomeCard title="异常分级统计" bodyStyle={{ position: 'relative' }} loading={loading}>
      <ToggleRadio
        style={{ position: 'absolute', right: 20, top: 10, zIndex: 1 }}
        onChange={e => {
          setDataType(e.target.value);
        }}
      />
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart.echarts);
        }}
        option={getOption()}
        style={{ height: '100%' }}
        className="echarts-for-echarts"
        theme="my_theme"
        onEvents={{ click: onOpenModal }}
      />
      <Modal
        title={'异常分级统计'}
        wrapClassName="fullScreenModal"
        destroyOnClose
        visible={open}
        footer={false}
        onCancel={() => setOpen(false)}
        bodyStyle={{ padding: 0 }}
      >
        {open && (
          <AbnormalDataAnalysis
            location={{
              pathname: '/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis/level',
            }}
            regionCode={regionCode}
            entCode={entCode}
            rtnType={dataType === 'Hours' ? 'hours' : 'nums'}
            wrapClassName={'fullScreenModal'}
          />
        )}
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(LevelCard);
