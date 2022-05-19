/**
 * 功  能：运维绩效  绩效信息
 * 创建人：jab
 * 创建时间：2022.05.18
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
import styles from "../style.less"

import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

import PersonalShare  from './components/PersonalShare'
import PersonalWorkInfo  from './components/PersonalWorkInfo'

const namespace = 'achievInfo'
const dvaPropsData =  ({ loading,achievInfo,global }) => ({
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
    <div>
    <BreadcrumbWrapper>
  <Card>
    <Tabs tabPosition='left'>
          <TabPane tab="个人分摊套数" key="1">
          <PersonalShare props/>
          </TabPane>
          <TabPane tab='个人工单信息' key="2">
          <PersonalWorkInfo props/>
          </TabPane>
        </Tabs>
   </Card>
   </BreadcrumbWrapper>


        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);