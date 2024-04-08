/**
 * 功  能：通用管理 车辆管理 详情内容
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Radio, Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
const { RangePicker } = DatePicker;
import Cookie from 'js-cookie';
import config from '@/config';
import ImageView from '@/components/ImageView';
import TitleComponents from '@/components/TitleComponents'
import SdlTable from '@/components/SdlTable'


import { API } from '@config/API';
import cuid from 'cuid';
const { Step } = Steps;
const namespace = 'vehicleManager'

const dvaPropsData = ({ loading, vehicleManager, global, }) => ({
  configInfo: global.configInfo,
})
const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetCarList: (payload,callback) => { //列表
      dispatch({
        type: `${namespace}/GetCarList`,
        payload: payload,
        callback: callback,
      })
    },

  }
}
const Index = (props) => {





 


  const [dataLoading,setDataLoading ] = useState(true)
  const [data,setData ] = useState({})
  useEffect(() => {
    props.GetCarList({
      id:props.id
    },(res)=>{
      setDataLoading(false)
      setData(res)
    })
  }, []);
  let columns = [
    {
      title: '报销单号',
      dataIndex: 'Num',
      key: 'Num',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '经办日期',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '费用类型',
      dataIndex: 'ItemCode',
      key: 'ItemCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '金额',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '经办人',
      dataIndex: 'ProjectType',
      key: 'ProjectType',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '费用承担部门',
      dataIndex: 'CustomEnt',
      key: 'CustomEnt',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '说明',
      dataIndex: 'Province',
      key: 'Province',
      align: 'center',
      ellipsis: true,
    }
  ];
  const ContentComponents = () => {
    return <Form className='detailForm'>
      <TitleComponents simpleSty text='基本信息' key='1' height={16} style={{ fontSize: 16,margin:'8px 0 12px 0' }} />
      <Row>
        <Col span={8}>
          <Form.Item label='车牌号'>
            {data?.CarNum}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='车型'>
            {data?.CarType}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='使用状态'>
            {data?.Status}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='所属单位'>
            {data?.AffiliatedUnit}
          </Form.Item>
        </Col>
      </Row>
      <TitleComponents simpleSty text='管理信息' key='1' height={16} style={{ fontSize: 16 ,margin:'8px 0 12px 0'}} />
      <Row>
        <Col span={8}>
          <Form.Item label='车辆分类'>
            {data?.CarClass}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='购入金额'>
            {data?.CarMoney}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='购入日期'>
            {data?.BuyDate}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='资产状态'>
            {data?.AssetStatus}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='所属部门'>
            {data?.Department}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='车辆管理人'>
            {data?.CarManager}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='所属大区'>
            {data?.LargeRegion}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='所属行业'>
            {data?.Industry}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='所属办事处'>
            {data?.Office}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='使用部门'>
            {data?.UseDepartment}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='下次年检日期'>
            {data?.LastCheckDate}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='综合油耗'>
            {data?.OilConsumption}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='当前里程数'>
            {data?.Kilometers}
          </Form.Item>
        </Col>
      </Row>
      <TitleComponents simpleSty text='行驶证信息' key='1' height={16} style={{ fontSize: 16 ,margin:'8px 0 12px 0'}} />
      <Row>
        <Col span={8}>
          <Form.Item label='车辆类型'>
            {data?.VehicleType}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='所有人'>
            {data?.CarOwner}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='使用性质'>
            {data?.Attribute}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='品牌型号'>
            {data?.BrandType}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='发动机型号'>
            {data?.Engine}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='车辆识别代码'>
            {data?.CarCode}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='注册日期'>
            {data?.CarDate}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='发证日期'>
            {data?.PapersDate}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='核定载人数'>
            {data?.ApprovedCount}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='外廓尺寸'>
            {data?.Dimensions}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='总质量'>
            {data?.Weight}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='整备质量'>
            {data?.PreparationWeight}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='核定载质量'>
            {data?.ApprovedWeight}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='准牵引总质量'>
            {data?.TractionWeight}
          </Form.Item>
        </Col>
      </Row>
      {/* <TitleComponents simpleSty text='费用支出记录' key='1' height={16} style={{ fontSize: 16,margin:'8px 0 12px 0' }} />
      <SdlTable
        resizable
        loading={false}
        bordered
        dataSource={[]}
        columns={columns}
        pagination={false}
      /> */}
    </Form>
  }



  return (
    <div>
     <Spin spinning={dataLoading}> <ContentComponents />  </Spin>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);