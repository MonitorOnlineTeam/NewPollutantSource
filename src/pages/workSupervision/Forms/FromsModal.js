/*
 * @Author: JiaQi
 * @Date: 2023-04-18 16:56:52
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-06 14:07:26
 * @Description: 任务单电子表单 - 操作弹窗
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import CustomerInterview from './CustomerInterview';
import Training from './Training';
import OfficeInspection from './OfficeInspection';
import Fieldwork from './Fieldwork';
import Branch_Inside from './Branch_Inside';
import Branch_Other from './Branch_Other';
import AttendanceLog from './AttendanceLog';
import AccountsReceivable from './AccountsReceivable';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  formsModalVisible: wordSupervision.formsModalVisible,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const FromsModal = props => {
  const { formsModalVisible, taskInfo, editData = {}, onSubmitCallback, visible, onCancel } = props;

  useEffect(() => {
    // loadData();
  }, []);

  //
  // const loadData = () => {};

  // 关闭弹窗
  // const onCancel = () => {
  //   // props.dispatch({
  //   //   type: 'wordSupervision/updateState',
  //   //   payload: {
  //   //     formsModalVisible: false,
  //   //   },
  //   // });

  //   setVisible(false);
  // };

  // 根据任务类型获取标题
  const getContentByTaskType = () => {
    // 3.运维回访客户、4.成套回访客户.5.办事处检查、6、人员培训、7、检查考勤和日志、8、现场工作、9、部门内其他工作事项、10、支持其他部门工作、11、应收账款催收
    let title = '';
    switch (taskInfo.TaskType) {
      case 3:
      case 4:
        return (
          <CustomerInterview
            editData={editData}
            taskInfo={taskInfo}
            onCancel={() => onCancel()}
            onSubmitCallback={() => onSubmitCallback && onSubmitCallback()}
          />
        );
      case 5:
        return (
          <OfficeInspection
            editData={editData}
            taskInfo={taskInfo}
            onCancel={() => onCancel()}
            onSubmitCallback={() => onSubmitCallback && onSubmitCallback()}
          />
        );
      case 6:
        return (
          <Training
            taskInfo={taskInfo}
            editData={editData}
            onCancel={() => onCancel()}
            onSubmitCallback={() => onSubmitCallback && onSubmitCallback()}
          />
        );
      case 7:
        // 检查考勤和日志
        return (
          <AttendanceLog
            isDetail={props.isDetail}
            taskInfo={taskInfo}
            editData={editData}
            onCancel={() => onCancel()}
            onSubmitCallback={() => onSubmitCallback && onSubmitCallback()}
          />
        );
      case 8:
        // 现场工作
        return (
          <Fieldwork
            taskInfo={taskInfo}
            editData={editData}
            onCancel={() => onCancel()}
            onSubmitCallback={() => onSubmitCallback && onSubmitCallback()}
          />
        );
      case 9:
        // 部门内其他工作事项
        return (
          <Branch_Inside
            taskInfo={taskInfo}
            editData={editData}
            onCancel={() => onCancel()}
            onSubmitCallback={() => onSubmitCallback && onSubmitCallback()}
          />
        );
      case 10:
        // 支持其他部门工作
        return (
          <Branch_Other
            taskInfo={taskInfo}
            editData={editData}
            onCancel={() => onCancel()}
            onSubmitCallback={() => onSubmitCallback && onSubmitCallback()}
          />
        );
      case 11:
        // 应收账款催收
        return (
          <AccountsReceivable
            taskInfo={taskInfo}
            editData={editData}
            onCancel={() => onCancel()}
            onSubmitCallback={() => onSubmitCallback && onSubmitCallback()}
          />
        );
    }
  };

  return (
    <Modal
      centered
      // title="超标报警核实率"
      visible={visible}
      footer={null}
      wrapClassName="spreadOverModal"
      destroyOnClose
      onCancel={() => onCancel()}
    >
      {getContentByTaskType()}
    </Modal>
  );
};

export default connect(dvaPropsData)(FromsModal);
