import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Button, Tabs, Select, Space, Row, Col, message, Divider } from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import ServiceIsNotTimelyContent from './ServiceIsNotTimelyContent';

const { TabPane } = Tabs;

const dvaPropsData = ({ loading }) => ({});

const AllViewModal = props => {
  const [form] = Form.useForm();

  const [showType, setShowType] = useState('chart');

  const { dispatch, serviceType, title, isModalOpen, onCancel } = props;

  useEffect(() => {}, []);

  return (
    <Modal
      title={`${title} - 查看全部`}
      wrapClassName="spreadOverModal"
      visible={isModalOpen}
      destroyOnClose
      footer={[]}
      onCancel={() => {
        onCancel();
      }}
    >
      <ServiceIsNotTimelyContent serviceType={serviceType} isAll />
    </Modal>
  );
};

export default connect(dvaPropsData)(AllViewModal);
