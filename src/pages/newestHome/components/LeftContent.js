/**
 * 功能：首页 左侧内容
 * 创建人：贾安波
 * 创建时间：2021.11.08
 */
import React, { useState,useEffect,Fragment, useRef,useMemo  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Popover,Radio,Spin    } from 'antd';
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
import styles from "../style.less"
import CardHeader from './publicComponents/CardHeader'
import ScrollTable from './publicComponents/ScrollTable'
import MoreBtn from './publicComponents/MoreBtn'
import PlanWorkOrderStatistics from './springModal/planWorkOrderStatistics'
import EntWorkOrderModal from '@/pages/IntelligentAnalysis/operationWorkStatis/homeEntWorkOrderStatistics/EntWorkOrderModal'
import OperatingInfo from './springModal/operatingInfo'

const { Option } = Select;

const namespace = 'newestHome'

// const subjectFontSize = 14;



const dvaPropsData =  ({ loading,newestHome }) => ({
  operationLoading:loading.effects[`${namespace}/GetOperatePointList`],
  operationDataSource:newestHome.operationDataSource,
  operationTaskLoading:loading.effects[`${namespace}/GetOperationTaskList`],
  operaOrderData:newestHome.operaOrderData,
  operationPlanTaskLoading:loading.effects[`${namespace}/GetOperationPlanTaskRate`],
  planOperaList:newestHome.planOperaList,
  planCompleteListLoading:loading.effects[`${namespace}/GetOperationRegionPlanTaskRate`],
  planCompleteList:newestHome.planCompleteList,
  latelyDays30:newestHome.latelyDays30,
  pollType:newestHome.pollType,
  subjectFontSize:newestHome.subjectFontSize
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ //更新参数
      dispatch({
        type: `${namespace}/updateState`, 
        payload:{...payload},
      }) 
    },
    GetOperatePointList:(payload)=>{ //运营信息总览
      dispatch({
        type: `${namespace}/GetOperatePointList`, 
        payload:{...payload},
      }) 
    },
    GetOperationTaskList:(payload)=>{ //运维工单统计
      dispatch({
        type: `${namespace}/GetOperationTaskList`, 
        payload:{...payload},
      }) 
    },
    GetOperationPlanTaskRate:(payload)=>{ //近30日运维情况
      dispatch({
        type: `${namespace}/GetOperationPlanTaskRate`, 
        payload:{...payload},
      }) 
    },
    GetOperationRegionPlanTaskRate:(payload)=>{ //计划完成率
      dispatch({
        type: `${namespace}/GetOperationRegionPlanTaskRate`, 
        payload:{...payload},
      }) 
    },
    entWorkOrderStatistics:(payload)=>{ //运维工单统计弹框
      dispatch({
        type: `entWorkOrderStatistics/GetOperationRegionPlanTaskRate`, 
        payload:{...payload},
      }) 
    }
  }
  
}
const Index = (props) => {




const { operaOrderData,latelyDays30,pollType,subjectFontSize } = props;


  
  useEffect(() => {
    initData()
  },[]);
  const pollutantType = pollType[props.type]
  const  initData = () =>{
    props.GetOperatePointList({ //运营监测点信息
      pollutantType: pollutantType,
    })
    props.GetOperationTaskList({ //运维工单统计
      pollutantType: pollutantType,
      ...latelyDays30
    })
    props.GetOperationPlanTaskRate({ //计划运维情况
      pollutantType: pollutantType,
      ...latelyDays30
    })
    getOperationRegionPlanTaskRate(1) //计划完成率
    
  }
  const getOperationRegionPlanTaskRate = (taskType) =>{
    props.GetOperationRegionPlanTaskRate({ //计划完成率
      pollutantType: pollutantType,
      taskType: taskType,
      ...latelyDays30
    })
  }

   const [planBtnCheck,setPlanBtnCheck] = useState(1)  
   const btnClick = (key,datatype) =>{ //计划完成率  切换
     setPlanBtnCheck(key)
     getOperationRegionPlanTaskRate(key)
    }
  const operationColumns =  [
    {
      title: '统计类别',
      dataIndex: 'type',
      key: 'type',
      align:'center',
      width:61,
    },
    {
      title: '运营企业',
      dataIndex: 'entCount',
      key: 'entCount',
      align:'center',
      width:61,
      render: (text, record) => {
        return <span style={{cursor:'pointer'}} onClick={()=>{operatingInfo('ent',record)}}>{text}</span>
      }
    },
    {
      title: '排放口',
      dataIndex: 'disPointCount',
      key: 'disPointCount',
      align:'center',
      width:61,
      render: (text, record) => {
        return <span style={{cursor:'pointer'}} onClick={()=>{operatingInfo('point',record,0)}}>{text}</span>
      }
    },
    {
      title: '非排放口',
      dataIndex: 'unDisPointCount',
      key: 'unDisPointCount',
      align:'center',
      width:61,
      render: (text, record) => {
        return <span  style={{cursor:'pointer'}} onClick={()=>{operatingInfo('point',record,1)}}>{text}</span>
      }
    },
  ]
  const changeBarData = (data)=>{
    let max = 0, bgBarData = [];
    data.map(item=>{
      if (max < Number(item)) max = item;
    })

    data.map(item=>{
       bgBarData.push(max)
    })
    return bgBarData;
  }
  const  bagBarData = changeBarData(operaOrderData);

  const operaOrderOption = {  //运维工单图表
    tooltip: { show:false },
    grid: { top:0,left: 80, right: 65, bottom: 0,},
    xAxis: { show:false,  type: 'value'},
    yAxis: {
        type: 'category',
        data: [ '配合比对', '配合检查','参数核对','校验测试','维护','维修','校准','巡检', ],
        axisLine: { show: false},
        axisTick: {show: false  },
        axisLabel: {  margin:80, textStyle: { color: '#fff',fontSize:subjectFontSize,align:'left'},   
      },       
    },
    series: [
      {
        type: 'bar', //显示背景图 
        data: bagBarData,
        label: {
          normal: {
          show: true,
          position:"right",
          //通过formatter函数来返回想要的数据
          formatter:function(params){
            for(let i=0;i<operaOrderData.length;i++){
              if(params.dataIndex==i){
               return `${operaOrderData[i]}次`;
             }
            }
           },
           fontSize:subjectFontSize,
           color: '#4BF3F9',
           padding : [0, 0, 0, 5],
          },
        },
        itemStyle:{ normal:{color: '#2f3648', barBorderRadius: [15, 15, 15 ,15] },},
        barWidth: '50%',  // 柱形的宽度
        barGap: '-100%', // Make series be ove
        silent: true, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。  为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面 
        barMinHeight:215,
      },
        {
            type: 'bar',
            data: operaOrderData,
            label: {  normal: { show: false, }},
            itemStyle:{
             normal:{
              color: {
                type: 'linear', // 线性渐变
                x: 0,  y: 0, x2: 1, y2: 0,
               colorStops: [{
                offset: 0,
                color: '#298CFB' // 0%处的颜色为红色
                 }, {
                offset: 1,
                color: '#29D6FB' // 100%处的颜色为蓝
               }],
              },
               barBorderRadius: [15, 15, 15 ,15]
             },
            },
            barWidth: '50%',   // 柱形的宽度
        },

                        
    ]
};
 
const planOperaText = (type) =>{
switch(type){
  case 1 :
    if(planOperaList.inspectionRate=="-"){
     return '-'
    }else{
      return `${planOperaList.inspectionRate}%`
    }
  break;
  case 2 :
    if(planOperaList.autoCalibrationRate=="-"){
     return '-'
    }else{
      return `${planOperaList.autoCalibrationRate}%`
    }
  break;
  
}
}
 const { planOperaList } = props;

 const planOperaOption = (type) => {  //计划运维图表
  let color1 = ["#3DBDFF", "#323A70"], color2 = ["#FFDD54", '#323A70'],color3 = ['#F66080', '#323A70']
  let option = {
    tooltip: {
      show: false,
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    color: type == 1 ? color1 : type == 2 ? color2 : color3,
    title: {
      text: planOperaText(type),
      left: "center",
      top: "48%",
      textStyle: {
        color: type == 1 ? color1[0] : type == 2 ? color2[0] : color3[0],
        fontSize: 16,
        align: "center",
        fontWeight: 'bold',
      },
    },
    graphic: {
      type: "text",
      left: "center",
      top: "38%",
      style: {
        text: type == 1 ?'巡检完成率' :'校准完成率',
        textAlign: "center",
        fill: "#fff",
        fontSize: 12,
      }
    },
    series: [
      {
        name: type == 1 ? '计划巡检完成率' : type == 2 ? '计划校准完成率' : '实际校准完成率',
        type: 'pie',
        radius: ['70%', '80%'],
        avoidLabelOverlap: false,
        label: { normal: { show: false, position: 'center'  }, },
        data: [
          { value: type == 1 ? `${planOperaList.inspectionRate} `: type == 2 ? planOperaList.autoCalibrationRate : planOperaList.actualCalibrationRate, name: '已完成' },
          { value: type == 1 ? (100 - `${planOperaList.inspectionRate=='-'? 100 : planOperaList.inspectionRate  }`) : type == 2 ? (100  - `${planOperaList.autoCalibrationRate=='-'? 100 : planOperaList.autoCalibrationRate  }`) : (100 - `${planOperaList.actualCalibrationRate=='-'? 100 : planOperaList.actualCalibrationRate  }`), name: '未完成' },
        ],
        startAngle:330, //起始角度
      }
    ]
  };
  return option;
}


const planCalibration = () =>{  //计划校准弹框
 
  setPlanCalibrationVisible(true)
}

const  planInspection = () =>{ //计划巡检弹框
  setPlanInspectionVisible(true)
}

const actualCalibration = () =>{  //实际校准弹框
 
  setActualInspectionVisible(true)
}

const moreBtnClick = (type) =>{ //近30日运维工单
  switch(type){
    case "operaOrder" :
    setOrderModalVisible(true)
    break;
    // case "planComplete" : //计划完成率
    // setTVisible(true)
    // break;
  }
}
 
const [operatingInfoType, setOperatingInfoType] = useState()
const [operatingStatus, setOperatingStatus] = useState(1)
const [outputType, setOutputType] = useState(undefined)

const operatingInfo = (type,record,outputType) =>{
  setOperatingInfoVisible(true)
  setOperatingInfoType(type)
  setOutputType(outputType) //排口类型
  record.type==='运维中'? setOperatingStatus(1) : record.type==='运维暂停'? setOperatingStatus(2) : setOperatingStatus(undefined);
}


const planOperaEcharts = useMemo(()=>{ //监听变量，第一个参数是函数，第二个参数是依赖，只有依赖变化时才会重新计算函数
  return <div style={{height:'100%', padding:'5px 0 10px 21px'}}> {/**当图表有点击事件时 更新更新页面时  图表抖动 */}
   <Row type='flex'  align='middle'>    
     <ReactEcharts
       option={planOperaOption(1)} 
       style={{ width: 105, height: 105 }}
       onEvents={{click: planInspection }}
     />
     <img  style={{padding:'0 24px'}} src='./homePlanSplitLine.png' />
     <div  className={styles.planOperaText} >
       <div>计划内次数：<span style={{color:'#3DBDFF'}}>{planOperaList.inspectionAllCount}</span></div>
       <div>计划内完成次数：<span style={{color:'#3DBDFF'}}>{planOperaList.inspectionCompleteCount}</span></div>
       <div style={{color:'#4BF3F9'}}>计划外完成次数：<span style={{color:'#4BF3F9'}}>{planOperaList.inspectionOutCompleteCount }</span> </div>
    </div>
   </Row>
     <div style={{ width:'100%', height: 1,marginLeft:-21, background:"rgba(65, 66, 69, 0.5)"}}></div>
     <Row type='flex'  align='middle'>    
     <ReactEcharts
       option={planOperaOption(2)} 
       style={{ width: 105, height: 105 }}
       onEvents={{click: planCalibration }}
     />
     <img style={{padding:'0 24px'}} src='./homePlanSplitLine.png' />
     <div className={styles.planOperaText} >
       <div>计划内次数：<span style={{color:'#FFDD54'}}>{planOperaList.autoCalibrationAllCount}</span></div>
       <div>计划内完成次数：<span style={{color:'#FFDD54'}}>{planOperaList.autoCalibrationCompleteCount}</span></div>
       <div style={{color:'#4BF3F9'}}>计划外完成次数：<span style={{color:'#4BF3F9'}}>{planOperaList.autoCalibrationOutCompleteCount  }</span> </div>
    </div>
   </Row>
   {/* <Col span={8} align='middle'>
       <ReactEcharts
         option={planOperaOption(3)}
         style={{ width: '100%', height: 120 }}
         onEvents={{click: actualCalibration }}
       />
      <div className={styles.planOperaText}> <div  style={{fontWeight:'bold'}}>实际校准完成率</div><div>计划内次数： {planOperaList.autoCalibrationAllCount}</div> <div>完成次数： {planOperaList.actualCalibrationCount}</div></div>
   </Col> */}
   </div>
},[planOperaList])
  
 const   cancel=()=>{
  props.entWorkOrderStatistics({
    payload: {
      initialForm: {
        Time:[moment().subtract(30, "days").startOf("day"), moment().endOf("day")],
        RegionCode:undefined,
        AttentionCode:undefined,
        PollutantTypeCode:'1',
        },
    },
});

}

  pollutantType == 1 &&operationColumns.splice(2,2,{
      title: '监测点',
      dataIndex: 'allPointCount',
      key: 'allPointCount',
      align:'center',
      width:61,
      render: (text, record) => {
        return <span style={{cursor:'pointer'}} onClick={()=>{operatingInfo('point',record)}}>{text}</span>
      }
  })
  const  { operationLoading,operationDataSource } = props; {/**运营信息总览 */}
  const  { operationTaskLoading } = props; {/**近30日运维工单 */}
  const  { operationPlanTaskLoading } = props; {/**近30日运维情况 */}
  const  { planCompleteList,planCompleteListLoading } = props;{/**计划完成率 */}
  const  [planCalibrationVisible,setPlanCalibrationVisible ]  = useState(false)
  const  [planInspectionVisible,setPlanInspectionVisible] = useState(false)
  const  [actualInspectionVisible,setActualInspectionVisible] = useState(false)
  const  [orderModalVisible,setOrderModalVisible] = useState(false)
  const  [operatingInfoVisible,setOperatingInfoVisible ] = useState(false)
  return (
    <div>
      <Spin spinning={operationLoading}>
         <div className={styles.pointSty}> 
           <CardHeader  title='运营信息总览'/>  
          <Table  style={{padding:'16px 15px 0 0'}}  columns={operationColumns} dataSource={operationDataSource} pagination={false}/>
         </div>
         </Spin>

         <Spin spinning={operationTaskLoading}>
         <div className={styles.operaOrder}>
           <CardHeader  title='近30日运维工单'/>
           <div style={{height:'100%', padding:'20px 10px 0 0'}}>     
           <ReactEcharts 
              option={operaOrderOption}
              style={{height:'calc(100% - 44px )',width:'100%'}}
             />
             <MoreBtn style={{padding:'8px 10px 0'}}  type='operaOrder' moreBtnClick={moreBtnClick}/>   
            </div>
          </div>
          </Spin>

          <Spin spinning={operationPlanTaskLoading}> {/**近30日运维情况 */}
          <div className={styles.planOpera }>
           <CardHeader  title='近30日运维情况'/>
            {planOperaEcharts}
          </div>
          </Spin>

          <Spin spinning={planCompleteListLoading}>
          <div className={styles.planComplete}>
           <CardHeader  btnClick={btnClick} datatype='planComplete' showBtn type='plan' btnCheck={planBtnCheck} title='近30日运维排名'/>
           <div style={{height:'100%', padding:'21px 18px 0 0'}}>
            {!planCompleteListLoading&&<ScrollTable data={[...planCompleteList,]}  column={[]} />}
           {/* <MoreBtn style={{paddingTop:10}} type='planComplete' moreBtnClick={moreBtnClick}/> */}
           </div>
          </div>
          </Spin>
      
       <PlanWorkOrderStatistics  //计划校准完成率弹框
        modalType="planCalibration"
        visible={planCalibrationVisible}
        type={pollutantType}
        onCancel={()=>{setPlanCalibrationVisible(false)}}
        time={[moment(latelyDays30.beginTime),moment(latelyDays30.endTime)]}
      />  
         <PlanWorkOrderStatistics  //计划巡检完成率弹框
        modalType="planInspection"
        visible={planInspectionVisible}
        type={pollutantType}
        onCancel={()=>{setPlanInspectionVisible(false)}}
        time={[moment(latelyDays30.beginTime),moment(latelyDays30.endTime)]}
      />  
      <PlanWorkOrderStatistics  //实际校准完成率弹框
        modalType="actualCalibration"
        visible={actualInspectionVisible}
        type={pollutantType}
        onCancel={()=>{setActualInspectionVisible(false)}}
        time={[moment(latelyDays30.beginTime),moment(latelyDays30.endTime)]}
      />  
          <EntWorkOrderModal  //近30日运维工单
            showModal={orderModalVisible}
            onCloseListener={ () => { 
                setOrderModalVisible(false)
                cancel();
              }}
            pollutantTypeCode={pollutantType}
          />
         <OperatingInfo  //运营信息总览
             visible={operatingInfoVisible}
             type={pollutantType}
             onCancel={()=>{setOperatingInfoVisible(false)}}
             type={operatingInfoType}
             pollutantType={pollutantType}
             operatingStatus={operatingStatus}
             outputType={outputType}
          />         
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);