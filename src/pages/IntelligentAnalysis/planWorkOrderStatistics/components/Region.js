/**
 * 功  能：异常工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,Fragment,useRef,useImperativeHandle,forwardRef} from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tabs    } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon, Left } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'planWorkOrderStatistics'




const dvaPropsData =  ({ loading,planWorkOrderStatistics,global }) => ({
  tableDatas:planWorkOrderStatistics.tableDatas,
  pointDatas:planWorkOrderStatistics.pointDatas,
  tableLoading:planWorkOrderStatistics.tableLoading,
  tableTotal:planWorkOrderStatistics.tableTotal,
  abnormalTypes:planWorkOrderStatistics.abnormalTypes,
  // exportLoading: loading.effects[`${namespace}/exportProjectInfoList`],
  abnormalLoading:loading.effects[`${namespace}/abnormalExceptionTaskList`],
  abnormalList:planWorkOrderStatistics.abnormalList,
  queryPar:planWorkOrderStatistics.queryPar,
  cityTableDatas:planWorkOrderStatistics.cityTableDatas,
  cityTableLoading:loading.effects[`${namespace}/cityGetTaskWorkOrderList`],
  cityActualTableLoading:loading.effects[`${namespace}/cityActualGetTaskWorkOrderList`],
  cityTableTotal:planWorkOrderStatistics.cityTableTotal,
  regPointTableDatas:planWorkOrderStatistics.regPointTableDatas,
  regPointTableLoading:loading.effects[`${namespace}/regPointGetTaskWorkOrderList`],
  insideOrOutsideWorkLoading:loading.effects[`${namespace}/insideOrOutsideWorkGetTaskWorkOrderList`],
  insideOrOutsideWorkActualLoading:loading.effects[`${namespace}/insideOrOutsideWorkActualGetTaskWorkOrderList`],
  insideOrOutsiderWorkTableDatas:planWorkOrderStatistics.insideOrOutsiderWorkTableDatas,
  insideOrOutsiderWorkTableTotal:planWorkOrderStatistics.insideOrOutsiderWorkTableTotal,
  clientHeight: global.clientHeight,
  cityDetailTableDatas:planWorkOrderStatistics.cityDetailTableDatas,
  cityDetailTableLoading:loading.effects[`${namespace}/cityDetailGetTaskWorkOrderList`],
  cityDetailTableTotal:planWorkOrderStatistics.cityDetailTableTotal,
  dateCol:planWorkOrderStatistics.dateCol,
  regPointTableDatasTotal:planWorkOrderStatistics.regPointTableDatasTotal,
  cityDetailExportLoading:loading.effects[`${namespace}/exportCityDetailTaskWorkList`],
  workRegExportLoading:loading.effects[`${namespace}/workRegExportTaskWorkList`],
  cityRegExportLoading:loading.effects[`${namespace}/cityRegExportTaskWorkList`],
  operaPointExportLoading:loading.effects[`${namespace}/operaPointExportTaskWorkList`],
  exportActualRegDetailLoading:planWorkOrderStatistics.exportActualRegDetailLoading,
  exportActualRegTaskLoading:planWorkOrderStatistics.exportActualRegTaskLoading,
  exportActualRegDetailTaskLoading:planWorkOrderStatistics.exportActualRegDetailTaskLoading,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    regEntGetTaskWorkOrderList:(payload)=>{ // 计划工单统计
      dispatch({
        type: `${namespace}/regEntGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    cityGetTaskWorkOrderList:(payload)=>{ // 计划工单统计 市级别
      dispatch({
        type: `${namespace}/cityGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    regPointGetTaskWorkOrderList:(payload)=>{ // 计划工单统计 运营监测点
      dispatch({
        type: `${namespace}/regPointGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    insideOrOutsideWorkGetTaskWorkOrderList:(payload)=>{ // 计划内or计划外 工单数 弹框
      dispatch({
        type: `${namespace}/insideOrOutsideWorkGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    cityDetailGetTaskWorkOrderList:(payload)=>{ // 计划外 市详情
      dispatch({
        type: `${namespace}/cityDetailGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    exportCityDetailTaskWorkList:(payload)=>{ // 计划外 市详情 导出
      dispatch({
        type: `${namespace}/exportCityDetailTaskWorkList`,
        payload:payload,
      })
    },
    workRegExportTaskWorkList:(payload)=>{ // 导出 计划内or计划外 工单数 弹框
      dispatch({
        type: `${namespace}/workRegExportTaskWorkList`,
        payload:payload,
      })
    },
    cityRegExportTaskWorkList:(payload)=>{ // 导出 市级别
      dispatch({
        type: `${namespace}/cityRegExportTaskWorkList`,
        payload:payload,
      })
    },
    operaPointExportTaskWorkList:(payload)=>{ // 导出 监测点
      dispatch({
        type: `${namespace}/operaPointExportTaskWorkList`,
        payload:payload,
      })
    },


    /**实际工单统计 */
    cityActualGetTaskWorkOrderList:(payload)=>{ // 市级别
      dispatch({
        type: `${namespace}/cityActualGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    insideOrOutsideWorkActualGetTaskWorkOrderList:(payload)=>{ //  计划内or计划外 工单数 弹框
      dispatch({
        type: `${namespace}/insideOrOutsideWorkActualGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    exportActualTaskWorkOrderList:(payload)=>{ // 计划工单统计 导出
      dispatch({
        type: `${namespace}/exportActualTaskWorkOrderList`,
        payload:payload,
      })
    },
  }
}
const Index = (props,ref ) => {


  const [regionForm] = Form.useForm();


  const [data, setData] = useState([]);


  const [tableVisible,setTableVisible] = useState(false)
  const [abnormalType,setAbnormalType] = useState(1)

  const [cityVisible,setCityVisible] = useState(false)

  const [insideOperaPointVisible,setInsideOperaPointVisible] = useState(false)

  const [regionCode,setRegionCode]  = useState();
  const  [regName ,setRegName] = useState()

  const [pageSize,setPageSize] = useState(20)
  const [pageIndex,setPageIndex] = useState(1)



  
  const  {clientHeight, tableDatas,tableTotal,tableLoading,pointLoading,exportLoading,exportPointLoading,refInstance,isPlanCalibrationModal,isPlanInspectionModal,isActualCalibrationModal } = props; 

  const {cityTableDatas,cityTableLoading,cityTableTotal,cityActualTableLoading} = props; //市级别

  const { regPointTableDatas,regPointTableLoading ,regPointTableDatasTotal} = props; //监测点

  const { insideOrOutsiderWorkTableDatas,insideOrOutsideWorkLoading,insideOrOutsiderWorkTableTotal,insideOrOutsideWorkActualLoading } = props; //计划内or计划外工单数

   const { cityDetailExportLoading,workRegExportLoading,cityRegExportLoading,operaPointExportLoading,exportActualRegDetailLoading,exportActualRegTaskLoading,exportActualRegDetailTaskLoading }  = props; //导出
  useEffect(() => {

  
    },[]);

  

  const plannedInspectTip =()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>通过该页面可以查看监测点派发计划工单情况。</li>
    <li>运维状态：运维暂停则系统停止派发计划工单情况。</li>
  </ol>
  }
  const workOrderTip = ()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>运营周期内：在监测点的实际运营周期内。 </li>
    <li>完成工单：当日系统派发的工单已被完成。</li>
    <li>系统关闭工单：当日系统派发的工单被系统关闭。</li>
    <li>同时存在关闭和完成的工单：当日存在系统关闭工单，也存在完成工单。</li>

  </ol>
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'x',
      key:'x',
      align:'center',
      width: 50,
      render:(text,record,index)=>{
        return index + 1;
      }
    },
    {
      title: '省',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      render:(text,record,index)=>{
        return  <Button type="link"
         onClick={()=>{
          regionClick(record)
         }}
        >{text}</Button>
      }
    },
    {
      title: '运营企业数',
      dataIndex: 'entCount',
      key:'entCount',
      align:'center',
      width: 100,
    },
    {
    title: <span>运营监测点数{!isActualCalibrationModal&&!isPlanCalibrationModal&&<Tooltip title={`点击运营监测点数，可以查看运营监测点在条件日期内派发计划"}工单情况。`}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip>}</span>,
      dataIndex: 'pointCount',
      key:'pointCount',
      align:'center',
      width: 100,
      render:(text,record,index)=>{ 
        if(!isPlanCalibrationModal&&!isPlanInspectionModal&&!isActualCalibrationModal){
          return  <Button type="link"
          onClick={()=>{
           insideOperaPointClick(record)
          }}
         >{text}</Button>
        }else{
          return text;
        }

      }
    },
    {
      title: '计划巡检工单',
      width:200,
      children: [
        {
          title: <span>总数<Tooltip  title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'inspectionCount',
          key: 'inspectionCount',
          width: 50,
          align:'center',
          render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(1,record,'inspectionCount')}}>{text}</Button>
          }
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'inspectionCompleteCount',
          key: 'inspectionCompleteCount',
          width: 50,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'inspectionRate',
          key: 'inspectionRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.inspectionRate - b.inspectionRate,
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text=='-'? 0 : text}
                  size="small"
                  style={{width:'85%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    },
    {
      title: '计划校准工单',
      width:200,
      children: [
        {
          title: <span>总数<Tooltip  title={'日期条件内，派发的计划校准工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'calibrationCount',
          key: 'calibrationCount',
          width: 50,
          align:'center',
          render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(2,record,'calibrationCount')}}>{text}</Button>
          }
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'calibrationCompleteCount',
          key: 'calibrationCompleteCount',
          width: 50,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'calibrationRate',
          key: 'calibrationRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.calibrationRate - b.calibrationRate,
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text=='-'? 0 : text}
                  size="small"
                  style={{width:'85%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    },
   
  ];

   const cityInsideRegColumns =[ //计划内  市级别 二级弹框
    {
      title: '序号',
      dataIndex: 'x',
      key:'x',
      align:'center',
      width: 50,
      render:(text,record,index)=>{
        return index + 1;
      }
    },
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      width: 150,
      render:(text,record,index)=>{
        return <div style={{textAlign:'center'}}>{text}</div>
      }
    },
    {
      title: '运营企业数',
      dataIndex: 'entCount',
      key:'entCount',
      align:'center',
      width: 100,
    },
    {
      title: <span>运营监测点数</span>,
      dataIndex: 'pointCount',
      key:'pointCount',
      align:'center',
      width: 100,
    },
    {
      title: '计划巡检工单',
      width:200,
      children: [
        {
          title: <span>总数</span>,
          dataIndex: 'inspectionCount', 
          key: 'inspectionCount',
          width: 50,
          align:'center',
          render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(1,record,'inspectionCount')}}>{text}</Button>
          }
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'inspectionCompleteCount',
          key: 'inspectionCompleteCount',
          width: 50,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'inspectionRate',
          key: 'inspectionRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.inspectionRate - b.inspectionRate,
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text=='-'? 0 : text}
                  size="small"
                  style={{width:'85%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    },
    {
      title: '计划校准工单',
      width:200,
      children: [
        {
          title: <span>总数</span>,
          dataIndex: 'calibrationCount',
          key: 'calibrationCount',
          width: 50,
          align:'center',
          render:(text,record,index)=>{
            return  <Button type="link" onClick={()=>{workOrderNum(2,record,'calibrationCount')}}>{text}</Button>
            }
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'calibrationCompleteCount',
          key: 'calibrationCompleteCount',
          width: 50,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'calibrationRate',
          key: 'calibrationRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.calibrationRate - b.calibrationRate,
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text=='-'? 0 : text}
                  size="small"
                  style={{width:'85%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    },
   ]
   const insideWorkOrderColumns = [
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      fixed: 'left',
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      width: 150,
      fixed: 'left',
      // render:(text,record,index)=>{
      //  return  <div style={{textAlign:"left"}}>{text}</div>
      // }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
      fixed: 'left',
    },
    {
      title: '巡检周期',
      dataIndex: 'calibrationCycle',
      key:'calibrationCycle',
      align:'center',
    },
    {
      title: '计划巡检工单',
      width:200,
      children: [
        {
          title: '总数',
          dataIndex: 'taskCount',
          key: 'taskCount',
          width: 50,
          align:'center',
        },
        {
          title:  "完成数",
          dataIndex: 'taskCompleteCount',
          key: 'taskCompleteCount',
          width: 100,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'taskRate',
          key: 'taskRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.taskRate - b.taskRate,
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text=='-'? 0 : text}
                  size="small"
                  style={{width:'85%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    },
   
  ];
 
  const insideWorkOrderColumns2 = [
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      width: 100,
      fixed: 'left',
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      width: 150,
      fixed: 'left',
      // render:(text,record,index)=>{
      //  return  <div style={{textAlign:"left"}}>{text}</div>
      // }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
      fixed: 'left',
    },
    {
      title: '校准周期',
      dataIndex: 'calibrationCycle',
      key:'calibrationCycle',
      align:'center',
    },
    {
      title: '计划校准工单',
      width:200,
      children: [
        {
          title: '总数',
          dataIndex: 'taskCount',
          key: 'taskCount',
          width: 50,
          align:'center',
        },
        {
          title:  "完成数",
          dataIndex: 'taskCompleteCount',
          key: 'taskCompleteCount',
          width: 100,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'taskRate',
          key: 'taskRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.taskRate - b.taskRate,
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text=='-'? 0 : text}
                  size="small"
                  style={{width:'85%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    },
   
  ];

  const planOutRegCompleteCommon = [ //计划外 行政区 市级别 完成工单数
      {
        title: '巡检',
        dataIndex: 'inspectionCompleteCount',
        key: 'inspectionCompleteCount',
        width: 100,
        align:'center',
        render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(3,record,'inspectionCount')}}>{text}</Button>
        }
      },
      {
        title: '维护',
        dataIndex: 'maintainCompleteCount',
        key: 'maintainCompleteCount',
        width: 100,
        align:'center',
        render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(3,record,'maintainCount')}}>{text}</Button>
        }
      },
      {
        title: '校准',
        dataIndex: 'calibrationCompleteCount',
        key: 'calibrationCompleteCount',
        width: 100,
        align:'center',
        render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(3,record,'calibrationCount')}}>{text}</Button>
        }
      },
      {
        title: '配合检查',
        dataIndex: 'cooperationInspectionCompleteCount',
        key: 'cooperationInspectionCompleteCount',
        width: 100,
        align:'center',
        render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(3,record,'cooperationInspectionCount')}}>{text}</Button>
        }
      },
      {
        title: '校验测试',
        dataIndex: 'calibrationTestCompleteCount',
        key: 'calibrationTestCompleteCount',
        width: 100,
        align:'center',
        render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(3,record,'calibrationTestCount')}}>{text}</Button>
        }
      },
      {
        title: '维修',
        dataIndex: 'repairCompleteCount',
        key: 'repairCompleteCount',
        width: 100,
        align:'center',
        render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(3,record,'repairCount')}}>{text}</Button>
        }
      },

      {
        title: '参数核对',
        dataIndex: 'matchingComparisonCompleteCount',
        key: 'matchingComparisonCompleteCount',
        width: 100,
        align:'center',
        render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(3,record,'matchingComparisonCount')}}>{text}</Button>
        }
      },

  ]
   const outsideColumns =  [ //计划外 首页面
    {
      title: '序号',
      dataIndex: 'x',
      key:'x',
      align:'center',
      width: 50,
      render:(text,record,index)=>{
        return index + 1;
      }
    },
    {
      title: '省',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      render:(text,record,index)=>{
        return  <Button type="link"
         onClick={()=>{
           regionClick(record)
         }}
        >{text}</Button>
      }
    },
    {
      title: '运营企业数',
      dataIndex: 'entCount',
      key:'entCount',
      align:'center',
      width: 100,
    },
    {
      title: <span>运营监测点数</span>,
      dataIndex: 'pointCount',
      key:'pointCount',
      align:'center',
      width: 100,
    },
    {
      title: '计划外完成工单',
      width:200,
      children:[
        {
          title: <span>总数<Tooltip  title={'日期条件内完成的工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'allCompleteTaskCount',
          key: 'allCompleteTaskCount',
          width: 50,
          align:'center',
        },
       ...planOutRegCompleteCommon,
      ],
    },
   
  ]; 
  const cityOutRegColumns = [ //计划外  市级别 二级弹框
    {
      title: '序号',
      dataIndex: 'x',
      key:'x',
      align:'center',
      width: 50,
      render:(text,record,index)=>{
        return index + 1;
      }
    },
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      width:150,
      render:(text,record,index)=>{
        return <div style={{textAlign:'center'}}> <a href="javascript:;" onClick={()=>{cityDetail(record)}}>{text}</a></div>
      }
    },
    {
      title: '运营企业数',
      dataIndex: 'entCount',
      key:'entCount',
      align:'center',
      width: 100,
    },
    {
      title: <span>运营监测点数</span>,
      dataIndex: 'pointCount',
      key:'pointCount',
      align:'center',
      width: 100,
    },
    {
      title: '计划外完成工单',
      width:200,
      children: [
        {
          title: <span>总数</span>,
          dataIndex: 'allCompleteTaskCount',
          key: 'allCompleteTaskCount',
          width: 50,
          align:'center',
        },
       ...planOutRegCompleteCommon,
      ],
    },
   
  ];
  const cityDetailOutRegColumns = [ //计划外  市级别详情  三级弹框
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      width:150,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      width: 150,
      // render:(text,record,index)=>{
      //  return  <div style={{textAlign:"left"}}>{text}</div>
      // }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
    },
    {
      title: '计划外完成工单',
      width:200,
      children: [
        {
          title: <span>总数</span>,
          dataIndex: 'allCompleteTaskCount',
          key: 'allCompleteTaskCount',
          width: 50,
          align:'center',
        },
        {
          title:  <span>巡检工单数</span>,
          dataIndex: 'inspectionCompleteCount',
          key: 'inspectionCompleteCount',
          width: 100,
          align:'center',
        },
        {
          title: '校准工单数',
          dataIndex: 'calibrationCompleteCount',
          key: 'calibrationCompleteCount',
          width: 100,
          align:'center',
        },
        {
          title: '维护维修工单数',
          dataIndex: 'repairCompleteCount',
          key: 'repairCompleteCount',
          width: 100,
          align:'center',
        },
        {
          title: '配合对比工单数',
          dataIndex: 'matchingComparisonCompleteCount',
          key: 'matchingComparisonCompleteCount',
          width: 100,
          align:'center',
        },
        {
          title: '配合检查工单数',
          dataIndex: 'cooperationInspectionCompleteCount',
          key: 'cooperationInspectionCompleteCount',
          width: 100,
          align:'center',
        },
        {
          title: '校验测试工单数',
          dataIndex: 'calibrationTestCompleteCount',
          key: 'calibrationTestCompleteCount',
          width: 100,
          align:'center',
        },
      ],
    },
   
  ];
  const  outWorkOrderColumn = [ //计划外 工单
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      fixed: 'left',
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      width: 150,
      fixed: 'left',
      // render:(text,record,index)=>{
      //  return  <div style={{textAlign:"left"}}>{text}</div>
      // }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
      fixed: 'left',
    },
  ]
  const operaPointColumns = [
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      width: 150,
      // render:(text,record,index)=>{
      //  return  <div style={{textAlign:"left"}}>{text}</div>
      // }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
    },
    {
      title: '运维周期',
      dataIndex: 'operationTime',
      key:'operationTime',
      align:'center',

    },
    {
      title: '运维状态',
      dataIndex: 'operationStatus',
      key:'operationStatus',
      align:'center',
      render:(text,record)=>{
      return <span style={{color: text=='进行中'?'#1890ff' :'#f5222d'}}>{text}</span> 
      }
    },
    {
      title: <span>计划巡检工单数<Tooltip title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
      dataIndex: 'inspectionCount',
      key:'inspectionCount',
      align:'center',
      width: 100,
    },
    {
      title: <span>计划校准工单数<Tooltip title={'日期条件内，派发的计划校准工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
      dataIndex: 'calibrationCount',
      key:'calibrationCount',
      align:'center',
      width: 100,
    },
  ]

 
 

 

const [cityDetailRegionCode, setCityDetailRegionCode] = useState()
const regionClick = (record) =>{
  setCityVisible(true)
  setRegName(record.regionName)
  setRegionCode(record.regionCode)
  setCityDetailRegionCode(record.regionCode)//计划外 市级详情 全部合计Code
  !isActualCalibrationModal? props.cityGetTaskWorkOrderList({
    ...queryPar,
    regionCode: record.regionCode,
    staticType: 1,
    regionLevel: 2,
  }): props.cityActualGetTaskWorkOrderList({ //实际校准率
    ...queryPar,
    regionCode: record.regionCode,
    staticType: 1,
    regionLevel: 2,
  })
  
}








const [outWorkOrderVisible, setOutWorkOrderVisible] = useState(false)

const cityDetailGetTaskWorkOrderList=(par)=>{
  props.cityDetailGetTaskWorkOrderList({
    ...queryPar,
    staticType:2,
    outOrInside:2,
    regionCode: regionCode,
    regionLevel:undefined,
    ...par
  })
}
const {cityDetailTableDatas,cityDetailTableLoading,cityDetailTableTotal} = props;
const [cityDetailVisible,setCityDetailVisible] = useState(false)

const cityDetail = (record) =>{
 setCityDetailVisible(true)
 cityDetailForm.resetFields()
 setRegName(record.regionName)
 setRegionCode(record.regionCode?record.regionCode:cityDetailRegionCode)
 cityDetailGetTaskWorkOrderList({
   regionCode: record.regionCode?record.regionCode:cityDetailRegionCode,
 })
}

const onFinishCityDetail = async () =>{  // 计划外 市详情


  try {

    const values = await cityDetailForm.validateFields();

     cityDetailGetTaskWorkOrderList({
      ...values,
    })
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }
}
const cityDetailExports =  ()=>{ // 导出 计划外 市详情

  props.exportCityDetailTaskWorkList({
    ...queryPar,
    staticType:2,
    outOrInside:2,
    regionCode: regionCode,
    regionLevel:undefined,
    pageIndex:undefined,
    pageSize:undefined,
 })
}
  
   const [cityDetailForm] = Form.useForm()

  const searchCityDetailRegComponents = ()=>{
   return <Form
    onFinish={onFinishCityDetail}
    form={cityDetailForm}
    layout={'inline'}
  >   
      <Form.Item name='entName' >
       <Input placeholder='请输入企业名称' allowClear />
     </Form.Item>

        <Form.Item>
     <Button  type="primary" htmlType='submit'>
          查询
     </Button>
     <Button icon={<ExportOutlined />}  style={{  margin: '0 8px'}}  loading={cityDetailExportLoading}  onClick={()=>{ cityDetailExports()} }>
            导出
     </Button> 
     
     </Form.Item>
     </Form>
  }

  
  const insideOrOutsideWorkGetTaskWorkOrderList = (par)=>{ //计划内or计划外弹框
    const pars ={
      ...queryPar,
      pageIndex:1,
      pageSize:10,
      taskType:outTypePar[outType],
      ...par,
      regionLevel:undefined,
      staticType:3,
      homePageIndex: isPlanInspectionModal? 1 :isPlanCalibrationModal? 2 : undefined,
    }
   !isActualCalibrationModal? props.insideOrOutsideWorkGetTaskWorkOrderList(pars)
                             :props.insideOrOutsideWorkActualGetTaskWorkOrderList(pars)
    
  }
  const [insideWorkType, setInsideWorkType] = useState()
  const [insideWorkOrderVisible, setInsideWorkOrderVisible] = useState(false)
  
  const [outType,setOutType] = useState()
  const [outTypeName,setOutTypeName] = useState()

  const outTypePar = {
    "inspectionCount"  : "1",
    "calibrationCount" :'2',
    "repairCount" :'3',
    "maintainCount" :'4',
    "matchingComparisonCount" :'5',
    "cooperationInspectionCount" :'6',
    "calibrationTestCount":'7',
   }
   const outTypeNames = {
    "inspectionCount"  : "巡检工单",
    "calibrationCount" :'校准工单',
    "repairCount" :'维修工单',
    "maintainCount" :'维护工单',
    "matchingComparisonCount" :'参数核对工单',
    "cooperationInspectionCount" :'配合检查工单',
    "calibrationTestCount":'校验测试工单',
   }
  const workOrderNum = (type,record,outType) =>{ //计划内  计划外  总数工单
    
     if(type == 1 || type ==2){
      setInsideWorkType(type) 
      setInsideWorkOrderVisible(true)
     }
     if(type == 3){
      setOutWorkOrderVisible(true)
      setOutTypeName(outTypeNames[outType])
     }
     setOutType(outType)
     workRegForm.resetFields()
     setRegName(record.regionName)
     setRegionCode(record.regionCode?record.regionCode:cityDetailRegionCode)
  
  
     setWorkPageIndex(1)
     setWorkPageSize(10)
     insideOrOutsideWorkGetTaskWorkOrderList({
      regionCode: record.regionCode,
      taskType:outTypePar[outType]
     })
    
  
  }
  const onFinishWorkOrder = async () =>{  //计划内 计划外 查询 工单
  
  
    try {
  
      const values = await workRegForm.validateFields();
      setWorkPageIndex(1)
      setWorkPageSize(10)
      insideOrOutsideWorkGetTaskWorkOrderList({
        ...values,
        regionCode:regionCode,
      }) 
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  
  
  const [workPageIndex,setWorkPageIndex] = useState(1)
  const [workPageSize,setWorkPageSize] = useState(10)
  
  const handleWorkTableChange =  (PageIndex, PageSize)=>{ //计划内 计划外 工单 分页
  
    setWorkPageIndex(PageIndex)
    setWorkPageSize(PageSize)
    insideOrOutsideWorkGetTaskWorkOrderList({
      regionCode:regionCode,
      pageIndex:PageIndex,
      pageSize:PageSize
    }) 
  }
  const workRegExports =   () =>{ //导出 工单

    const par = {
      ...queryPar,
      taskType:outTypePar[outType],
      staticType:3,
      regionCode:regionCode,
      pageIndex:undefined,
      pageSize:undefined,
      regionLevel:isActualCalibrationModal&&cityVisible? 2 : isActualCalibrationModal? 1 :undefined,
      homePageIndex: isPlanInspectionModal? 1 :isPlanCalibrationModal? 2 : undefined,
    }
    if(!isActualCalibrationModal){
    props.workRegExportTaskWorkList(par)
   }else{
    props.exportActualTaskWorkOrderList(par) 
   }
  }
  const [ workRegForm ]= Form.useForm()
  const searchWorkComponents = () =>{ //计划内  查询 工单
    return <> <Form
    onFinish={onFinishWorkOrder}
    form={workRegForm}
    layout={'inline'}
  >   
      <Row justify='space-between'  align='middle' style={{flex:1}} >

        <Col >
        <Row align='middle'>
      <Form.Item name='entName' >
       <Input placeholder='请输入企业名称' allowClear/>
     </Form.Item>

        <Form.Item>
     <Button  type="primary" htmlType='submit'>
          查询
     </Button>
     <Button icon={<ExportOutlined />}  style={{  margin: '0 8px'}}  loading={!isActualCalibrationModal? workRegExportLoading : isActualCalibrationModal&&cityVisible? exportActualRegDetailTaskLoading : exportActualRegTaskLoading}  onClick={()=>{ workRegExports()} }>
            导出
     </Button> 
     
     </Form.Item>
     </Row>
     </Col>


     <Col>
     <Row align='middle'>
       <div style={{marginRight:8}}>
     <div style={{display:'inline-block', background:'#bae7ff',width:24,height:12,marginRight:5}}></div>
       <span>运营周期内</span>
       </div>
       <div  style={{ marginRight:8}}>
     <div style={{ display:'inline-block',background:'#1890ff',width:24,height:12,marginRight:5}}></div>
       <span>完成工单</span>
       </div>
       <div  style={{ marginRight:8}}>
     <div style={{display:'inline-block',background:'#f5222d',width:24,height:12,marginRight:5}}></div>
       <span>系统关闭工单</span>
       </div>
       <div >
       <div style={{display:'inline-block',background:'#faad14',width:24,height:12,marginRight:5}}></div>
       <span>当日存在关闭和完成工单</span>
       <Tooltip overlayClassName='customTooltipSty'  title={workOrderTip()}><QuestionCircleOutlined style={{paddingLeft:5,fontSize:10}}/></Tooltip>
       </div>

     </Row>
     </Col>
    </Row>
      </Form>
      <Row style={{paddingTop:8}}>
     <span style={{color:'#f5222d',fontSize:14}}>
     {insideWorkType==1? "计划巡检工单由系统自动派发，在巡检周期内必须完成，否则将被系统自动关闭。" : `计划校准工单由系统自动派发，在校准周期内${isActualCalibrationModal? "没有被完成" : "必须完成"}，否则将被系统自动关闭。`}
        </span>
     </Row>
      </>
   }

   const searchOutWorkComponents =()=>{ //计划外 工单弹框
    return <Form
    onFinish={onFinishWorkOrder}
    form={workRegForm}
    layout={'inline'}
  >   
      <Row justify='space-between'  align='middle' style={{flex:1}} >

        <Col >
        <Row align='middle'>
      <Form.Item name='entName' >
       <Input placeholder='请输入企业名称' allowClear/>
     </Form.Item>

        <Form.Item>
     <Button  type="primary" htmlType='submit'>
          查询
     </Button>
     <Button icon={<ExportOutlined />}  style={{  margin: '0 8px'}}  loading={workRegExportLoading}  onClick={()=>{ workRegExports()} }>
            导出
     </Button> 
     
     </Form.Item>
     </Row>
     </Col>


     <Col>
     <Row align='middle'>
       <div style={{marginRight:8}}>
     <div style={{display:'inline-block', background:'#bae7ff',width:24,height:12,marginRight:5}}></div>
       <span>运营周期内</span>
       </div>
       <div  style={{ marginRight:8}}>
     <div style={{ display:'inline-block',background:'#1890ff',width:24,height:12,marginRight:5}}></div>
       <span>完成工单</span>
       </div>

     </Row>
     </Col>
    </Row>
      </Form>
   }

   const cityRegExports = () =>{

    const par ={
      ...queryPar,
      regionCode: cityDetailRegionCode,
      regionLevel: 2,
      pageIndex:undefined,
      pageSize:undefined,
      homePageIndex: isPlanInspectionModal? 1 :isPlanCalibrationModal? 2 : undefined,
    }
    if(!isActualCalibrationModal){  
      props.cityRegExportTaskWorkList(par)
     }else{
      props.exportActualTaskWorkOrderList(par) //实际校准完成率
     }
   }
   const searchCityRegComponents = ()=>{ //市级别弹框 
    return <Button icon={<ExportOutlined />}   loading={!isActualCalibrationModal? cityRegExportLoading : exportActualRegDetailLoading}  onClick={()=>{ cityRegExports()} }>
            导出
         </Button> 
   }
   const regPointGetTaskWorkOrderList = (par) =>{
    props.regPointGetTaskWorkOrderList({
      ...queryPar,
      pageIndex:1,
      pageSize:10,
      regionLevel: undefined,
      staticType:2,
      ...par
    })
   }
   const [regPointPageIndex,setRegPointPageIndex] = useState(1)
   const [regPointPageSize,setRegPointPageSize] = useState(10)

    const handleRegPointTableChange =(PageIndex,PageSize)=>{ //监测点   分页
      setRegPointPageIndex(PageIndex)
      setRegPointPageSize(PageSize)
      regPointGetTaskWorkOrderList({
        regionCode:regionCode,
        pageIndex:PageIndex,
        pageSize:PageSize
      })
    }
   const insideOperaPointClick=(record)=>{ //行政区 计划内 运营监测点弹框 
    setInsideOperaPointVisible(true)
    setRegName(record.regionName)
    setRegionCode(record.regionCode)
    setRegPointPageIndex(1)
    setRegPointPageSize(10)
    regPointGetTaskWorkOrderList({
      regionCode:record.regionCode
    })
  }

  
   const [operaPointForm] = Form.useForm()

   
   const operaPointClick  = (e) =>{  //查询  运营监测点
    setRegPointPageIndex(1)
    setRegPointPageSize(10)
    regPointGetTaskWorkOrderList({
      regionCode:regionCode,
      operationStatus:e.target.value
    })
  }
  const operaPointExports = async () => { //导出  运营监测点

    const values = await operaPointForm.validateFields()
    props.operaPointExportTaskWorkList({
      ...queryPar,
      regionLevel: 2,
      staticType:2,
      regionCode:regionCode,
      pageIndex:undefined,
      pageSize:undefined,
    })
  };
  
  const searchOperaPointComponents = () =>{ 
     return  <Form
     form={operaPointForm}
    //  onFinish={onFinishOperaPoint}
     layout={'inline'}
     initialValues={{
      operationStatus:undefined,
     }}
   >    
    {/* <Form.Item name='a'>
     <Radio.Group    buttonStyle="solid">
      <Radio.Button value={undefined}>全部</Radio.Button>
      <Radio.Button value="2">缺失计划工单</Radio.Button>
      <Radio.Button value="3">缺失计划巡检工单</Radio.Button>
      <Radio.Button value="4">缺失计划校准工单</Radio.Button>
    </Radio.Group>
    </Form.Item> */}
    <Form.Item   name='operationStatus'>
     <Radio.Group onChange={operaPointClick}  buttonStyle="solid"   style={{  margin: '0 8px'}}>
      <Radio.Button value={undefined}>全部</Radio.Button>
      <Radio.Button value="1">进行中</Radio.Button>
      <Radio.Button value="2">运维暂停</Radio.Button>
    </Radio.Group>
    </Form.Item>
    <Form.Item>
     <Button icon={<ExportOutlined />}  loading={operaPointExportLoading}  onClick={()=>{operaPointExports()} }>
            导出
     </Button> 

     <Tooltip overlayClassName='customTooltipSty'  title={plannedInspectTip()}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip>
    </Form.Item>
    </Form>
  }



  const { dateCol } = props;
  const insideWorkOrderColumnsPush = (col)=>{ //计划内 巡检周期
    if(dateCol&&dateCol[0]){ 

      col.push({
        title: '工单分布(按工单创建日期分布)',
        width:200, 
        align:'center',
        children:dateCol.map((item,index)=>{
          return { 
            title: `${item.date.split('_')[0]}`,
            width: 70,
            align:'center',
            children: [{
                title: `${item.date.split('_')[1]}`,
                dataIndex: `${item.date.split('_')[1]}`,
                key: `${item.date.split('_')[1]}`,
                width: 70,
                align:'center',
                render:(text,row,index)=>{
                    return row.datePick.map(dateItem=>{
                            if(dateItem.taskCloseCount && dateItem.taskCompleteCount&&dateItem.date == item.date){ //同时存在
                              return  <Row align='middle' justify='center' style={{ background:'#faad14',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                              <span style={{color:'#fff'}}>{dateItem.taskCloseCount + dateItem.taskCompleteCount}</span>
                             </Row>
                            }
                            if(dateItem.taskCloseCount&&dateItem.date == item.date){ //关闭
                              return  <Row align='middle' justify='center' style={{ background:'#f5222d',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                              <span style={{color:'#fff'}}>{dateItem.taskCloseCount}</span>
                            </Row>
                              }

                            if(dateItem.taskCompleteCount&&dateItem.date == item.date){//完成
                            return  <Row align='middle' justify='center' style={{ background:'#1890ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                            <span style={{color:'#fff'}}>{dateItem.taskCompleteCount}</span>
                          </Row>
                            }
                            if(dateItem.operationStatus&&dateItem.date == item.date){ //运营周期内
                              return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                                      
                                     </Row>
                              }else if(!dateItem.operationStatus&&!dateItem.taskCount&&dateItem.date == item.date){
                               return <Row align='middle' justify='center' style={{ background:'#fff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
               
                                      </Row>
                            }
                     })

    
                }
            }]
          }
        })
    })
     return col;
   }
  }
  const insideWorkOrderColumnsPush2 = (col)=>{ //计划内 校准周期
    if(dateCol&&dateCol[0]){ 

      col.push({
        title: '工单分布(按工单创建日期分布)',
        width:200, 
        align:'center',
        children:dateCol.map((item,index)=>{
          return { 
            title: `${item.date.split('_')[0]}`,
            width: 70,
            align:'center',
            children: [{
                title: `${item.date.split('_')[1]}`,
                dataIndex: `${item.date.split('_')[1]}`,
                key: `${item.date.split('_')[1]}`,
                width: 70,
                align:'center',
                render:(text,row,index)=>{
                    return row.datePick.map(dateItem=>{
                            if(dateItem.taskCloseCount && dateItem.taskCompleteCount&&dateItem.date == item.date){ //同时存在
                              return  <Row align='middle' justify='center' style={{ background:'#faad14',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                              <span style={{color:'#fff'}}>{dateItem.taskCompleteCount + dateItem.taskCloseCount}</span>
                             </Row>
                            }
                            if(dateItem.taskCloseCount&&dateItem.date == item.date){ //关闭
                              return  <Row align='middle' justify='center' style={{ background:'#f5222d',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                              <span style={{color:'#fff'}}>{dateItem.taskCloseCount}</span>
                            </Row>
                              }

                            if(dateItem.taskCompleteCount&&dateItem.date == item.date){//完成
                            return  <Row align='middle' justify='center' style={{ background:'#1890ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                            <span style={{color:'#fff'}}>{dateItem.taskCompleteCount}</span>
                          </Row>
                            }
                            if(dateItem.operationStatus&&dateItem.date == item.date){ //运营周期内
                              return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                                      
                                     </Row>
                              }else if(!dateItem.operationStatus&&!dateItem.taskCount&&dateItem.date == item.date){
                              return <Row align='middle' justify='center' style={{ background:'#fff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
               
                              </Row>
                            }
                     })

    
                }
            }]
          }
        })
    })
     return col;
   }
  }

  insideWorkOrderColumnsPush(insideWorkOrderColumns)
  insideWorkOrderColumnsPush2(insideWorkOrderColumns2)
 

 const  outWorkOrderColumnPush = (col)=>{  //计划外 巡检工单
  if(dateCol&&dateCol[0]){
    col.push({
      title: `${outTypeName}数`,
      dataIndex: 'taskCount',
      key:'taskCount',
      align:'center',
      fixed: 'left',
    },{
      title: `${outTypeName}分布`,
      width:200, 
      align:'center',
      children:dateCol.map((item,index)=>{
        return { 
          title: `${item.date.split('_')[0]}`,
          width: 70,
          align:'center',
          children: [{
              title: `${item.date.split('_')[1]}`,
              dataIndex: `${item.date.split('_')[1]}`,
              key: `${item.date.split('_')[1]}`,
              width: 70,
              align:'center',
              render:(text,row,index)=>{
                // const outTypeObj = {
                //   "inspectionCount"  : "inspectionCompleteCount",
                //   "calibrationCount" :'calibrationCompleteCount',
                //   "repairCount" :'repairCompleteCount',
                //   "matchingComparisonCount" :'matchingComparisonCompleteCount',
                //   "cooperationInspectionCount" :'cooperationInspectionCompleteCount',
                //   "calibrationTestCount":'calibrationTestCompleteCount',
                //  }
                return row.datePick.map(dateItem=>{             
                          //  for(let key in outTypeObj){ //完成
                          //     if(outType=== key && dateItem[`${outTypeObj[key]}`]){ 
                                 if(dateItem.taskCompleteCount&&dateItem.date == item.date){
                                  console.log(dateItem.taskCompleteCount)
                                return  <Row align='middle' justify='center' style={{ background:'#1890ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                                {/* <span style={{color:'#fff'}}>{dateItem[`${outTypeObj[key]}`]}</span> */}
                                  <span style={{color:'#fff'}}>{dateItem.taskCompleteCount}</span>
                               </Row>
                                 }
                          //     }

                          // }
                        if(dateItem.operationStatus&&dateItem.date == item.date){ //运营周期内
                          return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                                  
                                 </Row>
                          }else if(!dateItem.operationStatus&&!dateItem.taskCount&&dateItem.date == item.date){
                          return <Row align='middle' justify='center' style={{ background:'#fff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                          </Row>
                        }
                 })


            }
          }]
        }
      })
  }) 
  return col;
}
 }
 outWorkOrderColumnPush(outWorkOrderColumn)
// 暴露的子组件方法，给父组件调用   子传父
const childRef = useRef();
useImperativeHandle(refInstance,() => {
     return {
        _childFn(values) {
            // setAbnormalType(values)
        },
    }
})

  const [tabType,setTabType] = useState("1")
  const { queryPar } = props;
 const tabsChange = (key)=>{
  setTabType(key)
  setTimeout(()=>{
    props.parentCallback(key) //子组件调用父组件函数方法 可以向父组件传参，刷新父组件信息 子传父
    queryPar&&queryPar.beginTime&&props.regEntGetTaskWorkOrderList({
      ...queryPar,
      regionCode:'',
      regionLevel: 1,
      staticType:1,
      outOrInside:key,// 子组件调用的父组件方法
    })
  },300)

 }
 const handleCol = () =>{
   if(isPlanCalibrationModal){
    columns.splice(columns.length-2,1)
    cityInsideRegColumns.splice(cityInsideRegColumns.length-2,1) //首页计划校准完成率弹框
   }
   if(isPlanInspectionModal){ 
    columns.splice(columns.length-1,1)
    cityInsideRegColumns.splice(cityInsideRegColumns.length-1,1) //首页计划巡检完成率弹框
   }
   if(isActualCalibrationModal){ //首页 实际校准完成率弹框
    const data = {
      title: '校准工单',
      children: [
        {
        title: <span>计划次数{<Tooltip  title={'日期条件内，按计划派发的校准工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip>}</span>,
          dataIndex: 'taskCount',
          key: 'taskCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(2,record,'calibrationCount')}}>{text}</Button>
          }
        },
        {
        title:  <span>实际完成次数<Tooltip title={`日期条件内，按计划派发的校准工单数+手工申请的校准工单数。`}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'taskCompleteCount',
          key: 'taskCompleteCount',
          width: 150,
          align:'center',
        },
        {
          title: '实际完成率',
          dataIndex: 'taskRate',
          key: 'taskRate',
          width: 150,
          align:'center',
          sorter: (a, b) => a.calibrationRate - b.calibrationRate,
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text&&text}
                  size="small"
                  style={{width:'85%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    }
    const data2 = {
      title: '校准工单',
      children: [
        {
        title: <span>计划次数</span>,
          dataIndex: 'taskCount',
          key: 'taskCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
          return insideWorkOrderVisible? text : <Button type="link" onClick={()=>{workOrderNum(2,record,'calibrationCount')}}>{text}</Button>
          }
        },
        {
        title:  <span>实际完成次数</span>,
          dataIndex: 'taskCompleteCount',
          key: 'taskCompleteCount',
          width: 150,
          align:'center',
        },
        {
          title: '实际完成率',
          dataIndex: 'taskRate',
          key: 'taskRate',
          width: 150,
          align:'center',
          sorter: (a, b) => a.calibrationRate - b.calibrationRate,
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text&&text}
                  size="small"
                  style={{width:'85%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    }
    columns.splice(columns.length-2,2,data)  //首页计划巡检完成率弹框
    cityInsideRegColumns.splice(cityInsideRegColumns.length-2,2,data2)
    insideWorkOrderColumns2.splice(insideWorkOrderColumns2.length-2,1,data2)//计划次数弹框
   }
 }
 handleCol()

  return (
      <div style={{height:'100%'}}>
   
  {!isPlanCalibrationModal&&!isPlanInspectionModal&&!isActualCalibrationModal? <Tabs defaultActiveKey="1"  onChange={tabsChange} style={{height:'100%'}}>
    <Tabs.TabPane tab="计划工单统计" key="1">
    <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={false}
      />
    </Tabs.TabPane>
    <Tabs.TabPane tab="计划外工单统计" key="2">
    <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={outsideColumns}
        pagination={false}
      />
    </Tabs.TabPane>
  </Tabs>
  :
  <SdlTable
  loading = {tableLoading}
  bordered
  dataSource={tableDatas}
  columns={columns}
  pagination={false}
  scroll={{ y:clientHeight - 420}}
/>}
   

      {/**市级别弹框 */}
      <Modal
        title={`${regName}-统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
                  ${isActualCalibrationModal?'实际校准工单完成情况':tabType==1?`内完成的计划工单情况` :'内完成的计划外工单情况' }`}
        visible={cityVisible}
        onCancel={()=>{setCityVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
     <Card title={  searchCityRegComponents()}>
     <SdlTable
        loading = {!isActualCalibrationModal? cityTableLoading : cityActualTableLoading}
        bordered
        dataSource={cityTableDatas}
        total={cityTableTotal}
        columns={tabType==1?cityInsideRegColumns : cityOutRegColumns}
        pagination={false}
        scroll={{ y: clientHeight - 500}}
      />
   </Card>
 
      </Modal> 
  {/**计划内 运营监测点数弹框 */}
      
      <Modal
        title={`${regName}-统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
        内派发的计划工单情况`}
        visible={insideOperaPointVisible}
        onCancel={()=>{setInsideOperaPointVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
     <Card title={  searchOperaPointComponents()}>
     <SdlTable
        loading = {regPointTableLoading}
        bordered
        dataSource={regPointTableDatas}
        columns={operaPointColumns}
        scroll={{ y: clientHeight - 500}}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total:regPointTableDatasTotal,
          pageSize:regPointPageSize,
          current:regPointPageIndex,
          onChange: handleRegPointTableChange,
      }}
      
      />
   </Card>
 
      </Modal> 

        {/**计划内 省级&&市级工单数弹框  计划巡检 计划校准*/}
        <Modal
        title={`${regName}-统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
        ${isActualCalibrationModal?'实际校准工单完成情况': insideWorkType==1?  '内派发的计划巡检工单完成情况' :'内派发的计划校准工单完成情况' }`}
        visible={insideWorkOrderVisible}
        onCancel={()=>{setInsideWorkOrderVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
     <Card title={  searchWorkComponents()}>
     <SdlTable
        loading = {!isActualCalibrationModal? insideOrOutsideWorkLoading : insideOrOutsideWorkActualLoading}
        bordered
        dataSource={insideOrOutsiderWorkTableDatas}
        columns={insideWorkType==1? insideWorkOrderColumns : insideWorkOrderColumns2}
        scroll={{ y: clientHeight - 580}}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total:insideOrOutsiderWorkTableTotal,
          pageSize:workPageSize,
          current:workPageIndex,
          onChange: handleWorkTableChange,
      }}
      />
   </Card>
      </Modal> 
 
           {/**计划外 省级&&市级工单数弹框  */}
      
           <Modal
        title={ `${regName}-统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
               计划外派发的${outTypeName}完成情况`}
        visible={outWorkOrderVisible}
        onCancel={()=>{setOutWorkOrderVisible(false)}}
        footer={null}
        destroyOnClose
        centered
        width='90%'
        
      >
     <Card title={  searchOutWorkComponents()}>
     <SdlTable
        loading = {insideOrOutsideWorkLoading}
        bordered
        dataSource={insideOrOutsiderWorkTableDatas}
        columns={outWorkOrderColumn}
        scroll={{ y: clientHeight - 500}}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total:insideOrOutsiderWorkTableTotal,
          pageSize:workPageSize,
          current:workPageIndex,
          onChange: handleWorkTableChange, 
      }}
      />
   </Card>
      </Modal> 

      {/**计划外 市级详情 */}
      <Modal
        title={`${regName}-统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
                   内完成的计划外工单情况`}
        visible={cityDetailVisible}
        onCancel={()=>{setCityDetailVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
     <Card title={  searchCityDetailRegComponents()}>
     <SdlTable
        loading = {cityDetailTableLoading}
        bordered
        dataSource={cityDetailTableDatas}
        total={cityDetailTableTotal}
        columns={ cityDetailOutRegColumns}
        scroll={{ y: clientHeight - 500}}
        pagination={false}
      />
   </Card>
 
      </Modal> 
        </div>
  );
};

export default   connect(dvaPropsData,dvaDispatch)(Index);
// const TFunction = connect(dvaPropsData,dvaDispatch)(Index);

// export default forwardRef((props,ref)=><TFunction {...props} refInstance={ref} />);