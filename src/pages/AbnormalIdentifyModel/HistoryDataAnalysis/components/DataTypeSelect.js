import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const DataTypeSelect = props => {
  const { taskInfo } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {};

  return (
    <Radio.Group {...props}>
      {/* 单企业项目只显示排放口，集团项目不显示行政区 */}
      {!configInfo.isGroupEnt && !configInfo.IsSingleEnterprise && (
        <Radio.Button value="region">行政区</Radio.Button>
      )}
      {!configInfo.IsSingleEnterprise && (
        <Radio.Button value="ent">{configInfo.isGroupEnt ? '分厂' : '企业'}</Radio.Button>
      )}
      <Radio.Button value="point">排放口</Radio.Button>
    </Radio.Group>
  );
};

export default connect(dvaPropsData)(DataTypeSelect);
