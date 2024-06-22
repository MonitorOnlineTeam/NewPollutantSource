import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import EquipmentFailureRate from '@/pages/newestHome/components/springModal/equipmentFailureRate';
import EquipmentFailurerePairRate from '@/pages/newestHome/components/springModal/equipmentFailurerePairRate';

let myChart;
const dvaPropsData = ({ loading, OperationSysDashboard }) => ({
  level: OperationSysDashboard.level,
  regionCode: OperationSysDashboard.regionCode,
  entCode: OperationSysDashboard.entCode,
  time: OperationSysDashboard.time,
  loading: loading.effects['OperationSysDashboard/GetEquipmentExceptionsOverview'],
});

const DeviceDiagnostics = props => {
  const [echarts, setEcharts] = useState();
  const [rates, setRates] = useState({
    faultAllNum: 0,
    failureRate: 0,
    repairRate: 0,
  });
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const { dispatch, loading, time, level, regionCode, entCode } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'OperationSysDashboard/GetEquipmentExceptionsOverview',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        setRates({
          faultAllNum: res.faultAllNum,
          failureRate: res.failureRate,
          repairRate: res.repairRate,
        });
      },
    });
  };

  const onOpenModal = () => {
    setOpen1(true);
  };

  const getOption = type => {
    if (!echarts) {
      return {};
    }
    let value = type === 1 ? rates.failureRate : rates.repairRate;
    const dataArr = [
      {
        value: value,
        name: '',
      },
    ];
    const color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: type === 1 ? '#2783CD' : '#FF7200', // 0% 处的颜色
      },
      {
        offset: 1,
        color: type === 1 ? '#0EFCFF' : '#FFD725', // 100% 处的颜色
      },
    ]);
    const colorSet = [
      [value !== '-' ? value : 0, color],
      [1, '#192A51'],
    ];
    const rich = {
      bule: {
        fontSize: 120,
        fontFamily: 'DINBold',
        color: '#fff',
        fontWeight: '700',
      },
      radius: {
        width: 350,
        height: 80,
        // lineHeight:80,
        borderWidth: 1,
        borderColor: '#0092F2',
        fontSize: 50,
        color: '#fff',
        backgroundColor: '#1B215B',
        borderRadius: 20,
        textAlign: 'center',
      },
      size: {
        height: 20,
        padding: [10, 0, 0, 0],
      },
    };
    let option = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
      },

      series: [
        {
          type: 'gauge',
          radius: '70%',
          startAngle: '205',
          endAngle: '-25',
          pointer: {
            show: false,
          },
          detail: {
            color: type === 1 ? '#00EDFF' : '#FFA111',
            lineHeight: 40,
            padding: [40, 0, 0, 0],
            fontStyle: 'italic',
            fontSize: 26,
            formatter: function(val) {
              // return '{size|' + num + '%}';
              return value !== '-' ? value + '%' : '-';
            },
            // rich: rich,
            offsetCenter: ['0%', 50],
          },

          data: dataArr,
          title: {
            show: true,
            color: '#fff',
            // offsetCenter: ["0", -100],
            fontSize: 20,
            fontStyle: 'italic',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colorSet,
              width: 25,
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
            // length: 35,
            // lineStyle: {
            //   color: '#00377a',
            //   width: 2,
            //   type: 'solid',
            // },
          },
          axisLabel: {
            show: false,
            color: '#fff',
            formatter: function(value) {
              // if (value === 0 || value === 1000) {
              return value;
              // }
            },
          },
        },
        {
          name: '刻度文字',
          type: 'gauge',
          radius: '72%',
          startAngle: '200',
          endAngle: '-21',
          min: 0,
          max: rates.faultAllNum,
          splitNumber: 1,
          z: 4,
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 0, //刻度节点线长度
            lineStyle: {
              width: 5,
              color: '#018DFF',
            }, //刻度节点线
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 1)',
            fontSize: 12,
            padding: [0, -20, 0, -12],
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

  return (
    <HomeCard title="设备故障分析" bodyStyle={{}} loading={loading}>
      <Row style={{ marginTop: 16, padding: '0 20px', height: '100%' }}>
        <Col span={12} style={{ cursor: 'pointer' }} onClick={() => setOpen1(true)}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts(echart.echarts);
            }}
            option={getOption(1)}
            lazyUpdate={true}
            style={{ height: 'calc(100% - 40px)', width: '100%' }}
          />
          <p
            style={{
              width: '100%',
              textAlign: 'center',
              color: '#fff',
              fontSize: 16,
              position: 'absolute',
              bottom: 40,
              fontWeight: 'bold',
            }}
          >
            故障率
          </p>
        </Col>
        <Col span={12} style={{ cursor: 'pointer' }} onClick={() => setOpen2(true)}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts(echart.echarts);
            }}
            option={getOption(2)}
            lazyUpdate={true}
            style={{ height: 'calc(100% - 40px)', width: '100%' }}
            onEvents={{
              click: () => {
                setOpen2(true);
              },
            }}
          />
          <p
            style={{
              width: '100%',
              textAlign: 'center',
              color: '#fff',
              fontSize: 16,
              position: 'absolute',
              bottom: 40,
              fontWeight: 'bold',
            }}
          >
            故障修复率
          </p>
        </Col>
      </Row>
      {open1 && (
        <EquipmentFailureRate //设备故障率弹框
          visible={open1}
          type={2}
          onCancel={() => {
            setOpen1(false);
          }}
          time={[moment(time[0]), moment(time[1])]}
        />
      )}
      {open2 && (
        <EquipmentFailurerePairRate //设备故障修复率弹框
          visible={open2}
          type={2}
          onCancel={() => {
            setOpen2(false);
          }}
          time={[moment(time[0]), moment(time[1])]}
        />
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceDiagnostics);
