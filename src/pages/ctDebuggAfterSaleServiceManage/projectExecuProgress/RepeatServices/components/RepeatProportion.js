/*
 * @Author: JiaQi
 * @Date: 2024-03-25 15:30:11
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-26 14:30:34
 * @Description:  大区重复服务次数占比
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
  '#0487ED',
  '#0666E8',
  '#3EB076',
  '#FFFE95',
  '#FF9000',
  '#FF87A7',
  '#B447EB',
  '#2043B9',
  '#EBEBEB',
];

const dvaPropsData = ({ loading, repeatServices }) => ({
  repeatServicesData: repeatServices.repeatServicesData,
  loading: loading.effects[`repeatServices/GetRepeatServiceAnalysis`],
});

const RepeatProportion = props => {
  const [echarts, setEcharts] = useState();

  const {
    date,
    loading,
    repeatServicesData: { LargeRegionAnalysis },
  } = props;

  useEffect(() => {}, []);

  const getOption = () => {
    let count = 0;
    let seriesData = LargeRegionAnalysis.map(item => {
      count += item.Times;
      return { value: item.Rate.replace(/%/g, '') * 1, name: item.LargeRegionName };
    });
    console.log('seriesData', seriesData);
    let option = {
      color: COLOR,
      title: {
        text: '{name|重复服务次数}\n{val|' + count + '}',
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
      angleAxis: {
        max: 100,
        show: false,
      },
      series: [
        {
          name: '重复服务次数占比',
          type: 'pie',
          // radius: [50, 250],
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          roseType: 'area',
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
          <Row className={styles.legendWrapper}>
            {LargeRegionAnalysis.map((item, index) => {
              return (
                <Col span={12} className={styles.lengendItem}>
                  <div className={styles.label}>
                    <i style={{ backgroundColor: COLOR[index] }}></i>
                    <span className="textOverflow">{item.LargeRegionName}</span>
                  </div>
                  <div className={styles.value}>{item.Rate}</div>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    );
  }, [LargeRegionAnalysis, echarts]);

  return (
    <Card title="大区重复服务次数占比" size="small" bodyStyle={{ height: 300 }} loading={loading}>
      {renderEcharts}
    </Card>
  );
};

export default connect(dvaPropsData)(RepeatProportion);
