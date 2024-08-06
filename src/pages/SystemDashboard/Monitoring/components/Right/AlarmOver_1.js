import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { bar3DrenderItem } from '@/pages/ctDebuggAfterSaleServiceManage/utils/getBar3D';
import ExceedData from '@/pages/dataSearch/exceedData/index.js';

const COLOR = ['#3AE3FD', '#00AEFF', '#FFC75D'];
const xData = ['烟尘', 'SO₂', 'NOx'];
let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  regionInfo: sysDashboard.regionInfo,
  entInfo: sysDashboard.entInfo,
  time: sysDashboard.time,
  loading: loading.effects['sysDashboard/GetOverDataAnalysis'],
});

const Emissions = props => {
  const [echarts, setEcharts] = useState();
  const [counts, setCounts] = useState({
    p01: 0,
    p02: 0,
    p03: 0,
  });
  const [open, setOpen] = useState(false);

  const { dispatch, loading, time, level, regionCode, entCode, regionInfo, entInfo } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetOverDataAnalysis',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        let counts = {};
        res.map(item => {
          if (item.code === 'zs01' || item.code === 'zs02' || item.code === 'zs03') {
            counts[item.code] = item.count;
          }
        });
        setCounts(counts);
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

    let serviceNum = [counts['zs01'] || 0, counts['zs02'] || 0, counts['zs03'] || 0];

    return {
      color: ['#3AE3FD', '#00AEFF', '#FFC75D'],
      grid: {
        left: 50,
        right: 20,
        bottom: 30,
        top: 50,
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
            fontSize: 13,
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
          name: '超标时长（h）',
          nameTextStyle: {
            color: '#63BFFF',
            fontWeight: 'bold',
          },
          min: 0,
          minInterval: 1,
          axisLabel: {
            textStyle: {
              color: '#fff',
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
          name: '排放量综合分析',
          type: 'custom',
          barWidth: 60,
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
              offset: [4, -20], //左右 上下
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
          // <span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background:linear-gradient(to bottom,#28CBFA, #64B0FD);\"></span>${params[0].name} ：${params[0].value} (kg)<br />`
          return (
            params &&
            `${params[0].seriesName}<br />
               ${params[0].marker}${params[0].name} ：${params[0].value}（h）<br />`
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
      modalParams.regionName = regionInfo.regionName;
      modalParams.entCode = entCode;
    }
  }

  return (
    <HomeCard title="超标数据分析" style={{ minHeight: 340 }} loading={loading}>
      <Row style={{ marginTop: 16, padding: '0 20px' }} className={styles.center}>
        {xData.map((item, index) => {
          return (
            <Col span={5} className={styles.center}>
              <i
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  background: COLOR[index],
                  marginRight: 4,
                }}
              ></i>
              <span style={{ fontSize: 12, color: '#fff' }}>{item}</span>
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
        style={{ height: 'calc(100% - 40px)', width: '100%' }}
        onEvents={{ click: onOpenModal }}
      />

      <Modal
        title={`超标数据分析${extraTitle}`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        bodyStyle={{ padding: 0 }}
      >
        <ExceedData {...modalParams} time={time} />
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(Emissions);
