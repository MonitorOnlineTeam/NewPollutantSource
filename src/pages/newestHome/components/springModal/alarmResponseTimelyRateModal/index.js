/**
 * 功  能：报警响应及时率
 * 创建人：jab
 * 创建时间：2023.06.27
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;

import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'newestHome'

const dvaPropsData = ({ loading, newestHome }) => ({
  alarmResponseTimelyList: newestHome.alarmResponseTimelyList,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getResponseList: (payload, callback) => {
      dispatch({
        type: `${namespace}/getResponseList`,
        payload: payload,
        callback: callback,
      })
    },
  }
}
const Index = (props) => {


  const [form] = Form.useForm();

  const { visible, onCancel, time, type, alarmResponseTimelyList } = props;

  useEffect(() => {
    props.getResponseList({})
  }, [visible])


  const SearchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      layout='inline'
      onFinish={() => { onFinish() }}
      initialValues={{
        pollutantType: type,
        time: time
      }}
    >
      <Form.Item name='time' label='日期'>
        <RangePicker allowClear={false} style={{ width: '100%' }}
          showTime={{ format: 'YYYY-MM-DD HH:mm:ss', defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')] }}
        />
      </Form.Item>
      <Form.Item label='监测点类型' name='pollutantType'>
        <Select placeholder='请选择' style={{ width: 120 }} allowClear>
          <Option value={'2'}>废气</Option>
          <Option value={'1'}>废水</Option>
        </Select>
      </Form.Item>
      <Form.Item label='报警类型' name='exceptionType'>
        <Select style={{ width: 150 }} placeholder='请选择'>
          <Option value={1}>超标报警</Option>
          <Option value={2}>异常报警</Option>
          <Option value={3}>缺失报警</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' >
          查询
    </Button>
      </Form.Item>
    </Form>

  }



  return (
    <Modal
      title="报警响应及时率"
      wrapClassName='spreadOverModal'
      visible={visible}
      footer={false}
      onCancel={onCancel}
      destroyOnClose
    >
      <SearchComponents />

    </Modal>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);