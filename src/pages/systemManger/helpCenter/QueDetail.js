/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
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

const namespace = 'helpCenter'


const dvaPropsData =  ({ loading,helpCenter }) => ({
  listData:helpCenter.questionListData,
  questionDetialLoading: loading.effects[`${namespace}/getQuestionDetialList`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getQuestionDetialList:(payload,callback)=>{ //列表
        dispatch({
          type: `${namespace}/getQuestionDetialList`,
          payload:payload,
          callback:callback,
        })
      },
  }
}


const Index = (props) => {






  
  
  const  {questionDetialLoading, match:{params:{id}}  } = props; 
  

  const [questionDetail,setQuestionDetail] = useState({QuestionName:'',CreateUserName:'',CreateTime:'',Content:''})
  
  const isMobile = props.match.path &&props.match.path == '/appoperation/appQuestionDetail/:id' ? true : false;

  useEffect(() => {
    props.getQuestionDetialList({},(res)=>{
        const data = res.filter(item=>item.ID == id)
        if(data&&data[0]){
         setQuestionDetail({
             QuestionName:data[0].QuestionName,
             CreateUserName:data[0].CreateUserName,
             CreateTime:data[0].CreateTime,
             Content:data[0].Content,
         })
        }
    })

  },[]);


  return (
    <div className={styles.quesDetailSty} style={{padding:isMobile? 12 : 0,height:isMobile? '100vh': '100%',backgroundColor:'#fff'}}>
         <Spin spinning={questionDetialLoading} active style={{height:isMobile? '100vh':'100%'}}>
       <div style={{textAlign:isMobile? 'center' : 'left',fontWeight:'bold',fontSize:15,}}>{questionDetail.QuestionName}</div>
       <div style={{textAlign:isMobile? 'center' : 'left',color:'rgb(194,194,194)',paddingTop:8}}><span>创建人：{questionDetail.CreateUserName}</span> <span style={{paddingLeft:22}}>创建时间：{questionDetail.CreateTime}</span></div>
       <div style={{paddingTop:12}} dangerouslySetInnerHTML={{__html:questionDetail.Content}}></div> 
       </Spin>
 </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);