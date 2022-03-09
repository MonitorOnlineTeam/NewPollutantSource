/**
 * 功  能：异常工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,Fragment,useRef,useImperativeHandle,forwardRef} from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
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
import RegionDetail from '../regionDetail'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'abnormalWorkStatistics'




const dvaPropsData =  ({ loading,abnormalWorkStatistics,global }) => ({
  tableDatas:abnormalWorkStatistics.tableDatas,
  pointDatas:abnormalWorkStatistics.pointDatas,
  tableLoading:abnormalWorkStatistics.tableLoading,
  tableTotal:abnormalWorkStatistics.tableTotal,
  abnormalTypes:abnormalWorkStatistics.abnormalTypes,
  exportCardExceptionLoading:abnormalWorkStatistics.exportCardExceptionLoading,
  exportResExceptionLoading:abnormalWorkStatistics.exportCardResExceptionLoading,
  abnormalLoading:loading.effects[`${namespace}/abnormalExceptionTaskList`],
  abnormalList:abnormalWorkStatistics.abnormalList,
  queryPar:abnormalWorkStatistics.queryPar,
  dateCol:abnormalWorkStatistics.dateCol,
  abnormalListTotal:abnormalWorkStatistics.abnormalListTotal,
  clientHeight: global.clientHeight,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    abnormalExceptionTaskList:(payload)=>{ //打卡异常
      dispatch({
        type: `${namespace}/abnormalExceptionTaskList`,
        payload:payload,
      })
    },
    regEntExceptionTaskList:(payload)=>{ //省级 异常打卡统计
      dispatch({
        type: `${namespace}/regEntExceptionTaskList`,
        payload:payload,
      })
    },
    exportCardResExceptionTaskList:(payload)=>{ //导出 省级 异常打卡 响应超时 统计 
      dispatch({
        type: `${namespace}/exportCardResExceptionTaskList`,
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

  






  
  const  { tableDatas,tableLoading,tableTotal,abnormalTypes,refInstance,abnormalList,abnormalListTotal,abnormalLoading,queryPar,dateCol} = props; 
  

  const { exportCardExceptionLoading, exportResExceptionLoading,isResponseModal,isClockAbnormalModal,clientHeight} = props;

  useEffect(() => {

  
    },[]);
  const abnormalNumber = ()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>打卡异常：每个监测点设置了电子围栏，填写运维工单时需要打卡，如果在电子围栏外打卡，则判断定工单为打卡异常工单。</li>
  </ol>
  }
  
  const alarmResponse = () =>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
              <li>报警响应工单:数据出现异常、缺失后:系统会发出报警，运维人员响应报警后会生成工单。</li>
              <li>响应超时:报警首欠出现后:超过5个小时响应，则生成的工单判定为响应超时异常工单。</li>
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
          !isClockAbnormalModal? 
          router.push({pathname:`/Intelligentanalysis/operationWorkStatis/abnormalWorkStatistics/regionDetail`,query:{data:JSON.stringify(queryPar),regionName:record.regionName,regionCode:record.regionCode,abnormalTypes:abnormalTypes }})
          :
          props.clockAbnormalRegionDetailModal({query:{data:JSON.stringify(queryPar),regionName:record.regionName,regionCode:record.regionCode,abnormalTypes:abnormalTypes }})
        }}
        >{text}</Button>
      }
    },
    {
      title: '计划内工单',
      width:200,
      children: [
        {
          title: '总数',
          dataIndex: 'insidePlanCount',
          key: 'insidePlanCount',
          width: 50,
          align:'center',
        },
        {
          title:  <span>打卡异常数<Tooltip overlayClassName='customTooltipSty' title={abnormalNumber()}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'insidePlanExceptionCount',
          key: 'insidePlanExceptionCount',
          width: 100,
          align:'center',
          render:(text, record)=>{
           return  <Button type="link" onClick={()=>{abnormalNum(record,1)}}>{text}</Button>
          }
        },
        {
          title: '异常率',
          dataIndex: 'insideRate',
          key: 'insideRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.insideRate - b.insideRate,
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text&&text}
                  size="small"
                  style={{width:'80%'}}
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
      title: '计划外工单',
      width:200,
      children: [
        {
          title: '总数',
          dataIndex: 'outPlanCount',
          key: 'outPlanCount',
          width: 50,
          align:'center',
        },
        {
          title: '打卡异常数',
          dataIndex: 'outPlanExceptionCount',
          key: 'outPlanExceptionCount',
          width: 100,
          align:'center',
          render:(text, record)=>{
          return   <Button type="link" onClick={()=>{abnormalNum(record,2)}}>{text}</Button>
          }
        },
        {
          title: '异常率',
          dataIndex: 'outRate',
          key: 'outRate',
          width: 100,
          align:'center',
          sorter: (a, b) => a.outRate - b.outRate,
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text&text}
                  size="small"
                  style={{width:'80%'}}
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
      title: '异常率',
      dataIndex: 'allRate',
      key: 'allRate',
      width: 100,
      align:'center',
      sorter: (a, b) => a.allRate - b.allRate,
      render: (text, record) => {
        return (
          <div>
            <Progress
              percent={text&&text}
              size="small"
              style={{width:'80%'}}
              status='normal'
              format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}
            />
          </div>
        );
      }
    },
  ];
    const cityColumns = [
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      width: 150,
      fixed: 'left',
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      width: 200,
      align:'center',
      fixed: 'left',
    },

    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
      fixed: 'left',
    },
    {
      title:  <span>打卡异常数</span>,
      dataIndex: 'exceptionCount',
      key: 'exceptionCount',
      width: 100,
      align:'center',
  }
  ];
 


  const alarmColumns = [
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
          !isResponseModal? 
          router.push({pathname:`/Intelligentanalysis/abnormalWorkStatistics/regionDetail`,query:{data:JSON.stringify(queryPar),regionName:record.regionName,regionCode:record.regionCode,abnormalTypes:abnormalTypes}})
          :
          props.resRegionDetailModal({query:{data:JSON.stringify(queryPar),regionName:record.regionName,regionCode:record.regionCode,abnormalTypes:abnormalTypes }})
        }}
        >{text}</Button>
      }
    },
    {
      title: <span>报警响应工单<Tooltip overlayClassName='customTooltipSty' title={alarmResponse()}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
      width:200,
      children: [
        {
          title: '总数',
          dataIndex: 'outPlanCount',
          key: 'outPlanCount',
          width: 50,
          align:'center',
        },
        {
          title: "响应超时数",
          dataIndex: 'outPlanExceptionCount',
          key: 'outPlanExceptionCount',
          width: 100,
          align:'center',
          render:(text, record)=>{
            return  <Button type="link" onClick={()=>{abnormalNum(record)}}>{text}</Button>
          }
        },
        {
          title: '超时率',
          dataIndex: 'outRate',
          key: 'outRate',
          width: 100,
          align:'center',
          render: (text, record) => {
            return (
              <div>
              <Progress
                percent={text&&text}
                size="small"
                style={{width:'80%'}}
                status='normal'
                format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}
              />
            </div>
            );
          }
        },
      ],
    }
  ]; 
  const cityReponseNumColumns = [
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      width: 150,
      fixed: 'left',
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      width: 150,
      align:'center',
      fixed: 'left',
      // render:(text)=>{
      //   return <div style={{textAlign:'left'}}>{text}</div>
      //  }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
      fixed: 'left',
    },
    {
      title: '响应超时数',
      dataIndex: 'exceptionCount',
      key:'exceptionCount',
      align:'center',
    }
  ];


 


 const [regName,setRegName] = useState()
 const [regionCode,setRegionCode] = useState()
 const [outOrInside,setOutOrInside] = useState()


const abnormalNum = (row,outOrInside) =>{  //打卡异常  响应超时
   setTableVisible(true)
   regionForm.resetFields()
   setRegionCode(row.regionCode)
   setRegName(row.regionName)
   setOutOrInside(outOrInside)
   abnormalExceptionTaskList(row.regionCode,outOrInside)

}
 const abnormalExceptionTaskList = (regionCode,outOrInside,pageIndexs,pageSizes,par) =>{
  props.abnormalExceptionTaskList({
    ...queryPar,
    regionCode:regionCode,
    outOrInside:outOrInside,
    staticType:3,
    regionLevel: 2,
    pageIndex:pageIndexs?pageIndexs:pageIndex,
    pageSize:pageSizes?pageSizes:pageSize,
    ...par
  })

 }
   

 const [pageIndex,setPageIndex] = useState(1)
 const [pageSize,setPageSize] = useState(10)
  const handleTableChange =   (PageIndex, PageSize )=>{ //分页 打卡异常 响应超时 弹框
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    abnormalExceptionTaskList(regionCode,outOrInside,PageIndex,PageSize)
  }

  
  const onFinish  = async () =>{  //查询


    try {

      const values = await regionForm.validateFields();
      setPageIndex(1)
      setPageSize(10)
      abnormalExceptionTaskList(regionCode,outOrInside,1,10,values)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const searchComponents = () =>{
    return <Form
    onFinish={onFinish}
    form={regionForm}
    layout={'inline'}
  >   
      <Row justify='space-between'  align='middle' style={{flex:1}} >

        <Col >
        <Row align='middle'>
      <Form.Item name='entName' >
       <Input placeholder='请输入企业名称'  allowClear/>
     </Form.Item>

        <Form.Item>
     <Button  type="primary" htmlType='submit'>
          查询
     </Button>
     <Button icon={<ExportOutlined />}  style={{  margin: '0 8px'}}  loading={abnormalTypes==1? exportCardExceptionLoading: exportResExceptionLoading}  onClick={()=>{ exports()} }>
            导出
     </Button> 
     
     </Form.Item>
     </Row>
     </Col>


     <Col>
     <Row align='middle'><div style={{background:'rgb(247,152,34)',width:20,height:10,marginRight:5}}></div>
     <span>{abnormalTypes ==1? '打卡异常工单数' : '报警响应超时工单数'}</span>
     </Row>
     </Col>
    </Row>
     </Form>
  }
  const exports = async() => { //导出 打卡异常 弹框 
    props.exportCardResExceptionTaskList({
      ...queryPar,
      staticType:3,
      regionCode:regionCode,
      outOrInside:outOrInside,
      pageIndex:undefined,
      pageSize:undefined,
    })
  };
  const  cityColumnsPush = (col) =>{
    if(dateCol&&dateCol[0]){
      col.push({
        title: '打卡异常工单分布',
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
                      if(dateItem.date == item.date){
                      return dateItem.count? <span style={{color:'rgb(247,152,34)'}}>{dateItem.count}</span>: dateItem.count;
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
   cityColumnsPush(cityColumns)
   cityColumnsPush(cityReponseNumColumns)
// 暴露的子组件方法，给父组件调用 父传子值
const childRef = useRef();
useImperativeHandle(refInstance,() => {
     return {
        _childFn(values) {
            // setAbnormalType(values)
            props.updateState({
              abnormalTypes : values
            })
        }
    }
})
  return (
      <div style={{height:"100%"}}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={ abnormalTypes ==1? columns :alarmColumns }
        pagination={false} 
        scroll={{ y:props.hideBreadcrumb?clientHeight - 420: clientHeight - 370}}
      />
      {/*打卡异常 响应超时 弹框*/}
      <Modal
        title={`${regName} - 统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
        内${abnormalTypes==1?'打卡异常工单情况' :'报警响应超时工单情况'}`}
        visible={tableVisible}
        onCancel={()=>{setTableVisible(false)}}
        footer={null}
        destroyOnClose
        // centered
        width='90%'
      >
     <Card title={searchComponents()}>
     <SdlTable
        loading = {abnormalLoading}
        bordered
        columns={abnormalTypes ==1? cityColumns : cityReponseNumColumns}
        dataSource={abnormalList}
        scroll={{ y: 'calc(100vh - 560px)' }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total:abnormalListTotal,
          pageSize:pageSize,
          current:pageIndex,
          onChange: handleTableChange,
      }}
      />
   </Card>

      </Modal>
      
        </div>
  );
};

// export default connect(dvaPropsData,dvaDispatch)(Index);
const TFunction = connect(dvaPropsData,dvaDispatch)(Index);

export default forwardRef((props,ref)=><TFunction {...props} refInstance={ref}/>);