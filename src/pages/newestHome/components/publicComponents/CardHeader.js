/**
 * 功能：标题组件
 * 创建人：jab
 * 创建时间：2021.11.03
 */
import React, { useState,useEffect,Fragment, useRef,useMemo  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Popover,Radio    } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,RollbackOutlined,QuestionCircleOutlined, } from '@ant-design/icons';
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
  latelyDays30:newestHome.latelyDays30,
  latelyDays7:newestHome.latelyDays7,
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
  const content =  <ul>
  <li>次数：系统按计划派发的工单数量</li>
  <li>计划内结束次数：系统关闭次数、完成次数</li>
  <li>完成率：(计划内完成次数/计划内结束次数) * 100%</li>
  </ul>
  
  const { showBtn, type,btnCheck,btnClick,dataType,latelyDays30,latelyDays7,isPopover, } = props;
  const btnArr = type =='plan'? [{name:"巡检",key:1}, {name:"校准",key:2}] : [{name:"近7日",key:latelyDays7}, {name:"近30日",key:latelyDays30}]
  return (
    <div className={styles.cardHeaderSty}>
          <span  className={styles.titleTextSty}>
          {props.title}
          {isPopover&&<Popover content={content}  overlayClassName={styles.cardPopoverSty} placement="right">
            <QuestionCircleOutlined style={{position:'absolute',right:-18,top:7}}/>
          </Popover>}
          </span>
          <img  className={styles.titleImgSty} src='/title_bg2.png'/>
          {showBtn?
          <div className={styles.titleBtn}>
            {btnArr.map(item=>{
              return <span onClick={()=>{btnClick(item.key)}} className={btnCheck==item.key&&styles.titleCheckSty}>{item.name}</span>
            })}
          </div> : null}
    </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);