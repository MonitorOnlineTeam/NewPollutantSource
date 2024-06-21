import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import PageContent from './components/PageContent';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({});

const AnomalyRateDetect = props => {
  const { entCode, regionCode } = props;

  useEffect(() => {}, []);
  return (
    <BreadcrumbWrapper hideBreadcrumb={entCode || regionCode}>
      <PageContent
        entCode={entCode}
        regionCode={regionCode}
        dataType={regionCode ? 'ent' : entCode ? 'point' : ''}
      />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(AnomalyRateDetect);
