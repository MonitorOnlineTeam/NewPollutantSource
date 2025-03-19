import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard_YS/styles.less';
import HomeCard from '@/pages/SystemDashboard_YS/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import EquipmentFailureRate from '@/pages/newestHome/components/springModal/equipmentFailureRate';
import EquipmentFailureRatePoint from '@/pages/newestHome/components/springModal/equipmentFailureRate/components/Point';
import EquipmentFailurerePairRate from '@/pages/newestHome/components/springModal/equipmentFailurerePairRate';
import EquipmentFailurerePairRatePoint from '@/pages/newestHome/components/springModal/equipmentFailurerePairRate/components/Point.js';
import { fontSizeFn } from '@/pages/SystemDashboard_YS/CONST.js';

let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  regionInfo: sysDashboard.regionInfo,
  entInfo: sysDashboard.entInfo,
  time: sysDashboard.time,
  loading: loading.effects['sysDashboard/GetEquipmentExceptionsOverview'],
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

  const { dispatch, loading, time, level, regionCode, entCode, regionInfo, entInfo } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetEquipmentExceptionsOverview',
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
    const colorSet = [[value !== '-' ? value : 0, color], [1, '#192A51']];
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
            lineHeight: fontSizeFn(40),
            padding: [fontSizeFn(40), 0, 0, 0],
            fontStyle: 'italic',
            fontSize: fontSizeFn(26),
            formatter: function(val) {
              // return '{size|' + num + '%}';
              return value !== '-' ? value + '%' : '-';
            },
            // rich: rich,
            offsetCenter: ['0%', fontSizeFn(50)],
          },

          data: dataArr,
          title: {
            show: true,
            color: '#fff',
            // offsetCenter: ["0", -100],
            fontSize: fontSizeFn(20),
            fontStyle: 'italic',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: colorSet,
              width: fontSizeFn(25),
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
              width: fontSizeFn(5),
              color: '#018DFF',
            }, //刻度节点线
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 1)',
            fontSize: fontSizeFn(12),
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

  const updateState = (modalParams, namespace) => {
    dispatch({
      type: `${namespace}/updateState`,
      payload: {
        queryPar: { ...modalParams },
      },
    });
  };

  return (
    <HomeCard
      title="设备故障分析"
      bodyStyle={{
        // display: 'flex',
        overflow: 'hidden',
      }}
      loading={loading}
    >
      <Row style={{ marginTop: '1rem', padding: '0 1.25rem', height: '100%' }}>
        <Col
          span={12}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (level == 3 && entCode) {
              let pointParams = {};
              pointParams.regionCode = regionCode;
              pointParams.entCode = entCode;
              pointParams.pointType = 3;
              pointParams.beginTime = moment(time[0]).format('YYYY-MM-DD HH:mm:ss');
              pointParams.endTime = moment(time[1]).format('YYYY-MM-DD HH:mm:ss');
              pointParams.pollutantType = 2;
              updateState(pointParams, 'equipmentFailureRate');
              setTimeout(() => {
                setOpen1(true);
              }, 0);
            } else {
              setOpen1(true);
            }
          }}
        >
          <ReactEcharts
            ref={echart => {
              echart && setEcharts(echart.echarts);
            }}
            option={getOption(1)}
            lazyUpdate={true}
            style={{ height: 'calc(100% - 2.5rem)', width: '100%' }}
          />
          <p
            style={{
              width: '100%',
              textAlign: 'center',
              color: '#fff',
              fontSize: '1rem',
              position: 'absolute',
              bottom: '2.5rem',
              fontWeight: 'bold',
            }}
          >
            故障率
          </p>
        </Col>
        <Col
          span={12}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (level == 3 && entCode) {
              let pointParams = {};
              pointParams.regionCode = regionCode;
              pointParams.entCode = entCode;
              pointParams.pointType = 3;
              pointParams.beginTime = moment(time[0]).format('YYYY-MM-DD HH:mm:ss');
              pointParams.endTime = moment(time[1]).format('YYYY-MM-DD HH:mm:ss');
              pointParams.pollutantType = 2;
              updateState(pointParams, 'equipmentFailurerePairRate');
              setTimeout(() => {
                setOpen2(true);
              }, 0);
            } else {
              setOpen2(true);
            }
          }}
        >
          <ReactEcharts
            ref={echart => {
              echart && setEcharts(echart.echarts);
            }}
            option={getOption(2)}
            lazyUpdate={true}
            style={{ height: 'calc(100% - 2.5rem)', width: '100%' }}
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
              fontSize: '1rem',
              position: 'absolute',
              bottom: '2.5rem',
              fontWeight: 'bold',
            }}
          >
            故障修复率
          </p>
        </Col>
      </Row>
      {open1 &&
        (!modalParams.entCode ? (
          <EquipmentFailureRate //设备故障率弹框
            visible={open1}
            type={2}
            onCancel={() => {
              setOpen1(false);
            }}
            time={[moment(time[0]), moment(time[1])]}
            {...modalParams}
          />
        ) : (
          <Modal
            title={`设备故障率${extraTitle}`}
            wrapClassName="spreadOverModal"
            mask={false}
            open={open1}
            footer={false}
            onCancel={() => {
              setOpen1(false);
            }}
            destroyOnClose
          >
            <EquipmentFailureRatePoint time={[moment(time[0]), moment(time[1])]} {...modalParams} />
          </Modal>
        ))}
      {open2 &&
        (!modalParams.entCode ? (
          <EquipmentFailurerePairRate //设备故障修复率弹框
            visible={open2}
            type={2}
            onCancel={() => {
              setOpen2(false);
            }}
            time={[moment(time[0]), moment(time[1])]}
            {...modalParams}
          />
        ) : (
          <Modal
            title={`设备故障修复率${extraTitle}`}
            wrapClassName="spreadOverModal"
            mask={false}
            open={open2}
            footer={false}
            onCancel={() => {
              setOpen2(false);
            }}
            destroyOnClose
          >
            <EquipmentFailurerePairRatePoint
              time={[moment(time[0]), moment(time[1])]}
              {...modalParams}
            />
          </Modal>
        ))}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceDiagnostics);
