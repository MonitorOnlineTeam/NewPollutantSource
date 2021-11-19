/**
 * 功能：首页
 * 创建人：贾安波
 * 创建时间：2021.11.03
 */
import React, { useState,useEffect,Fragment, useRef,useMemo  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Popover,Radio    } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'
import moment from 'moment'
import styles from "../style.less"

const { Option } = Select;

const namespace = 'newestHome'




const dvaPropsData =  ({ loading,newestHome }) => ({
  exportLoading: loading.effects[`${namespace}/exportnewestHomeList`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ //更新参数
        dispatch({
          type: `${namespace}/updateState`, 
          payload:{...payload},
        }) 
      },
    getnewestHomeList : (payload,callback) =>{ //列表
      dispatch({
        type: `${namespace}/getnewestHomeList`,
        payload:payload,
        callback:callback
      })
      
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();

  
 const [tableDatas,setTableDatas] = useState([])
 const [pollutantType,setPollutantType] = useState('')


  const  { tableLoading,exportLoading,checkName,totalDatas } = props; 

  
  useEffect(() => {
      getnewestHomeList()
  },[]);


  const getnewestHomeList = (value) =>{
    props.getnewestHomeList({PollutantType:value},(res)=>{
      setTableDatas(res.notExpired7List)
    })
  }





  return (
        <Row style={{flexFlow:'row nowrap'}} justify='end'> 
          <Col span={8} className={styles.clockAbnormal}>
           </Col>
           <Col span={8} className={styles.consumablesStatistics}>

           </Col>
           <Col span={8} className={styles.deviceAbnormal}>

           </Col>
        </Row>  
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);