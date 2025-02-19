import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard_YS/styles.less';
import HomeCard from '@/pages/SystemDashboard_YS/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { bar3DrenderItem } from '@/pages/ctDebuggAfterSaleServiceManage/utils/getBar3D';
import ConsumablesStatisticsModal from '@/pages/newestHome/components/springModal/consumablesStatistics';
import ConsumablesStatisticsModal2 from '@/pages/newestHome/components/springModal/consumablesStatistics/components/Point.js';
import { fontSizeFn } from '@/pages/SystemDashboard_YS/CONST.js';

const COLOR = ['#3AE3FD', '#00AEFF', '#FFC75D'];
const xData = ['标准气体更换数量', '易耗品更换数量', '备品备件更换数量'];
let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  regionInfo: sysDashboard.regionInfo,
  entInfo: sysDashboard.entInfo,
  time: sysDashboard.time,
  loading: loading.effects['sysDashboard/GetVisualDashBoardConsumablesStatisticsInfo'],
});

const ReplacementAnalysis = props => {
  const [echarts, setEcharts] = useState();
  const [counts, setCounts] = useState({
    consumablesReplaceCount: 0,
    sparePartReplaceRecordCount: 0,
    standardGasRepalceCoun: 0,
    standardLiquidRepalceCount: 0,
  });
  const [open, setOpen] = useState(false);

  const { dispatch, loading, time, level, regionCode, entCode, regionInfo, entInfo } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetVisualDashBoardConsumablesStatisticsInfo',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        setCounts(res);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  const renderItemFun = (params, api, type, e) => {
    let color1, color2, color3;
    if (params.dataIndex === 0) {
      color1 = '#4EAEFC';
      color2 = '#3C7BB7';
      color3 = '#3AE3FD'; //顶部
    }

    if (params.dataIndex === 1) {
      color1 = '#00AEFF';
      color2 = '#00AEFF';
      color3 = '#00AEFF'; //顶部
    }
    if (params.dataIndex === 2) {
      color1 = '#FF9C5D';
      color2 = '#FFD75D';
      color3 = '#FFC75D'; //顶部
    }

    return bar3DrenderItem(params, api, type, e, color1, color2, color3);
  };

  const getOption = () => {
    if (!echarts) {
      return {};
    }

    let serviceNum = [
      counts.standardGasRepalceCoun,
      counts.consumablesReplaceCount,
      counts.sparePartReplaceRecordCount,
    ];

    return {
      color: ['#3AE3FD', '#00AEFF', '#FFC75D'],
      grid: {
        left: fontSizeFn(50),
        right: fontSizeFn(20),
        bottom: fontSizeFn(30),
        top: fontSizeFn(50),
      },

      xAxis: {
        type: 'category',
        data: xData,
        inverse: 0,
        axisLine: {
          lineStyle: {
            color: '#202D52', // 修改 x 轴的轴线颜色
          },
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: '#fff', // 修改 x 轴刻度文字的颜色
            fontWeight: 'bold',
            fontSize: fontSizeFn(13),
          },
        },
        axisTick: {
          //刻度
          show: false,
        },
        axisPointer: {
          type: 'shadow',
        },
      },
      yAxis: [
        {
          type: 'value',
          min: 0,
          minInterval: 1,
          axisLabel: {
            textStyle: {
              color: '#fff',
              fontSize: fontSizeFn(13)
            },
            // formatter: '{value}次',
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            //网格线
            lineStyle: {
              //分割线
              color: '#202D52',
              width: 1,
              // type: 'dashed', //dotted：虚线 solid:实线
            },
          },
        },
      ],
      series: [
        {
          name: '备件更换分析',
          type: 'custom',
          barWidth: fontSizeFn(60),
          renderItem: (params, api) => {
            return renderItemFun(params, api, 1);
          },
          data: serviceNum,
        },
        {
          type: 'bar',
          barWidth: 0,
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#3AE3FD',
              fontWeight: 'bold',
              offset: [fontSizeFn(4), -20], //左右 上下
              fontSize: fontSizeFn(14)
            },
          },
          itemStyle: {
            color: 'transparent',
          },
          data: serviceNum,
          z: 2,
        },
        // {
        //   type: 'bar', //显示背景图
        //   data: serviceNum,
        //   itemStyle: { color: 'rgba(59, 133, 176, .1)' },
        //   barWidth: 24,
        //   z: '-1',
        //   barGap: '-100%',
        //   silent: true, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。  为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面
        //   barMinHeight: 1000,
        // },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          return (
            params &&
            `${params[0].seriesName}<br />
              <span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background:linear-gradient(to bottom,#28CBFA, #64B0FD);\"></span>${params[0].name} ：${params[0].value}<br />`
          );
        },
      },
    };
  };

  let extraTitle = '',
    modalParams = {};
  if (level != 1 && (regionCode || entCode)) {
    if (level == 2 && regionCode) {
      extraTitle = `（${regionInfo.regionName}）`;
      modalParams.regionCode = regionCode;
    }
    if (level == 3 && entCode) {
      extraTitle = `（${regionInfo.regionName} - ${entInfo.entName}）`;
      modalParams.regionCode = regionCode;
      modalParams.entCode = entCode;
    }
  }

  return (
    <HomeCard title="备件使用监管" bodyStyle={{}} loading={loading}>
      <Row style={{ marginTop: '1rem', padding: '0 1.25rem' }}>
        {xData.map((item, index) => {
          return (
            <Col span={8} className={styles.center}>
              <i
                style={{
                  display: 'inline-block',
                  width: '.625rem',
                  height: '.625rem',
                  background: COLOR[index],
                  marginRight: '.25rem',
                }}
              ></i>
              <span style={{ fontSize: '.75rem', color: '#fff' }}>{item}</span>
            </Col>
          );
        })}
      </Row>
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart.echarts);
        }}
        option={getOption(1)}
        lazyUpdate={true}
        style={{ height: 'calc(100% - 2.5rem)', width: '100%' }}
        onEvents={{ click: onOpenModal }}
      />

      {open && (
        <ConsumablesStatisticsModal //耗材统计弹框
          title={`备件使用监管${extraTitle}`}
          visible={open}
          type={2}
          onCancel={() => {
            setOpen(false);
          }}
          time={[moment(time[0]), moment(time[1])]}
          {...modalParams}
        />
        // <Modal
        // title={`备件更换分析${extraTitle}`}
        //   wrapClassName="spreadOverModal"
        //   mask={false}
        //   open={open}
        //   footer={false}
        //        onCancel={() => {
        //     setOpen(false);
        //   }}
        //   destroyOnClose
        // >
        //   <ConsumablesStatisticsModal2 time={[moment(time[0]), moment(time[1])]} {...modalParams} />
        // </Modal>
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ReplacementAnalysis);
