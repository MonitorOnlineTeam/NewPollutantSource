/**
 * 功  能：设备异常率
 * 创建人：jab
 * 创建时间：2021.2.24
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Spin, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Checkbox,   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import RegionDetail from './RegionDetail'
import point from '@/models/point';

const namespace = 'equipmentAbnormalRate'



const dvaPropsData =  ({ loading,equipmentAbnormalRate,global,point }) => ({
  tableDatas:equipmentAbnormalRate.regTableDatas,
  tableLoading: loading.effects[`${namespace}/regGetExecptionRateList`],
  exportLoading: loading.effects[`${namespace}/exportTaskWorkOrderList`],
  clientHeight: global.clientHeight,
  queryPar:equipmentAbnormalRate.queryPar,
  pollutantTypeListLoading: loading.effects[`point/getPollutantById2`],
  pollutantTypeList:point.pollutantTypeList2,
  coommonCol:equipmentAbnormalRate.coommonCol
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    regGetExecptionRateList:(payload)=>{ // 行政区
      dispatch({
        type: `${namespace}/regGetExecptionRateList`,
        payload:payload,
      })
    },
    getPollutantById:(payload,callback)=>{ // 设备参数类别
      dispatch({
        type: `point/getPollutantById2`,
        payload:payload,
        callback:callback
      })
    },
    // exportTaskWorkOrderList:(payload)=>{ // 导出
    //   dispatch({
    //     type: `${namespace}/exportTaskWorkOrderList`,
    //     payload:payload,
    //   })
    // },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [dates, setDates] = useState([]);
  const  { tableDatas,tableLoading,exportLoading,clientHeight,type,time,queryPar,pollutantTypeList,pollutantTypeListLoading,coommonCol } = props; 
  
  
  useEffect(() => {
    initData();
  
  },[]);


  
  const [parType,setParType] = useState([])
  const initData = () =>{
    
    props.getPollutantById({id:type==1?'1b27155c-5b8b-439a-987c-8100723c2866':'31f8f6f9-5700-443b-8570-9229b36fa00c'},(data)=>{
      const parList = data.map(item=>{
        return { label: item.Name, value: item.ID }
      })
      setParType(parList)
      form.setFieldsValue({parameterCategory:parList.map(item=>item.value) })
      onFinish();
    }) 
  }

  const exports = async  () => {
    const values = await form.validateFields();
      props.exportTaskWorkOrderList({
        pageIndex:undefined,
        pageSize:undefined,
    })

 };

 const columns = [
  {
    title: '序号',
    // dataIndex: 'x',
    // key:'x',
    align:'center',
    render:(text,record,index)=>{
     return  index +1 
    }
  },
  {
    title: '省',
    dataIndex: 'regionName',
    key:'regionName',
    align:'center',
    render:(text,record,index)=>{
      return  <Button type="link" onClick={()=>{ regionDetail(record)  }} >{text}</Button>
    }
  },
  {
    title: '运营企业数',
    dataIndex: 'entCount',
    key:'entCount',
    align:'center',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '运营监测点数',
    dataIndex: 'pointCount',
    key:'pointCount',
    align:'center',
    sorter: (a, b) => a.age - b.age,

  },
  ...coommonCol
]


  const onFinish  = async () =>{  //查询

    try {
      const values = await form.validateFields();
      const par = {
        ...values,
        time:undefined,
        beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
        parameterCategory:values.parameterCategory? values.parameterCategory.toString() :'',
        pointType:1,
      }
        props.regGetExecptionRateList({ ...par  })
        props.updateState({
          queryPar:{ ...par }
        })
        
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  
  const [regionDetailVisible,setRegionDetailVisible] = useState(false)

  const regionDetail = (row) =>{ 
    setRegionDetailVisible(true)
    props.updateState({
      queryPar:{
        ...props.queryPar,
        regionCode:row.regionCode
      }
    })
  }

  

  


  
  console.log(parType,parType.map(item=>item.value))
  return (
    <div  className={styles.equipmentAbnormalRateSty}>
   {!regionDetailVisible? <><Form
    form={form}
    name="advanced_search"
    onFinish={onFinish}
    initialValues={{
      pollutantType:type,
      time:time,
    }}
    style={{paddingBottom:15}}
    loading={tableLoading}
  >  
  <Row>
     <Form.Item label='日期' name='time'  style={{paddingRight:'16px'}}>
         <RangePicker allowClear={false} style={{width:'100%'}} 
          showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}/>
    </Form.Item> 
    <Form.Item label='监测点类型' name='pollutantType'  style={{paddingRight:'16px'}}>
        <Select placeholder='请选择' style={{width:150}}>
           <Option value={1}>废水</Option>
           <Option value={2}>废气</Option>
           </Select>
       </Form.Item>
       <Form.Item>
           <Button  type="primary" htmlType='submit' >
         查询
    </Button>
    <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
           导出
    </Button> 
    </Form.Item>
    </Row>
    <Row style={{paddingTop:8}}>
    <Form.Item label='设备参数类别' name='parameterCategory'>
      {pollutantTypeListLoading? <Spin size='small'/> :
      <Checkbox.Group  options={parType} />
       } 
       </Form.Item>
    </Row>
  </Form>

  <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={ columns}
        pagination={false}
      />
      </>
      :
   
     <RegionDetail  onGoBack={()=>{setRegionDetailVisible(false)}}/>  // 行政区详情弹框 
    }

        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);