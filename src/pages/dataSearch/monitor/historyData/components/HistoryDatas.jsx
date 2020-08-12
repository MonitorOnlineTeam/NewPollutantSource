


import React, { useState } from 'react';

import { Card, Form, Button, Row, Col,Select,Switch,Tabs } from 'antd';
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


/**
 * 历史数据组件
 * jab 2020.07.30
 */


@connect(({ loading, historyData }) => ({
  isloading: loading.effects['historyData/getAllTypeDataList'],//当historyData的effects中的getAllTypeDataList有异步请求行为时为true，没有请求行为时为false
  exportLoading: loading.effects['historyData/exportHistoryReport'],
  // option: historyData.chartdata,
  // selectpoint: historyData.selectpoint,
  // columns: historyData.columns,
  // datatable: historyData.datatable,
  // total: historyData.total,
  // tablewidth: historyData.tablewidth,
  historyparams: historyData.historyparams,
  pollutantlist:historyData.pollutantlist,
  chartparams:historyData.chartparams,
  dgimn:historyData.dgimn,
  alreadySelect:historyData.alreadySelect,
  pollutantDefault:historyData.pollutantDefault
}))
// loadingAll:loading.models.mySpace,
// //当mySpace这个models有数据请求行为的时候，loading为true，没有请求的时候为false
  

class HistoryDatas extends React.Component {
  
  // formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      displayType: 'data',
      format: 'YYYY-MM-DD HH:mm:ss',
      selectP: '',   
      defaultSearchForm: {
        PollutantSourceType: 1,
        EntCode: '',
        ReportTime: moment().add(-1, 'day'),
        airReportTime: [moment().add(-1, 'day'), moment()],
        pollDefaultCode:"",
        dataType: "",
      },
      dateValue: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
      dataType: "",
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
      pollSelectCode:[],
      pollutantDetault:[]
    };
  }

  componentDidMount() {
    this.props.initLoadData && this.changeDgimn(this.props.dgimn)
   
  }
  static getDerivedStateFromProps(props, state) {
    // 只要当前 dgimn  变化，
    // 重置所有跟 dgimn 相关的状态。
    // if (props.dgimn !== state.dgimn) {
      
    //   return {
    //     dgimn: props.dgimn
    //   };
    // }
    //  if (props.pollutantlist !== state.pollutantlist) {
      
    //   return {
    //     pollutantDefault: props.pollutantlist.map((item,index)=>{
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

  initData = () =>{
    const { pollDefaultCode,dgimn } = this.state;
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
              unit: pollutantSelectUnit.toString()
            } 
          dispatch({
           type: 'historyData/updateState',
           payload: { historyparams:{ ...historyparamData} },
          });
          chartparams = {
            ...chartparams,
            PollutantCode: pollutantSelectCode,
            // pollutantNames: res.length > 0 ? res.toString() : '',
          }
          dispatch({type: 'historyData/updateState',payload: { chartparams } });


          setTimeout(()=>{ this.onFinish()})
  
  }


    /** 切换排口 */
    changeDgimn = (dgimn) => {
      this.setState({
          selectDisplay: true,
          selectP: '',
          dgimn,
      })
      this.getpointpollutants(dgimn);

  }
    /** 根据排口dgimn获取它下面的所有污染物 */
    getpointpollutants = dgimn => {
      const {dispatch} = this.props;
       dispatch({
          type: 'historyData/getPollutantList',
          payload: { DGIMNs : dgimn  },
          callback: () => {
              this.initData();
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



  exportData = () => {
    this.props.dispatch({
      type: "historyData/exportHistoryReport",
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
    // dispatch({
    //   type: 'historyData/updateState',
    //   payload: { chartparams},
    // })
  }
  
  changeReportType=(value)=>{
    // this.setState({dataType:value})
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


    // dispatch({
    //   type: 'historyData/updateState',
    //   payload: { chartparams},
    // })

  }
  onFinish = () => { //查询
    let { historyparams,chartparams, dispatch } = this.props;
     dispatch({
      type: "historyData/getAllTypeDataList",
      payload: {...historyparams},
     })
     dispatch({
      type: "historyData/getAllChatDataList",
      payload: {...chartparams},
     })

  }
  tabChange = (key) =>{
    if(key ==='tableData'){
      this.setState({isSwitch:false})
    }else{
    this.setState({isSwitch:true})
   }
  }

/** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
  getpollutantSelect = () => {
      const { pollutantlist } = this.props;
      const pollutantSelect = pollutantlist ? pollutantlist.map((item,index)=>{
        return  item.PollutantCode
   }) : [];
      // alert(pollutantDefault.toString())
      return (<DropDownSelect
        mode="multiple"
        optionDatas={pollutantlist}
        defaultValue={ pollutantSelect}
        onChange={this.handlePollutantChange} //父组件事件回调子组件的值
    />);

       

    }
    onRef1 = (ref) => {
      this.children = ref;
  }
  //查询条件
  queryCriteria = () => {
    const { dataType,dateValue, displayType,isSwitch } = this.state;
    const GetpollutantSelect = this.getpollutantSelect;
    const formItemLayout = {
      labelCol: { },
      wrapperCol: { }
  };

    return <div>
      <div style={{ marginTop: 10 }}>
        <Form className="search-form-container" ref={this.formRef} layout="inline"  onFinish={this.onFinish}>
          <Row gutter={[{ xl: 8, md: 16, sm: 16 },8]} style={{flex:1}} > 
            <Col  xl={8}    md={12} sm={24} xs={24}>
              <Form.Item label="监测时间" {...formItemLayout} className='queryConditionForm'>
                  <RangePicker_ 
                   onRef={this.onRef1}
                  dateValue={dateValue}
                  dataType={dataType}
                  isVerification={true}
                  className='textEllipsis'
                  callback={(dates, dataType) => this.dateCallback(dates,dataType)} //父组件事件回调子组件的值
                  allowClear={false} showTime={true} style={{width:"100%"}} /> 
              </Form.Item>
            </Col>
            <Col  xl={5}  md={12} sm={24} xs={24}>
              <Form.Item  {...formItemLayout} label="数据类型" className='queryConditionForm'>
                  <Select onChange={this.changeReportType } defaultValue={dataType}>
                    <Select.Option key="hour">小时</Select.Option>
                    <Select.Option key="minute">分钟</Select.Option>
                    <Select.Option key="day">日均</Select.Option>
                    <Select.Option key="realtime">实时</Select.Option>
                  </Select>
                
              </Form.Item>
              </Col>
              <Col  xl={5}  md={12} sm={24} xs={24}>
              <Form.Item label="污染类型" {...formItemLayout} className='queryConditionForm'>
               <GetpollutantSelect />
              </Form.Item>
            </Col>
            <Col  xl={2}   md={12} sm={24} xs={12}>
              <Form.Item label="标识" {...formItemLayout} className='queryConditionForm'>
              <Switch  disabled={this.state.isSwitch} checkedChildren="开启" unCheckedChildren="关闭" style={{ marginRight: 10 }} defaultChecked />
              </Form.Item>
            </Col>
            <Col  xl={4}   md={12} sm={24} xs={12}>
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
      <div id="dataquery">
        <Card title={<QueryCriteria />} >
          <CemsTabs panes={this.state.panes}  tabChange={this.tabChange} />
        </Card>

      </div>
    );
  }
}

export default HistoryDatas;