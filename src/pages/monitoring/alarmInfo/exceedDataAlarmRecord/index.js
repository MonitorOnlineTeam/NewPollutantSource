import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import PageContent from './PageContent';

const dvaPropsData = ({ loading, common }) => ({
  // attentionList: common.attentionList,
  // pollutantCodeList: common.pollutantCode,
  // loading: loading.effects['exceedDataAlarmModel/GetAlarmVerifyRate'],
});

const exceedDataAlarmRecord = props => {
  return (
    <BreadcrumbWrapper>
      <PageContent />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(exceedDataAlarmRecord);
