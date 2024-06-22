import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Radio, Badge, Row, Col, Space, Button, Statistic, Form, InputNumber } from 'antd';
import styles from '../../styles.less';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { getModelGuidsByBaseTypeCode, handleHomeDate } from '@/pages/AbnormalIdentifyModel/CONST';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import ReactEcharts from 'echarts-for-react';
import PageContent from './PageContent';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  // loading: loading.effects['AbnormalIdentifyModel/GetDataMissAnalysis'],
});

const PointStatisticalAnalysis = props => {
  const [form] = Form.useForm();

  const { dispatch, pageTitle, entCode, DGIMN, warningForm, regionCode } = props;

  useEffect(() => {}, []);
  console.log('entCode || regionCode', entCode || regionCode)
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

export default connect(dvaPropsData)(PointStatisticalAnalysis);
