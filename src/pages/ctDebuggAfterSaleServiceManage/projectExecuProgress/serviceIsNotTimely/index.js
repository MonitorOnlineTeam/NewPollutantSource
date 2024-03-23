/*
 * @Author: JiaQi
 * @Date: 2024-03-21 13:47:44
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-22 11:44:42
 * @Description:  服务不及时页面
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Tabs, Select, Space, Row, Col, message, Divider } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import ServiceIsNotTimelyContent from './components/ServiceIsNotTimelyContent';

const { TabPane } = Tabs;

const dvaPropsData = ({ loading }) => ({});

const ServiceIsNotTimely = props => {
  const [form] = Form.useForm();

  const [showType, setShowType] = useState('chart');

  const {} = props;

  useEffect(() => {}, []);

  return (
    <BreadcrumbWrapper>
      <Tabs defaultActiveKey="1" tabPosition="left" style={{ marginTop: 20 }}>
        <TabPane tab="服务不及时" key="1">
          <ServiceIsNotTimelyContent serviceType={0} />
        </TabPane>
        <TabPane tab="不参与统计" key="2">
          <ServiceIsNotTimelyContent serviceType={1} />
        </TabPane>
        <TabPane tab="服务时间变更" key="3">
          <ServiceIsNotTimelyContent serviceType={2} />
        </TabPane>
      </Tabs>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(ServiceIsNotTimely);
