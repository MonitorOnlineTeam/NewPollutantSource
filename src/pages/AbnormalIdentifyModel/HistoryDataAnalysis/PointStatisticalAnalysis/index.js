import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import styles from '../../styles.less';
import NavigationTree from '@/components/NavigationTree';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import PageContent from './PageContent';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const PointStatisticalAnalysis = props => {
  const { dispatch } = props;
  const [DGIMN, setDGIMN] = useState();
  const [pageTitle, setPageTitle] = useState();

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {};

  return (
    <>
      <NavigationTree
        showIndustry
        propsParams={{
          // ModelFlag: 'ModelFlag',
          // industryTypeCode: '1',
          outputType: 0,
          // StopPointFlag: true,
        }}
        checkpPol="2"
        polShow
        domId="#PointStatisticalAnalysis"
        onItemClick={value => {
          console.log('value', value);
          if (value[0].IsEnt === false) {
            setDGIMN(value[0].key);
            setPageTitle(`${value[0].entName} - ${value[0].pointName}`);
          }
        }}
      />
      <div id="PointStatisticalAnalysis">
        <BreadcrumbWrapper>
          {DGIMN && <PageContent pageTitle={pageTitle} DGIMN={DGIMN} />}
        </BreadcrumbWrapper>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(PointStatisticalAnalysis);
