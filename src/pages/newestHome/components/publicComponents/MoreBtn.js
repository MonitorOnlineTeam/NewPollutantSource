/**
 * 功能：更多按钮组件
 * 创建人：贾安波
 * 创建时间：2021.11.19
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
import styles from "../../style.less"
const { Option } = Select;

const namespace = 'newestHome'




const dvaPropsData =  ({ loading,newestHome }) => ({

})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ //更新代码
      dispatch({
        type: `${namespace}/updateState`, 
        payload:{...payload},
      }) 
    },
  }
}
const Index = (props) => {






  
  useEffect(() => {
  
  },[]); 

  
  const { style,moreBtnClick,type,className } = props;

  return (
      <Row justify='end' className={`${styles.moreBtnSty} ${className}` } style={style} >
    <Button type="primary" ghost onClick={()=>{moreBtnClick(type)}} >
      更多 >
    </Button>
    </Row>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);