/**
 * 功  运维到期点位
 * 创建人：贾安波
 * 创建时间：2021.08.26
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
import styles from "./style.less"
const { Option } = Select;

const namespace = 'operationExpirePoint'




const dvaPropsData =  ({ loading,operationExpirePoint }) => ({
  tableLoading:operationExpirePoint.tableLoading,
  totalDatas:operationExpirePoint.totalDatas,
  exportLoading: loading.effects[`${namespace}/exportOperationExpirePointList`],
  checkName:operationExpirePoint.checkName,
})

const  dvaDispatch = (dispatch) => {
  return {
    getOperationExpirePointList : (payload,callback) =>{ //运维到期点位
      dispatch({
        type: `${namespace}/getOperationExpirePointList`,
        payload:payload,
        callback:callback
      })
      
    },
    exportOperationExpirePointList:(payload,callback)=>{ //导出
      dispatch({
        type: `${namespace}/exportOperationExpirePointList`,
        payload:payload,
      })
    },
    updateState:(payload)=>{ //更新数据
      dispatch({
        type: `${namespace}/updateState`, 
        payload:{...payload},
      }) 
    },
  }
} 
const Index = (props) => {



  const [form] = Form.useForm();

  const echartsRef = useRef(null);

  
 const [tableDatas,setTableDatas] = useState([])
 const [pollutantType,setPollutantType] = useState('')


  const  { tableLoading,exportLoading,checkName,totalDatas } = props; 

  
  useEffect(() => {
      getOperationExpirePointList()
  },[]);
//   useEffect(() => {
//     console.log(tableDatas)
// },[tableDatas])

  const getOperationExpirePointList = (value) =>{
    props.getOperationExpirePointList({PollutantType:value},(res)=>{
      setTableDatas(
        [...res.overdue14List,...res.overdue7List,...res.notExpired7List,...res.notExpired14List,...res.notExpired30List,
          ...res.notExpired30List,...res.notExpired60List
        ]
        )
      
    })
  }

  const columns = [
    {
      title: '项目号',
      dataIndex: 'projectCode',
      key:'projectCode',
      align:'center'
    },
    {
      title: '省份',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center'
    },
    {
      title: '监控目标',
      dataIndex: 'parentName',
      key:'parentName',
      align:'center',
    },
    {
      title: '监测点',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
    },
    {
      title: '监测点类型',
      dataIndex: 'pollutantTypeName',
      key:'pollutantTypeName',
      align:'center',
    },
    {
      title: '运营实际开始日期',
      dataIndex: 'beginTime',
      key:'beginTime',
      align:'center',
      sorter: (a, b) => moment(a.beginTime).valueOf() - moment(b.beginTime).valueOf()
    },
    {
      title: '运营实际结束日期',
      dataIndex: 'endTime',
      key:'endTime',
      align:'center',
      sorter: (a, b) => moment(a.endTime).valueOf() - moment(b.endTime).valueOf()
      
    },
  ]

  const getOption = () =>{
   return {
    color: ['#64b0fd'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: 45,
        right: 0,
        bottom: 50,
        // containLabel: true
    },

    xAxis: [
        {
            type: 'category',
            data: ['过期15~30日', '过期8~14日', '过期7日内','0~7日', '8~14日', '15~30日', '31~60日'],
            axisTick: {
                alignWithLabel: true
            },
            axisLine: { //x轴
              lineStyle: {
                color: '#333',
                width: 1
              },
            },
            axisLabel: {
              textStyle: {
                color: '#333'
              }
            },
        }
    ],
    yAxis: [
        {
            name: '监测点数（个）',
            type: 'value',
            minInterval: 1,
            splitLine:{
              show:false
            },
            axisLabel: {
              lineStyle: {
                color: '#333',
                width: 1
              },
              textStyle: {
                color: '#333'
              }
            },
        }
    ],
    series: [
        {
            name: '监测点个数',
            type: 'bar',
            barWidth: '60%',
            data: [totalDatas.overdue30, totalDatas.overdue14, totalDatas.overdue7, totalDatas.notExpired7, totalDatas.notExpired14, totalDatas.notExpired30, totalDatas.notExpired60],
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#333'
              }
          },
          itemStyle:{
            normal:{
              // color:(params)=>{
              //  return  params.name == checkName ? '#ffa940' : '#64b0fd'
              // }
              color:'#64b0fd'
            }
          }
        }
    ]
};
  }
  const  codeList = {
    '过期15~30日':"overdue30List",
    '过期8~14日':"overdue14List",
    '过期7日内':"overdue7List",
    '0~7日':"notExpired7List",
    '8~14日':"notExpired14List",
    '15~30日':"notExpired30List", 
    '31~60日':"notExpired60List"
   }
   const  titleList = {
    '过期15~30日':"运维过期15~30日",
    '过期8~14日':"运维过期8~14日",
    '过期7日内':"运维过期7日内",
    '0~7日':"0~7日内运维到期",
    '8~14日':"8~14日内运维到期",
    '15~30日':"15~30日内运维到期", 
    '31~60日':"31~60日内运维到期"
   }
 const exports = () =>{

   props.exportOperationExpirePointList({Title:`${titleList[checkName]}${pollutantType==1?'废水':pollutantType==2? '废气':'全部'}监测点列表`,Code:codeList[checkName]})
 }


  const onChange =(e) => {
    setPollutantType(e.target.value)
    getOperationExpirePointList(e.target.value);
  };

  const  onChartClick = (e)=>{
    props.updateState({checkName:e.name})
   const dataObj = {
    '过期15~30日':totalDatas.overdue30List,
    '过期8~14日':totalDatas.overdue14List,
    '过期7日内':totalDatas.overdue7List,
    '0~7日':totalDatas.notExpired7List,
    '8~14日':totalDatas.notExpired14List,
    '15~30日':totalDatas.notExpired30List, 
    '31~60日':totalDatas.notExpired60List
   }
   setTableDatas(dataObj[e.name])
   echartsRef.current.props.option.series[0].itemStyle.normal.color = (params)=>{
    return  params.name == e.name ? '#ffa940' : '#64b0fd'
  }
  echartsRef.current.getEchartsInstance().setOption(echartsRef.current.props.option)
  }
  const searchComponents = () =>{
     return  <Form
    name="advanced_search"
    className={styles['ant-advanced-search-form']}
  >  
         <Row> 
         <Form.Item name='' label=''  style={{  marginRight: 8,}} >
             <Radio.Group onChange={onChange} defaultValue="">
                <Radio.Button value="">全部</Radio.Button>
                <Radio.Button value="1">废水</Radio.Button>
                <Radio.Button value="2">废气</Radio.Button>
             </Radio.Group>
          </Form.Item>
          <Form.Item name=''  label='' >
           <Button icon={<ExportOutlined />} loading={exportLoading} onClick={()=>{ exports()} }>
            导出
           </Button>  
          </Form.Item>
      </Row>  
      <Row>
        <span style={{color:'#f5222d'}}>
        运维监测点到期后，系统将停止自动派发工单，关闭手工申请工单功能。对于续签项目请及时续签,然后将运营信息维护至平台。
        </span>
         </Row>  
     </Form>
  }

  const echartsComponents = useMemo(()=>{ //监听变量，第一个参数是函数，第二个参数是依赖，只有依赖变化时才会重新计算函数
    return <ReactEcharts
    option={getOption()}
    style={{  width: '100%' }}
    theme="my_theme "
    onEvents={{
      'click': onChartClick,
    }}   
    ref={echartsRef}  
  />
  },[tableLoading])
  return (
    <div  className={styles.operationExpirePoint}>
    <BreadcrumbWrapper>
    <Card title={searchComponents()}>
     { tableLoading? <div style={{paddingBottom:100}}><PageLoading /></div>: echartsComponents}
        <div style={{color:'#f5222d',paddingBottom:8}}>
        {titleList[checkName]}运维到期监测点列表
        </div>
        <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        scroll={{ y: 'calc(100vh - 670px)' }}
      />  
   </Card>
   </BreadcrumbWrapper>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);