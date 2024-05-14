import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Alert } from 'antd';
import { taskType } from '../workSupervisionUtils';

const TaskAlart = props => {
  const {
    taskInfo: { CreateTime, TaskType, EndTime, standNum },
  } = props;

  const rangeText = TaskType === 7 ? '周' : '月';

  return (
    <>
      {CreateTime && (
        <Alert
          message={`任务类型：${taskType[TaskType]}，派发时间：${CreateTime}，有效期：${EndTime} ，任务单派发频次（${standNum}次/${rangeText}）。`}
          type="info"
          showIcon
          style={{ marginRight: 30 }}
        />
      )}
    </>
  );
};

export default connect()(TaskAlart);
