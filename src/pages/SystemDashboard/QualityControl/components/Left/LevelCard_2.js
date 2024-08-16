import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard.js';
import DescriptionModal from '@/pages/SystemDashboard/components/DescriptionModal.js';
import ReactEcharts from 'echarts-for-react';
import AbnormalDataAnalysis from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis';
import _ from 'lodash';

let myChart;
const dvaPropsData = ({ loading, sysDashboard, AbnormalIdentifyModel }) => ({
  time: sysDashboard.time,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  LevelList: sysDashboard.modalLevelList,
  loading: loading.effects['sysDashboard/GetMapPointInfo'],
});

const LevelCard = props => {
  const [echarts, setEcharts] = useState();
  const [dataType, setDataType] = useState('Hours');
  const [open, setOpen] = useState(false);

  const { dispatch, loading, LevelList, entCode, regionCode, time } = props;

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
        name: '完成数量',
        data: [320, 332, 301, 334, 390, 330, 320],
        type: 'bar',
        barMaxWidth: 40,
        stack: 'total',
        itemStyle: {
          color: '#1B8FFE',
        },
      },
      {
        name: '失败数量',
        data: [20, 32, 1, 34, 90, 30, 20],
        type: 'bar',
        barMaxWidth: 40,
        stack: 'total',
        itemStyle: {
          color: '#FF7F0E',
        },
      },
      {
        name: '质控完成率',
        data: [20, 32, 1, 34, 90, 30, 20],
        type: 'line',
        barMaxWidth: 40,
        yAxisIndex: 1,
        smooth: true,
        itemStyle: {
          color: '#42DAB8',
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
      legend: {
        x: 'center',
        top: 10,
        borderRadius: 0,
        itemGap: 18,
        itemWidth: 18,
        // itemHeight: 14,
        textStyle: {
          color: '#fff',
        },
        itemStyle: {
          borderRadius: 0,
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          return `${params[0].marker}${params[0].name}：${params[0].value} ${unit}`;
        },
      },
      grid: {
        borderWidth: 0,
        bottom: 40,
        right: 40,
        left: 40,
        top: 80,
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
          name: `数量(个)`,
          nameTextStyle: {
            padding: [0, 0, 10, 0],
            color: '#63BFFF',
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
        {
          type: 'value',
          name: `完成率(%)`,
          nameTextStyle: {
            padding: [0, 0, 10, 0],
            color: '#63BFFF',
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
    <HomeCard
      title={<>核查任务分析</>}
      bodyStyle={{ position: 'relative' }}
      loading={loading}
      // onExtraClick={onOpenModal}
    >
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart.echarts);
        }}
        option={getOption()}
        style={{ height: '100%' }}
        className="echarts-for-echarts"
        theme="my_theme"
        // onEvents={{ click: onOpenModal }}
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
            time={time}
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
