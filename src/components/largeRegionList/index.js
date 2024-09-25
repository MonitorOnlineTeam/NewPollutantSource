/*
 * @Author: outman0611
 * @Date: 2024-07-04 11:25:06
 * @LastEditors: outman0611
 * @LastEditTime: 2024-09-24 17:01:32
 */
/**
 * 功  能：服务大区 成套
 * 创建人：jab
 * 创建时间：2024.03
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;

const { Option } = Select;

const namespace = 'ctCommon'


const dvaPropsData = ({ loading, ctAfterSalesServiceManagement, global, }) => ({
  largeRegionListLoading: loading.effects[`${namespace}/GetLargeRegionList`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetLargeRegionList: (payload, callback) => { //服务大区
      dispatch({
        type: `ctCommon/GetLargeRegionList`,
        payload: payload,
        callback: callback,
      })
    },
  }
}
const Index = (props) => {



  const { name, label } = props;
  const [largeRegionList, setLargeRegionList] = useState([]);



  useEffect(() => {
    props.GetLargeRegionList({}, (res) => {
      setLargeRegionList(res)
    })

  }, []);


  return (
      <Form.Item name={name ? name : 'serviceAreaCode'} label={label ? label : '服务大区'}  className={props.formItemClassName}>
        {props.largeRegionListLoading ?
          <Spin size='small'> <Select placeholder='请选择' style={{minWidth:130,width:'100%'}}/> </Spin>
          :
          <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{minWidth:130, width:'100%'}}>
            {largeRegionList.map(item => <Option value={item.ID}>{item.LargeRegion}</Option>)}
          </Select>
        }
      </Form.Item>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);