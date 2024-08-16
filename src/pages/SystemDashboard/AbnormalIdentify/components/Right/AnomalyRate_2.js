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

  useEffect(() => {}, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  const getOption = (type, data, label) => {
    let echarts,
      colors = [];
    if (type === 1) {
      echarts = echarts1;
      colors = ['#FFA800', '#FFDE25'];
    } else if (type === 2) {
      echarts = echarts2;
      colors = ['#0066FF', '#00CCFF'];
    } else {
      echarts = echarts3;
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
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
              },
              name: {
                fontSize: 12,
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
      title="疑似异常占比分析"
      style={{ minHeight: 260, flex: 2 }}
      bodyStyle={{}}
      loading={loading}
      onExtraClick={onOpenModal}
    >
      <div className={styles.CustomerSatisfactionWrapper}>
        <Row style={{ height: '100%' }}>
          <Col span={8} onClick={onOpenModal}>
            <ReactEcharts
              ref={echart => {
                echart && setEcharts1(echart.echarts);
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
                echart && setEcharts2(echart.echarts);
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
                echart && setEcharts3(echart.echarts);
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
