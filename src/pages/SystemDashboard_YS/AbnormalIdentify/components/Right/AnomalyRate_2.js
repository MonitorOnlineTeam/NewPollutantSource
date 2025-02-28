import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import AnomalyRateDetect from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/AnomalyRateDetect';

let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  time: sysDashboard.time,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  modalRates: sysDashboard.modalRates,
  loading: loading.effects['sysDashboard/GetMapPointInfo'],
});

const AnomalyRate = props => {
  const [echarts1, setEcharts1] = useState();
  const [echarts2, setEcharts2] = useState();
  const [echarts3, setEcharts3] = useState();
  const [open, setOpen] = useState(false);

  const { dispatch, loading, time, modalRates, entCode, regionCode } = props;

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // 在组件卸载或者依赖发生变化前，移除事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [echarts1, echarts2, echarts3]);

  const handleResize = () => {
    echarts1 && refreshChart(echarts1);
    echarts2 && refreshChart(echarts2);
    echarts3 && refreshChart(echarts3);
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
    if (option.title) {
      option.title[0].textStyle.rich.name.fontSize = fontSizeFn(12);
      option.title[0].textStyle.rich.val.fontSize = fontSizeFn(20);
      echarts_instance.setOption(option);
    }
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  const getOption = (type, data, label) => {
    let echarts,
      colors = [];
    if (type === 1) {
      echarts = echarts1?.echarts;
      colors = ['#FFA800', '#FFDE25'];
    } else if (type === 2) {
      echarts = echarts2?.echarts;
      colors = ['#0066FF', '#00CCFF'];
    } else {
      echarts = echarts3?.echarts;
      colors = ['#3A6DFF', '#513DFD'];
    }
    if (echarts)
      return {
        title: {
          text: '{val|' + data + '%}\n{name|' + label + '}',
          top: 'center',
          left: 'center',
          textStyle: {
            rich: {
              val: {
                fontSize: fontSizeFn(20),
                fontWeight: 'bold',
                color: '#fff',
              },
              name: {
                fontSize: fontSizeFn(12),
                color: '#bfbfbf',
                padding: [8, 0, 0, 0],
                fontWeight: 'bold',
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
            roundCap: true,
            data: [, , data],
            barWidth: 16,
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
            label: {
              show: false,
            },
          },
          {
            type: 'pie',
            z: 2,
            // coordinateSystem: 'polar',
            radius: ['78%', '56%'],
            name: '警告事件1',
            // roundCap: true,
            // barWidth: 40,
            data: [data],
            itemStyle: {
              color: '#003577',
            },
            label: {
              show: false,
            },
          },
          {
            type: 'pie',
            z: 4,
            // coordinateSystem: 'polar',
            radius: ['85%', '83%'],
            name: '警告事件1',
            // roundCap: true,
            // barWidth: 40,
            data: [data],
            itemStyle: {
              color: '#003577',
            },
            label: {
              show: false,
            },
          },
          {
            type: 'pie',
            z: 3,
            // coordinateSystem: 'polar',
            radius: ['56%', '54%'],
            name: '警告事件1',
            // roundCap: true,
            // barWidth: 40,
            data: [data],
            itemStyle: {
              color: '#014B8F',
            },
            label: {
              show: false,
            },
          },
        ],
      };

    return {};
  };
  return (
    <HomeCard
      title="疑似异常小时数据"
      style={{ flex: 2 }}
      bodyStyle={{}}
      loading={loading}
      onExtraClick={onOpenModal}
    >
      <div className={styles.CustomerSatisfactionWrapper}>
        <Row style={{ height: '100%' }}>
          <Col span={8} onClick={onOpenModal}>
            <ReactEcharts
              ref={echart => {
                console.log('echart', echart);
                echart && setEcharts1(echart);
              }}
              option={getOption(1, modalRates.ExcepRate, '疑似异常占比')}
              lazyUpdate={true}
              style={{ height: '100%', width: '100%' }}
              onEvents={{ click: onOpenModal }}
            />
          </Col>
          <Col span={8}>
            <ReactEcharts
              ref={echart => {
                echart && setEcharts2(echart);
              }}
              // option={getOption(2, modalRates.CheckRate, '核实率')}
              option={getOption(2, 93, '核实率')}
              lazyUpdate={true}
              style={{ height: '100%', width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <ReactEcharts
              ref={echart => {
                echart && setEcharts3(echart);
              }}
              option={getOption(3, 94, '整改率')}
              lazyUpdate={true}
              style={{ height: '100%', width: '100%' }}
            />
          </Col>
        </Row>
      </div>
      <Modal
        title={`异常占比诊断分析`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        bodyStyle={{ padding: 0 }}
      >
        {open && <AnomalyRateDetect regionCode={regionCode} entCode={entCode} time={time} />}
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(AnomalyRate);
