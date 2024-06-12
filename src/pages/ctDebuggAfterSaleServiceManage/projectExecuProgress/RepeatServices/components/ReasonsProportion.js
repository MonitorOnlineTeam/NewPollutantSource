/*
 * @Author: JiaQi
 * @Date: 2024-03-25 15:30:11
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-26 14:29:47
 * @Description:  重复服务原因次数占比
 */
import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Row,
  Col,
  message,
  Divider,
} from 'antd';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import styles from '../index.less';

const COLOR = [
  '#4964F0',
  '#2043B9',
  '#B08FFF',
  '#D144DE',
  '#e95781',
  '#ff87a7',
  '#f98102',
  '#f7cd03',
  '#f7ee04',
  '#84dc03',
  '#1bff8f',
  '#00d3db',
  '#3aa1c9',
  '#488CF7',
  '#e3e3e3',
];

const dvaPropsData = ({ loading, repeatServices }) => ({
  repeatServicesData: repeatServices.repeatServicesData,
  loading: loading.effects[`repeatServices/GetRepeatServiceAnalysis`],
});

const ReasonsProportion = props => {
  const [echarts, setEcharts] = useState();

  const {
    date,
    loading,
    repeatServicesData: { TimeoutReasonAnalysis },
  } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    let count = 0;
    let seriesData = TimeoutReasonAnalysis.map(item => {
      count += item.Times;
      return { value: item.Rate.replace(/%/g, '') * 1, name: item.ReasonName };
    });
    console.log('seriesData', seriesData);
    let option = {
      color: COLOR,
      title: {
        text: '{name|重复原因次数}\n{val|' + count + '}',
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            name: {
              fontSize: 14,
              color: '#0693EF',
              padding: [10, 0],
            },
            val: {
              fontSize: 24,
              fontWeight: 'bolder',
              color: '#0693EF',
            },
          },
        },
      },
      tooltip: {
        valueFormatter: function(value) {
          return value + '%';
        },
      },
      series: [
        {
          name: '重复原因次数占比',
          type: 'pie',
          // radius: [50, 250],
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          // roseType: 'area',
          label: { show: false },
          data: seriesData,
        },
      ],
    };

    return option;
  };

  const renderEcharts = useMemo(() => {
    return (
      <Row style={{ height: '100%' }}>
        <Col span={9}>
          <ReactEcharts
            ref={echart => {
              echart && setEcharts(echart.echartsLib);
            }}
            option={getOption()}
            style={{ height: '100%' }}
            className="echarts-for-echarts"
            theme="my_theme"
          />
        </Col>
        <Col span={15}>
          <Row className={styles.legendWrapper} style={{ padding: '10px 0' }}>
            {TimeoutReasonAnalysis.map((item, index) => {
              return (
                <Col span={12} className={styles.lengendItem}>
                  <div className={styles.label}>
                    <i style={{ backgroundColor: COLOR[index], borderRadius: 0 }}></i>
                    <span className="textOverflow">{item.ReasonName}</span>
                  </div>
                  <div className={styles.value}>{item.Rate}</div>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    );
  }, [TimeoutReasonAnalysis, echarts]);

  return (
    <Card title="重复服务原因次数占比" size="small" bodyStyle={{ height: 300 }} loading={loading}>
      {renderEcharts}
    </Card>
  );
};

export default connect(dvaPropsData)(ReasonsProportion);
