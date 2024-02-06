/*
 * @Author: JiaQi
 * @Date: 2023-07-14 10:37:27
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-02-02 10:38:28
 * @Description: 报警数据 - 弹窗
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Tabs, Form, Space, Button, Select, Radio, message, Spin, Alert } from 'antd';
import styles from '../styles.less';
import _ from 'lodash';
import AssistDataAnalysis from '@/pages/AbnormalIdentifyModel/AssistDataAnalysis/index.js';

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
    // CompareDGIMN,
    // ComparePointName,
    warningDate,
    defaultChartSelected,
  } = props;

  const [DGIMN, setDGIMN] = useState(props.DGIMN);

  const getTitle = () => {
    if (CompareDGIMN) {
      return (
        <>
          线索数据
          <Select
            style={{ width: 420, marginLeft: 20 }}
            value={DGIMN}
            onChange={value => {
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
      return `线索数据（${PointName}）`;
    }
  };

  return (
    <Modal
      title={`线索数据（${PointName}）`}
      destroyOnClose
      visible={visible}
      wrapClassName={wrapClassName}
      footer={false}
      onCancel={() => onCancel()}
      bodyStyle={{ paddingTop: 6 }}
    >
      <AssistDataAnalysis
        displayType={'modal'}
        DGIMN={DGIMN}
        dataChartParams={{
          describe,
          warningDate,
          date,
          defaultChartSelected,
        }}
      />
    </Modal>
  );
};

export default connect(dvaPropsData)(WarningData);
