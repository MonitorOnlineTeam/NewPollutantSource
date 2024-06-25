import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import PlanWorkOrderStatistics from '@/pages/newestHome/components/springModal/planWorkOrderStatistics/index.js';
import moment from 'moment';

const COLOR = ['#2998FF', '#21ECBB', '#DFE06D'];

const dvaPropsData = ({ sysDashboard, loading }) => ({
  time: sysDashboard.time,
  InspectionAndCalibration: sysDashboard.InspectionAndCalibration,
  loading: loading.effects[`sysDashboard/GetPlanOperationTaskCompleteRate`],
});

const Calibration = props => {
  const [open, setOpen] = useState(false);
  const [echarts, setEcharts] = useState();
  const { time, loading, InspectionAndCalibration } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    if (!echarts) {
      return {};
    }
    let rate = InspectionAndCalibration.calibrationRate;
    let option = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
               type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
            },
         },
         legend: {
            inverse: true,
            itemGap: 40,
            top: 16,
            bottom:0,
            itemWidth: 28,  // 设置图例的宽度
            itemHeight: 14, // 设置图例的高度
            itemStyle: {
                borderRadius: 0 // 设置图例的圆角大小为5
            },
            textStyle: {
                color: "#fff", // 文本颜色
            },
         },
         grid: {
            left: 78,
            right: 0,
            bottom: 20,
         },
         xAxis: {
            type: "value",
            axisLine: {
                show:true,
                lineStyle: {
                    color: '#3B85B0'
                }
                
            },
            axisLabel: {
               show:false,
             },
            axisTick: {
              show:false,
            },
            splitLine: {
              show:false
            },
            
         },
         yAxis: {
            type: "category",
            data: ['量程一致性','数据一致性','参数一致性'],           
            axisLabel: {
                textStyle: {
                    fontSize:14,
                    color: "#fff",
                },
             },
             axisLine: {//y轴线的配置
                show: true,//是否展示
                lineStyle: {
                    color: "#3B85B0",//y轴线的颜色（若只设置了y轴线的颜色，未设置y轴文字的颜色，则y轴文字会默认跟设置的y轴线颜色一致）
                },
             },
            axisTick: {
                show:false,
              },
         },
         series: [
            {
                name: "一致",
                type: "bar",
                barWidth:'34%',
                stack: "total",
                emphasis: {
                  focus: "series",
                },
                data: [1,2,3],
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
                data: [4,5,6],
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

  return (
    <HomeCard title="关键参数监督核查分析" bodyStyle={{}} loading={loading} style={{minHeight:props.homeCardMinHight}}>
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
        <span style={{color:'#63BFFF',position:'absolute',top:'calc(40px + 16px)',right:16}}>单位：个</span>
      {open && (
        <PlanWorkOrderStatistics //实际校准完成率弹框
          modalType="planCalibration"
          visible={open}
          type={2}
          onCancel={() => {
            setOpen(false);
          }}
          time={[moment(time[0]), moment(time[1])]}
        />
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(Calibration);
