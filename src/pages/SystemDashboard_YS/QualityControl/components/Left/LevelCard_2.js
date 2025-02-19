import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard.js';
import DescriptionModal from '@/pages/SystemDashboard/components/DescriptionModal.js';
import ReactEcharts from 'echarts-for-react';
import AbnormalDataAnalysis from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis';
import _ from 'lodash';
import moment from 'moment';
import { fontSizeFn } from '@/pages/SystemDashboard/CONST.js';

let myChart;
const dvaPropsData = ({ loading, sysDashboard, AbnormalIdentifyModel }) => ({
  level: sysDashboard.level,
  time: sysDashboard.time,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  loading: loading.effects['sysDashboard/GetQCACRTaskAnalysis'],
});

const LevelCard = props => {
  const [echarts, setEcharts] = useState();
  const [taskAnalysisData, setTaskAnalysisData] = useState([]);
  const [open, setOpen] = useState(false);

  const { dispatch, loading, level, entCode, regionCode, time } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = value => {
    dispatch({
      type: 'sysDashboard/GetQCACRTaskAnalysis',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        pLeve: level,
        TopNum: 10,
        bTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        eTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        setTaskAnalysisData(res);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  const getOption = () => {
    if (!echarts) {
      return {};
    }

    let xData = [],
      ResultTrueNums = [],
      ResultFalseNum = [],
      rates = [];
    taskAnalysisData.map(item => {
      xData.push(item.Name);
      ResultTrueNums.push(item.ResultTrueNum);
      ResultFalseNum.push(item.ResultFalseNum);
      let count = item.ResultFalseNum + item.ResultTrueNum;
      let rate = count > 0 ? item.ResultTrueNum / count : 0;
      rates.push(rate);
    });

    let series = [
      {
        name: '完成数量',
        data: ResultTrueNums,
        type: 'bar',
        barMaxWidth: fontSizeFn(40),
        stack: 'total',
        itemStyle: {
          color: '#1B8FFE',
        },
      },
      {
        name: '失败数量',
        data: ResultFalseNum,
        type: 'bar',
        barMaxWidth: fontSizeFn(40),
        stack: 'total',
        itemStyle: {
          color: '#FF7F0E',
        },
      },
      {
        name: '质控完成率',
        data: rates,
        type: 'line',
        barMaxWidth: fontSizeFn(40),
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
        itemGap: fontSizeFn(18),
        itemWidth: fontSizeFn(18),
        // itemHeight: 14,
        textStyle: {
          color: '#fff',
          fontSize: fontSizeFn(13),
        },
        itemStyle: {
          borderRadius: 0,
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          console.log('params', params);
          let str = '';
          params.map(item => {
            let unit = item.seriesName === '质控完成率' ? '%' : '个';
            str += `${item.marker}${item.seriesName}：${item.value} ${unit} <br />`;
          });

          return str;
        },
      },
      grid: {
        borderWidth: 0,
        bottom: fontSizeFn(40),
        right: fontSizeFn(40),
        left: fontSizeFn(40),
        top: fontSizeFn(80),
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
            // interval: 0,
            // formatter: function(value, index) {
            //   if (index == 0) {
            //     return `{clickItem|${value}}`;
            //   } else {
            //     return `{defalutItem|${value}}`;
            //   }
            // },
            textStyle: {
              fontSize: fontSizeFn(14),
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
            padding: [0, 0, fontSizeFn(10), 0],
            color: '#63BFFF',
            fontSize: fontSizeFn(13),
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
              fontSize: fontSizeFn(13),
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
            padding: [0, 0, fontSizeFn(10), 0],
            color: '#63BFFF',
            fontSize: fontSizeFn(13),
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
              fontSize: fontSizeFn(13),
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
      {/* <Modal
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
      </Modal> */}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(LevelCard);
