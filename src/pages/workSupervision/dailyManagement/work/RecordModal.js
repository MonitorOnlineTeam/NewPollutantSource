/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:38:17
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-13 11:15:30
 * @Description：部门内其他工作事项
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Button, Space, Tooltip, Popconfirm, Radio, Tag, Divider } from 'antd';
import Work from './Work';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/GetOtherWorkList'],
  exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
});

const Record = props => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [editData, setEditData] = useState({});
  const [handleWorkModalOpen, setHandleWorkModalOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);

  const { open, onCancel, CTOperation, title, WorkType } = props;

  useEffect(() => {}, []);

  return (
    <Modal
      title={title}
      wrapClassName={`spreadOverModal`}
      open={open}
      destroyOnClose
      footer={false}
      onCancel={() => {
        onCancel();
      }}
    >
      <Work WorkType={WorkType} CTOperation={CTOperation} mode="record" />
    </Modal>
  );
};

export default connect(dvaPropsData)(Record);
