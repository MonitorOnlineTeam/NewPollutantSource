/*
 * @Author: JiaQi
 * @Date: 2023-07-14 10:37:27
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-04-17 16:07:58
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
    warningInfo,
    date,
    PointName,
    wrapClassName,
    describe,
    CompareDGIMN,
    ComparePointName,
    warningDate,
    defaultChartSelected,
    warningId,
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
      // title={`线索数据（${PointName}）`}
      title={getTitle()}
      destroyOnClose
      visible={visible}
      wrapClassName={wrapClassName}
      footer={false}
      onCancel={() => onCancel()}
      bodyStyle={{ padding: 0 }}
    >
      <AssistDataAnalysis
        pointName={PointName}
        displayType={'modal'}
        warningId={warningId}
        DGIMN={DGIMN}
        pointInfo={{
          EntCode: warningInfo.EntCode,
          EntName: PointName?.split(' - ')[0],
          PointName: PointName?.split(' - ')[1],
          OpeUserId: warningInfo.OpeUserId
        }}
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
