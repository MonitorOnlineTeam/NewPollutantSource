/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag,Spin, Typography,Tree,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import QueList from './QueList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';


const { TextArea,Search, } = Input;
 
const { Option } = Select;

const namespace = 'helpCenter'


const dvaPropsData =  ({ loading,helpCenter }) => ({
  treeData:helpCenter.treeData,
  treeLoading: loading.effects[`${namespace}/editManufacturer`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getManufacturerList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getManufacturerList`,
        payload:payload,
      })
    },

  }
}


const Index = (props) => {



  const [form] = Form.useForm();







  
  
  
  const  { treeData,treeLoading, } = props; 
  useEffect(() => {
  
  },[]);








  
  






  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };


  return (
    <div>
    <BreadcrumbWrapper>
    <Card>
      <Row>
    <Tree
      defaultExpandAll 
      defaultSelectedKeys={['0-0-1']}
      onSelect={onSelect}
      treeData={treeData}
      style={{ width: 170 }}
    />
       <div style={{width:'calc(100% - 170px)'}}>
        <QueList />
      
      </div>
      </Row>
   </Card>
   </BreadcrumbWrapper>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);