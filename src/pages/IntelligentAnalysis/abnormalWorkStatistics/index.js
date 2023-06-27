/**
 * 功  能：异常工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "./style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import Region from './components/Region'
import Ent from './components/Ent'
import RegionDetail from './regionDetail'
const namespace = 'abnormalWorkStatistics'




const dvaPropsData =  ({ loading,abnormalWorkStatistics }) => ({
  tableDatas:abnormalWorkStatistics.tableDatas,
  tableLoading:abnormalWorkStatistics.tableLoading,
  exportLoading: loading.effects[`${namespace}/exportExceptionTaskList`],
  queryPar:abnormalWorkStatistics.queryPar,
  tableTotal:abnormalWorkStatistics.tableTotal,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:{...payload},
      })
    },
    regEntExceptionTaskList:(payload)=>{ //省级 异常工单
      dispatch({
        type: `${namespace}/regEntExceptionTaskList`,
        payload:payload,
      })
    }, 
    exportExceptionTaskList:(payload)=>{ //导出
      dispatch({
        type: `${namespace}/exportExceptionTaskList`,
        payload:payload,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [showType,setShowType] = useState('1')
  const [dates, setDates] = useState([]);
  const  { tableDatas,tableTotal,loadingConfirm,pointDatas,tableLoading,pointLoading,exportLoading,queryPar,isResponseModal,isClockAbnormalModal } = props; 
  
  
  useEffect(() => {
    onFinish();
  
  },[]);


  const showTypeChange =  (e) =>{
     setShowType(e.target.value)
     setPageSize(20)
  }

  useEffect(() => {
      onFinish();
  },[showType]);


  const exports =  async () => {

    props.exportExceptionTaskList({
       ...queryPar,
       pageIndex:undefined,
       pageSize:undefined,
    })
     
 };

 

  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询
     
    try {
      const values = await form.validateFields();
      if(values.time[1].diff(values.time[0], 'days') <= 90){
      
       const exceptionType = isResponseModal? 2 : isClockAbnormalModal? 1: values.exceptionType;
       pchildref.current._childFn(exceptionType);
       
       !pageIndex&&setPageIndex(1)
       props.regEntExceptionTaskList({
          ...values,
          time:undefined,
          staticType:showType,
          beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
          endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
          regionLevel: showType==1? 1 :undefined,
          exceptionType:exceptionType,
          pageIndex: pageIndexs? pageIndexs : 1,
          pageSize: pageSizes? pageSizes : pageSize,
        })


      }else{
        message.warning('日期单位不能超过90天，请重新选择')
      }

    } catch (errorInfo) {
      console.log('Failed:', errorInfo);                                                               }
  }




  // const abnormalTypeChange =  (data) =>{
    // pchildref.current._childFn(data);
    // props.updateState({
    //   abnormalTypes : data
    // })
    // onFinish()

  // }
  const resRegionDetailModal = (query) =>{  //首页响应详情弹框
    setQuery(query)
    setResponseModelDetail(true)
  }
  const responseModelGoBack = (query) =>{ //首页响应详情弹框返回
    setResponseModelDetail(false)
  }

  const clockAbnormalRegionDetailModal = (query) =>{  //首页打卡异常详情弹框
    setQuery(query)
    setClockAbnormalModelDetail(true)
  }
  const clockAbnormalModelGoBack = (query) =>{ //首页打卡异常详情弹框返回
    setClockAbnormalModelDetail(false)
  }

  
 const [pageIndex,setPageIndex] = useState(1)
 const [pageSize,setPageSize] = useState(20)
 const handleTableChange =   (PageIndex, PageSize )=>{ //分页
  setPageIndex(PageIndex)
  setPageSize(PageSize)
  onFinish(PageIndex,PageSize)
}
  const searchComponents = () =>{
     return <Form
    form={form}
    name="advanced_search"
    onFinish={()=>{onFinish()}}
    initialValues={{
      exceptionType:1,
      pollutantType:isResponseModal||isClockAbnormalModal? props.pollutantTypes : undefined,
      time: isResponseModal||isClockAbnormalModal? props.time : [moment(new Date()).add(-30, 'day').startOf('day'), moment(new Date()).add(-1, 'day').endOf('day')]
    }}
  >  

    {showType==1? <Row  align='middle'>
      <Form.Item name='time' label='日期'>
          <RangePicker allowClear={false}   style={{width:'100%'}} 
             showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}
           />
     </Form.Item>
      <Form.Item label = '监测点类型'  name='pollutantType' style={{padding:'0 8px'}} >
          <Select placeholder='请选择' style={{width:120}} allowClear>
            <Option value={2}>废气</Option>
            <Option value={1}>废水</Option> 
      </Select>
        </Form.Item>
       {!isResponseModal&&!isClockAbnormalModal&&<Form.Item label='异常类型' name='exceptionType'  style={{paddingRight:'8px'}}>
            <Select style={{width:150}} placeholder='请选择'>
                <Option value={1}>打卡异常</Option>
                {/* <Option value={2}>报警响应超时率</Option> */}
            </Select>
        </Form.Item>}
        <Form.Item>
     <Button  type="primary" htmlType='submit' >
          查询
     </Button>
     <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 17px 0 8px',}} onClick={()=>{ exports()} }>
            导出
     </Button> 
     
     </Form.Item>
     {!isResponseModal&&!isClockAbnormalModal&&<Form.Item>
     <Radio.Group defaultValue="1" onChange={showTypeChange} buttonStyle="solid">
      <Radio.Button value="1">行政区</Radio.Button>
      <Radio.Button value="2">企业</Radio.Button>
    </Radio.Group>
    </Form.Item>}
      </Row> 
      :
      <>
      <Row  align='middle'>
      <Form.Item label='日期' name='time'  style={{paddingRight:'16px'}}>
         <RangePicker style={{width:'100%'}} 
          allowClear={false}
          showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}/>
    </Form.Item> 
     <Form.Item label='企业名称' name='entName' style={{paddingRight:'16px',width:350}}>
         <Input placeholder='请输入企业名称'  allowClear/>
       </Form.Item>
       <Form.Item label='行政区'  name='regionCode'   style={{paddingRight:'16px'}}>
          <RegionList style={{width:170}}/>
       </Form.Item>
       </Row>
       <Row style={{paddingTop:8}}>
       <Form.Item name='exceptionType'  label='异常类型' style={{paddingRight:'16px'}}>
           <Select placeholder='请选择' style={{width:150}}>
             <Option value={1}>打卡异常</Option>
             {/* <Option value={2}>报警响应超时率</Option> */}
           </Select>
       </Form.Item>
       <Form.Item label='监测点类型' name='pollutantType'  style={{paddingRight:'16px'}}>
        <Select placeholder='请选择' style={{width:150}} allowClear>
           <Option value={2}>废气</Option>
           <Option value={1}>废水</Option>
           </Select>
       </Form.Item>

       <Form.Item>
    <Button  type="primary" htmlType='submit' >
         查询
    </Button>
    <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 17px 0 8px',}} onClick={()=>{ exports()} }>
           导出
    </Button> 
    
    </Form.Item>
    
    <Form.Item>
    <Radio.Group  name='showType' value={showType} onChange={showTypeChange} buttonStyle="solid">
     <Radio.Button value="1">行政区</Radio.Button>
     <Radio.Button value="2">企业</Radio.Button>
   </Radio.Group>
   </Form.Item>
            </Row>   
            </>
            }  
     </Form>
    
  }

  const [responseModelDetail, setResponseModelDetail] = useState(false)
  const [clockAbnormalModelDetail, setClockAbnormalModelDetail] = useState(false)

  const [query, setQuery] = useState({})
  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    total:tableTotal,
    pageSize:pageSize,
    current:pageIndex,
    onChange: handleTableChange,
}
  return (
    <div  className={styles.abnormalWorkStatisticsSty}>
    <BreadcrumbWrapper hideBreadcrumb={props.hideBreadcrumb} >
    {!responseModelDetail&&!clockAbnormalModelDetail?
    <Card title={searchComponents()}>
      {showType==1?
       <Region  resRegionDetailModal={resRegionDetailModal} clockAbnormalRegionDetailModal={clockAbnormalRegionDetailModal}  isResponseModal={isResponseModal} isClockAbnormalModal={isResponseModal} ref={pchildref} {...props} /> : <Ent showType={showType} ref={pchildref}  pagination={pagination} {...props}/>}
   </Card>
   :
    <RegionDetail hideBreadcrumb responseModelDetail={responseModelDetail} clockAbnormalModelDetail={clockAbnormalModelDetail}  responseModelGoBack={responseModelGoBack}clockAbnormalModelGoBack={clockAbnormalModelGoBack}  location={query}/> //首页报警弹框
    }
   </BreadcrumbWrapper>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);