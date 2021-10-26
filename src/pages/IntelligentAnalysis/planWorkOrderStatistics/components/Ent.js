/**
 * 功  能：计划工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,Fragment,useRef,useImperativeHandle,forwardRef} from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tabs,Calendar,Tag    } from 'antd';
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




const dvaPropsData =  ({ loading,planWorkOrderStatistics }) => ({
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
  getPointExceptionLoading:planWorkOrderStatistics.getPointExceptionLoading,
  entAbnormalList:planWorkOrderStatistics.entAbnormalList,
  taskList:planWorkOrderStatistics.taskList,
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
  }
}
const Index = (props,ref) => {


  const [regionForm] = Form.useForm();


  const [data, setData] = useState([]);


  const [tableVisible,setTableVisible] = useState(false)
  const [abnormalType,setAbnormalType] = useState(1)



  

  const [pageSize,setPageSize] = useState(20)
  const [pageIndex,setPageIndex] = useState(1)

  const [regionCode,setRegionCode]  = useState();
  const  [regName ,setRegName] = useState()

  
  const  { tableDatas,tableTotal,loadingConfirm,pointDatas,tableLoading,pointLoading,exportLoading,exportPointLoading,abnormalTypes,refInstance } = props; 
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
          return  <Button type="link" onClick={()=>{totalNum(1,record)}}>{text}</Button>
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
          return  <Button type="link" onClick={()=>{totalNum(2,record)}}>{text}</Button>
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


   const insideWorkOrderColumns = [
    {
      title: '省/市',
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
    },
    {
      title: '企业名称',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
      width: 150,
      render:(record,text,index)=>{
        return  <div style={{textAlign:"left"}}>Link Button</div>
      }
    },
    {
      title: '监测点名称',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '巡检周期',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '计划巡检工单',
      width:200,
      children: [
        {
          title: '总数',
          dataIndex: 'building',
          key: 'building',
          width: 50,
          align:'center',
        },
        {
          title:  "完成数",
          dataIndex: 'number',
          key: 'number',
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
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
    },
    {
      title: '企业名称',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
      width: 150,
      render:(record,text,index)=>{
        return  <div style={{textAlign:"left"}}>Link Button</div>
      }
    },
    {
      title: '监测点名称',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '巡检周期',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '计划校准工单',
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
          dataIndex: 'inspectionCount',
          key: 'inspectionCount',
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
   const outsideColumns =  [ //计划外 首页面
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
      title: <span>监测点名称</span>,
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
      width: 100,
      render:(text,record,index)=>{
        return  <Button type="link"
         onClick={()=>{
           outPointClick(record)
         }}
        >{text}</Button>
      }
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
  const cityOutRegColumns = [ //计划外  市级别 二级弹框
    {
      title: '省/市',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '运营企业数',
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 50,
    },
    {
      title: <span>运营监测点数</span>,
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
    },
    {
      title: '计划外完成工单',
      width:200,
      children: [
        {
          title: <span>总数<Tooltip  title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'building',
          key: 'building',
          width: 50,
          align:'center',
        },
        {
          title:  <span>巡检工单数</span>,
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
        },
        {
          title: '校准工单数',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
        },
        {
          title: '维护维修工单数',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
        },
        {
          title: '配合对比工单数',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
        },
        {
          title: '配合检查工单数',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
        },
        {
          title: '校验监测工单数',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
        },
      ],
    },
   
  ];
  const  outWorkOrderColumn = [ //计划外 工单
    {
      title: '省/市',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '运营企业数',
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 50,
    },
    {
      title: <span>运营监测点数</span>,
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
    },
  ]
  const operaPointColumns = [
    {
      title: '省/市',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '企业名称',
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
    },
    {
      title: '监测点名称',
      dataIndex: 'RegionName',
      key:'RegionName',
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
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
    },
    {
      title: <span>计划校准工单数<Tooltip title={'日期条件内，派发的计划校工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
    },
  ]

 
 

 
 const operaPointExports = () => {

};
const cityRegColumnsExports = () =>{

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
const [insideWorkOrderVisible, setInsideWorkOrderVisible] = useState()

const totalNum = (type,record) =>{ //计划内 总数工单
  
  setInsideWorkType(type)
  setInsideWorkOrderVisible(true)
  setRegName(record.regionName)
  setRegionCode(record.regionCode)
  insideOrOutsideWorkGetTaskWorkOrderList({
   regionCode: record.regionCode,
  })
 

}

const [operaPointVisible, setOperaPointVisible] = useState(false)
const outPointClick = (record) =>{ //计划外 监测点名称
  setOperaPointVisible(true)
}

  const handleTableChange =   async (PageIndex, )=>{ //分页
  }
  const onFinish  = async () =>{  //查询


    try {

      const values = await form.validateFields();

      props.getProjectInfoList({
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  



  const onFinishWorkOrder = async () =>{  //计划内 查询 工单


    try {

      const values = await form.validateFields();

      insideWorkOrderVisible?  props.getProjectInfoList({
        ...values,
      }) : props.getProjectInfoList({
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
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

   const [outWorkRegForm] = Form.useForm()
   const searchOutWorkComponents =()=>{ //计划外 工单弹框
    return <Form
    onFinish={onFinishWorkOrder}
    form={outWorkRegForm}
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
   const { dateCol } = props;
  const insideWorkOrderColumnsPush = (col)=>{
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
              render:(text,record)=>{
                switch(text){
                  case 1 :
                    return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                    <span style={{color:'#fff'}}>1</span>
                  </Row>
                  break;
                  case 2 :
                    return  <Row align='middle' justify='center' style={{ background:'#1890ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                    <span style={{color:'#fff'}}>1</span>
                  </Row>
                  break;
                  case 3 :
                    return  <Row align='middle' justify='center' style={{ background:'#f5222d',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                    <span style={{color:'#fff'}}>1</span>
                  </Row>
                  break;
                  case 4 :
                    return  <Row align='middle' justify='center' style={{ background:'#faad14',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                    <span style={{color:'#fff'}}>1</span>
                  </Row>
                  break;
                  default:
                    return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                    <span style={{color:'#fff'}}>1</span>
                  </Row>
                }
  
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


 const  outWorkOrderColumnPush = (col)=>{  //计划外 巡检工单

  if(dateCol&&dateCol[0]){
  col.push({
    title: '巡检工单分布',
    width:200, 
    align:'center',
    children:dateCol.map((item,index)=>{
      return { 
        title:`${item.date.split('_')[0]}`,
        width: 70,
        align:'center',
        children: [{
            title: `${item.date.split('_')[1]}`,
            dataIndex: `${item.date.split('_')[1]}`,
            key: `${item.date.split('_')[1]}`,
            width: 70,
            align:'center',
            render:(text,record)=>{
              switch(text){
                case 1 :
                  return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                  <span style={{color:'#fff'}}>1</span>
                </Row>
                break;
                case 2 :
                  return  <Row align='middle' justify='center' style={{ background:'#1890ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                  <span style={{color:'#fff'}}>1</span>
                </Row>
                break;
                default:
                  return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                  <span style={{color:'#fff'}}>1</span>
                </Row>
              }

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
        }
    }
})

const  onPanelChange = (value, mode)=> { //日历
  console.log(value.format('YYYY-MM-DD'), mode);
}
const dateCellRender = (value)=>{//日期
  if (value.month() === 8) {
    return  <Tag color="#108ee9">巡检工单1个</Tag>;
  }
} 
const monthCellRender = (value) =>{//月份 
  if (value === 8) {
    return  <Tag color="#108ee9">巡检工单23个</Tag>;
  }

}
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
          // onChange: handleTableChange,
      }}
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
     
   

   
  {/**计划外 监测点数弹框 */}
      
      <Modal
        title={'河南省新乡市运营监测点数'}
        visible={operaPointVisible}
        onCancel={()=>{setOperaPointVisible(false)}}
        footer={null}
        destroyOnClose
        width='80%'
      >
     <Card title={'计划外工单情况'}>
     <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender}  onPanelChange={onPanelChange} />
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
        centered
        width='90%'
      >
     <Card title={  searchWorkComponents()}>
     <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={insideWorkType==1? insideWorkOrderColumns : insideWorkOrderColumns2}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          // onChange: handleTableChange,
      }}
      />
   </Card>
      </Modal> 
 

        </div>
  );
};
const TFunction = connect(dvaPropsData,dvaDispatch)(Index);

export default forwardRef((props,ref)=><TFunction {...props} refInstance={ref}/>);