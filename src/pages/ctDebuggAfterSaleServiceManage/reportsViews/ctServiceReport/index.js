/**
 * 功能：通用 成套服务报告
 * 创建人：jab
 * 创建时间：2024.04.26
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, Space, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import moment from 'moment'

const { Option } = Select;

const namespace = 'ctServiceReport'




const dvaPropsData = ({ loading }) => ({
  exportLoading: loading.effects[`${namespace}/ExportDebugReports`],
})


const Index = (props) => {



  const [form] = Form.useForm();


  const onExport = () => {
    const values = form.getFieldsValue();
    props.dispatch({
      type: `${namespace}/ExportDebugReports`,
      payload: {
        analysisDate: values.analysisDate && moment(values.analysisDate).format('YYYY-MM-DD HH:mm:ss')
      }
    })

  }

  return (<BreadcrumbWrapper>
  <Card>
    <Form
      name="basic"
      form={form}
      layout="inline"
      initialValues={{
        analysisDate: moment(),
      }}
      autoComplete="off"
    >
      <Form.Item label="年份" name="analysisDate">
        <DatePicker picker="year" allowClear={false} />
      </Form.Item>
      <Space>
        <Button icon={<ExportOutlined />} loading={props.exportLoading} onClick={() => { onExport() }}>
          导出
         </Button>
      </Space>
    </Form>
    </Card>
    </BreadcrumbWrapper>);
};
export default connect(dvaPropsData)(Index);