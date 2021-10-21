/**
 * 功  能：异常工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,RollbackOutlined } from '@ant-design/icons';
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
import { setAuthority } from '@/utils/authority';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'abnormalWorkStatistics'




const dvaPropsData =  ({ loading,abnormalWorkStatistics }) => ({
  tableDatas:abnormalWorkStatistics.cityTableDatas,
  tableLoading:abnormalWorkStatistics.cityTableLoading,
  tableTotal:abnormalWorkStatistics.cityTableTotal,
  abnormalLoading:loading.effects[`${namespace}/cityAbnormalExceptionTaskList`],
  cityDetailTableLoading:loading.effects[`${namespace}/cityDetailExceptionTaskList`],
  abnormalList:abnormalWorkStatistics.cityAbnormalList,
  dateCol:abnormalWorkStatistics.cityDateCol,
  cityDetailTableTotal:abnormalWorkStatistics.cityDetailTableTotal,
  cityDetailTableDatas:abnormalWorkStatistics.cityDetailTableDatas,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    cityExceptionTaskList:(payload)=>{ //市级 第一级
      dispatch({
        type: `${namespace}/cityExceptionTaskList`,
        payload:payload,
      })
    },
    cityDetailExceptionTaskList:(payload)=>{ //市级 第二级  弹框
       dispatch({
        type: `${namespace}/cityDetailExceptionTaskList`,
        payload:payload,
      })
    },
    abnormalExceptionTaskList:(payload)=>{ //市级别 弹框
      dispatch({
        type: `${namespace}/cityAbnormalExceptionTaskList`,
        payload:payload,
      })
    },
  }
}
const Index = (props) => {


  const [regionForm] = Form.useForm();


  const [data, setData] = useState([]);


  const [tableVisible,setTableVisible] = useState(false)
  const [abnormalNumVisible,setAbnormalNumVisible] = useState(false)

  
  const [pageSize,setPageSize] = useState(20)
  const [pageIndex,setPageIndex] = useState(1)

 

  
    const abnormalTypes = props.location.query.abnormalTypes
     
  
  const  { tableDatas,tableTotal,loadingConfirm,pointDatas,tableLoading,exportLoading,abnormalList,abnormalLoading,cityDetailTableTotal,cityDetailTableDatas,cityDetailTableLoading } = props; 
  useEffect(() => {
    queryFinish()
  
    },[]);

    const regionCodes = props.location.query.regionCode
    const queryPar = JSON.parse(props.location.query.data)
    const queryFinish  = () =>{  //查询
     
         props.cityExceptionTaskList({
            ...queryPar,
            regionCode: regionCodes,
            regionLevel: 2,
          })                                               
    }
  const abnormalNumber = ()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>打卡异常：每个监测点设置了电子围栏，填写运维工单时需要打卡，如果电子围栏外打卡，则判断定工单打卡异常工单。</li>
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
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      render:(text,record)=>{
       return  <Button type="link"
         onClick={()=>{
            cityClick(record)
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
                  percent={text&&text}
                  size="small"
                  style={{width:'80%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + "%"}</span>}
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
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      render:(text,record)=>{
       return  <Button type="link"
         onClick={()=>{
           cityClick(record)
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
            return  <Button type="link" onClick={()=>{abnormalNum(record,1)}}>{text}</Button>
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

  
 const cityColumns =  [
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
    width: 200,
    render:(text)=>{
     return <div style={{textAlign:'left'}}>{text}</div>
    }
  },
  {
    title: '监测点名称',
    dataIndex: 'pointName',
    key:'pointName',
    align:'center',
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
        title:  <span>打卡异常数</span>,
        dataIndex: 'insidePlanExceptionCount',
        key: 'insidePlanExceptionCount',
        width: 100,
        align:'center',
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
                percent={text&&text}
                size="small"
                style={{width:'80%'}}
                status='normal'
                format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + "%"}</span>}
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

const cityAlarmColumns = [
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
    width: 200,
    render:(text)=>{
     return <div style={{textAlign:'left'}}>{text}</div>
    }
  },
  {
    title: '监测点名称',
    dataIndex: 'pointName',
    key:'pointName',
    align:'center',
  },
  {
    title: <span>报警响应工单</span>,
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
 
const abnormalNumColumns = [
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
    width: 200,
    render:(text)=>{
     return <div style={{textAlign:'left'}}>{text}</div>
    },
  },
  {
    title: '监测点名称',
    dataIndex: 'pointName',
    key:'pointName',
    align:'center',
  },
  {
    title:  <span>打卡异常数</span>,
    dataIndex: 'exceptionCount',
    key: 'exceptionCount',
    width: 100,
    align:'center',
}
];
const reponseNumColumns = [
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
        router.push({pathname:`/Intelligentanalysis/abnormalWorkStatistics/regionDetail`,query:JSON.stringify(record)});
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
 const abnormalExports = () => {

};
const [regName,setRegName] = useState()
const [regionCode,setRegionCode] = useState()
const [staticType,setStaticType] = useState()
const [outOrInside,setOutOrInside] = useState()
const abnormalNum = (row,outOrInside) =>{  //打卡异常  响应超时
   setTableVisible(true)
   regionForm.resetFields()
   setRegionCode(row.regionCode ? row.regionCode : regionCodes)
   setRegName(row.regionName)
   setStaticType(3)
   setOutOrInside(outOrInside)
   abnormalExceptionTaskList(row.regionCode? row.regionCode : regionCodes,outOrInside)
 
}
 const abnormalExceptionTaskList = (regionCode,outOrInside) =>{
  props.abnormalExceptionTaskList({
    ...queryPar,
    regionCode:regionCode,
    outOrInside:outOrInside,
    staticType:3,
    regionLevel: 2,
  })

 }
 const [workTableVisible,setWorkTableVisible] = useState(false)
 
 const cityClick = (row) =>{ //点击市级别的弹框
  setWorkTableVisible(true)
  regionForm.resetFields()
  setRegionCode(row.regionCode ? row.regionCode : regionCodes)
  setRegName(row.regionName)
  setStaticType(2)
  cityDetailExceptionTaskList(row.regionCode? row.regionCode : regionCodes)
 }
 const cityDetailExceptionTaskList = (regionCode) =>{
  props.cityDetailExceptionTaskList({
    ...queryPar,
    regionCode:regionCode,
    staticType:2,
    regionLevel: 1,
  })

 }
  const handleTableChange =   async (PageIndex, )=>{ //分页
  }
  const onFinish  = async () =>{  //查询


    try {

      const values = await regionForm.validateFields();
      tableVisible? props.abnormalExceptionTaskList({
        ...queryPar,
        staticType:staticType,
        regionCode:regionCode,
        outOrInside:outOrInside,
        ...values,
      })
      :
      props.cityDetailExceptionTaskList({
        ...queryPar,
        regionCode:regionCode,
        staticType:staticType,
        ...values,
      })
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
     <Row align='middle'><div style={{background:'#faad14',width:24,height:12,marginRight:5}}></div>
       <span> {abnormalTypes ==1? '打卡异常数' : '报警响应超时工单数'}</span>
      </Row>
     </Col>
    </Row>
     </Form>
  }

  // const [ workForm ] =  Form.useForm();
  // const workSearchComponents = () =>{
  //   return <Form
  //   onFinish={onFinish}
  //   form={workForm}
  //   layout={'inline'}
  // >   
  //     <Row justify='space-between'  align='middle' style={{flex:1}} >

  //       <Col >
  //       <Row align='middle'>
  //     <Form.Item name='entName' >
  //      <Input placeholder='请输入企业名称' allowClear/>
  //    </Form.Item>

  //       <Form.Item>
  //    <Button  type="primary" htmlType='submit'>
  //         查询
  //    </Button>
  //    <Button icon={<ExportOutlined />}  style={{  margin: '0 8px'}}  loading={exportLoading}  onClick={()=>{ abnormalExports()} }>
  //           导出
  //    </Button> 
     
  //    </Form.Item>
  //    </Row>
  //    </Col>


  //    <Col>
  //    <Row align='middle'><div style={{background:'#faad14',width:24,height:12,marginRight:5}}></div>
  //      <span> {abnormalTypes ==1? '打卡异常数' : '报警响应超时工单数'}</span>
  //     </Row>
  //    </Col>
  //   </Row>
  //    </Form>
  // }
  const { dateCol } = props
const  cityColumnsPush = (col) =>{
  if(dateCol&&dateCol[0]){
    col.push({
      title: '计划异常工单分布',
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
                       return dateItem.count;
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
 cityColumnsPush(abnormalNumColumns)
 cityColumnsPush(reponseNumColumns)
  
 
  return ( <div>
         <Form layout={'inline'} style={{paddingBottom:12}} >   
       <Form.Item>
     <Button icon={<ExportOutlined />}  style={{  marginRight: '8px'}}  loading={exportLoading}  onClick={()=>{ abnormalExports()} }>
            导出
     </Button> 
     <Button onClick={() => {history.go(-1); }} icon={<RollbackOutlined />} >返回</Button>
     </Form.Item>
    </Form>
    <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={ abnormalTypes ==1? columns : alarmColumns}
        pagination={false}
      />
           {/*工单异常 响应超时 详情 弹框*/}
     <Modal
        title={`${regName} - 统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
        内${abnormalTypes==1? '打卡异常工单情况' : '报警响应超时工单情况'}`}
        visible={workTableVisible}
        onCancel={()=>{setWorkTableVisible(false)}}
        footer={null}
        destroyOnClose
        centered
        width='90%'
      >
     <Card title={searchComponents()}>
       <SdlTable
        loading = {cityDetailTableLoading}
        bordered
        dataSource={cityDetailTableDatas}
        columns={abnormalTypes ==1?  cityColumns : cityAlarmColumns}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          // onChange: handleTableChange,
      }}
      />
   </Card>
   </Modal>
     {/*打卡异常 响应 超时 弹框*/}
     <Modal
        title={`${regName} - 统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
        内${abnormalTypes==1? '打卡异常工单情况' : '报警响应超时工单情况'}`}
        visible={tableVisible}
        onCancel={()=>{setTableVisible(false)}}
        footer={null}
        destroyOnClose
        centered
        width='90%'
      >
     <Card title={searchComponents()}>
       <SdlTable
        loading = {abnormalLoading}
        bordered
        dataSource={abnormalList}
        columns={abnormalTypes ==1?  abnormalNumColumns : reponseNumColumns}
        scroll={{ y: 'calc(100vh - 560px)' }}
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
export default connect(dvaPropsData,dvaDispatch)(Index);