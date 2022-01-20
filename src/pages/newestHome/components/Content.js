/**
 * 功能：首页
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
import LeftContent from './LeftContent'
import BottomContent from './BottomContent'
import RightContent from './RightContent'
import MapContent from './MapContent'
import styles from "../style.less"
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
    document.querySelector("body").setAttribute('style', 'min-width:1800px');
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
    // console.log(e.srcElement.scrollTop)
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
  // <BreadcrumbWrapper  hideBreadcrumb>

      <div className={styles.homePage}>
        <Row style={{paddingTop:10,height:'100%'}}>   {/**地图部分 和 地图两侧*/}
          <Col span={5} className={`${fullScreen? `${styles.leftContent} ${styles.mapModalHide}`: `${styles.leftContent} ${styles.mapModalShow}` }` }>
             <LeftContent {...props}/>
           </Col>
           <Col span={14} className={styles.mapContent}>
             <MapContent {...props} fullScreenClick={fullScreenClick}/>
           </Col>
           
           <Col span={5} className={`${fullScreen? `${styles.rightContent} ${styles.mapModalHide}`: `${styles.rightContent} ${styles.mapModalShow}` }` }>
            <RightContent {...props}/>
            </Col>
        </Row>  
        <div className={styles.bottomContent} style={{display: fullScreen? 'none' :''}}>    {/**底部组件*/}
         <BottomContent {...props} />
        </div>
      </div>  
  //  </BreadcrumbWrapper>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);