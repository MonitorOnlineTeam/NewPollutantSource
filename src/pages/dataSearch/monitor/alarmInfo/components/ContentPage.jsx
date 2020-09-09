


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button,TreeSelect,Spin,Tooltip} from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { blue,green,gold } from '@ant-design/colors';
import DropDownSelect from '@/components/DropDownSelect'
const { SHOW_PARENT } = TreeSelect
/**
 * 报警信息
 * jab 2020.09.4
 */



@connect(({ alarmInfoData,common }) => ({
    tableDatas:alarmInfoData.tableDatas,
    total: alarmInfoData.total,
    tablewidth: alarmInfoData.tablewidth,
    tableLoading:alarmInfoData.tableLoading,
    queryParams:alarmInfoData.queryParams,
    entAndPointList: common.entAndPointList,
}))

class TableData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        columns:[],
        dateValue: [ moment(new Date()).add(-1, 'month'), moment(new Date())],
        alarmOptions:[{name:'超标报警',value:5},{name:'数据异常报警',value:0},{name:'备案不符报警',value:2},{name:'系统报警',value:3},{name:'质控核查报警',value:4}],
        defaultValue:[0,1,2,3,4]
        };
        this.columns =  [
          {
            title: '企业排扣',
            align: 'center',
            dataIndex: 'ParentName',
            render: (text, record) => {
              return `${text}-${record.PointName}`
            },
            width:230
          },
        
          {
            title: '报警时间',
            align: 'center',
            dataIndex: 'FirstTime',
            render: (text, record) => {
              return text ? <span>{text}</span> : "-"
            },
            width:200
          },
          {
            title: '报警类型',
            align: 'center',
            dataIndex: 'AlarmType',
            render: (text, record) => {
              switch (text) {
                case "5":
                  return <span> 超标报警</span>
                case "0":
                  return  <span> 数据异常报警</span>
                // case "2":
                //   return  <span> 超上限</span>
                // case "3": 
                //   return  <span> 参数不符</span>
                // case "3": 
                //   return  <span> 参数不符</span>
                default:
                  return "-"
            }
        
            },
            width:200
          },
          {
            title: '描述',
            dataIndex: 'AlarmMsg',
            render: (text, record) => {
              return text ? <div>
                           {/* <Tooltip title={this.tooltipText.bind(this,text)} color={"#fff"}  overlayStyle={{width:350}}> */}
                           <div style={{textAlign:"left",'-webkit-box-orient': 'vertical'}} className="line-clamp-3" >
                              <div>
                             <span> {text} </span>
                             <span style={{paddingLeft:5}}>
                             {record.AlarmType ===""?
                           
                        <Link  to={`/dataSearch/monitor/alarm/overrecord?code=${record.PollutantCode}&type=alarm`} >查看</Link>:// 数据超标
                        record.AlarmType ===""?
                        <Link  to={`/dataSearch/monitor/alarm/exceptionRecord?code=${record.PollutantCode}&type=alarm`} >查看</Link>: //数据异常
                        record.AlarmType ===""?
                        <Link  to={`/dynamicControl/dynamicDataManage/controlData/historyparame?code=${record.PollutantCode}&type=alarm`} >查看</Link>: //备案不符
                        <Link  to={`/dataSearch/monitor/alarm/overrecord?code=${record.PollutantCode}&type=alarm`} >查看</Link> //质控核查报警
                        // /dataSearch/qca/zeroCheck
                        // /dataSearch/qca/rangeCheck
                        // /dataSearch/qca/blindCheck
                        // /dataSearch/qca/linearCheck
                        // /dataSearch/qca/resTimeCheck
                        }
                        </span>
                             </div>
                            </div>
                           {/* </Tooltip> */}
            
    
                           </div>: "-"
        
            },

            width:400
          },
        ]
    }

    
  tooltipText=(value)=>{ 
    return <div style={{color:'rgba(0, 0, 0, 0.65)',wordWrap:'break-word'}}>{value}</div>
}
    componentDidMount(){
     
      this.props.initLoadData && this.changeDgimn(this.props.dgimn)
      this.getEntAndPointList();
                  
    }
  // 获取企业和排口
  getEntAndPointList = () => {
          this.props.dispatch({
            type: "common/getEntAndPointList",
            payload: { "Status": [], "RunState": "1", "PollutantTypes": "1,2" }
          })
        }
          
  // 在componentDidUpdate中进行异步操作，驱动数据的变化
  componentDidUpdate(prevProps) {
   if(prevProps.dgimn !==  this.props.dgimn) {
        this.changeDgimn(this.props.dgimn);
    }
}
 /** 切换排口 */
      changeDgimn = (dgimn) => {
       
        this.getTableData(dgimn);
  
    }

  /** 根据排口dgimn获取它下面的数据 */
  getTableData = dgimn => {
          let {dispatch,queryParams} = this.props;
          
          dispatch({
            type: 'alarmInfoData/updateState',
            payload: { ...queryParams},
         });

         this.firstLoad(dgimn)
   
      }
    firstLoad = dgimn =>{
      let {dispatch,queryParams} = this.props;
       dispatch({
          type: 'alarmInfoData/getAlarmDataList',
          payload: { ...queryParams, BeginTime: moment(new Date()).add(-1, 'month').format('YYYY-MM-DD HH:mm:ss'), EndTime: moment().format("YYYY-MM-DD HH:mm:ss")},
      });
    }
    
  /**
 * 回调获取时间并重新请求数据
 */
dateCallback = (dates, dataType) => { //更新日期
    let { queryParams, dispatch } = this.props;
    this.setState({dateValue: dates})
    queryParams = {
      ...queryParams,
      BeginTime: dates[0].format('YYYY-MM-DD'),
      EndTime: dates[1].format('YYYY-MM-DD'),
    }
    dispatch({
      type: 'alarmInfoData/updateState',
      payload: { queryParams},
    })
  }
  onFinish = ()=>{

    let {dispatch,queryParams} = this.props;
    dispatch({
       type: 'alarmInfoData/getAlarmDataList',
       payload: { ...queryParams},
   });
  }


  alarmSelect=(value,label, extra)=>{
    let { queryParams, dispatch } = this.props;
    queryParams = {
      ...queryParams,
      alarmType:value
    }
    dispatch({
      type: 'alarmInfoData/updateState',
      payload: { queryParams},
    })
    
  }


  treeChange=(value)=>{
  let { queryParams, dispatch } = this.props;
  dispatch({
    type: 'alarmInfoData/updateState',
    payload: { queryParams:{...queryParams,mnList:value}},
  })
 }

  //导出数据
  exportData = () => { 
  //   this.props.dispatch({
  //     type: "historyData/exportHistoryReports",
  //     payload: {DGIMNs: this.state.dgimn }
  // })

  // router.push({pathname: "/dynamicControl/dynamicDataManage/controlData/historyparame",query:{type:"alarm",code:["a21026"].join()} })

  // router.push({pathname: "/dataSearch/monitor/alarm/overrecord",query:{id:1} }) //超标数据

  router.push({pathname: "/dataSearch/monitor/alarm/exceptionRecord",query:{type:"alarm",code:["a21026"].join()} })  //异常数据
  
  }

//查询条件
  queryCriteria = () => {
    const { dateValue,alarmOptions,defaultValue } = this.state;
    
    const { entAndPointList } = this.props;
    const tProps = {
      treeData: entAndPointList,
      treeDefaultExpandAll: true,
      treeCheckable: true,
      treeNodeFilterProp: "title",
      placeholder: '请选择运维站点！',
      allowClear:true,
      style: {
        width: '100%',
      },
    };
    return <div>
      <div style={{ marginTop: 10 }}>
        <Form className="search-form-container" layout="inline"  onFinish={this.onFinish}>
          <Row gutter={[8,8]} style={{flex:1}} > 

            <Col xxl={6} xl={10}   lg={14} md={16} sm={24} xs={24}>

              <Form.Item label="监测时间" className='queryConditionForm'>
                  <RangePicker_ 
                   format={"YYYY-MM-DD"}
                   showTime={false}
                   onRef={this.onRef1}
                  dateValue={dateValue}
                  isVerification={true}
                  callback={(dates, dataType) => this.dateCallback(dates,dataType)} //父组件事件回调子组件的值
                  allowClear={false} style={{width:"100%"}} /> 
              </Form.Item>
            </Col>
            <Col xxl={6} xl={10}   lg={14} md={16} sm={24} xs={24}>
            <Form.Item label="企业排扣" className='queryConditionForm'>
               <TreeSelect {...tProps} onChange={this.treeChange}/>
              </Form.Item>
            </Col>
            <Col xxl={6} xl={10}   lg={14} md={16} sm={24} xs={24}>
              <Form.Item label="报警类型" className='queryConditionForm'>
               <DropDownSelect mode='multiple' optiondatas={alarmOptions}  defaultValue= {defaultValue}  onChange={this.alarmSelect}/>
              </Form.Item>
            </Col>
            <Col xxl={4} xl={4} lg={4}  md={3} sm={24} xs={24}>
              <Form.Item  className='queryConditionForm'> 
                <Button type="primary" loading={false} htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                <Button type="primary" loading={false} onClick={() => { this.exportData() }} style={{ marginRight: 5 }}>导出</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  }



  render() {

    const {tableLoading,tableDatas,total} = this.props;
    const  QueryCriteria = this.queryCriteria;

    return (

<div id="alarmInfoData">
        <Card title={<QueryCriteria />} >
           <SdlTable
              rowKey={(record, index) => `complete${index}`}
              dataSource={tableDatas}
              columns={this.columns}
              resizable
              defaultWidth={80}
              scroll={{ y: this.props.tableHeight || undefined}}
              loading={tableLoading}
              pagination={{ showSizeChanger:true , showQuickJumper:true,defaultPageSize:20}}
          /> 
        </Card>
     </div>);
  }
}

export default TableData;