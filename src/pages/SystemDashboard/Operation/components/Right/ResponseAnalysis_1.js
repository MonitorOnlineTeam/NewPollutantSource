import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import AbnormalAlarmRateModal from '@/pages/newestHome/components/springModal/abnormalAlarmRate';
import MissingDataRateModal from '@/pages/newestHome/components/springModal/missingDataRate/MissingDataRateModel';

let myChart;
const dvaPropsData = ({ loading, OperationSysDashboard }) => ({
  level: OperationSysDashboard.level,
  regionCode: OperationSysDashboard.regionCode,
  entCode: OperationSysDashboard.entCode,
  time: OperationSysDashboard.time,
  loading: loading.effects['OperationSysDashboard/GetExceptionResponseRate'],
});

const ResponseAnalysis = props => {
  const [echarts, setEcharts] = useState();
  const [rates, setRates] = useState({
    ex2Rate: 0,
    ex8Rate: 0,
    ex24Rate: 0,
    exOver24Rate: 0,
    miss2Rate: 0,
    miss8Rate: 0,
    miss24Rate: 0,
    missOver24Rate: 0,
  });
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const { dispatch, time, loading, level, regionCode, entCode } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  function formatNumber(value) {
    // 如果是整数就直接返回，不是就保留小数
    return Number.isInteger(value) ? value : value.toFixed(2);
  }

  function calculatePercentage(part, total) {
    const percentage = total !== 0 ? (part / total) * 100 : 0;
    return isNaN(percentage) ? 0 : formatNumber(percentage);
  }

  const getData = () => {
    dispatch({
      type: 'OperationSysDashboard/GetExceptionResponseRate',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        let ex2Rate = calculatePercentage(res.ex2ResponseCount, res.exAllCount);
        let ex8Rate = calculatePercentage(res.ex8ResponseCount, res.exAllCount);
        let ex24Rate = calculatePercentage(res.ex24ResponseCount, res.exAllCount);
        let exOver24Rate = calculatePercentage(res.exOver2ResponseCount, res.exAllCount);

        let miss2Rate = calculatePercentage(res.miss2ResponseCount, res.missAllCount);
        let miss8Rate = calculatePercentage(res.miss8ResponseCount, res.missAllCount);
        let miss24Rate = calculatePercentage(res.miss24ResponseCount, res.missAllCount);
        let missOver24Rate = calculatePercentage(res.missOver2ResponseCount, res.missAllCount);

        setRates({
          ex2Rate,
          ex8Rate,
          ex24Rate,
          exOver24Rate,
          miss2Rate,
          miss8Rate,
          miss24Rate,
          missOver24Rate,
        });
      },
    });
  };

  const getOption = (type, data) => {
    if (!echarts) {
      return {};
    }

    const {
      ex2Rate,
      ex8Rate,
      ex24Rate,
      exOver24Rate,
      miss2Rate,
      miss8Rate,
      miss24Rate,
      missOver24Rate,
    } = rates;

    var xData = ['2小时内', '2-8小时', '8-24小时', '24小时以上'];
    var exRates = [ex2Rate, ex8Rate, ex24Rate, exOver24Rate];
    var missRates = [miss2Rate, miss8Rate, miss24Rate, missOver24Rate];
    let lineColor = 'rgba(255,255,255,0.2)';
    let colors = [
      {
        borderColor: 'rgba(227,161,96,1)',
        start: '#FDA020',
        end: '#FFEC1A',
      },
      {
        borderColor: 'rgba(0,222,255,1)',
        start: '#0170FD',
        end: '#92BFFC',
      },
    ];
    let borderData = [];
    let scale = 2;
    borderData = xData.map(item => {
      return scale;
    });
    let maxData = [];
    maxData = xData.map(item => {
      return 100;
    });
    let option = {
      baseOption: {
        timeline: {
          show: false,
          top: 0,
          data: [],
        },
        grid: [
          {
            show: false,
            left: '60px',
            top: '18%',
            bottom: '10',
            containLabel: true,
            width: '24%',
          },
          {
            show: false,
            left: '51%',
            top: '18%',
            bottom: '10',
            width: '0%',
          },
          {
            show: false,
            right: '70px',
            top: '18%',
            bottom: '10',
            containLabel: true,
            width: '24%',
          },
        ],
        xAxis: [
          {
            name: '异常报警响应',
            nameTextStyle: {
              color: '#fff',
              padding: [0, 0, -10, 0],
              fontWeight: 'bold',
              fontSize: 15,
            },
            nameLocation: 'center',
            type: 'value',
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: 'top',
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {},
            },
          },
          {
            gridIndex: 1,
            show: false,
          },
          {
            name: '缺失报警响应',
            nameTextStyle: {
              color: '#fff',
              padding: [0, 0, -10, 0],
              fontWeight: 'bold',
              fontSize: 15,
            },
            nameLocation: 'center',
            gridIndex: 2,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: 'top',
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: 'category',
            inverse: true,
            position: 'right',
            axisLine: {
              show: false,
              lineStyle: {
                color: lineColor,
              },
            },

            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: xData,
          },
          {
            gridIndex: 1,
            type: 'category',
            inverse: true,
            position: 'left',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              padding: [0, 0, 0, 0],
              textStyle: {
                color: '#A4C7DB',
                fontSize: 15,
                fontWeight: 'bold',
              },
              align: 'center',
            },
            data: xData.map(function(value) {
              return {
                value: value,
                textStyle: {
                  align: 'center',
                },
              };
            }),
          },
          {
            gridIndex: 2,
            type: 'category',
            inverse: true,
            position: 'left',
            axisLine: {
              show: false,
              lineStyle: {
                color: lineColor,
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: xData,
          },
        ],
        series: [],
      },
      options: [],
    };

    option.options.push({
      series: [
        {
          name: '2017',
          type: 'bar',
          barWidth: 8,
          stack: '1',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: colors[0].start,
                },
                {
                  offset: 1,
                  color: colors[0].end,
                },
              ]),
            },
          },
          label: {
            normal: {
              show: false,
            },
          },
          data: exRates,
          animationEasing: 'elasticOut',
        },
        {
          name: '2017',
          type: 'bar',
          barWidth: 8,
          stack: '1',
          itemStyle: {
            normal: {
              color: '#fff',
            },
          },
          data: borderData,
        },
        {
          type: 'bar',
          barWidth: 8,
          itemStyle: {
            normal: {
              color: '#192A51',
            },
          },
          z: '-1',
          barGap: '-100%',
          label: {
            show: true,
            position: 'left',
            color: '#FDB31E',
            fontWeight: 'bold',
            fontSize: 16,
            formatter: params => {
              let dataIndex = params.dataIndex;
              return exRates[dataIndex] + '%';
            },
          },
          data: maxData,
        },
        {
          name: '2018',
          type: 'bar',
          stack: '2',
          barWidth: 8,
          xAxisIndex: 2,
          yAxisIndex: 2,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: colors[1].start,
                },
                {
                  offset: 1,
                  color: colors[1].end,
                },
              ]),
            },
          },
          label: {
            normal: {
              show: false,
            },
          },
          data: missRates,
          animationEasing: 'elasticOut',
        },
        {
          name: '2018',
          type: 'bar',
          xAxisIndex: 2,
          yAxisIndex: 2,
          barWidth: 10,
          stack: '2',
          itemStyle: {
            normal: {
              color: '#fff',
            },
          },
          data: borderData,
        },
        {
          type: 'bar',
          barWidth: 8,
          xAxisIndex: 2,
          yAxisIndex: 2,
          itemStyle: {
            normal: {
              color: '#192A51',
            },
          },
          z: '-1',
          barGap: '-100%',
          label: {
            show: true,
            position: 'right',
            color: '#77B2FF',
            fontWeight: 'bold',
            fontSize: 16,
            formatter: params => {
              let dataIndex = params.dataIndex;
              return missRates[dataIndex] + '%';
            },
          },
          data: maxData,
        },
      ],
    });

    return option;
  };

  return (
    <HomeCard title="响应异常分析" bodyStyle={{}} loading={loading}>
      <ReactEcharts
        ref={echart => {
          echart && setEcharts(echart.echarts);
        }}
        option={getOption(1)}
        lazyUpdate={true}
        style={{ height: '100%', width: '100%' }}
      />
      <Row
        style={{
          height: 'calc(100% - 80px)',
          position: 'absolute',
          width: '94%',
          top: 60,
          cursor: 'pointer',
        }}
      >
        <Col span={12} onClick={() => setOpen1(true)}></Col>
        <Col span={12} onClick={() => setOpen2(true)}></Col>
      </Row>
      {open1 && (
        <AbnormalAlarmRateModal //异常报警响应率弹框
          type={'1'}
          visible={open1}
          time={[moment(time[0]), moment(time[1])]}
          onCancel={() => {
            setOpen1(false);
          }}
        />
      )}
      {open2 && (
        <MissingDataRateModal //缺失报警响应率弹框
          type={'ent'}
          pollutantType={'2'}
          time={[moment(time[0]), moment(time[1])]}
          missingRateVisible={open2}
          missingRateCancel={() => {
            setOpen2(false);
          }}
        />
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ResponseAnalysis);
