import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Select, Input, Progress } from 'antd';
import DataQuery from '@/pages/monitoring/dataquery/components/DataQuery';

const dvaPropsData = ({ loading }) => ({
  // todoList: wordSupervision.todoList,
  // loading: !!loading.effects['AbnormalIdentifyModelHome/GetClueDrillDownData'],
});

const DataQueryModal = props => {
  const {
    dispatch,
    open,
    onCancel,
    DGIMN,
    pointName,
    entName,
    title,
    date,
    dataStatus,
    pollutantCode,
  } = props;

  useEffect(() => {}, []);
  return (
    <Modal
      title={title}
      wrapClassName="fullScreenModal"
      open={open}
      destroyOnClose
      // open={false}
      footer={false}
      onCancel={() => {
        onCancel();
      }}
    >
      <DataQuery
        DGIMN={DGIMN}
        initLoadData
        // chartHeight="calc(100vh - 590px)"
        // style={{ height: modalHeight, overflow: 'auto', height: 'calc(100vh - 350px)' }}
        tableHeight={'calc(100vh - 238px)'}
        pointName={pointName}
        pollutantCode={pollutantCode}
        entName={entName}
        date={date}
        dataType="hour"
        isVerification={false}
        dataStatus={dataStatus}
        hideTitle
      />
    </Modal>
  );
};

export default connect(dvaPropsData)(DataQueryModal);
