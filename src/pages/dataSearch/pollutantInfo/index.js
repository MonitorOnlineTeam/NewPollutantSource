/**
 * 功  能：污染源信息
 * 创建人：jab
 * 创建时间：2022.04.02
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag,Tabs, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
import AutoFormTable from './components/AutoFormTable'
import DataVerifica from './components/DataVerifica'
import SystemInfo from './components/SystemInfo'
import DevicePar from './components/DevicePar'
import DeviceInfo from './components/DeviceInfo'
import PointInfo from './components/PointInfo'
import OperationInfo  from './components/OperationInfo'
import EntInfo  from './components/EntInfo'

const namespace = 'pollutantInfo'
const dvaPropsData =  ({ loading,pollutantInfo,global }) => ({

})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    
  }
}
const Index = (props) => {






  
  







  return (
    <div  className={styles.pollutantInfoSty}>
    <BreadcrumbWrapper>
  <Card>
    <Tabs tabPosition='left'>
          <TabPane tab="企业信息" key="1">
          <EntInfo props/>
          </TabPane>
          <TabPane tab="监测点信息" key="2">
          <PointInfo props/>
          </TabPane>
          <TabPane tab="运营信息" key="3">
          <OperationInfo props/>
          </TabPane>
          <TabPane tab="系统信息" key="4">
            <SystemInfo props/>
          </TabPane>
          <TabPane tab="设备信息" key="5">
            <DeviceInfo props/>
          </TabPane>
          <TabPane tab="数据核查项" key="6">
            <DataVerifica props/>
          </TabPane>
          <TabPane tab="设备参数项" key="7">
            <DevicePar props/>
          </TabPane>
        </Tabs>
   </Card>
   </BreadcrumbWrapper>


        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);