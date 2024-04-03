/*
 * @Author: JiaQi
 * @Date: 2024-04-01 15:21:31
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-04-03 09:42:32
 * @Description:  查看全部
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Button, Tabs, Select, Space, Row, Col, message, Divider } from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import HandleComplaintsContentPage from './HandleComplaintsContentPage';

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
      footer={null}
      onCancel={() => {
        onCancel();
      }}
    >
      {isModalOpen && <HandleComplaintsContentPage isAll />}
    </Modal>
  );
};

export default connect(dvaPropsData)(AllViewModal);
