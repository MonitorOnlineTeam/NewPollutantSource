/**
 * 功  能：CEMS型号清单
 * 创建人：jab
 * 创建时间：2022.07.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag,Tabs, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Spin,   } from 'antd';
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
import styles from "./style.less"
import Cookie from 'js-cookie';
import NumTips from '@/components/NumTips'
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
import  ParticleDrift from './components/ParticleDrift'
import  ParticleMatterRefer from './components/ParticleMatterRefer'

const namespace = 'hourCommissionTest'




const dvaPropsData =  ({ loading,hourCommissionTest,commissionTest, }) => ({
  tableDatas:hourCommissionTest.tableDatas,
  tableLoading:loading.effects[`${namespace}/addSystemModel`],

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
const importClick = () =>{

}


const Index = (props) => {




  return (
    <div  className={styles.hourCommissionTestSty}>
    <BreadcrumbWrapper>
    <Card>
    <Tabs defaultActiveKey="1" tabPosition="bottom" >
        <TabPane tab="颗粒物漂移" key="1">
         <ParticleDrift importClick={importClick}/>
        </TabPane>
        <TabPane tab="颗粒物参比" key="2">
          <ParticleMatterRefer />
        </TabPane>
        <TabPane tab="气态污染物漂移" key="3">
          Content of tab 3
        </TabPane>
        <TabPane tab="气态准确度" key="4">
          Content of tab 4
        </TabPane>
        <TabPane tab="响应时间及示值误差" key="5">
          Content of tab 5
        </TabPane>
        <TabPane tab="流速" key="6">
          Content of tab 6
        </TabPane>
        <TabPane tab="温度" key="7">
          Content of tab 7
        </TabPane>
        <TabPane tab="湿度" key="8">
          Content of tab 8
        </TabPane>
        <TabPane tab="监测报告" key="9">
          Content of tab 9
        </TabPane>
      </Tabs>
   </Card>
   </BreadcrumbWrapper>
   

        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);