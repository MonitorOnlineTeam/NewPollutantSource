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
import styles from "./style.less"
const { Option } = Select;

const namespace = 'newestHome'




const dvaPropsData =  ({ loading,operationExpirePoint }) => ({
  tableLoading:operationExpirePoint.tableLoading,
  totalDatas:operationExpirePoint.totalDatas,
  exportLoading: loading.effects[`${namespace}/exportOperationExpirePointList`],
  checkName:operationExpirePoint.checkName,
})

const  dvaDispatch = (dispatch) => {
  return {
    getOperationExpirePointList : (payload,callback) =>{ //运维到期点位
      dispatch({
        type: `${namespace}/getOperationExpirePointList`,
        payload:payload,
        callback:callback
      })
      
    },
    exportOperationExpirePointList:(payload,callback)=>{ //导出
      dispatch({
        type: `${namespace}/exportOperationExpirePointList`,
        payload:payload,
      })
    },
    updateState:(payload)=>{ //下拉列表测量参数
      dispatch({
        type: `${namespace}/updateState`, 
        payload:{...payload},
      }) 
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();

  const echartsRef = useRef(null);

  
 const [tableDatas,setTableDatas] = useState([])
 const [pollutantType,setPollutantType] = useState('')


  const  { tableLoading,exportLoading,checkName,totalDatas } = props; 

  
  useEffect(() => {
      getOperationExpirePointList()
  },[]);


  const getOperationExpirePointList = (value) =>{
    props.getOperationExpirePointList({PollutantType:value},(res)=>{
      setTableDatas(res.notExpired7List)
    })
  }





  return (
    <div>
    <BreadcrumbWrapper>

   </BreadcrumbWrapper>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);