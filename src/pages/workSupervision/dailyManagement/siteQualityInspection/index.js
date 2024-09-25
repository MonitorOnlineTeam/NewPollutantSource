/*
 * @Author: outman0611
 * @Date: 2024-09-09 14:03:35
 * @LastEditors: outman0611
 * @LastEditTime: 2024-09-09 14:11:45
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tag, Radio, Divider } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import Content from './Content';

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
      <Content WorkType={WorkType} CTOperation={CTOperation} />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(WorkPage);
