import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Badge, Row, Col, Space, Button, Statistic, Form, InputNumber } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import DischargeStandard from '@/pages/dataSearch/dischargeStandard/components/StandardData';
import AbnormalStandard from '@/pages/dataSearch/abnormalStandard/components/StandardData';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  // loading: loading.effects['AbnormalIdentifyModel/GetDataMissAnalysis'],
});

const dischargeUnits = props => {
  const [form] = Form.useForm();

  const { dispatch, pageTitle, entCode, DGIMN, time, regionCode } = props;

  useEffect(() => {}, []);
  return (
    <BreadcrumbWrapper>
      <Tabs defaultActiveKey="1" tabPosition="left" tabBarStyle={{ marginTop: 14 }}>
        <Tabs.TabPane tab="排放标准记录" key="1">
          <DischargeStandard />
        </Tabs.TabPane>
        <Tabs.TabPane tab="异常规则记录" key="2">
          <AbnormalStandard />
        </Tabs.TabPane>
      </Tabs>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(dischargeUnits);
