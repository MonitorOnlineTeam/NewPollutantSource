/*
 * @Author: Jiaqi 
 * @Date: 2020-11-06 15:29:02 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-11-11 11:02:46
 * @Description: 异常报警响应率弹框
 */


import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import AlarmResponseTimelyRateModal from '@/pages/operations/alarmResponseTimelyRate'

const { RangePicker } = DatePicker;

import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;


const dvaPropsData = ({ loading, }) => ({
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {



  const { visible, onCancel, time, type, alarmResponseTimelyList } = props;

  useEffect(() => {

  }, [])


  return (
    <Modal
      title="报警响应及时率"
      wrapClassName='spreadOverModal'
      visible={visible}
      footer={false}
      onCancel={onCancel}
      destroyOnClose
    >
      <AlarmResponseTimelyRateModal time={time} pollutantType={type}/>
    </Modal>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);