/**
 * 功能：通用 资源一览
 * 创建人：jab
 * 创建时间：2024.04.12
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
import LeftContent from './components/LeftContent'
import RightContent from './components/RightContent'
import MapContent from './components/MapContent'
import styles from "./style.less"
import { Item } from 'gg-editor';

const { Option } = Select;

const namespace = 'newestHome'




const dvaPropsData =  ({ loading,newestHome }) => ({

})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ //更新参数
        dispatch({
          type: `${namespace}/updateState`, 
          payload:{...payload},
        }) 
      },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();

  
 const [pollutantType,setPollutantType] = useState('')


  const  {  } = props; 

  useEffect(() => {
  initData()
  },[]);


  const initData = () =>{
    setMinWidth()
  }
  const setMinWidth=(e)=>{  
    document.querySelector("body").setAttribute('style', 'min-width:1500px');
}
  const cancelMinWidth=(e)=>{  
   document.querySelector("body").setAttribute('style', 'min-width:inherit');
  }
 
  const handleResize = (e) =>{
    if( e.target.innerWidth <=1800){
      props.updateState({subjectFontSize:13})
    }else{
      props.updateState({subjectFontSize:14})
    }
  }


  const [scrollTop,setScrollTop] = useState(0)
  const handleScroll=(e)=>{
    //滚动条高度
    setScrollTop(e.srcElement.scrollTop)
  }

  useEffect(() => {
    // let scrollEle = document.querySelector(".homeBreadcrumb");
    // 监听
    // scrollEle.addEventListener("scroll", handleScroll);
    // window.addEventListener("resize", handleResize);

    // 销毁
    return () =>  {
      cancelMinWidth()
      // scrollEle.removeEventListener("scroll", handleScroll);
      // window.removeEventListener("resize", handleResize);
    }
  },[]);
  const [fullScreen,setFullScreen] = useState(false)
  const fullScreenClick = (visible) =>{
     setFullScreen(visible)
  }



  return (
      <div className={styles.resourceOverviewPage}>
        <Row style={{height:'100%'}}>   {/**地图部分 和 地图两侧*/}
          <Col style={{width:445}} className={`leftPageSty ${fullScreen? `mapModalHide`: `mapModalShow` }` }>
             <LeftContent {...props}/>
           </Col>
           <Col  style={{width:'calc(100% - 890px)'}} className={'mapPageSty'}>
             <MapContent {...props} fullScreenClick={fullScreenClick}/>
           </Col>
           
           <Col style={{width:445}} className={`rightPageSty ${fullScreen? `mapModalHide`: `mapModalShow` }` }>
            <RightContent {...props}/>
            </Col>
        </Row>  
      </div>  

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);