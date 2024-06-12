import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Divider, Modal, Descriptions } from 'antd';
import ServiceReport from '@/pages/ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchQuery/detail.js';
import HandlingSugges from '@/pages/ctDebuggAfterSaleServiceManage/supervisionInspection/installEquipment/components/HandlingSugges.js';

const dvaPropsData = ({ loading }) => ({});

const ServiceReportModal = props => {
  const {
    dispatch,
    data: { ID, ItemCode, Num, DispatchId,SystemModelId,PointId,EquipmentAuditId },
    descriptionList,
    descriptionColumn,
    isModalOpen,
    onCancel,
    wrapClassName,
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
      title={`${Num || ItemCode}-验收服务报告`}
      wrapClassName={wrapClassName || 'spreadOverModal'}
      open={isModalOpen}
      destroyOnClose
      footer={false}
      onCancel={() => {
        onCancel();
      }}
    >
      {ID && (
        <>
          <Descriptions style={{ marginTop: 16, marginBottom: 10 }} column={descriptionColumn}>
            {descriptionList.map(item => {
              return <Descriptions.Item label={item.name}>{item.value}</Descriptions.Item>;
            })}
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

ServiceReportModal.defaultProps = {
  descriptionColumn: 3,
};

export default connect(dvaPropsData)(ServiceReportModal);
