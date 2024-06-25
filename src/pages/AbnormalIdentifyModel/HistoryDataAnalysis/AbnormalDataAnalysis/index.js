import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import PageContent from './components/PageContent';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({});

const AbnormalDataAnalysis = props => {
  const { entCode, regionCode, rtnType, location, time } = props;

  useEffect(() => {}, []);

  const index = location.pathname.lastIndexOf('/'); // 找到最后一个'/'的位置
  const excepType = location.pathname.substring(index + 1); // 截取'/'之后的内容
  return (
    <BreadcrumbWrapper hideBreadcrumb={entCode || regionCode}>
      <PageContent
        time={time}
        entCode={entCode}
        regionCode={regionCode}
        dataType={regionCode ? 'ent' : entCode ? 'point' : ''}
        excepType={excepType}
        rtnType={rtnType}
        location={location}
      />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(AbnormalDataAnalysis);
