


import React, { useState } from 'react';

import { Card, Form, Button, Row, Col,Select,Switch,Tabs,Spin,Checkbox } from 'antd';
import moment from 'moment';

import { connect } from 'dva';

import PageLoading from '@/components/PageLoading'
import CemsTabs from '@/components/CemsTabs'

import SdlTable from '@/components/SdlTable'

import TimeRadioButton from '@/components/RadioButton'

import DropDownSelect from '@/components/DropDownSelect'

import RangePicker_ from '@/components/RangePicker/NewRangePicker'

import TableData from './TableData'
import MultiChart from  './MultiChart'
import SingleChart from './SingleChart'
import { ConsoleSqlOutlined } from '@ant-design/icons';


/**
 * 历史数据组件
 * jab 2020.07.30
 */


@connect(({ loading, historyData }) => ({
  isloading: loading.effects['historyData/getAllTypeDataList'],//当historyData的effects中的getAllTypeDataList有异步请求行为时为true，没有请求行为时为false
  exportLoading: loading.effects['historyData/exportHistoryReport'],
  pollLoading: historyData.pollLoading,
  // option: historyData.chartdata,
  // selectpoint: historyData.selectpoint,
  // columns: historyData.columns,
  // datatable: historyData.datatable,
  // total: historyData.total,
  // tablewidth: historyData.tablewidth,
  historyparams: historyData.historyparams,
  pollutantlist:historyData.pollutantlist,
  chartparams:historyData.chartparams,
  // dgimn:historyData.dgimn,
  alreadySelect:historyData.alreadySelect,
  pollutantDefault:historyData.pollutantDefault,
  // pollType:historyData.pollType
}))
// loadingAll:loading.models.mySpace,
// //当mySpace这个models有数据请求行为的时候，loading为true，没有请求的时候为false
  

class HistoryDatas extends React.Component {
  
  // formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      format: 'YYYY-MM-DD HH:mm:ss',
      dateValue: [moment(moment(new Date()).format('YYYY-MM-DD 00:00:00')), moment(new Date())],
      dataType: "hour",
      dgimn:'',
      panes: [{
        key: 'tableData',
        title: '数据列表',
        name: <TableData />
      }, {
        key: 'singleChart',
        title: '单参数图表',
        name: <SingleChart />
      }, {
        key: 'multiChart',
        title: '多参数图表',
        name: <MultiChart />
      }],
      isSwitch:false,
      isSingerChat:false,
      pollSelectCode:[],
      pollutantSelect:[],
      defaultChecked:false,
      chatDatatype:"hour"
    };
  }

  componentDidMount() {
    this.props.initLoadData && this.changeDgimn(this.props.dgimn)
   
  }
  static getDerivedStateFromProps(props, state) {
    // 只要当前 dgimn  变化，
    // 重置所有跟 dgimn 相关的状态。
    if (props.dgimn !== state.dgimn) {
      
      return {
        dgimn: props.dgimn
      };
    }
    //  if (props.pollutantlist !== state.pollutantlist) {
      
    //   return {
    //     pollutantSelect: props.pollutantlist.map((item,index)=>{
    //                       return  item.PollutantCode
    //                     })
    //   };
    // }
    if (props.historyparams.datatype !== state.dataType) {

      return {
        dataType:props.historyparams.datatype
      };
    }
    return null;

  }

// 在componentDidUpdate中进行异步操作，驱动数据的变化
 componentDidUpdate(prevProps) {
    if(prevProps.dgimn !==  this.props.dgimn) {
          this.changeDgimn(this.props.dgimn);
      }
}  



  initData = (dgimn) =>{
    let { dispatch,historyparams,pollutantlist,chartparams } = this.props;
         const pollutantSelectCode =  pollutantlist.map((item,index)=>{
              return item.PollutantCode
         })
         const pollutantSelectName =  pollutantlist.map((item,index)=>{
          return item.PollutantName
        })
        const pollutantSelectUnit =  pollutantlist.map((item,index)=>{
          return item.Unit
        })
             let historyparamData = {
              ...historyparams,
              pollutantCodes: pollutantSelectCode.toString(),
              pollutantNames: pollutantSelectName.toString(),
              unit: pollutantSelectUnit.toString(),
              DGIMN: dgimn,
              DGIMNs: dgimn,
            } 
          dispatch({
           type: 'historyData/updateState',
           payload: { historyparams:{ ...historyparamData} },
          });
          chartparams = {
            ...chartparams,
            PollutantCode: pollutantSelectCode,
            DGIMN:[dgimn]
          }
          dispatch({type: 'historyData/updateState',payload: { chartparams } });


          setTimeout(()=>{ this.onFinish()})
  
  }


    /** 切换排口 */
    changeDgimn = (dgimn) => {
        dgimn?  this.getpointpollutants(dgimn) : null;
  }
    /** 根据排口dgimn获取它下面的所有污染物 */
    getpointpollutants = dgimn => {
      const {dispatch} = this.props;
       dispatch({
          type: 'historyData/getPollutantList',
          payload: { DGIMNs : dgimn  },
          callback: () => {
              this.initData(dgimn);
          }
      });
  }


  handlePollutantChange = (value,selectedOptions) =>{ //污染物列表change事件
      //污染物类型
  let  { dispatch,historyparams,chartparams} = this.props;
  const res = [];
  if (selectedOptions.length > 0) {
    selectedOptions.map((item, key) => {
        res.push(item.props.children);
    })
}
//  this.forceUpdate() // 强制刷新数据
  historyparams = {
    ...historyparams,
    pollutantCodes: value.length > 0 ? value.toString() : null,
    pollutantNames: res.length > 0 ? res.toString() : '',
  }
  dispatch({type: 'historyData/updateState',payload: { historyparams } });

  chartparams = {
    ...chartparams,
    PollutantCode: value.length > 0 ? value : null,
    // pollutantNames: res.length > 0 ? res.toString() : '',
  }
  dispatch({type: 'historyData/updateState',payload: { chartparams } });
  }


  //导出数据
  exportData = () => { 
    this.props.dispatch({
      type: "historyData/exportHistoryReports",
      payload: {DGIMNs: this.state.dgimn }
  })
  }



  /**
 * 回调获取时间并重新请求数据
 */
  dateCallback = (dates, dataType) => { //更新日期
    let { historyparams,chartparams, dispatch } = this.props;
    this.setState({
      dateValue: dates
    })
    historyparams = {
      ...historyparams,
      beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
      datatype: dataType
    }
    chartparams = {
      ...chartparams,
      BeginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
      EndTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
      DataType: dataType
    }
    dispatch({
      type: 'historyData/updateState',
      payload: { historyparams},
    })
    dispatch({
      type: 'historyData/updateState',
      payload: { chartparams},
    })
  }
  
  changeReportType=(value)=>{
    
    this.state.isSingerChat ? this.setState({chatDatatype:value}) : this.setState({dataType:value});

    this.children.onDataTypeChange(value)//修改日期选择日期  
    let { historyparams,chartparams, dispatch } = this.props;
    historyparams = {
      ...historyparams,
      datatype: value
    }
    dispatch({
      type: 'historyData/updateState',
      payload: { historyparams},
    })
    chartparams = {
      ...chartparams,
      DataType: value
    }


    dispatch({
      type: 'historyData/updateState',
      payload: { chartparams},
    })

  }
  identChange = (e) =>{
    let { historyparams,dispatch } = this.props;
    historyparams = {
      ...historyparams,
      Flag: e.target.checked ? "1" : "0"
    }
    dispatch({
     type: "historyData/updateState",
     payload: {historyparams},
    })
  }
  onFinish = () => { //查询
    let { historyparams,chartparams, dispatch,polltype } = this.props;
     dispatch({
      type: "historyData/getAllTypeDataList",
      payload: {...historyparams},
     })

     chartparams = {
      ...chartparams,
      PollutantType: polltype
    }
     dispatch({
      type: "historyData/getAllChatDataList",
      payload: {...chartparams},
     })

  }
  tabChange = (key) =>{
    if(key ==='tableData'){
      this.setState({isSwitch:false,isSingerChat:false})
    }else{
      this.setState({isSwitch:true,isSingerChat:false})
      if(key === "singleChart"){
        this.setState({isSingerChat:true})
      }
   
   }
  }

/** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
  getpollutantSelect = () => {
      const { pollutantlist } = this.props;
        const pollDefaultSelect = pollutantlist.map((item,index)=>{
          return  item.PollutantCode
         });
        return (<DropDownSelect
          ispollutant = {1}
          mode = "multiple"
          optiondatas={pollutantlist}
          defaultValue={pollDefaultSelect}
          onChange={this.handlePollutantChange} //父组件事件回调子组件的值
      /> );
    }

    onRef1 = ref =>{
      this.children = ref;  // -> 获取整个Child元素
    }
  //查询条件
  queryCriteria = () => {
    const { dataType,dateValue,isSwitch,defaultChecked,isSingerChat,chatDatatype } = this.state;
    const { pollLoading,pollutantlist } = this.props;
    const GetpollutantSelect = this.getpollutantSelect;
    const formItemLayout = {
      labelCol: { },
      wrapperCol: { }
  };

    return <div>
      <div style={{ marginTop: 10 }}>
        <Form className="search-form-container" ref={this.formRef} layout="inline"  onFinish={this.onFinish}>
          <Row gutter={[{ xl: 8, md: 16, sm: 16 },8]} style={{flex:1,alignItems:"center"}} > 
          <Col  xxl={4} xl={5}  md={12} sm={24} xs={24}>
              <Form.Item  {...formItemLayout} label="数据类型" className='queryConditionForm'>
                   {isSingerChat ?
                  
                   <Select onChange={this.changeReportType } value={chatDatatype}> 
                     <Select.Option key="hour">小时</Select.Option>      
                     <Select.Option key="day">日均</Select.Option>  
                   </Select> 
                   : 
                   <Select onChange={this.changeReportType } value={dataType}> 
                   <Select.Option key="realtime">实时</Select.Option> 
                    <Select.Option key="minute">分钟</Select.Option> 
                    <Select.Option key="hour">小时</Select.Option>      
                    <Select.Option key="day">日均</Select.Option>  
                  </Select> 
            }
              </Form.Item>
              </Col>
            <Col  xxl={8} xl={8}    md={12} sm={24} xs={24}>
              <Form.Item label="监测时间" {...formItemLayout} className='queryConditionForm'>
                  <RangePicker_ 
                  dateValue={dateValue}
                  dataType={dataType}
                  isVerification={true}
                  className='textEllipsis'
                  onRef={this.onRef1}
                  callback={(dates, dataType) => this.dateCallback(dates,dataType)} //父组件事件回调子组件的值
                  allowClear={false} showTime={true} style={{width:"100%"}} /> 
              </Form.Item>
            </Col>
              <Col  xxl={6} xl={5}  md={12} sm={24} xs={24}>
              <Form.Item label="污染类型" {...formItemLayout} className='queryConditionForm'>
               { pollLoading?  <Spin size="small" /> : <GetpollutantSelect /> }
              </Form.Item>
            </Col>
            <Col xxl={1}  xl={2}   md={12} sm={24} xs={12}>
              <Checkbox  defaultChecked={defaultChecked} v-show={this.state.isSwitch} onChange={this.identChange}>标识</Checkbox>
            </Col>
            <Col  xxl={3} xl={3}   md={12} sm={24} xs={12}>
              <Form.Item {...formItemLayout} className='queryConditionForm'> 
                <Button type="primary" loading={false} htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                <Button type="primary" loading={false} onClick={() => { this.exportData() }} style={{ marginRight: 5 }}>导出</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  }
  pageContent = () => {
    const { showType, columns } = this.state;
    const { siteParamsData: { timeList, tableList, chartList }, loading } = this.props;
    if (loading) {
      return <PageLoading />
    }
    return <>{
      chartList.length ? (showType === "chart" ?
        <ReactEcharts
          option={this.getOptions()}
          lazyUpdate={true}
          style={{ height: 'calc(100vh - 250px)', width: '100%' }}
          className="echarts-for-echarts"
          theme="my_theme"
        /> :
        <SdlTable columns={columns} dataSource={tableList} pagination={false} />) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
    </>
  }


  render() {
    const QueryCriteria = this.queryCriteria;
    const { TabPane } = Tabs;
    return (
      <div id="HistoryDatas">
        <Card title={<QueryCriteria />} >
          <CemsTabs panes={this.state.panes}  tabChange={this.tabChange} />
        </Card>

      </div>
    );
  }
}

export default HistoryDatas;