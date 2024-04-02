/*
 * @Author: JiaQi
 * @Date: 2024-04-01 10:17:49
 * @Last Modified by:   JiaQi
 * @Last Modified time: 2024-04-01 10:17:49
 * @Description:  服务热线电话
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Popconfirm,
  Select,
  Space,
  Row,
  Col,
  message,
  Divider,
  Tooltip,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import ImageLightboxView from '@/components/ImageLightboxView';
import HotPhoneContentPage from './components/HotPhoneContentPage';

const dvaPropsData = ({ loading }) => ({});

const HotPhone = props => {
  const [pageIndex, setPageIndex] = useState(1);
  const { isAll, queryLoading, dispatch, exportLoading } = props;

  useEffect(() => {}, []);

  return (
    <BreadcrumbWrapper>
      <HotPhoneContentPage />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(HotPhone);
