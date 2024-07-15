import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import TimelinessQualityReport from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/timelinessQualityReport';

let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  time: sysDashboard.time,
  loading: loading.effects['ctDataScreen/GetTimelyRateAnalysis'],
});

const Card_2 = props => {
  const [echarts1, setEcharts1] = useState();
  const [echarts2, setEcharts2] = useState();
  const [echarts3, setEcharts3] = useState();
  const [open, setOpen] = useState(false);
  const [ServiceReport, setServiceReport] = useState({
    ReportTimelyRate: '0.00',
    ReportQualifiedRate: '0.00',
    ReportTimelyQualifiedRate: '0.00',
  });

  const { dispatch, time, loading } = props;

  useEffect(() => {
    getData();
  }, [time]);

  const getData = value => {
    dispatch({
      type: 'ctDataScreen/GetTimelyRateAnalysis',
      payload: {
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

  const getOption = (type, data) => {
    let echarts,
      colors = [],
      labelColor = [];
    if (type === 1) {
      echarts = echarts1;
      colors = ['rgba(10,123,219,0.5)', '#008AFF', '#3AA0F6'];
      labelColor = ['#7FC4FF', 'rgba(4,64,117,0.82)'];
    } else if (type === 2) {
      echarts = echarts2;
      colors = ['rgba(211,161,51,0.5)', '#FFA800', '#EAB131'];
      labelColor = ['#FFD16B', 'rgba(156,108,0,0.82)'];
    } else {
      echarts = echarts3;
      colors = ['rgba(56,230,212,0.5)', '#38E6D4', '#38E6D4'];
      labelColor = ['#38E6D4', 'rgba(6,72,94,0.82)'];
    }
    if (echarts)
      return {
        title: [
          {
            text: data + '%',
            x: 'center',
            y: 'center',
            textStyle: {
              fontSize: 18,
              color: colors[2],
              // fontFamily: 'DINAlternate-Bold, DINAlternate',
              fontWeight: 'bold',
            },
          },
        ],

        polar: {
          radius: ['37%', '73%'],
          center: ['50%', '50%'],
        },
        angleAxis: { 
          max: 100,
          show: false,
          // startAngle: 225
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            type: 'bar',
            z: 3,
            coordinateSystem: 'polar',
            name: '警告事件',
            roundCap: true,
            data: [, , data],
            barWidth: 30,
            // showBackground: true,
            // backgroundStyle: {
            //   color: 'rgba(66, 66, 66, .3)',
            // },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: colors[1],
                },
                {
                  offset: 1,
                  color: colors[0],
                },
              ]),
            },
          },
          {
            type: 'pie',
            z: 2,
            // coordinateSystem: 'polar',
            radius: ['74%', '62%'],
            name: '警告事件1',
            // roundCap: true,
            barWidth: 40,
            data: [data],
            itemStyle: {
              color: '#rgba(66, 66, 66, .3)',
            },
          },
          {
            type: 'pie',
            radius: ['72%', '58%'],
            hoverAnimation: false,
            z: 9,
            // startAngle: 225,
            // endAngle: 0,
            // showBackground: true,
            // backgroundStyle: {
            //   color: 'rgba(66, 66, 66, .3)',
            // },
            data: [
              {
                name: '',
                value: data,
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  color: 'rgba(0,0,0,0)',
                },
              },
              {
                //画中间的图标
                name: '',
                value: 0,
                label: {
                  position: 'inside',
                  // offset: [1, 0],
                  backgroundColor: labelColor[0],
                  borderRadius: 6,
                  padding: 6,
                  borderWidth: 0,
                  borderColor: 'blue',

                  shadowColor: labelColor[1],
                  shadowBlur: 10,
                  shadowOffsetY: 4,
                  shadowOffsetX: 4,
                },
              },
              {
                name: '',
                value: 100 - data,
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  color: 'rgba(255,255,255,0)',
                },
              },
            ],
          },
        ],
      };

    return {};
  };

  return (
    <HomeCard title="服务报告合格分析" bodyStyle={{}} loading={loading}>
      <Row style={{ height: '100%' }} onClick={onOpenModal}>
        <Col span={8}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts1(echart.echarts);
            }}
            option={getOption(1, ServiceReport.ReportTimelyRate)}
            lazyUpdate={true}
            style={{ height: '90%', width: '100%' }}
          />
          <p className={styles.echartsTitle}>及时合格率</p>
        </Col>
        <Col span={8}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts2(echart.echarts);
            }}
            option={getOption(2, ServiceReport.ReportTimelyQualifiedRate)}
            lazyUpdate={true}
            style={{ height: '90%', width: '100%' }}
          />
          <p className={styles.echartsTitle}>及时率</p>
        </Col>
        <Col span={8}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts3(echart.echarts);
            }}
            option={getOption(3, ServiceReport.ReportQualifiedRate)}
            lazyUpdate={true}
            style={{ height: '90%', width: '100%' }}
          />
          <p className={styles.echartsTitle}>合格率</p>
        </Col>
      </Row>
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
