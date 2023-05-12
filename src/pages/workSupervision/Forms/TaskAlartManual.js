import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Alert, Popconfirm, Tag, Button } from 'antd';
import { taskType } from '../workSupervisionUtils';

const TaskAlartManual = props => {
  const { taskInfo, onCancel } = props;

  const onDeleteTasks = () => {
    props.dispatch({
      type: 'wordSupervision/DeleteTasks',
      payload: {
        ID: taskInfo.ID,
      },
      callback: res => {
        onCancel();
      },
    });
  };

  return (
    <>
      <Alert
        message={
          <>
            {`任务类型：${taskType[taskInfo.TaskType]}，`}此任务为
            <Tag style={{ marginLeft: 4 }} color="processing">
              手动创建
            </Tag>
            ，可手动撤销！
            <Popconfirm
              title="撤销后此任务单将作废，是否确认撤销?"
              onConfirm={() => onDeleteTasks()}
              okText="是"
              cancelText="否"
            >
              <Button type="primary" danger size="small">
                撤销
              </Button>
            </Popconfirm>
          </>
        }
        type="info"
        showIcon
        style={{ marginRight: 30 }}
      />
    </>
  );
};

export default connect()(TaskAlartManual);
