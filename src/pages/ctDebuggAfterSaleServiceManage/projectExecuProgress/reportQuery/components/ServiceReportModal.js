import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Divider, Modal, Descriptions } from 'antd';
import ServiceReport from '@/pages/ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchQuery/detail.js';
import HandlingSugges from '@/pages/ctDebuggAfterSaleServiceManage/supervisionInspection/installEquipment/components/HandlingSugges.js';

const dvaPropsData = ({ loading }) => ({});

const AuditModalPage = props => {
  const {
    dispatch,
    data: { ID, ProjectCode, ItemCode, CheckStatuTip, AuditStatuTip },
    isModalOpen,
    onCancel,
  } = props;

  useEffect(() => {
    ID && getProcessingOpinions();
  }, [ID]);

  // 获取处理意见
  const getProcessingOpinions = () => {
    dispatch({
      type: `installEquipment/GetAuditPhoto`,
      payload: {
        equipmentAuditId: ID,
      },
    });
  };

  return (
    <Modal
      title={`${ProjectCode || ItemCode}-验收服务报告`}
      wrapClassName="spreadOverModal"
      open={isModalOpen}
      destroyOnClose
      footer={false}
      mask={false}
      onCancel={() => {
        onCancel();
      }}
    >
      {ID && (
        <>
          <Descriptions>
            <Descriptions.Item label="审核状态">{CheckStatuTip}</Descriptions.Item>
            <Descriptions.Item label="合格状态">{AuditStatuTip}</Descriptions.Item>
          </Descriptions>
          <ServiceReport id={ID} shouldOnlyRecordId="9" />
          <Divider />
          <HandlingSugges
            parData={{
              Type: 1,
              EquipmentAuditId: ID,
            }}
          />
        </>
      )}
    </Modal>
  );
};

export default connect(dvaPropsData)(AuditModalPage);
