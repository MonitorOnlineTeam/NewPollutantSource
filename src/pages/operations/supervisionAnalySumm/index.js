/**
 * 功  能：督查分析总结
 * 创建人：jab
 * 创建时间：2022.04.26
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

import Summary from './commpnents/Summary'
import Params from './commpnents/Params'
import TotalSystem from './commpnents/TotalSystem'

const namespace = 'supervisionAnalySumm'




const dvaPropsData =  ({ loading,supervisionAnalySumm,global,common }) => ({
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

  useEffect(() => {
  }, []);

  
  return (
    <div className={styles.supervisionAnalySummSty}>
    <BreadcrumbWrapper>
    <Card>
    <Tabs tabPosition={'left'}>
          <TabPane tab="督查总结" key="1">
            <Summary />
          </TabPane>
          <TabPane tab="关键参数督查管理" key="2">
           <Params />
          </TabPane>
          <TabPane tab="全系统督查汇总" key="3">
           <TotalSystem />
          </TabPane>
        </Tabs>
   </Card>
    </BreadcrumbWrapper>

    </div>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);