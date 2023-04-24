import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';

const CONFIGID = 'T_Bas_InsUseTheRecord';
const dvaPropsData = ({ loading, autoform }) => ({});

const PortableRecordModal = props => {
  const { visible, onCancel, insCode } = props;

  useEffect(() => {}, []);

  return (
    <Modal
      title="便携使用记录"
      width={'70vw'}
      visible={visible}
      footer={false}
      onCancel={onCancel}
      destroyOnClose
    >
      <AutoFormTable
        noload
        getPageConfig
        handleMode="modal"
        configId={CONFIGID}
        isFixedOpera
        isCenter
        hideBtns
        searchParams={[
          {
            Key: 'dbo__T_Bas_StandUseTheRecord__InsCode',
            Value: insCode,
            Where: '$=',
          },
        ]}
        pagination={false}
      />
    </Modal>
  );
};

export default connect(dvaPropsData)(PortableRecordModal);
