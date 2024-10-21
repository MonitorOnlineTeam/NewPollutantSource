import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import NetworkRateStatisticsModal from '@/pages/newestHome/components/springModal/networkRateStatistics';
import { fontSizeFn } from '@/pages/SystemDashboard/CONST.js';
const COLOR = ['#2998FF', '#21ECBB', '#DFE06D'];

const dvaPropsData = ({ sysDashboard, loading }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  loading: loading.effects[`sysDashboard/GetVisualDashBoardNetworkingRate`],
});

const ConnectionRate = props => {
  const [open, setOpen] = useState(false);
  const [echarts, setEcharts] = useState();
  const [rates, setRates] = useState({
    NetworkingRate: '0.00',
    NetworkingCount: 0,
    OffLineCount: 0,
  });

  const { dispatch, time, loading, level, regionCode, entCode } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  useEffect(() => {
    window.addEventListener('resize', refreshChart);
    // 在组件卸载或者依赖发生变化前，移除事件监听器
    return () => {
      window.removeEventListener('resize', refreshChart);
    };
  }, [echarts]);

  // 改变echarts图字体大小
  const refreshChart = () => {
    if (echarts) {
      let echarts_instance = echarts.getEchartsInstance();
      echarts_instance.resize();
      let option = echarts_instance.getOption();
      if (option.title) {
        option.title[0].textStyle.rich.val.fontSize = fontSizeFn(20);
        echarts_instance.setOption(option);
      }
    }
  };

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetVisualDashBoardNetworkingRate',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        setRates(res);
      },
    });
  };

  const getOption = () => {
    let data = rates.NetworkingRate;
    // let data = 55;
    if (echarts)
      return {
        title: {
          text: '{val|' + data + '%}',
          top: 'center',
          left: 'center',
          textStyle: {
            rich: {
              val: {
                fontSize: fontSizeFn(20),
                fontWeight: 'bold',
                color: '#fff',
              },
            },
          },
        },
        polar: {
          // radius: ['17%', '83%'],
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
            z: 5,
            coordinateSystem: 'polar',
            name: '警告事件',
            // roundCap: true,
            data: [, , data],
            barWidth: 40,
            // showBackground: true,
            // backgroundStyle: {
            //   color: 'rgba(66, 66, 66, .3)',
            // },
            itemStyle: {
              color: '#FFC200',
            },
            label: {
              show: false,
            },
          },
          {
            type: 'pie',
            z: 2,
            radius: ['75%', '53%'],
            name: '警告事件1',
            data: [data],
            itemStyle: {
              color: new echarts.echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#116CFD',
                },
                {
                  offset: 1,
                  color: '#0BAEFD',
                },
              ]),
            },
            label: {
              show: false,
            },
          },
          {
            type: 'pie',
            z: 4,
            // coordinateSystem: 'polar',
            radius: ['90%', '88%'],
            name: '警告事件1',
            // roundCap: true,
            // barWidth: 40,
            data: [data],
            itemStyle: {
              color: 'rgba(126,183,248, .1)',
            },
            label: {
              show: false,
            },
          },
        ],
      };

    return {};
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard title="实时联网率分析" bodyStyle={{}} loading={loading}>
      <Row style={{ height: '100%' }}>
        <Col span={11}>
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
        </Col>
        <Col span={13} className={styles.center}>
          <Row className={styles.chartLegendWrapper}>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: '#0BAEFD', width: 12, height: 12 }}></i>
                <span className="textOverflow">已联网检测点数</span>
              </div>
              <div className={styles.value}>{rates.NetworkingCount}个</div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: '#FFC200', width: 12, height: 12 }}></i>
                <span className="textOverflow">未联网监测点数</span>
              </div>
              <div className={styles.value}>{rates.OffLineCount}个</div>
            </Col>
          </Row>
        </Col>
      </Row>
      <NetworkRateStatisticsModal //实时联网率
        wrapClassName={'fullScreenModal'}
        networkRateVisible={open}
        networkType={''}
        networkRateCancel={() => {
          setOpen(false);
        }}
        regionCode={regionCode}
        entCode={entCode}
      />
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ConnectionRate);
