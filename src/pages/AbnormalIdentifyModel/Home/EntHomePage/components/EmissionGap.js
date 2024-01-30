import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';
import styles from '../../styles.less';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
  EmissionStatisticsData: AbnormalIdentifyModelHome.EmissionStatisticsData,
  loading: loading.effects['AbnormalIdentifyModelHome/GetPollutantDischargeGapStatistics'],
});

const EmissionGap = props => {
  const {
    dispatch,
    entRequestParams,
    EmissionStatisticsData,
    loading,
    entRequestParams: { pollutantCode },
  } = props;
  const [gapData, setGapData] = useState({});
  useEffect(() => {
    GetPollutantDischargeGapStatistics();
  }, [entRequestParams]);

  // 获取排污缺口
  const GetPollutantDischargeGapStatistics = () => {
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetPollutantDischargeGapStatistics',
      payload: {},
      callback: res => {
        setGapData(res);
      },
    });
  };

  const getOption = type => {
    let name = type === '01' ? '烟尘' : type === '02' ? '二氧化硫' : '氮氧化物';
    let currentData = gapData[type];

    if (!currentData) {
      return {};
    }

    let rate = Math.abs(currentData[type + '_r']) > 100 ? 100 : Math.abs(currentData[type + '_r']);
    let chaoRate =
      Math.abs(currentData[type + '_dr']) > 100 ? 100 : Math.abs(currentData[type + '_dr']);
    let data = [];
    if (currentData[type + '_d'] >= 0) {
      // if (false) {
      // 没超
      data = [
        {
          type: 'bar',
          data: [rate],
          showBackground: true,
          roundCap: true,
          backgroundStyle: {
            color: '#003577',
          },
          coordinateSystem: 'polar',
          barWidth: 16,
          itemStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#79DF70',
                  },
                  {
                    offset: 1,
                    color: '#00A9FF',
                  },
                ],
                global: false,
              },
            },
          },
        },
        {
          type: 'bar',
          data: [100],
          showBackground: true,
          roundCap: true,
          backgroundStyle: {
            color: '#003577',
          },
          coordinateSystem: 'polar',
          barWidth: 2,
          itemStyle: {
            normal: {
              color: '#003577',
              borderColor: '#003577',
              // borderWidth: 4,
            },
          },
        },
      ];
    } else {
      data = [
        {
          type: 'bar',
          data: [rate],
          showBackground: true,
          roundCap: true,
          backgroundStyle: {
            color: '#003577',
          },
          coordinateSystem: 'polar',
          barWidth: 16,
          itemStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#79DF70',
                  },
                  {
                    offset: 1,
                    color: '#00A9FF',
                  },
                ],
                global: false,
              },
            },
          },
        },
        {
          type: 'bar',
          data: [chaoRate],
          showBackground: true,
          roundCap: true,
          backgroundStyle: {
            color: '#003577',
          },
          coordinateSystem: 'polar',
          barWidth: 2,
          itemStyle: {
            normal: {
              color: '#FF942B',
              borderColor: '#FF942B',
              borderWidth: 4,
            },
          },
        },
      ];
    }

    const value = currentData[type];
    // const rate = value + '%';
    let option = {
      backgroundColor: '#081834',
      title: {
        text: rate + '%',
        left: 'center',
        top: '42%',
        itemGap: 10,
        textStyle: {
          color: '#fff',
          fontSize: '26',
          fontWeight: 600,
        },
        subtext: `已排放:${value}kg`,
        subtextStyle: {
          color: '#EDEDED',
          fontSize: '13',
          fontWeight: 600,
        },
      },
      // grid: {
      //   // left: '-10%',
      //   // right: '4%',
      //   // top: '-20%',
      //   // bottom: '100%',
      //   bottom: '15%',
      //   top: '40%',
      //   // containLabel: true,
      // },
      angleAxis: {
        max: 100,
        // 隐藏刻度线
        show: false,
        startAngle: 90,
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
      polar: {
        radius: '100%', //图形大小
      },
      series: data,
    };

    return option;
  };

  const _pollutantCode = pollutantCode.length ? pollutantCode : ['01', '02', '03'];

  const renderInfoContent = code => {
    let currentData = gapData[code];
    if (!currentData) {
      return '';
    }
    let value = currentData[code];
    let rate = Math.abs(currentData[code + '_r']) > 100 ? 100 : Math.abs(currentData[code + '_r']);

    let gapValue = currentData[code + '_d'];
    let gapRate =
      Math.abs(currentData[code + '_dr']) > 100 ? 100 : Math.abs(currentData[code + '_dr']);

    return (
      <div className={styles.infoContent}>
        <p>
          SO2排放量：{value}kg ({rate}%)
        </p>
        {gapValue < 0 ? (
          // 超
          <p style={{ color: '#FF942B' }}>
            排污缺口超：{Math.abs(gapValue)}kg ({gapRate}%)
          </p>
        ) : (
          <p>
            排污缺口：{Math.abs(gapValue)}kg ({gapRate}%)
          </p>
        )}
      </div>
    );
  };

  return (
    <HomeCard
      title="排污缺口统计"
      loading={loading}
      bodyStyle={{
        height: 'calc(100% - 110px)',
      }}
    >
      <Row
        style={{
          height: '100%',
        }}
      >
        {_pollutantCode.map(item => {
          return (
            <Col span={24 / _pollutantCode.length}>
              <div className={styles.gapWrapper}>
                <p
                  style={{
                    textAlign: 'center',
                    position: 'absolute',
                    top: 20,
                    fontSize: 20,
                    width: '100%',
                    color: '#fff',
                    zIndex: 1,
                    fontWeight: 'bold',
                  }}
                >
                  {item === '01' ? '烟尘' : item === '02' ? 'SO2' : 'NOx'}
                </p>
                {gapData[item] ? (
                  <ReactEcharts
                    option={getOption(item)}
                    style={{ height: '100%', width: '100%', marginTop: -10 }}
                    theme="my_theme"
                  />
                ) : (
                  <div className="notData">
                    <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
                    <p style={{ color: '#d5d9e2', fontSize: 16, fontWeight: 500 }}>暂无数据</p>
                  </div>
                )}

                {renderInfoContent(item)}
                {/* <div className={styles.infoContent}>
                  <p>SO2排放量：324121kg (75%)</p>
                  <p>排污缺口：31341kg (25%)</p>
                </div> */}
              </div>
            </Col>
          );
        })}
      </Row>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(EmissionGap);
