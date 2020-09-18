


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button,TreeSelect,Spin} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { green,gold,red,yellow  } from '@ant-design/colors';

// const { SHOW_PARENT } = TreeSelect
/**
 * 历史管控参数
 * jab 2020.08.13
 */
const columns =  [
  {
    title: '仪器',
    align: 'center',
    dataIndex: 'monitoringItems',

  },
  {
    title: '参数名称',
    dataIndex: 'param',
  },
  {
    title: '状态',
    dataIndex: 'state',
    render: (text, record) => {
      switch (text) {
          case "0":
            return <span style={{color:green[6]}} > 正常</span>
          default:
            return "备案不符"
      }

    }
  },
  {
    title: '变更时间',
    dataIndex: 'monitorTime',
    render: (text, record) => {
      return text ? text : "-"
    }
  },
  {
    title: '变更前',
    dataIndex: 'oldValue',
    render: (text, record) => {
      return text || text===0 ? text : "-"
    }
  },
  {
    title: '变更后',
    dataIndex: 'value',
    render: (text, record) => {
      return text || text===0 ? text : "-"
    }
  },
  {
    title: '正常范围',
    dataIndex: 'range',
    render: (text, record) => {
      return text || text===0 ? text : "-"
    }
  },
  {
    title: '单位',
    dataIndex: 'unit',
    render: (text, record) => {
      return text ? text : "-"
    }
  }
]
@connect(({ historyparData }) => ({
    tableDatas:historyparData.tableDatas,
    total: historyparData.total,
    tablewidth: historyparData.tablewidth,
    tableLoading:historyparData.tableLoading,
    queryParams:historyparData.queryParams,
    paraCodeList:historyparData.paraCodeList,
    parLoading:historyparData.parLoading,
}))

class TableData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        tableDatas:[],
        columns:[],
        dateValue: [ moment(new Date()).add(-1, 'month'), moment(new Date())],
        code:[],
        };
    }
    static getDerivedStateFromProps(props, state) {
     
      // if (props.dateValue !== state.dateValue&&props.location.query.id) {
      //   return {
      //     dateValue: state.dateValue
      //   };
      // }
      return null;

    }
    componentDidMount(){
      const { location,initLoadData,dgimn,queryParams,dispatch } = this.props;
      if(location.query&&location.query.type==="alarm"){ //报警信息
         const paraCodeList  = location.query.code.split(",");
         const startTime = location.query.startTime;
         const endTime = location.query.endTime;
        this.child.onDateChange([ moment(startTime), moment(endTime)])//修改日期选择日期  
        this.setState({code:paraCodeList})
      }
        this.props.initLoadData && this.changeDgimn(this.props.dgimn)
      
    
    }
  // 在componentDidUpdate中进行异步操作，驱动数据的变化
  componentDidUpdate(prevProps) {
   if(prevProps.dgimn !==  this.props.dgimn) {
        this.changeDgimn(this.props.dgimn);
    }
}

onRef = ref =>{
  this.child = ref;  // -> 获取整个Child元素
}
 /** 切换排口 */
      changeDgimn = (dgimn) => {
        this.getTableData(dgimn);
  
    }

  /** 根据排口dgimn获取它下面的数据 */
  getTableData = dgimn => {

    let { location,initLoadData,queryParams,dispatch,paraCodeList } = this.props;

    if(location.query&&location.query.type==="alarm"){ //报警信息  更新参数

      const paraCodeList  = location.query.code;
      const startTime = location.query.startTime;
      const endTime = location.query.endTime;
      queryParams = {
        ...queryParams,
        BeginTime:startTime,
        EndTime: endTime,
        ParaCodeList:paraCodeList.split(","),
        DGIMN:dgimn
      }
    }else{

      queryParams = {
        ...queryParams,
        BeginTime: moment(new Date()).add(-1, 'month').format('YYYY-MM-DD HH:mm:ss'),
        EndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        ParaCodeList:[],
        DGIMN:dgimn
      }

    }
    dispatch({
      type: 'historyparData/updateState',
      payload: {queryParams},
    })
    dispatch({
      type: 'historyparData/getHistoryParaCodeList',
      payload: { DGIMN:dgimn  },
      callback:(res)=>{
        let paraCodeDefaults =  res.map(item =>{
           return item.children
        }) 
        console.log(paraCodeDefaults)
      //  let paraCodeDefault =  paraCodeDefaults.map(item=>{
      //     console.log(item)
      //     return item.value
      //  })
       
        // console.log(paraCodeDefault)
          setTimeout(()=>{this.onFinish()}) 
      }
    });
        
      }


  loadData=(dgimn)=>{
    let {dispatch,queryParams,paraCodeList} = this.props;
    dispatch({
      type: 'historyparData/getHistoryParaCodeList',
      payload: { DGIMN:dgimn  },
      callback:(res)=>{

        queryParams = {
          ...queryParams,
          DGIMN:dgimn
        }
        dispatch({
          type: 'historyparData/updateState',
          payload: { queryParams  },
       });
        setTimeout(()=>{this.onFinish()}) 
      }
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
      BeginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
      EndTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
    }
    dispatch({
      type: 'historyparData/updateState',
      payload: { queryParams},
    })
  }
  onFinish = ()=>{
    let {dispatch,queryParams} = this.props;
    queryParams = {
      ...queryParams,
    }
     dispatch({
        type: 'historyparData/getProcessFlowTableHistory',
        payload: { ...queryParams  },
    });
  }
  treeChange=(value,label, extra)=>{
     
    let { queryParams, dispatch } = this.props;
    queryParams = {
      ...queryParams,
      ParaCodeList:value
    }
    dispatch({
      type: 'historyparData/updateState',
      payload: { queryParams},
    })
    if(value=='all'){
      this.setState({code:['all',"leaf1"]})
    }else{
      this.setState({code:value})

    }
  }

 parameName=()=>{

  const {parLoading,paraCodeList} = this.props
  const { TreeNode } = TreeSelect;
  if(!parLoading){
    const tProps = {
      value:this.state.code,
      treeData:paraCodeList,
      treeDefaultExpandAll: true,
      treeCheckable: true,
      // showCheckedStrategy: SHOW_PARENT,
      placeholder: '请选择参数名称',
      onChange:this.treeChange,
    };
    return <TreeSelect {...tProps} maxTagCount={1} >
    
    {/* <TreeNode value="parent 1" title="parent 1">
          <TreeNode value="parent 1-0" title="parent 1-0">
            <TreeNode value="leaf1" title="my leaf" />
            <TreeNode value="leaf2" title="your leaf" />
          </TreeNode>
          <TreeNode value="parent 1-1" title="parent 1-1">
            <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} />
          </TreeNode>
        </TreeNode>
        <TreeNode value="all" title="全选">全选</TreeNode> */}
    </TreeSelect>;
  }else{
    return <Spin size="small" />
  }

 
 }



  //导出数据
  exportData = () => { 
    this.props.dispatch({
      type: "historyData/exportHistoryReports",
      payload: {DGIMNs: this.state.dgimn }
  })
  }


      //查询条件
  queryCriteria = () => {
    const { dateValue } = this.state;
    const ParameName = this.parameName;
    return <div>
      <div style={{ marginTop: 10 }}>
        <Form className="search-form-container" layout="inline"  onFinish={this.onFinish}>
          <Row gutter={[8,8]} style={{flex:1}} > 
          <Col xxl={7} xl={10}   lg={14} md={16} sm={24} xs={24}>
            <Form.Item label="工况参数" className='queryConditionForm'>
                  <ParameName /> 
              </Form.Item>
            </Col>
            <Col xxl={7} xl={10}   lg={14} md={16} sm={24} xs={24}>

              <Form.Item label="监测时间" className='queryConditionForm'>
                  <RangePicker_ 
                   onRef={this.onRef}
                  dateValue={dateValue}
                  isVerification={true}
                  className='textEllipsis'
                  callback={(dates, dataType) => this.dateCallback(dates,dataType)} //父组件事件回调子组件的值
                  allowClear={false} showTime={true} style={{width:"100%"}} /> 
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

<div id="historyparData">
        <Card title={<QueryCriteria />} >
           <SdlTable
              rowKey={(record, index) => `complete${index}`}
              dataSource={tableDatas}
              columns={columns}
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