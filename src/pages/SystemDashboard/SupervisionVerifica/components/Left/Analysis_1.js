import React, { useState, useEffect, useRef,useMemo } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import SupervisionAnalySumm from '@/pages/operations/supervisionAnalySumm';
import moment from 'moment';
import Modal from 'antd/lib/modal/Modal';

const COLOR = ['#2998FF', '#21ECBB', '#DFE06D'];

const dvaPropsData = ({ sysDashboard, loading }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  supervisionUniformityAnalysisData: sysDashboard.supervisionUniformityAnalysisData,
  loading: loading.effects[`sysDashboard/GetSupervisionUniformityAnalysis`],
});

const Calibration = props => {
  const [open, setOpen] = useState(false);
  const [echarts, setEcharts] = useState();
  const { dispatch, time, loading, level, regionCode, entCode, supervisionUniformityAnalysisData: { RemoteInspector } } = props;
  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetSupervisionUniformityAnalysis',
      payload: {
        pLeve: level,
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        btime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        etime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
    });
  };

  const getOption = () => {
    if (!echarts) {
      return {};
    }
    const nameList = []
    const num1 = []
    const num2 = []


    RemoteInspector?.[0] && RemoteInspector.map(item => {
      nameList.push(item.Name)
      num1.push(item.YiNum)
      num2.push(item.NoYiNum)
    })
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
        },
      },
      legend: {
        itemGap: 40,
        top: 16,
        itemWidth: 28,  // 设置图例的宽度
        itemHeight: 14, // 设置图例的高度
        textStyle: {
          color: "#fff", // 文本颜色
        },
      },
      grid: {
        left: 78,
        right: 0,
        bottom: 26,
      },
      xAxis: {
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: '#202c55'
          }

        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false
        },

      },
      yAxis: {
        type: "category",
        data: nameList,
        axisLabel: {
          textStyle: {
            fontSize: 14,
            color: "#fff",
          },
        },
        axisLine: {//y轴线的配置
          show: true,//是否展示
          lineStyle: {
            color: "#202c55",//y轴线的颜色（若只设置了y轴线的颜色，未设置y轴文字的颜色，则y轴文字会默认跟设置的y轴线颜色一致）
          },
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: "一致",
          type: "bar",
          barMinWidth: 16,
          barWidth: '34%',
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: num1,
          itemStyle: {
            color: "#58CA73", // 自定义颜色
          },
        },
        {
          name: "不一致",
          type: "bar",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: num2,
          itemStyle: {
            color: "#FAD046", // 自定义颜色
          },
        },
      ],
    };

    return option;
  };

  const onOpenModal = () => {
    setOpen(true);
  };
  const renderEcharts = useMemo(() => {
    return (
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
    );
  }, [RemoteInspector]);
  return (
    <HomeCard title="关键参数监督核查分析" bodyStyle={{}} loading={loading} style={{ minHeight: props.homeCardMinHight }}>
      {renderEcharts}
      <span style={{ color: '#63BFFF', position: 'absolute', top: 'calc(40px + 16px)', right: 16 }}>单位：个</span>
      <Modal
      title='关键参数督查汇总'
      destroyOnClose
      wrapClassName={'fullScreenModal'}
      bodyStyle={{padding:0}}
      visible={open}
      mask={false}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <SupervisionAnalySumm
        tabType={2}
      />
    </Modal>
    </HomeCard>

  );
};

export default connect(dvaPropsData)(Calibration);
