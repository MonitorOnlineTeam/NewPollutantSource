import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Progress } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import TransmissionefficiencyModal from '@/pages/IntelligentAnalysis/newTransmissionefficiency/EntIndexModal';

const titleBottomStyle = {
  width: 70,
  borderWidth: '3px 11px',
  borderStyle: 'solid',
  borderColor: 'transparent transparent rgb(13, 151, 235)',
};

const dvaPropsData = ({ loading, sysDashboard }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  regionInfo: sysDashboard.regionInfo,
  entInfo: sysDashboard.entInfo,
  time: sysDashboard.time,
  loading: loading.effects['sysDashboard/GetEffectiveTransmissionRate'],
});

const EffectiveRate_2 = props => {
  const [echarts, setEcharts] = useState();
  const [rates, setRates] = useState({
    EfficiencyRate: 0,
    TransmissionRate: 0,
    TransmissionEfficiencyRate: 0,
  });
  const [open, setOpen] = useState(false);

  const { dispatch, loading, time, level, regionCode, entCode, regionInfo, entInfo } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetEffectiveTransmissionRate',
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

  const onOpenModal = () => {
    setOpen(true);
  };

  const getOption = type => {
    if (!echarts) {
      return {};
    }
    let value = type === 1 ? rates.TransmissionRate : rates.EfficiencyRate;
    const dataArr = [
      {
        value: value,
        name: '',
      },
    ];
    const color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: type === 1 ? '#2FFADB' : '#0096FF', // 0% 处的颜色
      },
      {
        offset: 1,
        color: type === 1 ? '#47FFF0' : '#2EA9FF', // 100% 处的颜色
      },
    ]);
    const colorSet = [[value !== '-' ? value / 100 : 0, color], [1, '#192A51']];

    let option = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
      },
      series: [
        {
          type: 'gauge',
          radius: '100%',
          center: ['50%', '60%'],
          startAngle: '180',
          endAngle: '0',
          roundCap: true,
          pointer: {
            show: false,
          },
          detail: {
            color: type === 1 ? '#47FFF0' : '#2EA9FF',
            // lineHeight: 20,
            // padding: [-, 0, 0, 0],
            fontStyle: 'italic',
            fontSize: 20,
            formatter: function(val) {
              return value !== '-' ? value + '%' : '-';
            },
            offsetCenter: ['0%', -10],
          },
          data: dataArr,
          title: {
            show: true,
            color: '#fff',
            fontSize: 20,
            fontStyle: 'italic',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colorSet,
              width: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
            color: '#fff',
            formatter: function(value) {
              return value;
            },
          },
        },
        {
          name: '刻度文字',
          type: 'gauge',
          radius: '100%',
          center: ['50%', '60%'],
          startAngle: '200',
          endAngle: '-20',
          min: 0,
          max: 100,
          splitNumber: 1,
          z: 4,
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 0, //刻度节点线长度
            lineStyle: {
              width: 45,
              color: 'red',
            }, //刻度节点线
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 1)',
            fontSize: 12,
            padding: [20, -30, 0, -26],
          }, //刻度节点文字颜色
          pointer: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              opacity: 0,
            },
          },
          detail: {
            show: false,
          },
          data: [
            {
              value: 0,
              name: '',
            },
          ],
        },
      ],
    };

    return option;
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
    <HomeCard title="有效传输率" bodyStyle={{}} loading={loading}>
      <div className={styles.EffectiveRateWrapper} onClick={onOpenModal}>
        <Row className={styles.rateContent}>
          <p className={styles.title}>有效传输率</p>
          <Progress
            style={{ width: '93%' }}
            percent={rates.TransmissionEfficiencyRate}
            strokeColor="#11C0F9"
            trailColor="#0D6B8A"
            format={percent => {
              return <span style={{ color: '#00E7FF', fontSize: 18 }}>{`${percent}%`}</span>;
            }}
          />
        </Row>
        <Row style={{ marginTop: 16, padding: '0 20px', flex: 1 }}>
          <Col span={12} style={{ cursor: 'pointer' }}>
            <ReactEcharts
              ref={echart => {
                echart && setEcharts(echart.echarts);
              }}
              option={getOption(1)}
              lazyUpdate={true}
              style={{ height: 'calc(100% - 40px)', width: '100%' }}
            />
            <p
              className={styles.center}
              style={{
                width: '100%',
                position: 'absolute',
                bottom: 20,
                // fontWeight: 'bold',
                flexDirection: 'column',
              }}
            >
              传输率
              <div style={titleBottomStyle}></div>
            </p>
          </Col>
          <Col span={12} style={{ cursor: 'pointer' }}>
            <ReactEcharts
              ref={echart => {
                echart && setEcharts(echart.echarts);
              }}
              option={getOption(2)}
              lazyUpdate={true}
              style={{ height: 'calc(100% - 40px)', width: '100%' }}
            />
            <p
              className={styles.center}
              style={{
                width: '100%',
                position: 'absolute',
                bottom: 20,
                // fontWeight: 'bold',
                flexDirection: 'column',
              }}
            >
              有效率
              <div style={titleBottomStyle}></div>
            </p>
          </Col>
        </Row>
      </div>
      <TransmissionefficiencyModal //有效传输率弹框
        title={`有效传输率${extraTitle}`}
        wrapClassName="fullScreenModal"
        beginTime={time[0]}
        endTime={time[1]}
        TVisible={open}
        TCancle={() => {
          setOpen(false);
        }}
        {...modalParams}
        // pollutantType={pollutantType}
      />
    </HomeCard>
  );
};

export default connect(dvaPropsData)(EffectiveRate_2);
