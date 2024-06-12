/**
 * 功  能：客户满意度调查
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Radio,Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
const { RangePicker } = DatePicker;
import Cookie from 'js-cookie';
import config from '@/config';
import ImageView from '@/components/ImageView';
import TitleComponents from '@/components/TitleComponents'


import { API } from '@config/API';
import cuid from 'cuid';
import styles from "../style.less"
const { Step } = Steps;
const namespace = 'customerSatisfacQuery'

const dvaPropsData = ({ loading, customerSatisfacQuery, global, }) => ({
  configInfo: global.configInfo,
})

const Index = (props) => {





  const {data} = props;
 




  useEffect(() => {

  }, []);

  const ContentComponents = () => {
    return <Form className='detailForm'>
     <TitleComponents simpleSty text='派单详情' key='1' height={16} style={{ fontSize:16 }} />
      <div>
              <Row>
                <Col span={8}>
                    <Form.Item label='派工单号'>
                      {data?.Num}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='项目编号'>
                    {data?.ProjectCode}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='项目名称'>
                    {data?.ProjectName}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='大区名称'>
                    {data?.ServiceAreaName}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='省份'>
                    {data?.ProvinceName}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='行业'>
                    {data?.Industry}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='服务工程师'>
                    {data?.WorkerName}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='工程师行政区域'>
                    {data?.ServiceAreaName}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='服务主要内容'> 
                    {data?.Remark}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='服务完成日期'>
                    {data?.LeaveDate}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='客户姓名'>
                    {data?.ContactsName}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='客户电话'>
                    {data?.Phone}
                   </Form.Item> 
                </Col>
              </Row>
      </div>
    </Form>
  }

  

  return (
    <div>
          <ContentComponents />
    </div>
  );
};
export default connect(dvaPropsData)(Index);