import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import styles from '../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NavigationTree from '@/components/NavigationTree';
import PageContent from './PageContent';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const Index = props => {
  const { dispatch } = props;
  const [DGIMN, setDGIMN] = useState();

  useEffect(() => {
    GetModelList();
  }, []);

  // 获取通用库模型列表
  const GetModelList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetModelList',
      payload: {},
    });
  };

  return (
    <>
      <NavigationTree
        showIndustry
        propsParams={{
          // ModelFlag: 'ModelFlag',
          // industryTypeCode: '1',
          outputType: 0,
          StopPointFlag: true,
        }}
        // checkpPol="2"
        polShow
        domId="#ModelMatch"
        onItemClick={value => {
          console.log('value', value);
          if (value[0].IsEnt === false) {
            setDGIMN(value[0].key);
          }
        }}
      />
      <div id="ModelMatch">
        <BreadcrumbWrapper>{DGIMN && <PageContent DGIMN={DGIMN} />}</BreadcrumbWrapper>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(Index);
