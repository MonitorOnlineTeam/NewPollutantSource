/*
 * @Author: JiaQi
 * @Date: 2023-07-14 10:37:27
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-09-15 16:03:37
 * @Description: 报警数据 - 弹窗
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Tabs, Form, Space, Button, Select, Radio, message, Spin, Alert } from 'antd';
import styles from '../styles.less';
import _ from 'lodash';
import PollutantImages from '@/pages/DataAnalyticalWarningModel/Warning/components/PollutantImages';
import Histogram from '@/pages/DataAnalyticalWarningModel/Warning/components/Histogram';
import CorrelationCoefficient from '@/pages/DataAnalyticalWarningModel/Warning/components/CorrelationCoefficient';
import WarningDataAndChart from './components/WarningDataAndChart';

const dvaPropsData = ({ loading, dataModel, common }) => ({});

const WarningData = props => {
  const [form] = Form.useForm();
  const {
    dispatch,
    onCancel,
    visible,
    // DGIMN,
    date,
    PointName,
    wrapClassName,
    describe,
    CompareDGIMN,
    ComparePointName,
    warningDate,
    defaultChartSelected,
  } = props;

  const [DGIMN, setDGIMN] = useState(props.DGIMN);
  // const [images, setImages] = useState([]);

  // useEffect(() => {
  //   getImages();
  // }, [DGIMN]);

  // // 获取波动范围图表
  // const getImages = () => {
  //   if (DGIMN) {
  //     dispatch({
  //       type: 'dataModel/GetPointParamsRange',
  //       payload: {
  //         DGIMN,
  //       },
  //       callback: res => {
  //         setImages(res.image);
  //       },
  //     });
  //   }
  // };

  // console.log('legendSelected', legendSelected);
  // console.log('selectedNames', selectedNames);
  // console.log('units', units);
  // console.log('option', option);

  const getTitle = () => {
    if (CompareDGIMN) {
      return (
        <>
          报警关联数据
          <Select
            style={{ width: 420, marginLeft: 20 }}
            value={DGIMN}
            onChange={value => {
              console.log('value', value);
              setDGIMN(value);
            }}
          >
            <Option value={props.DGIMN} key={1}>
              {PointName}
            </Option>
            <Option value={props.CompareDGIMN} key={1}>
              {ComparePointName}
            </Option>
          </Select>
        </>
      );
    } else {
      return `报警关联数据（${PointName}）`;
    }
  };

  // DGIMN,
  // date,
  // describe,
  // warningDate,
  // defaultChartSelected,

  return (
    <Modal
      title={getTitle()}
      destroyOnClose
      visible={visible}
      wrapClassName={wrapClassName}
      footer={false}
      onCancel={() => onCancel()}
      bodyStyle={{ paddingTop: 6 }}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="数据列表" key="1">
          <WarningDataAndChart
            DGIMN={DGIMN}
            date={date}
            describe={describe}
            warningDate={warningDate}
            defaultChartSelected={defaultChartSelected}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="波动范围" key="2" style={{ overflowY: 'auto' }}>
          <PollutantImages DGIMN={DGIMN} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="密度分布直方图" key="3" style={{ overflowY: 'auto' }}>
          <Histogram DGIMN={DGIMN} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="相关系数表" key="4" style={{ overflowY: 'auto' }}>
          <CorrelationCoefficient DGIMN={DGIMN} />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(dvaPropsData)(WarningData);
