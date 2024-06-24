import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '../HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import CustomerSatisfacQuery from '@/pages/ctDebuggAfterSaleServiceManage/customerSatisfaction/customerSatisfacQuery';

let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  // loading: loading.effects['ctDataScreen/GetInstallationDebuggingAnalysis'],
});

const CustomerSatisfaction = props => {
  const [echarts1, setEcharts1] = useState();
  const [echarts2, setEcharts2] = useState();
  const [SatisfactionSurveyRate, setSatisfactionSurveyRate] = useState({
    ServiceAttitudeRate: 0,
    TechnicalLevelRate: 0,
    SatisfactionSurveyCount: 0,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState();

  const { dispatch, time, level, regionCode, entCode } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = value => {
    setLoading(true);
    dispatch({
      type: 'ctDataScreen/GetInstallationDebuggingAnalysis',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        bTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        eTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        if (res.IsSuccess) {
          setSatisfactionSurveyRate(res.Datas.SatisfactionSurveyRate);
        }
        setDate(value?.[0] && value?.[1] && [moment(value[0]), moment(value[1])]);
        setLoading(false);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  const getOption = (type, data) => {
    let echarts,
      colors = [],
      labelColor = [];
    if (type === 1) {
      echarts = echarts1;
      colors = ['#1DE4B7', '#1FCAD7', 'rgba(36,220,247,.4)'];
      labelColor = '#30E0DE';
    } else {
      echarts = echarts2;
      colors = ['#1C8AC3', '#4FB7FF', 'rgba(44,142,227, .4)'];
      labelColor = '#2C8EE3';
    }
    let angle = 0; // 角度
    let dataValue = data;
    if (echarts)
      return {
        title: {
          text: `{v|${dataValue}}{unit|%}`,
          x: 'center',
          y: 'center',
          textStyle: {
            rich: {
              v: { fontSize: 22, fontWeight: 'bold', color: labelColor },
              unit: { fontSize: 22, fontWeight: 'bold', color: labelColor },
            },
          },
        },
        series: [
          /** 内心圆 */
          {
            //内圆
            type: 'pie',
            radius: ['64%', '0%'],
            center: ['50%', '50%'],
            z: 1,
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(
                  0.5,
                  0.5,
                  0.5,
                  [
                    {
                      offset: 0,
                      color: 'transparent',
                    },
                    {
                      offset: 0.5,
                      color: 'transparent',
                    },
                    {
                      offset: 1,
                      color: colors[2],
                    },
                  ],
                  false,
                ),
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            label: {
              show: false,
            },
            tooltip: {
              show: false,
            },
            data: [100],
            animationType: 'scale',
          },
          /** 饼图 */
          {
            name: '已完成',
            type: 'pie',
            startAngle: 90,
            z: 0,
            label: {
              position: 'center',
            },
            radius: ['64%', '52%'],
            silent: true,
            animation: false, // 关闭饼图动画
            data: [
              {
                value: dataValue,
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0.2,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      { offset: 0, color: colors[0] },
                      { offset: 1, color: colors[1] },
                    ],
                  },
                },
              },
              {
                name: '未完成',
                value: 100 - dataValue,
                label: { show: false },
                itemStyle: { color: 'transparent' },
              },
            ],
          },
          /** 饼图上刻度 */
          {
            type: 'gauge',
            center: ['50%', '50%'],
            // radius: ['56%', '44%'],
            radius: '86%', // 错位调整此处

            startAngle: 0,
            endAngle: 360,
            splitNumber: 16,
            axisLine: { show: false },
            splitLine: {
              length: 12,
              // length: '24%',
              lineStyle: {
                width: 3,
                color: '#002837',
              },
            },
            axisTick: { show: false },
            axisLabel: { show: false },
          },
          {
            type: 'pie',
            name: '内层细圆环',
            radius: ['70%', '72%'],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                color: colors[2],
              },
            },
            label: {
              show: false,
            },
            data: [100],
          },
        ],
      };

    return {};
  };

  return (
    <HomeCard title="客户满意度分析" 
    style={{ minHeight: 260, flex: 2 }}
    bodyStyle={{}} loading={loading}>
      <div className={styles.CustomerSatisfactionWrapper} onClick={onOpenModal}>
        <Row style={{ height: '100%' }}>
          <Col span={12}>
            <ReactEcharts
              ref={echart => {
                echart && setEcharts1(echart.echarts);
              }}
              option={getOption(1, SatisfactionSurveyRate.ServiceAttitudeRate)}
              lazyUpdate={true}
              style={{ height: '90%', width: '100%' }}
            />
            <p className={styles.echartsTitle} style={{ bottom: '8%' }}>
              工程师态度满意度
            </p>
          </Col>
          <Col span={12}>
            <ReactEcharts
              ref={echart => {
                echart && setEcharts2(echart.echarts);
              }}
              option={getOption(2, SatisfactionSurveyRate.TechnicalLevelRate)}
              lazyUpdate={true}
              style={{ height: '90%', width: '100%' }}
            />
            <p className={styles.echartsTitle} style={{ bottom: '8%' }}>
              工程师技术水平满意度
            </p>
          </Col>
        </Row>
      </div>
      <Modal
        title={`客户满意度调查`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        // bodyStyle={{ padding: 0 }}
      >
        {open && (
          <CustomerSatisfacQuery
            viewOnlyAll
            match={{ path: '' }}
            modalWrapClassName="fullScreenModal"
            initDate={date}
            isHome
          />
        )}
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(CustomerSatisfaction);
