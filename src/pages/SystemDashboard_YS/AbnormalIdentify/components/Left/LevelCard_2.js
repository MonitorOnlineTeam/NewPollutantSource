import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard.js';
import DescriptionModal from '@/pages/SystemDashboard/components/DescriptionModal.js';
import ReactEcharts from 'echarts-for-react';
import AbnormalDataAnalysis from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis';
import ToggleRadio from '@/pages/SystemDashboard/components/ToggleRadio.js';
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

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // 在组件卸载或者依赖发生变化前，移除事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [echarts]);

  const handleResize = () => {
    echarts && refreshChart(echarts);
  };

  const fontSizeFn = size => {
    const scale = document.documentElement.clientWidth / 1680;
    return size * scale;
  };

  // 改变echarts图字体大小
  const refreshChart = chart => {
    let echarts_instance = chart.getEchartsInstance();
    echarts_instance.resize();
    let option = echarts_instance.getOption();
    if (option.xAxis && option.yAxis) {
      option.xAxis[0].axisLabel.textStyle.fontSize = fontSizeFn(13);
      option.yAxis[0].nameTextStyle.fontSize = fontSizeFn(13);
      option.yAxis[0].axisLabel.fontSize = fontSizeFn(13);
      option.grid.left = fontSizeFn(60);
      option.grid.bottom = fontSizeFn(40);
      echarts_instance.setOption(option);
    }
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  const getOption = () => {
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
          fontSize: fontSizeFn(14)
          // color: params => {
          //   let index = params.dataIndex;
          //   return color[index][0];
          // },
        },
        itemStyle: {
          normal: {
            color: params => {
              let index = params.dataIndex;
              return new echarts.echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
        bottom: fontSizeFn(40),
        right: 0,
        left: fontSizeFn(60),
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
              fontSize: fontSizeFn(13),
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
            padding: [0, fontSizeFn(50), 0, 0],
            color: '#fff',
            fontSize: fontSizeFn(13),
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            fontSize: fontSizeFn(13),
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
      title={
        <>
          异常分级统计
          <DescriptionModal type="level" />
          {/* <QuestionTooltip
            color="#073783"
            placement="right"
            overlayInnerStyle={{ width: 394 }}
            style={{ color: '#fff' }}
            content={
              <div style={{ fontWeight: 'bold', width: 394 }}>
                <p style={{ marginTop: 10 }}>
                  严重异常（严重影响数据质量，动机定义明确，影响恶劣的）
                </p>
                <div style={{ marginLeft: 20 }}>
                  {modelLevelList
                    ?.find(model => model.ModelTypeCode === '4')
                    ?.ModelList.map((item, i) => {
                      return (
                        <p key={i}>
                          {i + 1}. {item.ModelName}
                        </p>
                      );
                    })}
                </div>
                <p style={{ marginTop: 10 }}>
                  重点异常（影响数据质量，无法判断明显动机，非正常运行的）
                </p>
                <div style={{ marginLeft: 20 }}>
                  {modelLevelList
                    ?.find(model => model.ModelTypeCode === '3')
                    ?.ModelList.map((item, i) => {
                      return (
                        <p key={i}>
                          {i + 1}. {item.ModelName}
                        </p>
                      );
                    })}
                </div>
                <p style={{ marginTop: 10 }}>一般异常（对数据质量影响较小，但仍需要解决的）</p>
                <div style={{ marginLeft: 20 }}>
                  {modelLevelList
                    ?.find(model => model.ModelTypeCode === '2')
                    ?.ModelList.map((item, i) => {
                      return (
                        <p key={i}>
                          {i + 1}. {item.ModelName}
                        </p>
                      );
                    })}
                </div>
                <p style={{ marginTop: 10 }}>提示类异常（不影响数据质量，属于管理不规范的）</p>
                <div style={{ marginLeft: 20 }}>
                  {modelLevelList
                    ?.find(model => model.ModelTypeCode === '1')
                    ?.ModelList.map((item, i) => {
                      return (
                        <p key={i}>
                          {i + 1}. {item.ModelName}
                        </p>
                      );
                    })}
                </div>
              </div>
            }
          /> */}
        </>
      }
      bodyStyle={{ position: 'relative' }}
      loading={loading}
      onExtraClick={onOpenModal}
    >
      <ToggleRadio
        style={{ position: 'absolute', right: '1.25rem', top: '.625rem', zIndex: 1 }}
        onChange={e => {
          setDataType(e.target.value);
        }}
      />
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart);
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
