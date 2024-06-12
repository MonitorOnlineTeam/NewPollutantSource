import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tag, Radio, Divider } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import Content from './Content';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const WorkPage = props => {
  const {} = props;

  useEffect(() => {}, []);

  return (
    <BreadcrumbWrapper>
      <Content />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(WorkPage);
