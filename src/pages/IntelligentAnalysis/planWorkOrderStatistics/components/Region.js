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
  cityTableTotal:planWorkOrderStatistics.cityTableTotal,
  regPointTableDatas:planWorkOrderStatistics.regPointTableDatas,
  regPointTableLoading:loading.effects[`${namespace}/regPointGetTaskWorkOrderList`],
  insideOrOutsideWorkLoading:loading.effects[`${namespace}/insideOrOutsideWorkGetTaskWorkOrderList`],
  insideOrOutsiderWorkTableDatas:planWorkOrderStatistics.insideOrOutsiderWorkTableDatas,
  clientHeight: global.clientHeight,
  cityDetailTableDatas:planWorkOrderStatistics.cityDetailTableDatas,
  cityDetailTableLoading:loading.effects[`${namespace}/cityDetailGetTaskWorkOrderList`],
  cityDetailTableTotal:planWorkOrderStatistics.cityDetailTableTotal,
  dateCol:planWorkOrderStatistics.dateCol,
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
    insideOrOutsideWorkGetTaskWorkOrderList:(payload)=>{ // 计划内 工单数 弹框
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



  
  const  {clientHeight, tableDatas,tableTotal,tableLoading,pointLoading,exportLoading,exportPointLoading,refInstance } = props; 

  const {cityTableDatas,cityTableLoading,cityTableTotal} = props; //市级别

  const { regPointTableDatas,regPointTableLoading } = props; //监测点

  const { insideOrOutsiderWorkTableDatas,insideOrOutsideWorkLoading } = props; //计划内or计划外工单数


  useEffect(() => {

  
    },[]);

  

  const plannedInspectTip =()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>通过该页面可以查看监测点派发计划工单情况。</li>
    <li>运维状态：已结束则系统停止派发计划工单情况。</li>
  </ol>
  }
  const workOrderTip = ()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>运营周期内:在监测点的实际运营周期内。</li>
    <li>完成工单:当日存在完成的计划工单。</li>
    <li>系统关闭工单:在运维周期内未完成计划工单，系统会关闭掉。</li>
    <li>同时存在关闭和完成的工单:当日存在系统关闭的计划工单，也存在完成的工单。</li>

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
      title: <span>运营监测点数<Tooltip title={'点击运营监测点数，可以查看运营监测点在条件日期内派发计划工单情况。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
      dataIndex: 'pointCount',
      key:'pointCount',
      align:'center',
      width: 100,
      render:(text,record,index)=>{
        return  <Button type="link"
         onClick={()=>{
          insideOperaPointClick(record)
         }}
        >{text}</Button>
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
          return  <Button type="link" onClick={()=>{workOrderNum(1,record)}}>{text}</Button>
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
    },
    {
      title: '计划校准工单',
      width:200,
      children: [
        {
          title: <span>总数<Tooltip  title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'calibrationCount',
          key: 'calibrationCount',
          width: 50,
          align:'center',
          render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{workOrderNum(2,record)}}>{text}</Button>
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
          dataIndex: 'inspectionRate',
          key: 'inspectionRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.inspectionRate - b.inspectionRate,
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
          return  <Button type="link" onClick={()=>{workOrderNum(1,record)}}>{text}</Button>
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
            return  <Button type="link" onClick={()=>{workOrderNum(2,record)}}>{text}</Button>
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
          dataIndex: 'inspectionRate',
          key: 'inspectionRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.inspectionRate - b.inspectionRate,
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
    },
   ]
   const insideWorkOrderColumns = [
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
      render:(text,record,index)=>{
       return  <div style={{textAlign:"left"}}>{text}</div>
      }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
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
          dataIndex: 'inspectionCount',
          key: 'inspectionCount',
          width: 50,
          align:'center',
        },
        {
          title:  "完成数",
          dataIndex: 'inspectionCompleteCount',
          key: 'inspectionCompleteCount',
          width: 100,
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
    },
   
  ];
 
  const insideWorkOrderColumns2 = [
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      width: 100,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      width: 150,
      render:(text,record,index)=>{
       return  <div style={{textAlign:"left"}}>{text}</div>
      }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
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
          dataIndex: 'calibrationCount',
          key: 'calibrationCount',
          width: 50,
          align:'center',
        },
        {
          title:  "完成数",
          dataIndex: 'calibrationCompleteCount',
          key: 'calibrationCompleteCount',
          width: 100,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'calibrationRate',
          key: 'calibrationRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.calibrationRate - b.inspectionRate,
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
    },
   
  ];
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
      children: [
        {
          title: <span>总数<Tooltip  title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'allTaskCount',
          key: 'allTaskCount',
          width: 50,
          align:'center',
        },
        {
          title:  <span>巡检工单数</span>,
          dataIndex: 'inspectionCount',
          key: 'inspectionCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
            return  <Button type="link" onClick={()=>{workOrderNum(3,record,'inspectionCount')}}>{text}</Button>
          }
        },
        {
          title: '校准工单数',
          dataIndex: 'calibrationCount',
          key: 'calibrationCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
            return  <Button type="link" onClick={()=>{workOrderNum(3,record,'calibrationCount')}}>{text}</Button>
          }
        },
        {
          title: '维护维修工单数',
          dataIndex: 'repairCount',
          key: 'repairCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
            return  <Button type="link" onClick={()=>{workOrderNum(3,record,'repairCount')}}>{text}</Button>
          }
        },
        {
          title: '配合对比工单数',
          dataIndex: 'matchingComparisonCount',
          key: 'matchingComparisonCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
            return  <Button type="link" onClick={()=>{workOrderNum(3,record,'matchingComparisonCount')}}>{text}</Button>
          }
        },
        {
          title: '配合检查工单数',
          dataIndex: 'cooperationInspectionCount',
          key: 'cooperationInspectionCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
            return  <Button type="link" onClick={()=>{workOrderNum(3,record,'cooperationInspectionCount')}}>{text}</Button>
          }
        },
        {
          title: '校验监测工单数',
          dataIndex: 'calibrationTestCount',
          key: 'calibrationTestCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
            return  <Button type="link" onClick={()=>{workOrderNum(3,record,'calibrationTestCount')}}>{text}</Button>
          }
        },
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
          title: <span>总数<Tooltip  title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'allTaskCount',
          key: 'allTaskCount',
          width: 50,
          align:'center',
        },
        {
          title:  <span>巡检工单数</span>,
          dataIndex: 'inspectionCount',
          key: 'inspectionCount',
          width: 100,
          align:'center',
        },
        {
          title: '校准工单数',
          dataIndex: 'calibrationCount',
          key: 'calibrationCount',
          width: 100,
          align:'center',
        },
        {
          title: '维护维修工单数',
          dataIndex: 'repairCount',
          key: 'repairCount',
          width: 100,
          align:'center',
        },
        {
          title: '配合对比工单数',
          dataIndex: 'matchingComparisonCount',
          key: 'matchingComparisonCount',
          width: 100,
          align:'center',
        },
        {
          title: '配合检查工单数',
          dataIndex: 'cooperationInspectionCount',
          key: 'cooperationInspectionCount',
          width: 100,
          align:'center',
        },
        {
          title: '校验监测工单数',
          dataIndex: 'calibrationTestCount',
          key: 'calibrationTestCount',
          width: 100,
          align:'center',
        },
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
      render:(text,record,index)=>{
       return  <div style={{textAlign:"left"}}>{text}</div>
      }
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
          dataIndex: 'allTaskCount',
          key: 'allTaskCount',
          width: 50,
          align:'center',
        },
        {
          title:  <span>巡检工单数</span>,
          dataIndex: 'inspectionCount',
          key: 'inspectionCount',
          width: 100,
          align:'center',
        },
        {
          title: '校准工单数',
          dataIndex: 'calibrationCount',
          key: 'calibrationCount',
          width: 100,
          align:'center',
        },
        {
          title: '维护维修工单数',
          dataIndex: 'repairCount',
          key: 'repairCount',
          width: 100,
          align:'center',
        },
        {
          title: '配合对比工单数',
          dataIndex: 'matchingComparisonCount',
          key: 'matchingComparisonCount',
          width: 100,
          align:'center',
        },
        {
          title: '配合检查工单数',
          dataIndex: 'cooperationInspectionCount',
          key: 'cooperationInspectionCount',
          width: 100,
          align:'center',
        },
        {
          title: '校验监测工单数',
          dataIndex: 'calibrationTestCount',
          key: 'calibrationTestCount',
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
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      width: 150,
      render:(text,record,index)=>{
       return  <div style={{textAlign:"left"}}>{text}</div>
      }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
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
      render:(text,record,index)=>{
       return  <div style={{textAlign:"left"}}>{text}</div>
      }
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
      title: <span>计划校准工单数<Tooltip title={'日期条件内，派发的计划校工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
      dataIndex: 'calibrationCount',
      key:'calibrationCount',
      align:'center',
      width: 100,
    },
  ]

 
 

 
 const operaPointExports = () => {

};
const cityRegColumnsExports = () =>{

}

const regionClick = (record) =>{
  setCityVisible(true)
  setRegName(record.regionName)
   props.cityGetTaskWorkOrderList({
    ...queryPar,
    regionCode: record.regionCode,
    regionLevel: 2,
  })
}



const cityDetailGetTaskWorkOrderList=(par)=>{
   props.cityDetailGetTaskWorkOrderList({
     ...queryPar,
     staticType:2,
     outOrInside:2,
     regionLevel:undefined,
     ...par
   })
}
const {cityDetailTableDatas,cityDetailTableLoading,cityDetailTableTotal} = props;
const [cityDetailVisible,setCityDetailVisible] = useState(false)

const cityDetail = (record) =>{
  setCityDetailVisible(true)
  setRegName(record.regionName)
  setRegionCode(record.regionCode)
  cityDetailGetTaskWorkOrderList({
    regionCode: record.regionCode,
  })
}
const onFinishCityDetail = async () =>{  // 计划外 市详情


  try {

    const values = await cityDetailForm.validateFields();

     cityDetailGetTaskWorkOrderList({
      ...values,
      regionCode: regionCode,
    })
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }
}

const insideOrOutsideWorkGetTaskWorkOrderList = (par)=>{ //计划内or计划外弹框
  props.insideOrOutsideWorkGetTaskWorkOrderList({
    ...queryPar,
    ...par,
    regionLevel:undefined,
    staticType:3
  })
}
const [insideWorkType, setInsideWorkType] = useState()
const [insideWorkOrderVisible, setInsideWorkOrderVisible] = useState(false)

const [outType,setOutType] = useState()
const workOrderNum = (type,record,outType) =>{ //计划内  计划外  总数工单
  
   if(type == 1 || type ==2){
    setInsideWorkType(type) 
    setInsideWorkOrderVisible(true)
   }
   if(type == 3){
    setOutWorkOrderVisible(true)
    setOutType(outType)
   }
   workRegForm.resetFields()
   setRegName(record.regionName)
   setRegionCode(record.regionCode)

   insideOrOutsideWorkGetTaskWorkOrderList({
    regionCode: record.regionCode,
   })
  

}
const onFinishWorkOrder = async () =>{  //计划内 计划外 查询 工单


  try {

    const values = await workRegForm.validateFields();

    insideOrOutsideWorkGetTaskWorkOrderList({
      ...values,
      regionCode:regionCode,
    }) 
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }
}
const [outWorkOrderVisible, setOutWorkOrderVisible] = useState()


  const handleTableChange =   async (PageIndex, )=>{ //分页
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
     <Button icon={<ExportOutlined />}  style={{  margin: '0 8px'}}  loading={exportLoading}  onClick={()=>{ abnormalExports()} }>
            导出
     </Button> 
     
     </Form.Item>
     </Form>
  }


  const [ workRegForm ]= Form.useForm()
  const searchWorkComponents = () =>{ //计划内 查询 工单
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
     <Button icon={<ExportOutlined />}  style={{  margin: '0 8px'}}  loading={exportLoading}  onClick={()=>{ abnormalExports()} }>
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
     {insideWorkOrderVisible? "计划巡检工单由系统自动派发，在巡检周期内没有被完成，将被系统自动关闭。" : "计划校准工单由系统自动派发，在校准周期内没有被完成，将被系统自动关闭。"}
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
     <Button icon={<ExportOutlined />}  style={{  margin: '0 8px'}}  loading={exportLoading}  onClick={()=>{ abnormalExports()} }>
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
   const searchCityRegComponents = ()=>{
    return <Button icon={<ExportOutlined />}   loading={exportLoading}  onClick={()=>{ abnormalExports()} }>
            导出
         </Button> 
   }
   const regPointGetTaskWorkOrderList = (par) =>{
    props.regPointGetTaskWorkOrderList({
      ...queryPar,
      regionLevel: 2,
      staticType:2,
      ...par
    })
   }
   const insideOperaPointClick=(record)=>{ //行政区 计划内 运营监测点弹框 
    setInsideOperaPointVisible(true)
    setRegName(record.regionName)
    setRegionCode(record.regionCode)
    regPointGetTaskWorkOrderList({
      regionCode:record.regionCode
    })
  }
   const [operaPointForm] = Form.useForm()
   const operaPointClick  = (e) =>{  //查询  运营监测点
    regPointGetTaskWorkOrderList({
      regionCode:regionCode,
      operationStatus:e.target.value
    })
  }

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
    <Form.Item>
     <Radio.Group  name='operationStatus' onChange={operaPointClick}  buttonStyle="solid"   style={{  margin: '0 8px'}}>
      <Radio.Button value={undefined}>全部</Radio.Button>
      <Radio.Button value="1">进行中</Radio.Button>
      <Radio.Button value="2">已结束</Radio.Button>
    </Radio.Group>
    </Form.Item>
    <Form.Item>
     <Button icon={<ExportOutlined />}  loading={exportLoading}  onClick={()=>{operaPointExports()} }>
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
        title: '工单分布(按工单完成日期分布)',
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
                            if(dateItem.inspectionCompleteCount && dateItem.inspectionCloseCount){ //同时存在
                              return  <Row align='middle' justify='center' style={{ background:'#faad14',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                              <span style={{color:'#fff'}}>{dateItem.inspectionCompleteCount + dateItem.inspectionCloseCount}</span>
                             </Row>
                            }
                            if(dateItem.inspectionCloseCount){ //关闭
                              return  <Row align='middle' justify='center' style={{ background:'#f5222d',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                              <span style={{color:'#fff'}}>{dateItem.inspectionCloseCount}</span>
                            </Row>
                              }

                            if(dateItem.inspectionCompleteCount){//完成
                            return  <Row align='middle' justify='center' style={{ background:'#1890ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                            <span style={{color:'#fff'}}>{dateItem.inspectionCompleteCount}</span>
                          </Row>
                            }
                            if(dateItem.operationStatus){ //运营周期内
                              return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                                      
                                     </Row>
                              }else{
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
        title: '工单分布(按工单完成日期分布)',
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
                            if(dateItem.calibrationCompleteCount && dateItem.calibrationCloseCount){ //同时存在
                              return  <Row align='middle' justify='center' style={{ background:'#faad14',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                              <span style={{color:'#fff'}}>{dateItem.calibrationCompleteCount + dateItem.calibrationCloseCount}</span>
                             </Row>
                            }
                            if(dateItem.calibrationCloseCount){ //关闭
                              return  <Row align='middle' justify='center' style={{ background:'#f5222d',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                              <span style={{color:'#fff'}}>{dateItem.calibrationCloseCount}</span>
                            </Row>
                              }

                            if(dateItem.calibrationCompleteCount){//完成
                            return  <Row align='middle' justify='center' style={{ background:'#1890ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                            <span style={{color:'#fff'}}>{dateItem.calibrationCompleteCount}</span>
                          </Row>
                            }
                            if(dateItem.operationStatus){ //运营周期内
                              return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                                      
                                     </Row>
                              }else{
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
      title: '工单分布',
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
                 
                const outTypeObj = {
                  "inspectionCount"  : "inspectionCompleteCount",
                  "calibrationCount" :'calibrationCompleteCount',
                  "repairCount" :'repairCompleteCount',
                  "matchingComparisonCount" :'matchingComparisonCompleteCount',
                  "cooperationInspectionCount" :'cooperationInspectionCompleteCount',
                  "calibrationTestCount":'calibrationTestCompleteCount',
                 }
                return row.datePick.map(dateItem=>{
                           for(let key in outTypeObj){ //完成
                              if(outType=== key && dateItem[`${outTypeObj[key]}`]){ 
                                return  <Row align='middle' justify='center' style={{ background:'#1890ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                                <span style={{color:'#fff'}}>{dateItem[`${outTypeObj[key]}`]}</span>
                               </Row>
                              }

                          }
                        if(dateItem.operationStatus){ //运营周期内
                          return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                                  
                                 </Row>
                          }else{
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
// 暴露的子组件方法，给父组件调用
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
  props.parentCallback(key) //子组件调用父组件函数方法 可以向父组件传参，刷新父组件信息

  setTimeout(()=>{
    queryPar&&queryPar.beginTime&&props.regEntGetTaskWorkOrderList({
      ...queryPar,
      outOrInside:key// 子组件调用的父组件方法
    })
  },500)

 }
  return (
      <div style={{height:'100%'}}>
   
      <Tabs defaultActiveKey="1"  onChange={tabsChange} style={{height:'100%'}}>
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
     
   

      {/**市级别弹框 */}
      <Modal
        title={`${regName}-统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
                   内派发的计划工单完成情况`}
        visible={cityVisible}
        onCancel={()=>{setCityVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
     <Card title={  searchCityRegComponents()}>
     <SdlTable
        loading = {cityTableLoading}
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
        内派发的计划工单完成情况`}
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
          // onChange: handleTableChange,
      }}
      
      />
   </Card>
 
      </Modal> 

        {/**计划内 省级&&市级工单数弹框  计划巡检 计划校准*/}
        <Modal
        title={`${regName}-统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
        ${insideWorkType==1?  '内派发的计划巡检工单完成情况' :'内派发的计划校准工单完成情况' }`}
        visible={insideWorkOrderVisible}
        onCancel={()=>{setInsideWorkOrderVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
     <Card title={  searchWorkComponents()}>
     <SdlTable
        loading = {insideOrOutsideWorkLoading}
        bordered
        dataSource={insideOrOutsiderWorkTableDatas}
        columns={insideWorkType==1? insideWorkOrderColumns : insideWorkOrderColumns2}
        scroll={{ y: clientHeight - 580}}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          // onChange: handleTableChange,
      }}
      />
   </Card>
      </Modal> 
 
           {/**计划外 省级&&市级工单数弹框  */}
      
           <Modal
        title={ `${regName}-统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
               计划外派发的计划校准工单完成情况`}
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
          // onChange: handleTableChange,
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