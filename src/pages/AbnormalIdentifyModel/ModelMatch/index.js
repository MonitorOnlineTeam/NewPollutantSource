import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Spin } from 'antd';
import styles from '../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NavigationTree from '@/components/NavigationTree';
import PageContent from './PageContent';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  loading: loading.effects['AbnormalIdentifyModel/GetModelList'],
});

const Index = props => {
  const { dispatch, loading } = props;
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

  return props.isModal ? (
    loading ? (
      <Spin loading={loading}></Spin>
    ) : (
      <PageContent saveCallBack={props.saveCallBack} isModal={props.isModal} DGIMN={props.DGIMN} />
    )
  ) : (
    <>
      <NavigationTree
        showIndustry
        propsParams={{
          // ModelFlag: 'ModelFlag',
          // industryTypeCode: '1',
          outputType: 0,
          // StopPointFlag: true,
        }}
        // checkpPol="2"
        polShow
        domId="#ModelMatch"
        onItemClick={value => {
          if (value[0].IsEnt === false) {
            setDGIMN(value[0].key);
          }
        }}
        zIndex={props.zIndex}
      />
      <div id="ModelMatch">
        <BreadcrumbWrapper hideBreadcrumb={props.hideBreadcrumb}>
          {DGIMN && <PageContent DGIMN={DGIMN} />}
        </BreadcrumbWrapper>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(Index);
