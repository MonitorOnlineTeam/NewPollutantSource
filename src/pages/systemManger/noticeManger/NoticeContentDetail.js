/**
 * 功  能：公告内容详情  移动端
 * 创建人：jab
 * 创建时间：2022.10
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber,Skeleton, Popconfirm,List, Form,Tag,Spin, Typography,Tree,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,RightOutlined, } from '@ant-design/icons';
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



const { TextArea,Search, } = Input;
 
const { Option } = Select;

const namespace = 'noticeManger'


const dvaPropsData =  ({ loading,noticeManger }) => ({
  listData:noticeManger.questionListData,
  noticeContentDetailLoading: loading.effects[`${namespace}/getNoticeContentList`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getNoticeContentList:(payload,callback)=>{ //列表
        dispatch({
          type: `${namespace}/getNoticeContentList`,
          payload:payload,
          callback:callback,
        })
      },
  }
}


const Index = (props) => {






  
  
  const  {noticeContentDetailLoading, match:{params:{id}}  } = props; 
  

  const [noticeContentDetail,setNoticeContentDetail] = useState({NoticeTitle:'',CreateUserName:'',CreateTime:'',Content:''})
  


  useEffect(() => {
    props.getNoticeContentList({},(res)=>{
        const data = res.filter(item=>item.ID == id)
        if(data&&data[0]){
         setNoticeContentDetail({
             NoticeTitle:data[0].NoticeTitle,
             CreateUserName:data[0].CreatUserName,
             CreateTime:data[0].CreateTime,
             Content:data[0].Content,
         })
        }
    })

  },[]);


  return (
    <div className={styles.noticeContentDetailSty} style={{padding:12,height:'100vh',backgroundColor:'#fff'}}>
         <Spin spinning={noticeContentDetailLoading} active style={{height: '100vh'}}>
       <div style={{textAlign:'center',fontWeight:'bold',fontSize:15,}}>{noticeContentDetail.NoticeTitle}</div>
       <div style={{textAlign:'left',color:'rgb(194,194,194)',paddingTop:8}}> <span>创建时间：{noticeContentDetail.CreateTime}</span></div>
       {/* <div style={{textAlign:'center',color:'rgb(194,194,194)',paddingTop:8}}><span>创建人：{noticeContentDetail.CreateUserName}</span> <span style={{paddingLeft:22}}>创建时间：{noticeContentDetail.CreateTime}</span></div> */}
       <div style={{paddingTop:12}} dangerouslySetInnerHTML={{__html:noticeContentDetail.Content}}></div> 
       </Spin>
 </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);