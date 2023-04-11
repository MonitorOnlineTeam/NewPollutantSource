/**
 * 功  能：计划工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,Fragment,useRef,useImperativeHandle,forwardRef} from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Popover, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tabs,Calendar,Tag,Spin    } from 'antd';
import SdlTable from '@/components/SdlTable';
import MultipleHeadResizeTable from '@/components/MultipleHeadResizeTable';
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
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
import TaskRecordDetails from '@/pages/EmergencyTodoList/EmergencyDetailInfoLayout'

const { TextArea } = Input;
const { Option } = Select;
const namespace = 'planWorkOrderStatistics'




const dvaPropsData =  ({ loading,planWorkOrderStatistics,global }) => ({
  tableDatas:planWorkOrderStatistics.tableDatas,
  pointDatas:planWorkOrderStatistics.pointDatas,
  tableLoading:planWorkOrderStatistics.tableLoading,
  tableTotal:planWorkOrderStatistics.tableTotal,
  abnormalLoading:loading.effects[`${namespace}/abnormalExceptionTaskList`],
  abnormalTypes:planWorkOrderStatistics.abnormalTypes,
  dateCol:planWorkOrderStatistics.dateCol,
  abnormalList:planWorkOrderStatistics.abnormalList,
  queryPar:planWorkOrderStatistics.queryPar,
  // getPointExceptionLoading:loading.effects[`${namespace}/getPointExceptionSignList`],
  insideOrOutsideWorkLoading:loading.effects[`${namespace}/insideOrOutsideWorkGetTaskWorkOrderList`],
  insideOrOutsiderWorkTableDatas:planWorkOrderStatistics.insideOrOutsiderWorkTableDatas,
  insideOrOutsiderWorkTableTotal:planWorkOrderStatistics.insideOrOutsiderWorkTableTotal,
  clientHeight: global.clientHeight,
  entOutsidePointListTotal:planWorkOrderStatistics.entOutsidePointListTotal,
  entOutsidePointListDatas:planWorkOrderStatistics.entOutsidePointListDatas,
  entOutsidePointLoading:loading.effects[`${namespace}/entOutsidePointGetTaskWorkOrderList`],
  exportLoading:loading.effects[`${namespace}/workEntExportTaskWorkList`],
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
    insideOrOutsideWorkGetTaskWorkOrderList:(payload)=>{ // 计划内 工单数 弹框
      dispatch({
        type: `${namespace}/insideOrOutsideWorkGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    entOutsidePointGetTaskWorkOrderList:(payload)=>{ // 计划内 工单数 弹框
      dispatch({
        type: `${namespace}/entOutsidePointGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    workEntExportTaskWorkList:(payload)=>{ // 导出 计划内 工单数 弹框
      dispatch({
        type: `${namespace}/workEntExportTaskWorkList`,
        payload:payload,
      })
    },
  }
}
const Index = (props,ref) => {


  const [regionForm] = Form.useForm();


  const [data, setData] = useState([]);


  const [tableVisible,setTableVisible] = useState(false)
  const [abnormalType,setAbnormalType] = useState(1)



  


  const [regionCode,setRegionCode]  = useState();
  const  [regName ,setRegName] = useState()

  
  const  { tableDatas,tableTotal,loadingConfirm,pointDatas,tableLoading,pointLoading,exportLoading,exportPointLoading,abnormalTypes,refInstance } = props; 
  
  const { insideOrOutsideWorkLoading ,insideOrOutsiderWorkTableDatas,insideOrOutsiderWorkTableTotal,clientHeight} = props;

  
  useEffect(() => {

  
    },[]);

  

  const plannedInspectTip =()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>通过该页面可以查看监测点完成的计划工单情况。</li>
    <li>运维状态：运维暂停则系统停止派发自动工单。</li>
  </ol>
  }
  const workOrderTip = ()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>运维周期内：在监测点的实际运维周期内。 </li>
    <li>完成工单：当日完成的工单。</li>
    <li>系统关闭工单：当日系统关闭的工单。</li>
    <li>同时存在关闭和完成的工单：当日存在系统关闭工单，也存在完成工单。</li>

  </ol>
  }

  const [popVisible, setPopVisible] = useState(false)
  const [showTaskID,setShowTaskID ] = useState()
  const [showId,setShowId ] = useState(-1)

  const popContent = (type,id,taskTypeName,data,taskWorkNum1,taskWorkNum2, ) => {
  const oneNum = (record,taskNumData)=>record&&record[0]? <div style={{width:'100%',lineHeight:'44.5px', cursor: 'pointer',color:'#fff' }} onClick={() => {setShowId(-1);taskDetail(record&&record[0]) }}>{taskNumData}</div> : <span style={{color:'#fff'}}>{taskNumData}</span>
  const multipleNum = (dataSource,taskNumData,typeName) => dataSource&&dataSource[0]? <Popover
    zIndex={9999}
    placement="top"
    onVisibleChange={(newVisible) => {setPopVisible(newVisible) }}
    trigger="click"
    visible={showId==`${id}${typeName}`&&popVisible }
    // overlayClassName={styles.popSty}
    // getPopupContainer={trigger => trigger.parentNode}
    content={
      <Table
        bordered
        size='small'
        showHeader={false}
        columns={[
          {
            align: 'center',
            width: 180,
            dataIndex:'TaskCode',
            key:'TaskCode',
          },
          {
            align: 'center',
            width: 100,
            render: (text, record, index) => <a onClick={() => {taskDetail(record) }}>查看详情</a>
          }
        ]}
        dataSource={dataSource} pagination={false} />
    }>
    <div onClick={()=>{setShowId(`${id}${typeName}`)}} style={{width:'100%',lineHeight:'44.5px', cursor:'pointer',color:'#fff' }}>{taskNumData}</div>
  </Popover> :  <span style={{color:'#fff'}}>{taskNumData}</span>
    if (type == 1) {
      if (data.taskID&&data.taskID.length > 1) {
        return  multipleNum(data.taskList,taskWorkNum1,taskTypeName)
      } else {
       return  oneNum(data.taskList,taskWorkNum1)
      }
    } else { //同时存在两种工单
      let taskWorkNums1,taskWorkNums2;
      const popData = data.taskList.filter(item=>item.TaskStatus!=3)
      if(data[taskTypeName] > 1 ){ 
        taskWorkNums1 =  multipleNum(popData,taskWorkNum1,taskTypeName)
      }else{
        taskWorkNums1 = oneNum(popData,taskWorkNum1)
      }
      //完成工单
      const popData2 = data.taskList.filter(item=>item.TaskStatus==3)
      if(data['taskCompleteCount'] > 1 ){
        taskWorkNums2 =  multipleNum(popData2,taskWorkNum2,'taskCompleteCount')
      }else{
        taskWorkNums2 =  oneNum(popData2,taskWorkNum2)
      }
      return <Row align='middle' justify='center' style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <div  style={{width:'50%', height:'100%',display:'flex',alignItems:'center', background: taskTypeName =='taskInCompleteCount'? '#faad14': '#f5222d'}}> {taskWorkNums1} </div>
            <div  style={{width:'50%', height:'100%', display:'flex',alignItems:'center',background: '#1890ff' }}> {taskWorkNums2} </div>
            </Row>;
    }

  }

  const [taskRecordDetailVisible, setTaskRecordDetailVisible] = useState(false)
  const [taskID, setTaskID] = useState()
  const taskDetail = (record) => { //详情
      setTaskID(record.ID)
      setTaskRecordDetailVisible(true)
  }
  const columns = [
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      width: 150,
      ellipsis:true,

      // render:(text,record,index)=>{
      //  return  <div style={{textAlign:"left"}}>{text}</div>
      // }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '计划巡检工单',
      width:255,
      children: [
        {
          title:  <span>待完成数</span>,
          dataIndex: 'inspectionIncompleteCount',
          key: 'inspectionIncompleteCount',
          width: 100,
          align:'center',
          sorter: (a, b) => a.inspectionIncompleteCount - b.inspectionIncompleteCount,
        },
        {
          title: <span>结束数<Tooltip  title={'系统关闭工单数、完成工单数'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'inspectionCloseCount',
          key: 'inspectionCloseCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
            return  <Button type="link" onClick={()=>{workOrderNum(1,record)}}>{text}</Button>
            }
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'inspectionCompleteCount',
          key: 'inspectionCompleteCount',
          width: 70,
          align:'center',
        },
        {
          title: <span>完成率<Tooltip  title={'（完成数/结束数）* 100%'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'inspectionRate',
          key: 'inspectionRate',
          width: 105,
          align:'center',
          sorter: (a, b) =>props.sortRate(a,b,'inspectionRate'),
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
      width:255,
      children: [
        {
          title:  <span>待完成数</span>,
          dataIndex: 'calibrationIncompleteCount',
          key: 'calibrationIncompleteCount',
          width: 100,
          align:'center',
          sorter: (a, b) => a.calibrationIncompleteCount - b.calibrationIncompleteCount,
        },
        {
          title: <span>结束数<Tooltip  title={'系统关闭工单数、完成工单数'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'calibrationCloseCount',
          key: 'calibrationCloseCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
            return  <Button type="link" onClick={()=>{workOrderNum(2,record)}}>{text}</Button>
            }
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'calibrationCompleteCount',
          key: 'calibrationCompleteCount',
          width: 70,
          align:'center',
        },
        {
          title: <span>完成率<Tooltip  title={'（完成数/结束数）* 100%'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'calibrationRate',
          key: 'calibrationRate',
          width: 105,
          align:'center',
          sorter: (a, b) =>props.sortRate(a,b,'calibrationRate'),
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text=='-'? 0 : text}
                  size="small"
                  style={{width:'70%'}}
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
          title:  <span>待完成数</span>,
          dataIndex: 'taskIncompleteCount',
          key: 'taskIncompleteCount',
          width: 100,
          align:'center',
          sorter: (a, b) => a.taskIncompleteCount - b.taskIncompleteCount,
        },
        {
          title: <span>结束数</span>,
          dataIndex: 'taskCloseCount',
          key: 'taskCloseCount',
          width: 70,
          align:'center',
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'taskCompleteCount',
          key: 'taskCompleteCount',
          width: 70,
          align:'center',
        },
        {
          title: <span>完成率</span>,
          dataIndex: 'taskRate',
          key: 'taskRate',
          width: 105,
          align:'center',
          sorter: (a, b) =>props.sortRate(a,b,'taskRate'),
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
          title:  <span>待完成数</span>,
          dataIndex: 'taskIncompleteCount',
          key: 'taskIncompleteCount',
          width: 100,
          align:'center',
          sorter: (a, b) => a.taskIncompleteCount - b.taskIncompleteCount,
        },
        {
          title: <span>结束数</span>,
          dataIndex: 'taskCloseCount',
          key: 'taskCloseCount',
          width: 70,
          align:'center',
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'taskCompleteCount',
          key: 'taskCompleteCount',
          width: 70,
          align:'center',
        },
        {
          title: <span>完成率</span>,
          dataIndex: 'taskRate',
          key: 'taskRate',
          width: 105,
          align:'center',
          sorter: (a, b) =>props.sortRate(a,b,'taskRate'),
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text=='-'? 0 : text}
                  size="small"
                  style={{width:'70%'}}
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
   const outsideColumns =  [ //计划外 首页面
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      width: 150,
      ellipsis:true,
      // render:(text,record,index)=>{
      //  return  <div style={{textAlign:"left"}}>{text}</div>
      // }
    },
    {
      title: <span>监测点名称</span>,
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
      width: 120,
      ellipsis:true,
      render:(text,record,index)=>{
        return  <a
         onClick={()=>{
           outPointClick(record)
         }}
        >{text}</a>
      }
    },
    {
      title: '计划外完成工单',
      width:200,
      children: [
        {
          title: <span>总数<Tooltip  title={'日期条件内完成的工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'allCompleteTaskCount',
          key: 'allCompleteTaskCount',
          width: 100,
          align:'center',
        },
        {
          title: '巡检',
          dataIndex: 'inspectionCompleteCount',
          key: 'inspectionCompleteCount',
          width: 80,
          align: 'center',
        },
        {
          title: '维护',
          dataIndex: 'maintainCompleteCount',
          key: 'maintainCompleteCount',
          width: 80,
          align: 'center',
        },
        {
          title: '备品备件更换',
          dataIndex: 'sparePartsCompleteCount',
          key: 'sparePartsCompleteCount',
          width: 100,
          align: 'center',
        },
        {
          title: '易耗品更换',
          dataIndex: 'consumablesCompleteCount',
          key: 'consumablesCompleteCount',
          width: 100,
          align: 'center',
        },
        {
          title: pollutantType == 1 ? '试剂更换' : '标准物质更换',
          dataIndex: pollutantType == 1 ? 'reagentCompleteCount' : 'referenceMaterialsCompleteCount',
          key: pollutantType == 1 ? 'reagentCompleteCount' : 'referenceMaterialsCompleteCount',
          width: pollutantType == 1 ? 80 : 100,
          align: 'center',
        },
        {
          title: '校准',
          dataIndex: 'calibrationCompleteCount',
          key: 'calibrationCompleteCount',
          width: 80,
          align: 'center',
        },
        {
          title: '配合检查',
          dataIndex: 'cooperationInspectionCompleteCount',
          key: 'cooperationInspectionCompleteCount',
          width: 100,
          align: 'center',
        },
        {
          title: '校验测试',
          dataIndex: 'calibrationTestCompleteCount',
          key: 'calibrationTestCompleteCount',
          width: 100,
          align: 'center',
        },
        {
          title: '维修',
          dataIndex: 'repairCompleteCount',
          key: 'repairCompleteCount',
          width: 80,
          align: 'center',
        },
    
        {
          title: '参数核对',
          dataIndex: 'matchingComparisonCompleteCount',
          key: 'matchingComparisonCompleteCount',
          width: 100,
          align: 'center',
        },
        {
          title: '配合比对',
          dataIndex: 'coordinationComparisonCompleteCount',
          key: 'coordinationComparisonCompleteCount',
          width: 120,
          align: 'center',
        },
        // {
        //   title:  <span>巡检</span>,
        //   dataIndex: 'inspectionCompleteCount',
        //   key: 'inspectionCompleteCount',
        //   width: 80,
        //   align:'center',
        // },
        // {
        //   title: '维护',
        //   dataIndex: 'maintainCompleteCount',
        //   key: 'maintainCompleteCount',
        //   width: 80,
        //   align:'center',
        // },
        // {
        //   title: '校准',
        //   dataIndex: 'calibrationCompleteCount',
        //   key: 'calibrationCompleteCount',
        //   width: 80,
        //   align:'center',
        // },
        // {
        //   title: '配合检查',
        //   dataIndex: 'cooperationInspectionCompleteCount',
        //   key: 'cooperationInspectionCompleteCount',
        //   width: 100,
        //   align:'center',
        // },
        // {
        //   title: '校验测试',
        //   dataIndex: 'calibrationTestCompleteCount',
        //   key: 'calibrationTestCompleteCount',
        //   width: 100,
        //   align:'center',
        // },
        // {
        //   title: '维修',
        //   dataIndex: 'repairCompleteCount',
        //   key: 'repairCompleteCount',
        //   width: 80,
        //   align:'center',
        // },

        // {
        //   title: '参数核对',
        //   dataIndex: 'matchingComparisonCompleteCount',
        //   key: 'matchingComparisonCompleteCount',
        //   width: 100,
        //   align:'center',
        // },
        // {
        //   title: '配合比对',
        //   dataIndex: 'coordinationComparisonCompleteCount',
        //   key: 'coordinationComparisonCompleteCount',
        //   width: 120,
        //   align:'center',
        // },
      ],
    },
   
  ]; 
  



 
 

 


 const [entCode,setEntCode] = useState()
const insideOrOutsideWorkGetTaskWorkOrderList = (par)=>{ //计划内or计划外弹框
  props.insideOrOutsideWorkGetTaskWorkOrderList({
    ...queryPar,
    // pageIndex:1,
    // pageSize:20,
    taskType:insideWorkType,
    regionLevel:undefined,
    staticType:3,
    entCode: entCode,
    ...par,
    pageIndex:undefined,
    pageSize:undefined,
  })
}
 const [insideWorkPageIndex,setInsideWorkPageIndex] = useState(1)
 const [insideWorkPageSize,setInsideWorkPageSize] =useState(20)
   

  const handleInsideWorkTableChange =   (PageIndex, PageSize )=>{ //分页 打卡异常 响应超时 弹框
    setInsideWorkPageIndex(PageIndex)
    setInsideWorkPageSize(PageSize)
    // insideOrOutsideWorkGetTaskWorkOrderList({
    //   pageIndex:PageIndex,
    //   pageSize:PageSize
    //  })
  }
const [insideWorkType, setInsideWorkType] = useState()
const [insideWorkOrderVisible, setInsideWorkOrderVisible] = useState()

const workOrderNum = (type,record) =>{ //计划内 总数工单
  
  setInsideWorkType(type) 
  setInsideWorkOrderVisible(true)
  workRegForm.resetFields()
  setRegName(`${record.entName} - ${record.pointName}`)
  setEntCode(record.entCode)
  setInsideWorkPageIndex(1)
  setInsideWorkPageSize(20)
  insideOrOutsideWorkGetTaskWorkOrderList({
   entCode:record.entCode,
   taskType:type
  })

}
const exports = () => { //导出
  props.workEntExportTaskWorkList({
    ...queryPar,
    taskType:insideWorkType,
    regionLevel:undefined,
    staticType:3,
    entCode: entCode,
    pageIndex:undefined,
    pageSize:undefined,
   })
 
};
  // const onFinishWorkOrder = async () =>{  //计划内  查询 工单


  //   try {
  
  //     const values = await workRegForm.validateFields();
  //     setInsideWorkPageIndex(1)
  //     setInsideWorkPageSize(20)
  //     insideOrOutsideWorkGetTaskWorkOrderList({
  //       ...values,
  //     }) 
  //   } catch (errorInfo) {
  //     console.log('Failed:', errorInfo);
  //   }
  // }
  const [ workRegForm ]= Form.useForm()
  const searchWorkComponents = () =>{ //计划内 查询 工单
    return <> 
    <Form
    // onFinish={onFinishWorkOrder}
    form={workRegForm}
    layout={'inline'}
  >   
      <Row justify='space-between'  align='middle' style={{flex:1}} >

        <Col >
        <Row align='middle'>
        <Form.Item >
      <Button icon={<ExportOutlined />}  loading={exportLoading}  onClick={()=>{ exports()} }>
            导出
     </Button> 
     </Form.Item>
     </Row>
     </Col>


     <Col>
     <Row align='middle'>
       <div style={{marginRight:8}}>
     <div style={{display:'inline-block', background:'#bae7ff',width:24,height:12,marginRight:5}}></div>
       <span>运维周期内</span>
       </div>
       <div style={{marginRight:8}}>
       <div style={{display:'inline-block',background:'#faad14',width:24,height:12,marginRight:5}}></div>
       <span>待完成工单</span>    
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
       {/* <div style={{display:'inline-block',background:'#faad14',width:24,height:12,marginRight:5}}></div>
       <span>当日存在关闭和完成工单</span>
       <Tooltip overlayClassName='customTooltipSty' placement="bottom"   title={workOrderTip()}><QuestionCircleOutlined style={{paddingLeft:5,fontSize:20}}/></Tooltip> */}
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

   
   const { dateCol } = props;
   const insideWorkOrderColumnsPush = (col)=>{ //计划内 巡检周期
     if(dateCol&&dateCol[0]){ 
 
       col.push({
         title: '工单分布（按待完成工单的创建时间、已完成工单的完成时间、已关闭工单的关闭时间分布）',
         width:200, 
         align:'center',
         children:dateCol.map((item,index)=>{
           return { 
             title: `${item.date.split('_')[0]}`,
             width: 70,
             align:'center',
             ellipsis:false,
             children: [{
                 title: `${item.date.split('_')[1]}`,
                 dataIndex: `${item.date.split('_')[1]}`,
                 key: `${item.date.split('_')[1]}`,
                 width: 70,
                 align:'center',
                 ellipsis:false,
                 render:(text,row,index)=>{
                  let workNumEle,taskWorkNum1,taskWorkNum2,taskTypeName;
                  return row.datePick.map(dateItem=> {
                    if (dateItem.taskInCompleteCount && dateItem.taskCompleteCount && dateItem.date == item.date) { //同时存在 待完成和完成工单
                      taskWorkNum1 =  dateItem.taskInCompleteCount
                      taskWorkNum2 =  dateItem.taskCompleteCount
                      taskTypeName = 'taskInCompleteCount'
                      return  popContent(2,`${row.DGIMN}${dateItem.date}`,taskTypeName,dateItem, taskWorkNum1,taskWorkNum2)
                   }
                    if (dateItem.taskCloseCount && dateItem.taskCompleteCount && dateItem.date == item.date) { //同时存在 关闭和完成工单
                      taskWorkNum1 = dateItem.taskCloseCount
                      taskWorkNum2 = dateItem.taskCompleteCount
                      taskTypeName = 'taskCloseCount'
                       return popContent(2,`${row.DGIMN}${dateItem.date}`,taskTypeName,dateItem, taskWorkNum1,taskWorkNum2)
                    }
  
                    if (dateItem.taskInCompleteCount && dateItem.date == item.date) {//待完成
                      workNumEle = <Row align='middle' justify='center' style={{ background: '#faad14', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <span style={{ color: '#fff' }}>{dateItem.taskInCompleteCount}</span>
                      </Row>
                      taskTypeName = 'taskCount'
                      return popContent(1,`${row.DGIMN}${dateItem.date}`,taskTypeName,dateItem, workNumEle ) 
                    }
                    if (dateItem.taskCompleteCount && dateItem.date == item.date) {//完成
                      workNumEle = <Row align='middle' justify='center' style={{ background: '#1890ff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <span style={{ color: '#fff' }}>{dateItem.taskCompleteCount}</span>
                      </Row>
                      taskTypeName = 'taskCount'
                      return popContent(1,`${row.DGIMN}${dateItem.date}`,taskTypeName,dateItem, workNumEle ) 
                    }
                    if (dateItem.taskCloseCount && dateItem.date == item.date) { //关闭
                      workNumEle = <Row align='middle' justify='center' style={{ background: '#f5222d', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <span style={{ color: '#fff' }}>{dateItem.taskCloseCount}</span>
                      </Row>
                      taskTypeName = 'taskCount'
                      return popContent(1,`${row.DGIMN}${dateItem.date}`,taskTypeName ,dateItem, workNumEle ) 
                    }
  
                    if (dateItem.operationStatus && dateItem.date == item.date) { //运维周期内
                      workNumEle = <Row align='middle' justify='center' style={{ background: '#bae7ff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></Row>
                      return workNumEle
  
                    } else if (!dateItem.operationStatus && !dateItem.taskCount && dateItem.date == item.date) {
                      workNumEle = <Row align='middle' justify='center' style={{ background: '#fff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}> </Row>
                      return workNumEle
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
         title: '工单分布（按待完成工单的创建时间、已完成工单的完成时间、已关闭工单的关闭时间分布）',
         width:200, 
         align:'center',
         children:dateCol.map((item,index)=>{
           return { 
             title: `${item.date.split('_')[0]}`,
             width: 70,
             align:'center',
             ellipsis:false,
             children: [{
                 title: `${item.date.split('_')[1]}`,
                 dataIndex: `${item.date.split('_')[1]}`,
                 key: `${item.date.split('_')[1]}`,
                 width: 70,
                 align:'center',
                 render:(text,row,index)=>{
                  let workNumEle,taskWorkNum1,taskWorkNum2,taskTypeName;
                  return row.datePick.map(dateItem=> {
                    if (dateItem.taskInCompleteCount && dateItem.taskCompleteCount && dateItem.date == item.date) { //同时存在 待完成和完成工单
                      taskWorkNum1 =  dateItem.taskInCompleteCount
                      taskWorkNum2 =  dateItem.taskCompleteCount
                      taskTypeName = 'taskInCompleteCount'
                      return  popContent(2,`${row.DGIMN}${dateItem.date}`,taskTypeName,dateItem, taskWorkNum1,taskWorkNum2)
                   }
                    if (dateItem.taskCloseCount && dateItem.taskCompleteCount && dateItem.date == item.date) { //同时存在 关闭和完成工单
                      taskWorkNum1 = dateItem.taskCloseCount
                      taskWorkNum2 = dateItem.taskCompleteCount
                      taskTypeName = 'taskCloseCount'
                       return popContent(2,`${row.DGIMN}${dateItem.date}`,taskTypeName,dateItem, taskWorkNum1,taskWorkNum2)
                    }
  
                    if (dateItem.taskInCompleteCount && dateItem.date == item.date) {//待完成
                      workNumEle = <Row align='middle' justify='center' style={{ background: '#faad14', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <span style={{ color: '#fff' }}>{dateItem.taskInCompleteCount}</span>
                      </Row>
                      taskTypeName = 'taskCount'
                      return popContent(1,`${row.DGIMN}${dateItem.date}`,taskTypeName,dateItem, workNumEle ) 
                    }
                    if (dateItem.taskCompleteCount && dateItem.date == item.date) {//完成
                      workNumEle = <Row align='middle' justify='center' style={{ background: '#1890ff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <span style={{ color: '#fff' }}>{dateItem.taskCompleteCount}</span>
                      </Row>
                      taskTypeName = 'taskCount'
                      return popContent(1,`${row.DGIMN}${dateItem.date}`,taskTypeName,dateItem, workNumEle ) 
                    }
                    if (dateItem.taskCloseCount && dateItem.date == item.date) { //关闭
                      workNumEle = <Row align='middle' justify='center' style={{ background: '#f5222d', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <span style={{ color: '#fff' }}>{dateItem.taskCloseCount}</span>
                      </Row>
                      taskTypeName = 'taskCount'
                      return popContent(1,`${row.DGIMN}${dateItem.date}`,taskTypeName ,dateItem, workNumEle ) 
                    }
  
                    if (dateItem.operationStatus && dateItem.date == item.date) { //运维周期内
                      workNumEle = <Row align='middle' justify='center' style={{ background: '#bae7ff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></Row>
                      return workNumEle
  
                    } else if (!dateItem.operationStatus && !dateItem.taskCount && dateItem.date == item.date) {
                      workNumEle = <Row align='middle' justify='center' style={{ background: '#fff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}> </Row>
                      return workNumEle
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
  insideWorkOrderColumnsPush(insideWorkOrderColumns2)



// 暴露的子组件方法，给父组件调用
const childRef = useRef();
useImperativeHandle(refInstance,() => {
     return {
        _childFn(values) {
            // setAbnormalType(values)
        }
    }
})

const {entOutsidePointListTotal,entOutsidePointListDatas,entOutsidePointLoading,pollutantType,} = props;
const [operaPointVisible, setOperaPointVisible] = useState(false)
const [DGIMN, setDGIMN] = useState()
const [dete, setDete] = useState({})
// const [entName, setEntName] = useState({})
const outTypeObj = {
  "inspectionCount"  : "巡检工单",
  "maintainCount"  : "维护工单",
  "sparePartsCount": "备品备件更换工单",
  "consumablesCount":'易耗品更换工单',
  "referenceMaterialsCount":"标准物质更换工单",
  "reagentCount" : "试剂更换工单",
  "calibrationCount" :'校准工单',
  "cooperationInspectionCount" :'配合检查工单',
  "calibrationTestCount":'校验测试工单',
  "repairInfoCount" :'维修工单',
  "matchingComparisonCount" :'参数核对',
  "coordinationComparisonCount": '配合比对完成工单数',
 }
 const outTypeColor = {
  "inspectionCount"  : '#1890ff',
  "maintainCount"  : "#a0d911",
  "sparePartsCount": "#eb2f96",
  "consumablesCount":'#722ed1',
  "referenceMaterialsCount":"#bfbfbf",
  "reagentCount" : "#bfbfbf",
  "calibrationCount" :'#52c41a',
  "cooperationInspectionCount" :'#fa8c16',
  "calibrationTestCount":'#08979c',
  "repairInfoCount" :'#f5222d',
  "matchingComparisonCount" :'#13c2c2',
  "coordinationComparisonCount": '#fa541c',
 }
const dateCellRender = (value)=>{//日期
  let ele=[];
  if(entOutsidePointListDatas&&entOutsidePointListDatas[0]){
     entOutsidePointListDatas.map((item,index)=>{
      if(  moment(value).format("M") == item.month && moment(value).format("D") == item.day){
         for(let key in item){ //完成
          if(item[key] && outTypeObj[key]){ 
            ele.push(<Tag style={{minWidth:110,}} color={outTypeColor[key]}>{`${outTypeObj[key]} ${ item[key]}个`}</Tag>)
          //  return  <Tag color={outTypeColor[key]}>{`${outTypeObj[key]} ${ item[key]}个`}</Tag>;
        }
      }
      }
  })
  return ele;
  }

} 
const monthCellRender = (value) =>{//月份
  let ele=[];
  if(entOutsidePointListDatas&&entOutsidePointListDatas[0]){
    entOutsidePointListDatas.map((item,index)=>{
      if(Number(value.month()) + 1 == item.month ){
         for(let key in item){ //完成
          if(item[key] && outTypeObj[key]){ 
           ele.push(<Tag  style={{minWidth:110,}} color={outTypeColor[key]}>{`${outTypeObj[key]} ${ item[key]}个`}</Tag>);
        }
      }
      }
  })
  return ele;
  }

}
const  onPanelChange = (value, mode)=> { //日期面板变化回调
  entOutsidePointGetTaskWorkOrderList({
    DGIMN:DGIMN,
    beginTime:mode==='month'? moment(value).startOf('month').format('YYYY-MM-DD 00:00:00') :moment(value).startOf('year').format('YYYY-MM-DD 00:00:00'),
    endTime:mode==='month'?moment(value).endOf('month').format('YYYY-MM-DD 23:59:59'):moment(value).endOf('year').format('YYYY-MM-DD 23:59:59'),
    calendarType: mode==='month'? 1:2,
  })
}


 
const outPointClick = (record) =>{ //计划外 监测点名称
  setOperaPointVisible(true)
  setDGIMN(record.DGIMN)
  setRegName(`${record.entName} - ${record.pointName}`)
   entOutsidePointGetTaskWorkOrderList({
    DGIMN:record.DGIMN,
    beginTime:moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
    endTime:moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
    calendarType:1,
  })
  
}

const entOutsidePointGetTaskWorkOrderList = (par) =>{
  props.entOutsidePointGetTaskWorkOrderList({
    staticType: 4,
    outOrInside:2,
    ...par,
  })
  setDete({
    beginTime:moment(par.beginTime).format('YYYY-MM-DD'),
    endTime:moment(par.endTime).format('YYYY-MM-DD'),
  })
}
  const [tabType,setTabType] = useState("1")

 const { queryPar } = props;
 const tabsChange = (key)=>{

  setTabType(key)
  setPageIndex(1)
  setPageSize(20)
  setTimeout(()=>{
    props.parentCallback(key) //子组件调用父组件函数方法 可以向父组件传参，刷新父组件信息
    queryPar&&queryPar.beginTime&&props.regEntGetTaskWorkOrderList({
      ...queryPar,
      // pageIndex:1,
      // pageSize:20,
      regionLevel: 1,
      staticType:2,
      outOrInside:key// 子组件调用的父组件方法
    })
  },300)

 }

 const [pageIndex,setPageIndex] = useState(1)
 const [pageSize,setPageSize] = useState(20)


 const handleTableChange = (PageIndex, PageSize )=>{ //计划内 计划外
  setPageIndex(PageIndex)
  setPageSize(PageSize)
  // props.regEntGetTaskWorkOrderList({
  //   ...queryPar,
  //   pageIndex:PageIndex,
  //   pageSize:PageSize,
  //   outOrInside:tabType,
  // })
 }
  return (
      <div>
   
      <Tabs defaultActiveKey="1"  onChange={tabsChange}>
    <Tabs.TabPane tab="计划工单统计" key="1">
    <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          current:pageIndex,
          pageSize:pageSize,
          total:tableTotal,
          onChange: handleTableChange,
      }}
      />
    </Tabs.TabPane>
    <Tabs.TabPane tab="计划外工单统计" key="2">
    <SdlTable 
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={outsideColumns}
        className={styles.entPlanOutTableSty}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          current:pageIndex,
          pageSize:pageSize,
          total:tableTotal,
          onChange: handleTableChange,
      }}
      />
    </Tabs.TabPane>
  </Tabs>
     
   

   
  {/**计划外 监测点数弹框 */}
      
      <Modal
        title={regName}
        visible={operaPointVisible}
        onCancel={()=>{setOperaPointVisible(false)}}
        footer={null}
        destroyOnClose
        wrapClassName={`${styles.pointModalSty} spreadOverModal`}
      >
     <Card title={`统计${ dete.beginTime&&dete.beginTime} ~ ${dete.endTime&&dete.endTime}内计划外工单情况`}
        style={{
          height:clientHeight - 250,
          overflowY:'auto'
        }}
        >
          
      <Spin spinning={entOutsidePointLoading}>
     <Calendar
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender} 
        // onChange={onDateChange}
        onPanelChange={onPanelChange}

        />
      </Spin>
   </Card>
 
      </Modal> 

        {/**计划内 企业 计划巡检 计划校准*/}
        <Modal
        title={`${regName}-统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
        ${insideWorkType==1?  '内派发的计划巡检工单完成情况' :'内派发的计划校准工单完成情况' }`}
        visible={insideWorkOrderVisible}
        onCancel={()=>{setInsideWorkOrderVisible(false)}}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal`}
      >
     <Card title={  searchWorkComponents()}>
     <MultipleHeadResizeTable
        loading = {insideOrOutsideWorkLoading}
        bordered
        dataSource={insideOrOutsiderWorkTableDatas}
        columns={insideWorkType==1? insideWorkOrderColumns : insideWorkOrderColumns2}
        scroll={{ y: clientHeight - 450}}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize:insideWorkPageSize,
          current:insideWorkPageIndex,
          total:insideOrOutsiderWorkTableTotal,
          onChange: handleInsideWorkTableChange,
      }}
      />
   </Card>
      </Modal> 
      <Modal
          title="任务详情"
          visible={taskRecordDetailVisible}
          destroyOnClose
          wrapClassName='spreadOverModal'
          footer={null}
          onCancel={() => {
            setTaskRecordDetailVisible(false)
            setPopVisible(true)
          }}

        >
          <TaskRecordDetails 
            match={{ params: { TaskID: taskID, DGIMN: null } }}
            isHomeModal
            hideBreadcrumb
          />
        </Modal>

        </div>
  );
};
const TFunction = connect(dvaPropsData,dvaDispatch)(Index);

export default forwardRef((props,ref)=><TFunction {...props} refInstance={ref}/>);