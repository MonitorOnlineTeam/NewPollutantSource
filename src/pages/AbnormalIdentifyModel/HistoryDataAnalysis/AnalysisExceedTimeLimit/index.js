import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Radio, Badge, Row, Col, Space, Button, Statistic, Form, InputNumber } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import PageContent from './components/PageContent';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  // loading: loading.effects['AbnormalIdentifyModel/GetDataMissAnalysis'],
});

const PointStatisticalAnalysis = props => {
  const [form] = Form.useForm();

  const { dispatch, pageTitle, entCode, DGIMN, time, regionCode } = props;

  useEffect(() => {}, []);
  return (
    <BreadcrumbWrapper hideBreadcrumb={entCode || regionCode}>
      <PageContent
        time={time}
        entCode={entCode}
        regionCode={regionCode}
        dataType={regionCode ? 'ent' : entCode ? 'point' : ''}
      />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(PointStatisticalAnalysis);
