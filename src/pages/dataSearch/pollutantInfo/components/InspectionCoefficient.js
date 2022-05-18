

/**
 * 功  能：污染源信息 巡检频次系数
 * 创建人：jab
 * 创建时间：2022.05.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Space, Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,FilterFilled , CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import NumTips from '@/components/NumTips'
import styles from "../style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import tableList from '@/pages/list/table-list';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'pollutantInfo'




const dvaPropsData =  ({ loading,pollutantInfo,global,common, }) => ({
  tableDatas:pollutantInfo.systemModelTableDatas,
  tableTotal:pollutantInfo.systemModelTableTotal,
  tableLoading: loading.effects[`${namespace}/getSystemModelOfPoint`],
  clientHeight: global.clientHeight,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getTableData:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getSystemModelOfPoint`,
        payload:payload,
      })
    },
    
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  


  const  { tableDatas,tableTotal,tableLoading,} = props;
  

  useEffect(() => {
    onFinish()
  },[]);
  const columns = [
    {
        title: '序号',
        align: 'center',
        width:60,
        render:(text,record,index)=>{
          return index+1
        }
      },
      {
        title: '巡检频次',
        dataIndex: 'PollutantTypeName',
        key: 'PollutantTypeName',
        align: 'center',
        width:270,
      },
      {
        title: '系数',
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        width:270,
      },

  ];

 



  const onFinish  =  () =>{  //查询
      props.getTableData({

      })
    
  }









  return (
    <div  className={styles.pollutantInfoSty}>
    <Card title={null}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={false}
      />
   </Card>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);

