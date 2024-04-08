/**
 * 功  能：服务大区 成套
 * 创建人：jab
 * 创建时间：2024.03
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined,ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
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
    GetLargeRegionList: (payload,callback) => { //服务大区
        dispatch({
          type: `ctCommon/GetLargeRegionList`,
          payload: payload,
          callback:callback,
        })
      },
  }
}
const Index = (props) => {



  const { name,label } = props;
  const [largeRegionList, setLargeRegionList] = useState([]);



  useEffect(() => {
    props.GetLargeRegionList({},(res)=>{
        setLargeRegionList(res)
    })

  }, []);

  
  return (
        <Spin size='small' spinning={props.largeRegionListLoading} className='formItemSpinSty'>
        <Form.Item name={name? name : 'serviceAreaCode'} label={label?label :'服务大区'}  >
         <Select placeholder='请选择'  allowClear>
         {largeRegionList.map(item=><Option value={item.ID}>{item.LargeRegion}</Option>)}
         </Select>
         </Form.Item>
        </Spin>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);