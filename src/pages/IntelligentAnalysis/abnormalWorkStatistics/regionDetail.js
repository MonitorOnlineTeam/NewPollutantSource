/**
 * 功  能：异常工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,RollbackOutlined } from '@ant-design/icons';
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
const { TextArea } = Input;
const { Option } = Select;
import RegionDetail from './components/RegionDetail'

const namespace = 'abnormalWorkStatistics'




const dvaPropsData =  ({ loading,abnormalWorkStatistics }) => ({
  tableDatas:abnormalWorkStatistics.tableDatas,
  tableLoading:abnormalWorkStatistics.tableLoading,
  exportLoading: loading.effects[`${namespace}/exportProjectInfoList`],
})

const  dvaDispatch = (dispatch) => {
//   return {
//     updateState:(payload)=>{ 
//       dispatch({
//         type: `${namespace}/updateState`,
//         payload:payload,
//       })
//     },
//     getProjectInfoList:(payload)=>{ //项目管理列表
//       dispatch({
//         type: `${namespace}/getProjectInfoList`,
//         payload:payload,
//       })
//     },
//   }
}
const Index = (props) => {
  const [entForm] = Form.useForm();
  useEffect(() => {
  
  },[]);






  return (
    <div  className={styles.abnormalWorkStatisticsSty}>
    <BreadcrumbWrapper>
    <Card title={'河南省-统计2021-06-01 ~ 2021-08-01内打卡异常工单情况'}>
      <RegionDetail {...props}/>
   </Card>
   </BreadcrumbWrapper>
   
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);