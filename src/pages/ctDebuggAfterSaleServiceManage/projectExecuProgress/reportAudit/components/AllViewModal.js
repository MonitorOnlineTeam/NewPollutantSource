/*
 * @Author: JiaQi
 * @Date: 2024-03-22 11:45:31
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-22 15:40:25
 * @Description:  查看全部
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Button, Tabs, Select, Space, Row, Col, message, Divider } from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import ReportSpotCheck from '../index.js';

const { TabPane } = Tabs;

const dvaPropsData = ({ loading }) => ({});

const AllViewModal = props => {
  const [form] = Form.useForm();

  const [showType, setShowType] = useState('chart');

  const { dispatch, isModalOpen, onCancel } = props;

  useEffect(() => {}, []);

  return (
    <Modal
      title={`查看全部`}
      wrapClassName="spreadOverModal"
      visible={isModalOpen}
      destroyOnClose
      footer={[]}
      onCancel={() => {
        onCancel();
      }}
    >
      {isModalOpen && <ReportSpotCheck isAll />}
    </Modal>
  );
};

export default connect(dvaPropsData)(AllViewModal);
