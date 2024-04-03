/*
 * @Author: JiaQi
 * @Date: 2024-04-02 11:08:59
 * @Last Modified by:   JiaQi
 * @Last Modified time: 2024-04-02 11:08:59
 * @Description:  客户投诉解决
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
import HandleComplaintsContentPage from './components/HandleComplaintsContentPage';

const dvaPropsData = ({ loading }) => ({});

const HandleComplaints = props => {
  const [pageIndex, setPageIndex] = useState(1);
  const { isAll, queryLoading, dispatch, exportLoading } = props;

  useEffect(() => {}, []);

  return (
    <BreadcrumbWrapper>
      <HandleComplaintsContentPage />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(HandleComplaints);
