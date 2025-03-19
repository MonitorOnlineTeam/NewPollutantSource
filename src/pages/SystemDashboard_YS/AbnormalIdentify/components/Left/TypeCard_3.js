import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard.js';
import ReactEcharts from 'echarts-for-react';
import PlanWorkOrderStatistics from '@/pages/newestHome/components/springModal/planWorkOrderStatistics/index.js';
import moment from 'moment';
import ToggleRadio from '@/pages/SystemDashboard/components/ToggleRadio.js';
import AbnormalDataAnalysis from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis';
import QuestionTooltip from '@/components/QuestionTooltip';
import DescriptionModal from '@/pages/SystemDashboard/components/DescriptionModal.js';
import { fontSizeFn } from '@/pages/SystemDashboard/CONST.js';

const COLOR = ['#0FD4F9', '#066EE9', '#73DAA6', '#E9E87A', '#A339E6'];

const dvaPropsData = ({ sysDashboard, loading, AbnormalIdentifyModel }) => ({
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  typeList: sysDashboard.modalTypeList,
  modelTypeList: AbnormalIdentifyModel.modelTypeList,
  loading: loading.effects['sysDashboard/GetMapPointInfo'],
});

const TypeCard = props => {
  const [open, setOpen] = useState(false);
  const [dataType, setDataType] = useState('Hours');
  const [echarts, setEcharts] = useState();
  const { dispatch, time, loading, typeList, modelTypeList, entCode, regionCode } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    if (!echarts) {
      return {};
    }

    let count = 0;
    let seriesData = typeList.map(item => {
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
              fontSize: fontSizeFn(24),
              fontWeight: 'bold',
              color: '#fff',
            },
            name: {
              fontSize: fontSizeFn(13),
              color: '#C3F0FF',
              padding: [fontSizeFn(10), 0, 0, 0],
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
          name: '异常分类统计',
          type: 'pie',
          // roseType: 'area',
          // radius: [50, 250],
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          label: { show: false },
          itemStyle: {
            borderRadius: fontSizeFn(10),
            // borderColor: '#2998FF',
            borderWidth: fontSizeFn(2),
            padding: fontSizeFn(4),
          },
          padAngle: 1,
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
    <HomeCard
      title={
        <>
          异常分类统计
          <DescriptionModal type="type"/>

          {/* <QuestionTooltip
            color="#073783"
            placement="right"
            overlayInnerStyle={{ width: 300 }}
            style={{ color: '#fff' }}
            content={
              <div style={{ fontWeight: 'bold', width: 300 }}>
                {modelTypeList.map((item, i) => {
                  return (
                    <div key={i} style={{ marginBottom: i + 1 === typeList.length ? 0 : 10 }}>
                      <p>{item.ModelTypeName}包括：</p>
                      <div style={{ marginLeft: 20 }}>
                        {item.ModelList.map((model, index) => {
                          return (
                            <p key={index}>
                              {index + 1}. {model.ModelName}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

               
              </div>
            }
          /> */}
        </>
      }
      bodyStyle={{ position: 'relative' }}
      loading={loading}
      onExtraClick={onOpenModal}
    >
      <ToggleRadio
        style={{ position: 'absolute', right: '1.25rem', top: '.625rem', zIndex: 1 }}
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
        <Col span={11} className={styles.center} onClick={onOpenModal}>
          <Row className={styles.chartLegendWrapper}>
            {typeList.map((item, index) => {
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
            time={time}
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
