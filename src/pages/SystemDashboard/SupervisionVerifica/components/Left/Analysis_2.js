import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import PlanWorkOrderStatistics from '@/pages/newestHome/components/springModal/planWorkOrderStatistics/index.js';
const COLOR = ['#2899F6', '#FF4F4F', '#E3AB15'];

const dvaPropsData = ({ sysDashboard, loading }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  InspectionAndCalibration: sysDashboard.InspectionAndCalibration,
  loading: loading.effects[`sysDashboard/GetPlanOperationTaskCompleteRate`],
});

const ProjectExecution = props => {
  const [open, setOpen] = useState(false);

  const { dispatch, time, loading, level, regionCode, entCode, InspectionAndCalibration } = props;
  const [date, setDate] = useState();

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetPlanOperationTaskCompleteRate',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {},
    });
  };

  const getOption = () => {
    let rate = InspectionAndCalibration.inspectionRate;
    let seriesData = [
      {
        value: InspectionAndCalibration.inspectionCompleteCount,
        name: '原则性问题',
      },
      {
        value: InspectionAndCalibration.inspectionIncompleteCount,
        name: '重点问题',
      },
      {
        value: InspectionAndCalibration.inspectionCompleteCount,
        name: '一般问题',
      },
    ];

    let option = {
      color: [COLOR[0],COLOR[1], COLOR[2]],
      title: {
        text: '{val|' + rate + '}\n{name|核查结果}',
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            name: {
              fontSize: 14,
              color: '#C3F0FF',
              padding: [4, 0],
            },
            val: {
              fontSize: 24,
              color: '#0693EF',
            },
          },
        },
      },
      tooltip: {
        // valueFormatter: function(value) {
        //   return value + '个';
        // },
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      series: [
        {
          name: '合规性监督核查分析',
          type: 'pie',
          radius: ['54%', '66%'],
          center: ['50%', '50%'],
          label: { show: false },
          itemStyle: {
            padding: 4,
          },
          padAngle: 4,
          data: seriesData,
        },
      ],
    };

    return option;
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  const textSty = {color:'#FEFEFF',fontWeight:400}
  return (
    <HomeCard title="合规性监督核查分析" bodyStyle={{}} loading={loading} style={{minHeight:props.homeCardMinHight}}>
      <Row style={{ height: '100%' }}>
        <Col span={13}>
          <ReactEcharts
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
                <i style={{ backgroundColor: COLOR[0],borderRadius:0  }}></i>
                <span className="textOverflow" style={{...textSty}}>原则性问题</span>
              </div>
              <div className={styles.value}  style={{...textSty}}>{InspectionAndCalibration.inspectionCloseCount}%</div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: COLOR[1],borderRadius:0 }}></i>
                <span className="textOverflow" style={{...textSty}}>重点问题</span>
              </div>
              <div className={styles.value}  style={{...textSty}}>{InspectionAndCalibration.inspectionCompleteCount}%</div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: COLOR[2],borderRadius:0  }}></i>
                <span className="textOverflow" style={{...textSty}}>一般问题</span>
              </div>
              <div className={styles.value}  style={{...textSty}}>
                {InspectionAndCalibration.inspectionIncompleteCount}%
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      {open && (
        <PlanWorkOrderStatistics //计划巡检完成率弹框
          // wrapClassName="fullScreenModal"
          modalType="planInspection"
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

export default connect(dvaPropsData)(ProjectExecution);
