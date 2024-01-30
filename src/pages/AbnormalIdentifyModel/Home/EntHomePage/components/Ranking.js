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
  const { dispatch, title, type } = props;
  const [modelBaseType, setModelBaseType] = useState(1);

  useEffect(() => {}, []);

  return (
    <HomeCard
      title="线索排名"
      bodyStyle={
        {
          // height: 'calc(100% - 110px)',
          // padding: '10px',
          // overflowY: 'auto',
        }
      }
      extra={
        <Radio.Group
          defaultValue={1}
          size="small"
          buttonStyle="solid"
          onChange={e => {
            setModelBaseType(e.target.value);
          }}
        >
          <Radio.Button value={1}>人为干预</Radio.Button>
          <Radio.Button value={2}>设备故障</Radio.Button>
        </Radio.Group>
      }
    >
      <RankingContent modelType={2} modelBaseType={modelBaseType} />
    </HomeCard>
  );
};

export default connect(dvaPropsData)(Ranking);
