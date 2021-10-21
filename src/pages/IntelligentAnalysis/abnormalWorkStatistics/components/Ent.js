/**
 * 功  能：异常工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,Fragment ,useRef,useImperativeHandle,forwardRef } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,EnvironmentFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { 
  DelIcon, DetailIcon, EditIcon,PointIcon, Left, GasOffline,
  GasNormal,
  GasExceed,
  GasAbnormal,
  WaterIcon,
  WaterNormal,
  WaterExceed,
  WaterAbnormal,
  WaterOffline } from '@/utils/icon'


import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import config from '@/config';
import { Map, MouseTool, Marker,Markers, Polygon,Circle } from '@/components/ReactAmap';

const namespace = 'abnormalWorkStatistics'




const dvaPropsData =  ({ loading,abnormalWorkStatistics }) => ({
  tableDatas:abnormalWorkStatistics.tableDatas,
  pointDatas:abnormalWorkStatistics.pointDatas,
  tableLoading:abnormalWorkStatistics.tableLoading,
  tableTotal:abnormalWorkStatistics.tableTotal,
  abnormalLoading:loading.effects[`${namespace}/abnormalExceptionTaskList`],
  abnormalTypes:abnormalWorkStatistics.abnormalTypes,
  beginTime:abnormalWorkStatistics.beginTime,
  endTime:abnormalWorkStatistics.endTime,
  dateCol:abnormalWorkStatistics.dateCol,
  abnormalList:abnormalWorkStatistics.abnormalList,
  queryPar:abnormalWorkStatistics.queryPar,
  // getPointExceptionLoading:loading.effects[`${namespace}/getPointExceptionSignList`],
  getPointExceptionLoading:abnormalWorkStatistics.getPointExceptionLoading,
  entAbnormalList:abnormalWorkStatistics.entAbnormalList,
  taskList:abnormalWorkStatistics.taskList,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    abnormalExceptionTaskList:(payload)=>{ //响应超时
      dispatch({
        type: `${namespace}/abnormalExceptionTaskList`,
        payload:payload,
      })
    },
    getPointExceptionSignList:(payload)=>{  //企业监测点  异常打卡
      dispatch({
        type: `${namespace}/getPointExceptionSignList`,
        payload:payload,
      })
    }
  }
}
const Index = (props) => {


  const [regionForm] = Form.useForm();


  const [data, setData] = useState([]);


  const [abnormalNumVisible,setAbnormalNumVisible] = useState(false)
  const [entAbnormalNumVisible,setEntAbnormalNumVisible] = useState(false)

  

  const [pageSize,setPageSize] = useState(20)
  const [pageIndex,setPageIndex] = useState(1)



  
  const  { tableDatas,tableTotal,exportLoading ,tableLoading,abnormalTypes,refInstance,abnormalLoading,abnormalList,queryPar  } = props; 
  useEffect(() => {

  
    },[]);
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
          title:  <span>打卡异常数<Tooltip overlayClassName='customTooltipSty' title={abnormalNumber()}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'insidePlanExceptionCount',
          key: 'insidePlanExceptionCount',
          width: 100,
          align:'center',
          render:(text,record,index)=>{
          return  <Button type="link"  onClick={()=>{abnormalNum(record,1)}}>{text}</Button>
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
          render:(text,record,index)=>{
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
          render:(text,record,index)=>{
          return  <Button type="link" onClick={()=>{responselNum(record)}}>{text}</Button>
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
  ]; 

  
  
  const reponseNumColumns = [
    {
      title: '省/市',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      width: 150,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      width: 150,
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
      title: '响应超时数',
      dataIndex: 'exceptionCount',
      key:'exceptionCount',
      align:'center',
    }
  ];

 
 const abnormalExports = () => {

};
const handleTableChange =   async (PageIndex, )=>{ //分页
}





const [regName,setRegName] = useState()
const [entCode,setEntCode] = useState()
const responselNum = (row) =>{  //响应超时
  setAbnormalNumVisible(true)
  regionForm.resetFields()
  setEntCode(row.entCode)
  setRegName(row.regionName)
  abnormalExceptionTaskList(row.entCode)
}
const abnormalExceptionTaskList = (entCode) =>{ //响应超时
  props.abnormalExceptionTaskList({
    ...queryPar,
    entCode:entCode,
    staticType:3
  })

 }
 
  const onFinish  = async () =>{  //查询 响应超时
      
    try {

      const values = await regionForm.validateFields();
       props.abnormalExceptionTaskList({
        ...queryPar,
        staticType:3,
        entCode:entCode,
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
       <Input placeholder='请输入企业名称'  allowClear/>
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
     <Row align='middle'><div style={{background:'rgb(247,152,34)',width:30,height:15,marginRight:5}}></div><span>响应超时数</span></Row>
     </Col>
    </Row>
     </Form>
  }


 const  getWaterIcon = status => {
    let icon = '';
    switch (status) {
      case 0: // 离线
        icon = <WaterOffline />;
        break;
      case 1: // 正常
        icon = <WaterNormal />;
        break;
      case 2: // 超标
        icon = <WaterExceed />;
        break;
      case 3: // 异常
        icon = <WaterAbnormal />;
        break;
    }
    return icon;
  };

  const getGasIcon = status => {
    let icon = '';
    switch (status) {
      case 0: // 离线
        icon = <GasOffline />;
        break;
      case 1: // 正常
        icon = <GasNormal />;
        break;
      case 2: // 超标
        icon = <GasExceed />;
        break;
      case 3: // 异常
        icon = <GasAbnormal />;
        break;
    }
    return icon;
  };
  
  // const [outOrInside,setOutOrInside] = useState()
const [clockNumber,setClockNumber] = useState()
const [pointName,setPointName] = useState()

const abnormalNum = (row,outOrInside) =>{  //企业监测点异常打卡

  setEntAbnormalNumVisible(true)
  // setRegName(row.regionName)
  setPointName(`${row.entName} - ${row.pointName}`)
  setClockNumber(Number(row.insidePlanExceptionCount) + Number(row.outPlanExceptionCount))
  props.getPointExceptionSignList({
    beginTime:queryPar.beginTime,
    endTime:queryPar.endTime,
    // outOrInside:outOrInside,
    DGIMN:row.DGIMN,
   })  

}
  const  { entAbnormalList,getPointExceptionLoading,taskList }  = props; 

  const renderMarker = (extData) =>{
    return <div>
            
  <Row style={{whiteSpace:"nowrap",padding:5,background:'#fff',marginBottom:5,marginLeft:-58}}>{extData.position.checkInTime}</Row>
           {/* <EnvironmentFilled style={{color:'#1890ff',fontSize:24}}/> */}
           <img src='/location.png' style={{width:24}}/>
           </div>
  }

 const entMap = () =>{
  const styleA= {
    position: 'absolute',
    top: 0,
    padding: 5,
    color: '#fff',
    backgroundColor: "rgba(0,0,0,.4)"
}
   const styleB = {
    position: 'absolute',
    bottom: 0,
    padding: 5,
    color: '#fff',
    backgroundColor: "rgba(0,0,0,.4)"
}


if (getPointExceptionLoading) {
  return (<Spin
    style={{
      width: '100%',
      height: 'calc(100vh/2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    size="large"
  />);
}
  //  <Spin spinning={getPointExceptionLoading}  style={{  display: 'flex',alignItems:'center' , justifyContent: 'center', }}>
  return <div style={{width: '100%', height: 'calc(100vh - 200px)'}}>
    <Map
   amapkey={config.amapKey}
  //  events={this.amapEvents}
  //  mapStyle="amap://styles/normal"
   mapStyle="amap://styles/macaron"
   useAMapUI={!config.offlineMapUrl.domain}
   center={{longitude: entAbnormalList.longitude, latitude: entAbnormalList.latitude} } //center 地图中心点坐标值
   zoom={11}
 >

           <Markers markers={taskList? taskList : []} render={taskList? renderMarker : ''}  />


        {/*企业监测点 */}
        <Marker position={{longitude: entAbnormalList.longitude, latitude: entAbnormalList.latitude}} >
        <div>
          
          <Row style={{whiteSpace:"nowrap",padding:'0 5px',background:'#fff',
             marginBottom:5,marginLeft: `calc(-4 * ${entAbnormalList.pointName&&entAbnormalList.pointName.length}px)` }}>
            {entAbnormalList.pointName}
          </Row>
                 {entAbnormalList.pollutantType ==1 ?getWaterIcon(1) : getGasIcon(1)}
          </div> 
        </Marker>

        {/*半径 */}
        <Circle 
            center={ { longitude:  entAbnormalList.longitude, latitude:entAbnormalList.latitude} } 
            radius={ Number(entAbnormalList.operationRadius) }
            style={  {fillColor:"rgba(228,228,228,.7)", strokeColor: 'rgba(228,228,228,.8)'}}
          />

      <div style={styleA}>
        <span>{`${pointName} ,${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
             期间打卡异常数：${ entAbnormalList.exceptionCount}`}</span>
        </div>
           <div  style={styleB}>
          <Row align='middle'>
              {/* <EnvironmentFilled style={{color:'#1890ff',fontSize:18}}/> */}
              <img src='/location.png' style={{width:18}}/>
               <span style={{paddingLeft:5}}>打卡位置及时间</span></Row>
        </div>
   </Map>

   </div>  
  //  </Spin>
 }
 
  const { dateCol } = props;
  const  entColumnsPush = (col) =>{
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
  entColumnsPush(reponseNumColumns)
  const [abnormalType,setAbnormalType] = useState(1)
// 暴露的子组件方法，给父组件调用
const childRef = useRef();
useImperativeHandle(refInstance,() => {
     return {
        _childFn(values) {
            props.updateState({
              abnormalTypes : values  
            })
        }
    }
})
  return (
      <div>
     <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={abnormalTypes ==1?columns:alarmColumns}
        pagination={false}
      />
   
  {/** 打卡异常  监测点 弹框 */}
  <Modal
        title={ '' } 
        visible={entAbnormalNumVisible}
        onCancel={()=>{setEntAbnormalNumVisible(false)}}
        footer={null}
        destroyOnClose
        // centered
        width='90%'
      >
    
     <Card title={''} className={styles.mapContentSty}>
       { entMap() }
     
   </Card>

   </Modal>
 {/** 响应超时  弹框 */}
     <Modal
        title={ `${regName} - 统计${ queryPar&& moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar&&moment(queryPar.endTime).format('YYYY-MM-DD')}
          内报警响应超时工单情况` }
        visible={abnormalNumVisible}
        onCancel={()=>{setAbnormalNumVisible(false)}}
        footer={null}
        destroyOnClose
        // centered
        width='90%'
      >
   <Card title={ searchComponents()}>
       <SdlTable
       loading = {abnormalLoading}
       bordered
       dataSource={abnormalList}
       columns={reponseNumColumns}
       pagination={false}
     />
    </Card>
   </Modal> 
        </div>
  );
};
// export default connect(dvaPropsData,dvaDispatch)(Index);
const TFunction = connect(dvaPropsData,dvaDispatch)(Index);

export default forwardRef((props,ref)=><TFunction {...props} refInstance={ref}/>);