import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {} from 'antd';
import styles from './styles.less';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  todoList: wordSupervision.todoList,
  messageList: wordSupervision.messageList,
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const Training = props => {
  const { taskInfo } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {};

  return (
    <>
      {taskInfo.CreateTime && (
        <Alert
          message={`任务类型：${taskType[taskInfo.TaskType]}，${taskInfo.CreateTime} 开始，于${
            taskInfo.EndTime
          } 结束，每个工单最少有（${taskInfo.standNum}次/月）记录。`}
          type="info"
          showIcon
          style={{ marginRight: 30 }}
        />
      )}
      <h2 className={styles.formTitle}>回访客户记录表</h2>
      <div className={styles.formContent}></div>
    </>
  );
};

export default connect(dvaPropsData)(Training);
