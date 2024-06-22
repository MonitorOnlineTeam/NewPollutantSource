import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '../../styles.less';
import HomeCard from '../HomeCard';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import PlanWorkOrderStatistics from '@/pages/newestHome/components/springModal/planWorkOrderStatistics/index.js';
const COLOR = ['#2998FF', '#21ECBB', '#DFE06D'];

const dvaPropsData = ({ OperationSysDashboard, loading }) => ({
  level: OperationSysDashboard.level,
  regionCode: OperationSysDashboard.regionCode,
  entCode: OperationSysDashboard.entCode,
  time: OperationSysDashboard.time,
  InspectionAndCalibration: OperationSysDashboard.InspectionAndCalibration,
  loading: loading.effects[`OperationSysDashboard/GetPlanOperationTaskCompleteRate`],
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
      type: 'OperationSysDashboard/GetPlanOperationTaskCompleteRate',
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
        name: '实际完成数量',
      },
      {
        value: InspectionAndCalibration.inspectionIncompleteCount,
        name: '待完成数量',
      },
    ];

    let option = {
      color: [COLOR[1], COLOR[2]],
      title: {
        text: '{val|' + rate + '%}\n{name|巡检完成率}',
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
        //   return value + '个';
        // },
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      series: [
        {
          name: '巡检质量分析',
          type: 'pie',
          // radius: [50, 250],
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          // roseType: 'area',
          label: { show: false },
          itemStyle: {
            borderRadius: 6,
            borderColor: '#2998FF',
            borderWidth: 2,
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

  return (
    <HomeCard title="巡检质量分析" bodyStyle={{}} loading={loading}>
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
                <i style={{ backgroundColor: COLOR[0] }}></i>
                <span className="textOverflow">应完成数量</span>
              </div>
              <div className={styles.value}>{InspectionAndCalibration.inspectionCloseCount}</div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: COLOR[1] }}></i>
                <span className="textOverflow">实际完成数量</span>
              </div>
              <div className={styles.value}>{InspectionAndCalibration.inspectionCompleteCount}</div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: COLOR[2] }}></i>
                <span className="textOverflow">待完成数量</span>
              </div>
              <div className={styles.value}>
                {InspectionAndCalibration.inspectionIncompleteCount}
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
