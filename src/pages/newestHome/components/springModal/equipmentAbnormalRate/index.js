/**
 * 功  能：设备异常
 * 创建人：jab
 * 创建时间：
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;

import moment from 'moment';

import styles from "./style.less"
const { TextArea } = Input;
const { Option } = Select;
import Region from './components/Region'



const dvaPropsData =  ({ loading,equipmentAbnormalRate }) => ({

})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },

  }
}
const Index = (props) => {

  
  


  useEffect(()=>{

  },[])



 


  return (
    <Modal
    title={props.deviceType==1? "设备完好率" : "设备故障率"}
    wrapClassName='spreadOverModal'
    visible={props.visible}
    footer={false}
    onCancel={props.onCancel}
    destroyOnClose
  >
   <Region {...props}/>

    </Modal>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);