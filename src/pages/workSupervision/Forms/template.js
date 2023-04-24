import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import {
} from 'antd';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  todoList: wordSupervision.todoList,
  messageList: wordSupervision.messageList,
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const Workbench = props => {
  const { } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  // 
  const loadData = () => {
    
  };

  
  return (
    <BreadcrumbWrapper>
      
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Workbench);
