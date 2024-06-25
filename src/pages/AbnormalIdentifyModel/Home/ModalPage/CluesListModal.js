import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Select, Input, Progress } from 'antd';
import SdlTable from '@/components/SdlTable';
import styles from '../../styles.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import { handleHomeDate } from '@/pages/AbnormalIdentifyModel/CONST';
import EntAtmoList from '@/components/EntAtmoList';
import { RollbackOutlined } from '@ant-design/icons';
import CluesList from '@/pages/AbnormalIdentifyModel/CluesList';

const dvaPropsData = ({ loading, AbnormalIdentifyModel, AbnormalIdentifyModelHome }) => ({
  // todoList: wordSupervision.todoList,
  loading: !!loading.effects['AbnormalIdentifyModelHome/GetClueDrillDownData'],
});

const ClueStatisticsModal = props => {
  const { dispatch, open, onCancel, warningForm } = props;

  useEffect(() => {}, []);

  return (
    <Modal
      title="异常线索清单"
      wrapClassName="fullScreenModal"
      open={open}
      destroyOnClose
      // open={false}
      footer={false}
      onCancel={() => {
        onCancel();
        // 重置表单
        dispatch({
          type: 'AbnormalIdentifyModel/onReset',
          payload: {
            modelNumber: 'all',
          },
        });
      }}
    >
      <CluesList
        // history={props.history}
        showMode={'modal'}
        tableProps={{
          scroll: { y: 'calc(100vh - 320px)' },
        }}
        match={{
          params: {
            modelNumber: 'all',
          },
        }}
      />
    </Modal>
  );
};

export default connect(dvaPropsData)(ClueStatisticsModal);
