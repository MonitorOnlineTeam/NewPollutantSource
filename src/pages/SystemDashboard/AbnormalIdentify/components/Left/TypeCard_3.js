import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '../HomeCard';
import ReactEcharts from 'echarts-for-react';
import PlanWorkOrderStatistics from '@/pages/newestHome/components/springModal/planWorkOrderStatistics/index.js';
import moment from 'moment';
import ToggleRadio from '@/pages/SystemDashboard/components/ToggleRadio.js';
import AbnormalDataAnalysis from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis';
const COLOR = ['#0FD4F9', '#066EE9', '#73DAA6', '#E9E87A', '#A339E6'];

const dvaPropsData = ({ sysDashboard, loading }) => ({
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  typelList: sysDashboard.modalTypeList,
  loading: loading.effects['sysDashboard/GetMapPointInfo'],
});

const TypeCard = props => {
  const [open, setOpen] = useState(false);
  const [dataType, setDataType] = useState('Hours');
  const [echarts, setEcharts] = useState();
  const { time, loading, typelList, entCode, regionCode } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    if (!echarts) {
      return {};
    }

    let count = 0;
    let seriesData = typelList.map(item => {
      count += item[dataType];
      return {
        value: item[dataType],
        name: item.key,
      };
    });

    let text = dataType === 'Hours' ? '总时长' : '线索数量';

    let option = {
      // color: COLOR,
      title: {
        text: '{val|' + count + '}\n{name|' + text + '}',
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            val: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#fff',
            },
            name: {
              fontSize: 13,
              color: '#C3F0FF',
              padding: [10, 0, 0, 0],
              fontWeight: 'bold',
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
          roseType: 'area',
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
          data: seriesData,
        },
      ],
    };

    return option;
  };

  const onOpenModal = () => {
    debugger;
    setOpen(true);
  };

  return (
    <HomeCard title="异常分类统计" bodyStyle={{ position: 'relative' }} loading={loading}>
      <ToggleRadio
        style={{ position: 'absolute', right: 20, top: 10, zIndex: 1 }}
        onChange={e => {
          setDataType(e.target.value);
        }}
      />
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
            {typelList.map((item, index) => {
              return (
                <Col span={24} className={styles.lengendItem}>
                  <div className={styles.label}>
                    <i
                      style={{
                        backgroundColor: COLOR[index],
                        width: 10,
                        height: 10,
                        borderRadius: 0,
                      }}
                    ></i>
                    <span className="textOverflow">{item.key}</span>
                  </div>
                  <div className={styles.value}>{item[dataType]}</div>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
      {open && (
        <Modal
          title={'异常分类统计'}
          wrapClassName="fullScreenModal"
          destroyOnClose
          visible={open}
          footer={false}
          onCancel={() => setOpen(false)}
          bodyStyle={{ padding: 0 }}
        >
          <AbnormalDataAnalysis
            location={{
              pathname: '/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis/type',
            }}
            regionCode={regionCode}
            entCode={entCode}
            rtnType={dataType === 'Hours' ? 'hours' : 'nums'}
          />
        </Modal>
      )}
    </HomeCard>
  );
};

export default connect(dvaPropsData)(TypeCard);
