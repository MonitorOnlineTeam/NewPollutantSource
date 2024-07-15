import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import SupervisionAnalySumm from '@/pages/operations/supervisionAnalySumm';
import { fomatFloat } from '@/utils/utils';

const COLOR = ['#2899F6', '#FF4F4F', '#E3AB15'];

const dvaPropsData = ({ sysDashboard, loading }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  supervisionUniformityAnalysisData: sysDashboard.supervisionUniformityAnalysisData,
  loading: loading.effects[`sysDashboard/GetSupervisionUniformityAnalysis`],
});

const ProjectExecution = props => {
  const [open, setOpen] = useState(false);
  const [echarts, setEcharts] = useState();

  const { dispatch, time, loading, level, regionCode, entCode, supervisionUniformityAnalysisData: { InspectorOperationManage } } = props;

  const sum = Number(InspectorOperationManage.PrincipleProblemNum) + Number(InspectorOperationManage.importanProblemNum) + Number(InspectorOperationManage.CommonlyProblemNum)

  useEffect(() => {
  }, []);



  const getOption = () => {
    if (!echarts) {
      return {};
    }
    let seriesData = [
      {
        value: InspectorOperationManage.PrincipleProblemNum,
        name: '原则性问题',
      },
      {
        value: InspectorOperationManage.importanProblemNum,
        name: '重点问题',
      },
      {
        value: InspectorOperationManage.CommonlyProblemNum,
        name: '一般问题',
      },
    ];

    let option = {
      color: [COLOR[0], COLOR[1], COLOR[2]],
      title: {
        text: '{val|' + sum + '}\n{name|核查结果}',
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
          minAngle: 2,
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
  const renderEcharts = useMemo(() => {
    return (
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
    );
  }, [InspectorOperationManage]);
  const textSty = { color: '#FEFEFF', fontWeight: 400 }
  return (
    <HomeCard title="合规性监督核查分析" bodyStyle={{}} loading={loading} style={{ minHeight: props.homeCardMinHight }}>
      <Row style={{ height: '100%' }}>
        <Col span={13}>
          {renderEcharts}
        </Col>
        <Col span={11} className={styles.center}>
          <Row className={styles.chartLegendWrapper}>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: COLOR[0], borderRadius: 0 }}></i>
                <span className="textOverflow" style={{ ...textSty }}>原则性问题</span>
              </div>
              <div className={styles.value} style={{ ...textSty, textAlign: 'right' }}>{fomatFloat(InspectorOperationManage.PrincipleProblemNum / sum * 100, 2)}%</div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: COLOR[1], borderRadius: 0 }}></i>
                <span className="textOverflow" style={{ ...textSty }}>重点问题</span>
              </div>
              <div className={styles.value} style={{ ...textSty, textAlign: 'right' }}>{fomatFloat(InspectorOperationManage.importanProblemNum / sum * 100, 2)}%</div>
            </Col>
            <Col span={24} className={styles.lengendItem}>
              <div className={styles.label}>
                <i style={{ backgroundColor: COLOR[2], borderRadius: 0 }}></i>
                <span className="textOverflow" style={{ ...textSty }}>一般问题</span>
              </div>
              <div className={styles.value} style={{ ...textSty, textAlign: 'right' }}>
                {fomatFloat(InspectorOperationManage.CommonlyProblemNum / sum * 100, 2)}%
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title='全系统督查汇总'
        destroyOnClose
        wrapClassName={'fullScreenModal'}
        bodyStyle={{ padding: 0 }}
        visible={open}
        mask={false}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <SupervisionAnalySumm
          tabType={3}
          time={time}
        />
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(ProjectExecution);
