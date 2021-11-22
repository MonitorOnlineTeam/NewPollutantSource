/**
 * 功能：标题组件
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

  
  const { showBtn, type,btnCheck,btnClick,dataType } = props;
  const btnArr = type =='plan'? [{name:"巡检",key:1}, {name:"校准",key:2}] : [{name:"近7日",key:1}, {name:"近30日",key:2}]
  return (
    <div className={styles.cardHeaderSty}>
          <span  className={styles.titleTextSty}>{props.title}</span>
          <img  className={styles.titleImgSty} src='/title_bg2.png'/>
          {showBtn?
          <div className={styles.titleBtn}>
            {btnArr.map(item=>{
              return <span onClick={()=>{btnClick(item.key,type)}} className={btnCheck==item.key&&styles.titleCheckSty}>{item.name}</span>
            })}
          </div> : null}
    </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);