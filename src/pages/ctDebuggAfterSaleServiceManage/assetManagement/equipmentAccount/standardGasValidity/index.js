/*
 * @Author: JiaQi 
 * @Date: 2024-04-07 17:29:25 
 * @Last Modified by:   JiaQi 
 * @Last Modified time: 2024-04-07 17:29:25 
 * @Description:  标气有效期
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
import StandardGasValidityContent from './components/StandardGasValidityContent';

const dvaPropsData = ({ loading }) => ({});

const StandardGasValidity = props => {
  const [pageIndex, setPageIndex] = useState(1);
  const { isAll, queryLoading, dispatch, exportLoading } = props;

  useEffect(() => {}, []);

  return (
    <BreadcrumbWrapper>
      <StandardGasValidityContent />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(StandardGasValidity);
