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
import LeftContent from './LeftContent'
import BottomContent from './BottomContent'
import RightContent from './RightContent'
import styles from "../style.less"

const { Option } = Select;

const namespace = 'newestHome'




const dvaPropsData =  ({ loading,newestHome }) => ({
  tableLoading:newestHome.tableLoading,
  totalDatas:newestHome.totalDatas,
  exportLoading: loading.effects[`${namespace}/exportnewestHomeList`],
  checkName:newestHome.checkName,
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

  const [ hasAsyncData,setHasAsyncData] = useState()
  useEffect(() => {
      getnewestHomeList()
      setHasAsyncData(true)
  },[]);


  const getnewestHomeList = (value) =>{
    props.getnewestHomeList({PollutantType:value},(res)=>{
      setTableDatas(res.notExpired7List)
    })
  }

  const [scrollTop,setScrollTop] = useState(0)
  const handleScroll=(e)=>{
    //滚动条高度
    // console.log(e.srcElement.scrollTop)
    setScrollTop(e.srcElement.scrollTop)
  }


  useEffect(() => {
    let scrollEle = document.querySelector(".homeBreadcrumb");
    // 监听
    scrollEle.addEventListener("scroll", handleScroll);
    // 销毁
    return () =>  scrollEle.addEventListener("scroll", handleScroll);
  },[hasAsyncData]);

  return (
  <BreadcrumbWrapper type='homePage'>
      <div className={styles.homePage}>
        <Row style={{paddingTop:10}}>   {/**地图部分 和 地图两侧*/}
          <Col span={5} className={styles.leftContent}>
             <LeftContent {...props}/>
           </Col>
           <Col span={14} className={styles.mapContent}>
           111
           </Col>
           <Col span={5} className={styles.rightContent}>
            <RightContent {...props}/>
            </Col>
        </Row>  
        <div className={styles.bottomContent}>    {/**底部组件*/}
         <BottomContent {...props}/>
        </div>
      </div>  
   </BreadcrumbWrapper>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);