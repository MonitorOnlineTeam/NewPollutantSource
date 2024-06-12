/**
 * 功  能：省份 成套
 * 创建人：jab
 * 创建时间：2024.04
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
    GetLargeRegionList: (payload,callback) => { //服务大区 省份
        dispatch({
          type: `ctCommon/GetLargeRegionList`,
          payload: payload,
          callback:callback,
        })
      },
  }
}
const Index = (props) => {



  const { name } = props;
  const [provinceList, setProvinceList] = useState([]);



  useEffect(() => {
    props.GetLargeRegionList({},(res)=>{
      const data = [];
         res.map(item=>{
          if(item.ChildList?.[0]){
            item.ChildList.map(childListItem=>{
              data.push(childListItem)
            })
          }
        })
        setProvinceList(data)
    })

  }, []);

  
  return (
        <Spin size='small' spinning={props.largeRegionListLoading} className='formItemSpinSty'>
        <Form.Item name={name? name : 'province'} label='省份'  >
         <Select placeholder='请选择'  allowClear>
         {provinceList.map(item=><Option value={item.RegionCode}>{item.RegionName}</Option>)}
         </Select>
         </Form.Item>
        </Spin>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);