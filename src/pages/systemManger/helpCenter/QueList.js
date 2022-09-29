/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm,List, Form,Tag,Spin, Typography,Tree,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
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
  listDataTotal:helpCenter.questionListTotal,
  listLoading: loading.effects[`${namespace}/getQuestionDetialList`],
  questionTypeTitle:helpCenter.questionTypeTitle,
  questTypeFirstLevel:helpCenter.questTypeFirstLevel,
  questTypeSecondLevel:helpCenter.questTypeSecondLevel,

})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getQuestionDetialList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getQuestionDetialList`,
        payload:payload,
      })
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();



  const [helpVisible,sethelpVisible] = useState(false)



  
  
  
  const  { listData,listDataTotal,listLoading,detailLoading,questionTypeTitle,questTypeFirstLevel,questTypeSecondLevel, } = props; 
  
  const [searchContent,setSearchContent] = useState()
  
  useEffect(() => {
    getQuestionDetialListFun(pageIndex,pageSize,searchContent);
  
  },[questTypeFirstLevel,questTypeSecondLevel,]);


  const detail = (data) =>{
    sethelpVisible(true)

  }


  const [questionTitle,setQuestionTitle] = useState('问题标题')

   const getQuestionDetialListFun = (pageIndexs,pageSizes,questionName)=>{
      props.getQuestionDetialList({
        pageIndex:pageIndexs,
        pageSize:pageSizes,
        QuestionName:questionName,
        firstLevel: questTypeFirstLevel,
        secondLevel: questTypeSecondLevel,
      })
  }
  


  
  const onChange  =  (e) =>{  //查询
    setSearchContent(e.target.value)
  }
  const onSearch  =  (value) =>{  //查询
    getQuestionDetialListFun(pageIndex,pageSize,value);
  }
  const [pageIndex,setPageIndex] = useState(1)
  const [pageSize,setPageSize] = useState(20)
  const handleListChange = (PageIndex,PageSize )=>{ //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    getQuestionDetialListFun(PageIndex,PageSize)
  }
  
 


 
  return (
    <div>
      <Spin spinning={listLoading}>
        <div>{questionTypeTitle}</div>
      <Search loading={listLoading}  value={searchContent} allowClear style={{padding:'10px 0',width:'50%'}} placeholder="请输入" onChange={onChange} onSearch={onSearch} enterButton />
  
      <List
    itemLayout="vertical"
    size="default"
    pagination={listDataTotal&&listDataTotal>0&&{
        total:listDataTotal,
        pageSize: pageSize,
        current: pageIndex,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: handleListChange,
        size:'small',
      }}
    dataSource={listData}
    renderItem={(item) => (
      <List.Item
        key={item.title}
        extra={ <RightOutlined style={{color:'rgb(194,194,194)'}}/>  }
        onClick={()=>detail(item)}
        style={{cursor:'pointer'}}
      >
        {item.content}
      </List.Item>
    )}
  />
  </Spin>
   <Modal
        title={questionTypeTitle}
        visible={helpVisible}
        confirmLoading={detailLoading}
        onCancel={()=>{sethelpVisible(false)}}
        className={styles.helpCenterModal}
        destroyOnClose
        width='70%'
        footer={null}
      >
       <div style={{textAlign:'center'}}>{questionTitle}</div>
       <div style={{textAlign:'center',color:'rgb(194,194,194)',paddingTop:8}}><span>创建人：{questionTitle}</span> <span style={{paddingLeft:24}}>创建时间：{questionTitle}</span></div>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);