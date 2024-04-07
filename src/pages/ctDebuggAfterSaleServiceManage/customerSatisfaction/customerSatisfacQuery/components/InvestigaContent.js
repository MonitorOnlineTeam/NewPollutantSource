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
    return <Form className='detailForm' style={{marginTop:12}}>
     <TitleComponents simpleSty text='调查内容' key='1' height={16} style={{ fontSize:16 }} />
      <div>
              <Row>
                <Col span={8}>
                    <Form.Item label='调查人员'>
                    {data?.InvestigatorName}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='调查日期'>
                    {data?.InvestigationTime}
                   </Form.Item> 
                </Col>
                <Col span={8}></Col>
                <Col span={8}>
                    <Form.Item label='工程师的服务态度'>
                    {data?.ServiceAttitude}
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='工程师的技术水平'>
                    {data?.TechnicalLevel}
                   </Form.Item> 
                </Col>
                <Col span={8}></Col>
                <Col span={24}>
                    <Form.Item label='客户问题及建议'>
                    {data?.Problem}
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