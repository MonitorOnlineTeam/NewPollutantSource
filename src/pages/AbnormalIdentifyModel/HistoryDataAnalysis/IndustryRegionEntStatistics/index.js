import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import PageContent from './components/PageContent';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({});

const IndustryRegionEntStatistics = props => {
  const {
    match: {
      params: { dataType },
    },
  } = props;

  useEffect(() => {}, []);
  return (
    <BreadcrumbWrapper>
      <PageContent dataType={dataType} />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(IndustryRegionEntStatistics);
