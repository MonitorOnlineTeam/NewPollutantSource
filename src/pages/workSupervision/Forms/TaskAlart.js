import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Alert } from 'antd';
import { taskType } from '../CONST';

const TaskAlart = props => {
  const {
    taskInfo: { CreateTime, TaskType, EndTime, standNum },
  } = props;

  const rangeText = TaskType === 7 ? '周' : '月';

  return (
    <>
      {CreateTime && (
        <Alert
          message={`任务类型：${taskType[TaskType]}，${CreateTime} 开始，于${EndTime} 结束，每个工单最少有（${standNum}次/${rangeText}）记录。`}
          type="info"
          showIcon
          style={{ marginRight: 30 }}
        />
      )}
    </>
  );
};

export default connect()(TaskAlart);
