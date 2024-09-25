/*
 * @Author: outman0611
 * @Date: 2024-09-02 10:15:47
 * @LastEditors: outman0611
 * @LastEditTime: 2024-09-02 10:26:14
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tabs, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,ProfileOutlined,EditOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';

import styles from "./style.less"
import Cookie from 'js-cookie';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

import Category from './commpnents/Category'
import Template from './commpnents/Template'
const namespace = 'siteInspecTempSet'




const dvaPropsData =  ({ loading,siteInspecTempSet,global,common }) => ({

})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getInspectorTypeCode: (payload) => { // 督查类别 下拉列表
      dispatch({
        type: `${namespace}/getInspectorTypeCode`,
        payload: payload,
      })
    },
    }
}




const Index = (props) => {

  useEffect(() => {
    props.getInspectorTypeCode({})
  }, []);

  
  return (
    <div className={styles.supervisionSty}>
    <BreadcrumbWrapper>
    <Card size='small'>
    <Tabs tabPosition={'left'}>
          <TabPane tab="督查类别清单" key="1">
            <Category />
          </TabPane>
          <TabPane tab="督查表模板管理" key="2">
           <Template />
          </TabPane>
        </Tabs>
   </Card>
    </BreadcrumbWrapper>

    </div>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);