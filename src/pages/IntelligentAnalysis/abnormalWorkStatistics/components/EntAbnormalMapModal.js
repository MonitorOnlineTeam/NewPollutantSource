/**
 * 功  能：打卡异常  监测点地图弹框 
 * 创建人：jab
 * 创建时间：2022.10.25
 */
import React, { useState,useEffect,Fragment ,useRef,useImperativeHandle,forwardRef } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,EnvironmentFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { 
  DelIcon, DetailIcon, EditIcon,PointIcon, Left, GasOffline,
  GasNormal,
  GasExceed,
  GasAbnormal,
  WaterIcon,
  WaterNormal,
  WaterExceed,
  WaterAbnormal,
  WaterOffline } from '@/utils/icon'


import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import config from '@/config';
// import { Map, MouseTool, Marker,Markers, Polygon,Circle } from '@/components/ReactAmap';
import { Map, MouseTool, Marker,Markers, Polygon,Circle } from 'react-amap';
const namespace = 'abnormalWorkStatistics'




const dvaPropsData =  ({ loading,abnormalWorkStatistics }) => ({
  entAbnormalNumVisible:abnormalWorkStatistics.entAbnormalNumVisible,
  queryPar:abnormalWorkStatistics.queryPar,
  getPointExceptionLoading:abnormalWorkStatistics.getPointExceptionLoading,
  entAbnormalList:abnormalWorkStatistics.entAbnormalList,
  taskList:abnormalWorkStatistics.taskList,
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

  const  { queryPar  } = props; 
  useEffect(() => {
  
  
    },[]);


 const  getWaterIcon = status => {
    let icon = '';
    switch (status) {
      case 0: // 离线
        icon = <WaterOffline />;
        break;
      case 1: // 正常
        icon = <WaterNormal />;
        break;
      case 2: // 超标
        icon = <WaterExceed />;
        break;
      case 3: // 异常
        icon = <WaterAbnormal />;
        break;
    }
    return icon;
  };

  const getGasIcon = status => {
    let icon = '';
    switch (status) {
      case 0: // 离线
        icon = <GasOffline />;
        break;
      case 1: // 正常
        icon = <GasNormal />;
        break;
      case 2: // 超标
        icon = <GasExceed />;
        break;
      case 3: // 异常
        icon = <GasAbnormal />;
        break;
    }
    return icon;
  };
  


  const  { entAbnormalList,getPointExceptionLoading,taskList,abnormalTitle,noPoint,entAbnormalNumVisible, }  = props; 

  const renderMarker = (extData) =>{
    return <div>
            
  <Row style={{whiteSpace:"nowrap",padding:5,background:'#fff',marginBottom:5,marginLeft:-58}}>{extData.position.checkInTime}</Row>
           <img src='/location.png' style={{width:24}}/>
           </div>
  }

 const entMap = () =>{
  const styleA= {
    position: 'absolute',
    top: 0,
    padding: 5,
    color: '#fff',
    backgroundColor: "rgba(0,0,0,.4)"
}
   const styleB = {
    position: 'absolute',
    bottom: 0,
    padding: 5,
    color: '#fff',
    backgroundColor: "rgba(0,0,0,.4)"
}
if (getPointExceptionLoading) {
  return (<Spin
    style={{
      width: '100%',
      height: 'calc(100vh/2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    size="large"
  />);
}
  return <div style={{width: '100%', height: 'calc(100vh - 112px)'}}>
    <Map
   amapkey={config.amapKey}
  //  mapStyle="amap://styles/macaron"
   useAMapUI={!config.offlineMapUrl.domain}
   center={{longitude: entAbnormalList.longitude, latitude: entAbnormalList.latitude} } //center 地图中心点坐标值
   zoom={11}
 >
        <Markers markers={taskList? taskList : []} render={taskList? renderMarker : ''}  />
        {/*企业监测点 */}
        <Marker position={{longitude: entAbnormalList.longitude, latitude: entAbnormalList.latitude}} >
        <div style={{textAlign:'center',}}>
          <div style={{whiteSpace:"nowrap",padding:'0 5px',background:'#fff',position:'absolute',transform: 'translateX(calc(-50% + 10px))'}}>
            {entAbnormalList.pointName}
          </div>
                <div style={{display:'inline-block',marginTop:28}}> {entAbnormalList.pollutantType ==1 ?getWaterIcon(1) : getGasIcon(1)} </div>
          </div> 
        </Marker>

        {/*半径 */}
         <Circle 
            center={ { longitude:  entAbnormalList.longitude, latitude:entAbnormalList.latitude} } 
            radius={ Number(entAbnormalList.operationRadius) }
            style={  {fillColor:"rgba(60,147,147,.1)", strokeColor: '#86befe',strokeWeight : 1}}
          />

      <div style={styleA}>
        <span>{abnormalTitle}</span>
        </div>
           <div  style={styleB}>
          <Row align='middle'>
              <img src='/location.png' style={{width:18}}/>
               <span style={{paddingLeft:5}}>打卡位置及时间</span></Row>
        </div>
   </Map>

   </div>  

  }

  return (
      <div>
  <Modal
        title={ '' } 
        visible={entAbnormalNumVisible}
        onCancel={()=>{ props.updateState({entAbnormalNumVisible:false,entAbnormalList:[],taskList:[]});props.onCancel(); }}
        footer={null}
        destroyOnClose 
        wrapClassName="spreadOverModal"
      > 
       {entAbnormalNumVisible&&entMap()}
   </Modal>
        </div>
  );
};;


export default connect(dvaPropsData,dvaDispatch)(Index);