import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Radio, Row, Col } from 'antd';
import styles from '../../styles.less';
import ReactEcharts from 'echarts-for-react';
import HomeCard from '../../components/HomeCard';
import RankingContent from './RankingContent';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const Ranking = props => {
  const { dispatch, modelBaseType, title, type } = props;
  const [modelType, setModelType] = useState(type);

  useEffect(() => {}, []);

  return (
    <HomeCard
      title={title}
      bodyStyle={{
        // height: 'calc(100% - 110px)',
        // padding: '10px',
        // overflowY: 'auto',
      }}
      extra={
        <Radio.Group
          defaultValue={modelType}
          size="small"
          buttonStyle="solid"
          onChange={e => {
            setModelType(e.target.value);
          }}
        >
          <Radio.Button value={1}>企业</Radio.Button>
          <Radio.Button value={2}>线索</Radio.Button>
        </Radio.Group>
      }
    >
      <RankingContent modelType={modelType} modelBaseType={modelBaseType} />
    </HomeCard>
  );
};

export default connect(dvaPropsData)(Ranking);
