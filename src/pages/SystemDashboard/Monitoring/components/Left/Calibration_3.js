import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import PlanWorkOrderStatistics from '@/pages/newestHome/components/springModal/planWorkOrderStatistics/index.js';
import moment from 'moment';

const COLOR = ['#2998FF', '#21ECBB', '#DFE06D'];

const dvaPropsData = ({ sysDashboard, loading }) => ({
  time: sysDashboard.time,
  InspectionAndCalibration: sysDashboard.InspectionAndCalibration,
  loading: loading.effects[`sysDashboard/GetPlanOperationTaskCompleteRate`],
});

const Calibration = props => {
  const [open, setOpen] = useState(false);
  const [echarts, setEcharts] = useState();
  const { time, loading, InspectionAndCalibration } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    if (!echarts) {
      return {};
    }
    let rate = InspectionAndCalibration.calibrationRate;
    let option = {
      // color: COLOR,
      title: {
        text: '{val|' + rate + '%}\n{name|校准完成率}',
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            name: {
              fontSize: 14,
              color: '#C3F0FF',
              padding: [10, 0],
              fontWeight: 'bold',
            },
            val: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#0693EF',
            },
          },
        },
      },
      tooltip: {
        // valueFormatter: function(value) {
        //   return value + '%';
        // },
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      series: [
        {
          name: '校准质量分析',
          type: 'pie',
          // radius: [50, 250],
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          // roseType: 'area',
          label: { show: false },

          // itemStyle: {
          //   borderRadius: 6,
          //   borderColor: '#2998FF',
          //   borderWidth: 2,
          //   padding: 4,
          // },
          // padAngle: 4,
          data: [
            // {
            //   value: 20.95,
            //   name: '应完成数量',
            //   itemStyle: {
            //     normal: {
            //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //         {
            //           offset: 0,
            //           color: '#1EDF96',
            //         },
            //         {
            //           offset: 1,
            //           color: '#0D7759',
            //         },
            //       ]),
            //       opacity: 1,
            //     },
            //   },
            // },
            {
              value: InspectionAndCalibration.calibrationCompleteCount,
              name: '实际完成数量',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#1EDF96',
                    },
                    {
                      offset: 1,
                      color: '#0D7759',
                    },
                  ]),
                  opacity: 1,
                },
              },
            },
            {
              value: InspectionAndCalibration.calibrationIncompleteCount,
              name: '待完成数量',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#FFBA36',
                    },
                    {
                      offset: 1,
                      color: '#AA7829',
                    },
                  ]),
                  opacity: 1,
                },
              },
            },
          ],
        },
      ],
    };

    return option;
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard title="校准质量分析" bodyStyle={{}} loading={loading}>
      <Row style={{ height: '100%' }}>
        <Col span={13}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts(echart.echarts);
            }}
            option={getOption()}
            style={{ height: '100%' }}
            className="echarts-for-echarts"
            theme="my_theme"
            onEvents={{ click: onOpenModal }}
          />
        </Col>
        <Col span={11} className={styles.center}>
          <Row className={styles.chartLegendWrapper}>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: COLOR[0] }}></i>
                <span className="textOverflow">应完成数量</span>
              </div>
              <div className={styles.value}>{InspectionAndCalibration.calibrationCloseCount}</div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: COLOR[1] }}></i>
                <span className="textOverflow">实际完成数量</span>
              </div>
              <div className={styles.value}>
                {InspectionAndCalibration.calibrationCompleteCount}
              </div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: COLOR[2] }}></i>
                <span className="textOverflow">待完成数量</span>
              </div>
              <div className={styles.value}>
                {InspectionAndCalibration.calibrationIncompleteCount}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      {open && (
        <PlanWorkOrderStatistics //实际校准完成率弹框
          modalType="planCalibration"
          visible={open}
          type={2}
          onCancel={() => {
            setOpen(false);
          }}
          time={[moment(time[0]), moment(time[1])]}
        />
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(Calibration);
