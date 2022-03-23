/**
 * 功  能：远程督查 详情
 * 创建人：贾安波
 * 创建时间：2022.3.16
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Checkbox, Upload, Button, Select, Tabs, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';


import { RollbackOutlined } from '@ant-design/icons';

import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import styles from "../style.less"
import { getAttachmentDataSource } from '@/pages/AutoFormManager/utils'
import SdlTable from '@/components/SdlTable'

const { Option } = Select;
const { TabPane } = Tabs;

const namespace = 'remoteSupervision'




const dvaPropsData =  ({ loading,equipmentFeedback,global }) => ({
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getConsistencyCheckInfo:(payload)=>{ 
      dispatch({
        type: `${namespace}/getConsistencyCheckInfo`,
        payload:payload,
      })
    },
  }
}
const Index = (props) => {
    const {location:{query:{ detailData}} }= props;

  
  useEffect(() => {

  
  },[]);






 
 let data = JSON.parse(detailData) || [];
 console.log(data)
  return (
    <div className={styles.equipmentFeedbackDetailSty}>
    <BreadcrumbWrapper>
    <Card title={
     <Row justify='space-between'>
        <span>查看信息</span>
        <Button onClick={() => {props.history.go(-1);   }} ><RollbackOutlined />返回</Button>
     </Row>
    }>
    <Form
      name="detail"
    >
      <Row>
      <Col span={6}>
        <Form.Item label="企业名称">
        {data.ParentName }
      </Form.Item>
      </Col>
        <Col span={6}>
        <Form.Item label="监测点名称" >
        {data.PointName }
      </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="核查月份" >
        {data.RegionName}
      </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="核查结果" >
        {data.RegionName}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={6}>
        <Form.Item label="核查人">
        {data.FaultTime }
      </Form.Item>
      </Col>
      <Col span={6}>
      <Form.Item label="核查时间"  >
        {data.MonitorPointEquipmentName  }
      </Form.Item>
      </Col>
      </Row>
    </Form>
    <Tabs>
    <TabPane tab="数据一致性核查表" key="1">
              <SdlTable
                // loading={this.props.exceptionDataLoading}
                columns={[]}
                dataSource={[]}
                pagination={false}
                scroll={{ y: '100vh' }}
              />
               <SdlTable
                // loading={this.props.exceptionDataLoading}
                columns={[]}
                dataSource={[]}
                pagination={false}
                scroll={{ y: '100vh' }}
              />
            </TabPane>
            <TabPane tab="参数一致性核查表" key="2">
              <SdlTable
                // loading={this.props.exceptionDataLoading}
                columns={[]}
                dataSource={[]}
                pagination={false}
                scroll={{ y: '100vh' }}
              />
            </TabPane>
          </Tabs>
   </Card>
   </BreadcrumbWrapper>
        </div>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);