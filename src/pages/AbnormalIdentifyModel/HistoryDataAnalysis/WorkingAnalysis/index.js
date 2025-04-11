import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import PageContent from './components/PageContent';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({});

const WorkingAnalysis = props => {
  const { entCode, regionCode, time, pollutantType } = props;

  useEffect(() => {}, []);
  return (
    <BreadcrumbWrapper hideBreadcrumb={entCode || regionCode}>
      <PageContent
        pollutantType={pollutantType}
        time={time}
        entCode={entCode}
        regionCode={regionCode}
        dataType={regionCode ? 'ent' : entCode ? 'point' : ''}
      />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(WorkingAnalysis);
