/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag,Spin,Empty, Typography,Tree,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
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
import QueList from './QueList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';


const { TextArea,Search, } = Input;
 
const { Option } = Select;

const namespace = 'helpCenter'


const dvaPropsData =  ({ loading,helpCenter }) => ({
  questTypeTreeData:helpCenter.questTypeTreeData,
  treeLoading: loading.effects[`${namespace}/getHelpCenterList`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getHelpCenterList:(payload,callback)=>{ //左侧问题数
      dispatch({
        type: `${namespace}/getHelpCenterList`,
        payload:payload,
        callback:callback,
      })
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();







  
  
  
  const  { questTypeTreeData,treeLoading,questionListData, questionListTotal, } = props; 

  const [selectedKey ,setSelectedKey ] = useState([])
  useEffect(() => {
    props.getHelpCenterList({},(data)=>{
        if(data[0]&&data[0].children){
       const selectKey = data[0].children[0].key
       setSelectedKey([selectKey]) //默认选中第一个
       props.updateState({
        questionTypeTitle:`${data[0].title} - ${data[0].children[0].title}`,
        questTypeFirstLevel:data[0].type,
        questTypeSecondLevel:data[0].children[0].type,
       })
      }
    })
  },[]);








  const treeDatas = (data,i,parent)=> {
    if(data&&data.length>0){
      i++;
      return data.map(item=>{
        return {
        ...item,
        selectable:i==1? false : true ,
        parentTitle:parent&&parent.title,
        parentType:parent&&parent.type,
        children:item.children&&item.children.length>0? treeDatas(item.children,i,item) : undefined
      }
     })
    }
  
  }
  






  const onSelect = (selectedKeys, info) => {
    setSelectedKey(selectedKeys)
    const data = info.node;
    props.updateState({
      questionTypeTitle:`${data.parentTitle} - ${data.title}`,
      questTypeFirstLevel:data.parentType,
      questTypeSecondLevel:data.type,
     })
  };

  return (
    <div>
    <BreadcrumbWrapper>
    <Card>
   
     <Row> 
     <Spin spinning={treeLoading}>
      <Tree
      selectedKeys={selectedKey}
      onSelect={onSelect}
      treeData={treeDatas(questTypeTreeData,0)}
      style={{ width: 170 }}
      defaultExpandAll
    />
     </Spin>
       <div style={{width:'calc(100% - 170px)'}}>
        {selectedKey&&selectedKey[0]?  <QueList  /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </div>
     
      </Row>
     
   </Card>
   </BreadcrumbWrapper>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);