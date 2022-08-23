/**
 * 功  监测点导航树
 * 创建人：jsb
 * 创建时间：2022.08.23
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,CaretLeftFilled,CaretRightFilled, CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import NumTips from '@/components/NumTips'
import settingDrawer from '@/locales/en-US/settingDrawer';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'hourCommissionTest'




const dvaPropsData =  ({ loading,hourCommissionTest,global }) => ({
  treeList:hourCommissionTest.treeList,
  treeLoading:loading.effects[`${namespace}/addSystemModel`],

})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getEquipmentInfoList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getEquipmentInfoList`,
        payload:payload,
      })
    },
  }
}
const Index = (props) => {

    const [form] = Form.useForm();



  const  { treeList,treeLoading,} = props; 
  useEffect(() => {

  },[]);

  
 const  treeLoop =(list,level = 1,)=>{
    for (let i = 0; i < list.length; i ++) {
        const key = list[i].ID;
        return {
          title:<div style={{display:'inline-block'}}> {list[i].ManufacturerName }</div>,
          key,
          icon: level==1? <EntIcon  style={{color:'#1890ff'}}/> :  <PointIcon  style={{color:'#1890ff'}}/>,
          children:treeLoop(list[i].children,level + 1 ,)
        };
      }
 }
  
  const treeDatas = treeLoop(treeList);
  const onValuesChange = (hangedValues, allValues) => {
      const values = form.getFieldsValue();

    // if (Object.keys(hangedValues).join() == 'RegionCode') {
    // }
  }

  return (
    <div>
    <Drawer
          placement={'left'}
          closable={false}
          visible={props.drawerVisible}
          width={ 320}
          mask={false}
          keyboard={false}
          zIndex={1}
          onClose={props.onClose} 
          bodyStyle={{ padding: '18px 8px' }}
          style={{
            marginTop: 64,
          }}
          
        >
                <Form
            form={form}
            name="advanced_search"
            initialValues={{}}
            className={styles["ant-advanced-search-form"]}
            onValuesChange={onValuesChange}

        >
       <Form.Item  name="RegionCode">
         <RegionList style={{width:'100%'}}/>
         </Form.Item>
         <Form.Item  name="Status">
         <Select placeholder='完成状态' allowClear>
          <Option> </Option>
         </Select>
         </Form.Item>
         <Form.Item  name="EntName">
             <Input placeholder='企业名称' allowClear/>
         </Form.Item>
         </Form>
         {treeLoading?
        <PageLoading />
         :
         <>
        {treeList.length? 
          <Tree selectedKeys={[]}  blockNode  showIcon  onSelect={props.onSelect}  treeData={treeDatas()} height={props.clientHeight - 64 - 20}  defaultExpandAll />
          :
        <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </>
        }
    </Drawer>
      <div  onClick={props.arrowClick} style={{position:'absolute',zIndex:999,left:props.drawerVisible? 'calc(320px - 24px)' : -24,top:'50vh', background:"#1890ff",cursor:'pointer',padding:'5px 0',borderRadius:'0 2px 2px 0',transition:'all .2s'}}> { props.drawerVisible?<CaretLeftFilled style={{color:'#fff'}}/> : <CaretRightFilled style={{color:'#fff'}}/>}</div>
 </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);