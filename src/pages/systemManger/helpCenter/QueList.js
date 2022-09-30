/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm,List,Skeleton, Form,Tag,Spin, Typography,Tree,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
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
import QueDetail from './QueDetail';



const { TextArea,Search, } = Input;
 
const { Option } = Select;

const namespace = 'helpCenter'


const dvaPropsData =  ({ loading,helpCenter }) => ({
  listData:helpCenter.questionListData,
  listDataTotal:helpCenter.questionListTotal,
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



  const [form] = Form.useForm();



  const [helpVisible,sethelpVisible] = useState(false)



  
  
  
  const  { listData,listDataTotal,detailLoading,questionTypeTitle,questTypeFirstLevel,questTypeSecondLevel, } = props; 
  
  const [searchContent,setSearchContent] = useState()
  
  useEffect(() => {
    if(questTypeFirstLevel&&questTypeSecondLevel){
    getQuestionDetialListFun(pageIndex,pageSize,searchContent);
    }
  
  },[questTypeFirstLevel,questTypeSecondLevel,]);

  const [id,setId] = useState()

  const detail = (data) =>{
    sethelpVisible(true)
    setId(data.ID)
  }



  const [listLoading,setListLoading] = useState(false)

   const getQuestionDetialListFun = (pageIndexs,pageSizes,questionName)=>{
      setListLoading(true)
      props.getQuestionDetialList({
        pageIndex:pageIndexs,
        pageSize:pageSizes,
        QuestionName:questionName,
        firstLevel: questTypeFirstLevel,
        secondLevel: questTypeSecondLevel,
      },()=>{setListLoading(false)})
  }
  


  
  const onChange  =  (e) =>{  //查询
    setSearchContent(e.target.value)
  }
  const onSearch  =  (value,e) =>{  //查询
    // console.log(e,e.nativeEvent )
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
    <div className={styles.questListSty}>
        <div>{questionTypeTitle}</div>
      <Search loading={listLoading}  value={searchContent} allowClear style={{padding:'10px 0',width:'50%'}} placeholder="请输入" onChange={onChange} onSearch={onSearch} enterButton />
      <Skeleton loading={listLoading} active>
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
    </Skeleton>
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
       <QueDetail    match={{params:{id: id}}}/> {/*兼容移动端  */}
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);