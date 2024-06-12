import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tag, Radio, Divider } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import Work from './Work';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const WorkPage = props => {
  const {
    match: {
      params: { CTOperation, WorkType }, // 1. 运维   2. 成套
    },
  } = props;

  useEffect(() => {}, []);

  return (
    <BreadcrumbWrapper>
      <Work WorkType={WorkType} CTOperation={CTOperation} />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(WorkPage);
