import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '../HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import TimelinessQualityReport from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/timelinessQualityReport';
import ToggleRadio from '@/pages/SystemDashboard/components/ToggleRadio.js';

let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  loading: loading.effects['ctDataScreen/GetTimelyRateAnalysis'],
});

const Card_2 = props => {
  const [echarts, setEcharts] = useState();
  const [open, setOpen] = useState(false);
  const [ServiceReport, setServiceReport] = useState({
    ReportTimelyRate: '0.00',
    ReportQualifiedRate: '0.00',
    ReportTimelyQualifiedRate: '0.00',
  });

  const { dispatch, time, loading, level, regionCode, entCode } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = value => {
    dispatch({
      type: 'ctDataScreen/GetTimelyRateAnalysis',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        bTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        eTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        // 服务报告及时合格率
        setServiceReport(res.ServiceReport);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  const getOption = () => {
    let seriesData2 = [610, 610, 610, 610, 610, 610, 610, 610, 610],
      xData = ['严重异常', '重点异常', '一般异常', '轻微异常', '无异常'];
    let seriesData = [220, 22, 11, 610, 189];

    if (!echarts) {
      return {};
    }
    var color = [
      ['#FF3737', 'rgba(255,55,55,0)'],
      ['#FF6600', 'rgba(255,102,0,0)'],
      ['#FFCC00', 'rgba(255,204,0, 0)'],
      ['#00C0FF', 'rgba(0,192,255,0)'],
      ['#2EEB9D', 'rgba(46,235,157,0)'],
    ];
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
          return `${params[0].marker}${params[0].name}：${params[0].value} 小时`;
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
          name: '（小时）',
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
      <ToggleRadio />
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart.echarts);
        }}
        option={getOption()}
        style={{ height: '100%' }}
        className="echarts-for-echarts"
        theme="my_theme"
      />
      <Modal
        title={`服务报告及时合格率`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        bodyStyle={{ padding: 0 }}
      >
        {open && <TimelinessQualityReport hideBreadcrumb modalWrapClassName="fullScreenModal" />}
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(Card_2);
