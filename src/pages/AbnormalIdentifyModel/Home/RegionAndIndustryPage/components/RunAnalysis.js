import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Tooltip } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';
import DataEfficiencyRateModal from '../../ModalPage/DataEfficiencyRateModal';
import OverRateModal from '../../ModalPage/OverRateModal';

let myChart;
const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  // todoList: wordSupervision.todoList,
  requestParams: AbnormalIdentifyModelHome.requestParams,
  OverRate: AbnormalIdentifyModelHome.OverRate,
  DataEfficiencyRate: AbnormalIdentifyModelHome.DataEfficiencyRate,
  loading: loading.effects['AbnormalIdentifyModelHome/GetOperationsAnalysis'],
});

const RanAnalysis = props => {
  // const runChart = useRef();
  // const overChart = useRef();
  // let runChart, overChart;
  const { dispatch, requestParams, DataEfficiencyRate, OverRate, loading } = props;
  const [runChart, setRunChart] = useState();
  const [overChart, setOverChart] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  useEffect(() => {
    GetOperationsAnalysis();
  }, [requestParams]);

  // 获取运行分析数据
  const GetOperationsAnalysis = () => {
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetOperationsAnalysis',
      payload: {},
    });
  };

  const getOption = (type, data) => {
    let echarts,
      colors = [];
    if (type === 1) {
      echarts = runChart;
      colors = ['#1E83FF', '#53F5FF'];
    } else {
      echarts = overChart;
      colors = ['#FCB12E', '#F5FF53'];
    }
    if (echarts)
      return {
        title: [
          {
            text: data + '%',
            x: 'center',
            y: 'center',
            textStyle: {
              fontSize: '18',
              color: colors[1],
              // fontFamily: 'DINAlternate-Bold, DINAlternate',
              foontWeight: '600',
            },
          },
        ],
        // backgroundColor: '#111',
        polar: {
          radius: ['52%', '62%'],
          center: ['50%', '50%'],
        },
        angleAxis: {
          max: 100,
          show: false,
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
            name: '',
            type: 'bar',
            roundCap: true,
            barWidth: 30,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(66, 66, 66, .3)',
            },
            data: [data],
            coordinateSystem: 'polar',
            itemStyle: {
              normal: {
                color: new runChart.echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colors[0],
                  },
                  {
                    offset: 1,
                    color: colors[1],
                  },
                ]),
              },
            },
          },
        ],
      };

    return {};
  };
  return (
    <HomeCard title="运行分析" loading={loading}>
      <div className={styles.echartsContent}>
        <div
          className={styles.echartItem}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <Tooltip title={'点击查看数据有效率统计'}>
            <ReactEcharts
              ref={echart => {
                setRunChart(echart);
              }}
              option={getOption(1, DataEfficiencyRate)}
              lazyUpdate={true}
              style={{ height: '180px', width: '100%' }}
            />
            <div className={styles.echartsTitle} style={{ color: '#53F5FF' }}>
              数据有效率
            </div>
          </Tooltip>
        </div>
        <div
          className={styles.echartItem}
          onClick={() => {
            setIsModalOpen2(true);
          }}
        >
          <Tooltip title={'点击查看超标率统计'}>
            <ReactEcharts
              ref={echart => {
                setOverChart(echart);
              }}
              option={getOption(2, OverRate)}
              style={{ height: '180px', width: '100%' }}
              theme="my_theme"
            />
            <div className={styles.echartsTitle} style={{ color: '#FCB12E' }}>
              超标率
            </div>
          </Tooltip>
        </div>
      </div>
      <Modal
        title="数据有效率统计"
        wrapClassName="fullScreenModal"
        open={isModalOpen}
        destroyOnClose
        // open={false}
        footer={false}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <DataEfficiencyRateModal level={requestParams.regionCode ? 2 : 1} />
      </Modal>
      <Modal
        title="超标率统计"
        wrapClassName="fullScreenModal"
        open={isModalOpen2}
        destroyOnClose
        // open={false}
        footer={false}
        onCancel={() => {
          setIsModalOpen2(false);
        }}
      >
        <OverRateModal level={requestParams.regionCode ? 2 : 1} />
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(RanAnalysis);
