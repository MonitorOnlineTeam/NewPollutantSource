/**
 * 功  能：调试检测 污染源信息
 * 创建人：jab
 * 创建时间：2022.07
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
import EntInfo  from './components/EntInfo'
import PointInfo from './components/PointInfo'
import CemsDeviceInfo from './components/CemsDeviceInfo'
import CemsModelInfo from './components/CemsModelInfo'
import ReferenceInstruList  from './components/ReferenceInstruList'


const namespace = 'pollutantQuery'
const dvaPropsData =  ({ loading,pollutantQuery,global }) => ({

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

const filteredHandle = (filters)=>{
    
  let obj = {}
  for(let key in filters){
    if(filters&&filters[key]){
      obj[key] =  filters[key].toString()
    }
   
   }
   return obj;
} 
const Index = (props) => {

  return (
    <div  className={styles.pollutantQuerySty}>
    <BreadcrumbWrapper>
    <Tabs tabPosition='left'>
          <TabPane tab="企业信息" key="1">
          <EntInfo props/>
          </TabPane>
          <TabPane tab="点位信息" key="2">
          <PointInfo props filteredHandle={filteredHandle}/>
          </TabPane>
          <TabPane tab="CEMS设备信息" key="3">
            <CemsDeviceInfo props />
          </TabPane>
          <TabPane tab="CEMS型号信息" key="4">
            <CemsModelInfo props filteredHandle={filteredHandle}/>
          </TabPane>
          <TabPane tab="参数仪器设备信息" key="5">
            <ReferenceInstruList props filteredHandle={filteredHandle}/>
          </TabPane>
        </Tabs>
   </BreadcrumbWrapper>


        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);