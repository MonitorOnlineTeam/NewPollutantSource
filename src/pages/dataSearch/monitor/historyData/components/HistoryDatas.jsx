


import React, { useState } from 'react';

import { Card, Form, Button, Row, Col,Select,Switch } from 'antd';
import moment from 'moment';

import { connect } from 'dva';

import PageLoading from '@/components/PageLoading'
import CemsTabs from '@/components/CemsTabs'

import SdlTable from '@/components/SdlTable'

import TimeRadioButton from '@/components/TimeRadioButton'

import DropDownSelect from '@/components/DropDownSelect'

import RangePicker_ from '@/components/RangePicker/NewRangePicker'

import PollutantSelect from '@/components/PollutantSelect'

import TableData from './TableData'
import MultiChart from  './MultiChart'
import SingleChart from './SingleChart'

/**
 * 历史数据组件
 * jab 2020.07.30
 */


@connect(({ loading, historyData }) => ({
  pollutantlist: historyData.pollutantlist,
  isloading: loading.effects['historyData/getAllTypeDataList'],//当historyData的effects中的getAllTypeDataList有异步请求行为时为true，没有请求行为时为false
  // dataloading: loading.effects['dataquery/queryhistorydatalist'],
  // exportLoading: loading.effects['dataquery/exportHistoryReport'],
  option: historyData.chartdata,
  selectpoint: historyData.selectpoint,
  columns: historyData.columns,
  datatable: historyData.datatable,
  total: historyData.total,
  tablewidth: historyData.tablewidth,
  historyparams: historyData.historyparams,
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
      dateValue: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
      dataType: "realtime",
      defaultSearchForm: {
        PollutantSourceType: 1,
        EntCode: '',
        ReportTime: moment().add(-1, 'day'),
        airReportTime: [moment().add(-1, 'day'), moment()],
      },
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
      historyparams: {
        datatype: 'realtime',
        DGIMNs: null,
        pageIndex: null,
        pageSize: null,
        beginTime: moment().startOf('day').format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        pollutantCodes: null,
        pollutantNames: null,
        unit: null,
        isAsc: true,
        DGIMN: ''
      },
      isSwitch:false,
      pollutantlist : [{"PollutantName":"COD","PollutantCode":1},{"PollutantName":"氨氮","PollutantCode":2}]
    };
  }

  componentDidMount() {
    this.changeDgimn(this.props.DGIMN)
  }
  changeDgimn = () =>{
   
    this.onRbChange();
   const { dispatch } = this.props;

    dispatch({
    type: 'dataquery/querypollutantlist',
    payload: { ...this.state.historyparams},
});
  }
  singleChart = () => {//单参数图表
    const { tableDatas, loading,columns } = this.props;
    if (loading) {
      return <PageLoading />
    }
    return <>{
          // <p>这是单参数图表</p>
        // <ReactEcharts
        //   option={this.getOptions()}
        //   lazyUpdate={true}
        //   style={{ height: 'calc(100vh - 250px)', width: '100%' }}
        //   className="echarts-for-echarts"
        //   theme="my_theme"
        // /> 
        <TimeRadioButton changeCallback = {this.onRbChange}/>
    }
    </>
  }
  multiChart = () =>{ //多参数图表
    const { tableDatas, loading,columns } = this.props;
    let pollutantlist = this.state.pollutantlist;
    // const pollutantlist = [];
    if (loading) {
      return <PageLoading />
    }
    return <>{
          // <p>这是多参数图表</p>
        // <ReactEcharts
        //   option={this.getOptions()}
        //   lazyUpdate={true}
        //   style={{ height: 'calc(100vh - 250px)', width: '100%' }}
        //   className="echarts-for-echarts"
        //   theme="my_theme"
        // /> 
        <div>
        <DropDownSelect  onChange={this.pollutantChange}  optionDatas={pollutantlist} />
        <p></p>
        <DropDownSelect defaultValue={1} onChange={this.pollutantChange}  optionDatas={pollutantlist} mode="-"/>

        </div>
        
    }
    </>
  }

//   tableData = () =>{
//     return (
//       <SdlTable
//          // rowKey={(record, index) => `complete${index}`}
//          // dataSource={datatable}
//          // columns={columns}
//          resizable
//          defaultWidth={80}
//          scroll={{ y: this.props.tableHeight || undefined}}
//          pagination={{ pageSize: 20 }}

//      />
// );
//   }
  pollutantChange = (e) =>{
     console.log(e)
  }
  onRbChange = (value)=>{
    console.log("我是返回值"+value)
  }
  exoprtData = () => {
    // this.props.dispatch({
    //   type: 'historyData/updateState',
    //   payload: {
    //     testData: "这是修改后的第一页的数据"
    //   },
    // });
    console.log("导出数据")
  }
  /**
 * 回调获取时间并重新请求数据
 */
  dateCallback = (dates, dataType) => {
    console.log(dates)
    let { historyparams, dispatch } = this.props;
    this.setState({
      dateValue: dates
    })
    historyparams = {
      ...historyparams,
      beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
      datatype: dataType
    }
    dispatch({
      type: 'dataquery/updateState',
      payload: {
        historyparams,
      },
    })
    // this.reloaddatalist(historyparams);

  }

  changeReportType=(key)=>{

  }
  // handlePollutantChange=(value)=>{

  //   this.formRef.current.setFieldsValue({
  //      pollutionType: 2,
  // });
  // }
  onFinish = () => {
    console.log(111)
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
        const { displayType, selectP,pollutantlist } = this.state;
        // const { pollutantlist } = this.props;
        return (<PollutantSelect
            mode="multiple"
            optionDatas={pollutantlist}
            defaultValue={pollutantlist[0].PollutantCode}
            onChange={this.handlePollutantChange} //父组件事件回调子组件的值
            placeholder="请选择污染物"
            maxTagCount={2}
            maxTagTextLength={5}
            maxTagPlaceholder="..."
            style={{ width: "100%" }}
        />);
    }
  //   onRef1 = ref => {
  //     this.children = ref;
  // }
  //查询条件
  queryCriteria = () => {
    const { dataType, dateValue, displayType, formLayout,pollutantlist,isSwitch } = this.state;
    const GetpollutantSelect = this.getpollutantSelect;
    const formItemLayout = {
      labelCol: {
        //  span: 7 
          // xs: { span: 24 }, // lable 区域大小
          // sm: { span: 6 },
      },
      wrapperCol: {
          //  span: 17
          // xs: { span: 24 },
          // sm: { span: 18 },  // 内容区大小（两者和不能!>24）表单控件的大小
      }
  };
    return <div>
      <div>
        {"这是标题"}
      </div>
      <div style={{ marginTop: 10 }}>
        <Form className="search-form-container" ref={this.formRef} layout="inline"  onFinish={this.onFinish}>
          <Row gutter={[{ xl: 8, md: 16, sm: 16 },8]} style={{flex:1}} > 
            <Col  xl={8}    md={12} sm={24} xs={24}>
              <Form.Item label="监测时间" {...formItemLayout} className='queryConditionForm'>
                 <RangePicker_ 
                  dateValue={dateValue}
                  dataType={dataType}
                  isVerification={true}
                  // onRef={this.onRef1}
                  className='textEllipsis'
                  callback={(dates, dataType) => this.dateCallback(dates, dataType)} //父组件事件回调子组件的值
                  allowClear={false} showTime={true} style={{width:"100%"}} /> 
              </Form.Item>
            </Col>
            <Col  xl={5}  md={12} sm={24} xs={24}>
              <Form.Item  {...formItemLayout} label="数据类型" className='queryConditionForm'>
                  <Select onChange={this.changeReportType } >
                    <Select.Option key="siteDaily">小时</Select.Option>
                    <Select.Option key="monthly">分钟</Select.Option>
                    <Select.Option key="day">日均</Select.Option>
                    <Select.Option key="annals">实时</Select.Option>
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
                <Button type="primary" loading={false} onClick={() => { this.exoprtData() }} style={{ marginRight: 5 }}>导出</Button>
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