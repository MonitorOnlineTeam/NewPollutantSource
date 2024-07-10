/*
 * @Author: JiaQi
 * @Date: 2024-04-02 11:09:09
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-23 16:40:14
 * @Description:  客户投诉解决页面内容
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
  Descriptions,
  Modal,
} from 'antd';
import styles from '../../index.less';
import ViewComplaintContent from './ViewComplaintContent';

const { TextArea } = Input;

let timeout;

const dvaPropsData = ({ loading, common }) => ({});

const ViewModal = props => {
  const [form] = Form.useForm();

  const [detailsData, setDetailsData] = useState({}); // 大区、省份列表

  const { dispatch, onCancel, isModalOpen, id } = props;

  useEffect(() => {
    id && isModalOpen && GetCustomerComplaintsView();
  }, [id]);

  // 获取详情
  const GetCustomerComplaintsView = () => {
    dispatch({
      type: 'customer/GetCustomerComplaintsView',
      payload: {
        id,
      },
      callback: res => {
        setDetailsData(res);
      },
    });
  };

  const TitleComponents = props => {
    // position:'sticky',top: 0,zIndex:998,background: '#fff',
    return (
      <div
        style={{
          display: 'inline-block',
          fontWeight: 'bold',
          marginTop: 4,
          padding: '2px 0',
          marginBottom: 12,
          borderBottom: '1px solid rgba(0,0,0,.1)',
        }}
      >
        {props.text}
      </div>
    );
  };

  return (
    <Modal
      title="详情"
      wrapClassName="spreadOverModal"
      visible={isModalOpen}
      width={1300}
      destroyOnClose
      footer={null}
      mask={false}
      onCancel={onCancel}
      // bodyStyle={{ padding: '0 24px' }}
    >
      <ViewComplaintContent data={detailsData} />
      <Descriptions
        className={styles.complaintsDetailsWrapper}
        title={<TitleComponents text="处理结果" />}
        labelStyle={{ fontWeight: 500 }}
        style={{ marginTop: 20 }}
      >
        <Descriptions.Item label="处理结果">{detailsData.ProcessingResults}</Descriptions.Item>
        <Descriptions.Item label="扣款金额（RMB）">{detailsData.DeductionAmount}</Descriptions.Item>
        <Descriptions.Item label="纠正预防措施">{detailsData.PreventiveMeasure}</Descriptions.Item>
        <Descriptions.Item label="人员考核">{detailsData.PersonnelAssessment}</Descriptions.Item>
        <Descriptions.Item label="处理人">{detailsData.ProcessedByName}</Descriptions.Item>
        <Descriptions.Item label="处理时间">{detailsData.ProcessingTime}</Descriptions.Item>
        <Descriptions.Item label="处理结果填写时间" span={3}>
          {detailsData.UpdateTime}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default connect(dvaPropsData)(ViewModal);
