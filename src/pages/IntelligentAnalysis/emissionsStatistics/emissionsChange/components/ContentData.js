/**
 * 功  能：统计量变化趋势
 * 创建人：贾安波
 * 创建时间：2019.10.19
 */
import React, { Component } from 'react';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Icon,
  Badge,
  Modal,
  Input,
  Button,
  Form,
  Select,
  Tabs,
  Radio,
  Checkbox,
  message
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';

import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile,GetDataType,toDecimal3} from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import ReactEcharts from 'echarts-for-react';
import { blue,red,green,gold,grey} from '@ant-design/colors';
import PageLoading from '@/components/PageLoading'
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import EntType from '@/components/EntType'
import AttentList from '@/components/AttentList'
import { EnumPropellingAlarmSourceType } from '@/utils/enum';



const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'emissionsChange/updateState',
  getData: 'emissionsChange/getEmissionsTrendList',
};
@connect(({ loading, emissionsChange,autoForm }) => ({
  priseList: emissionsChange.priseList,
  exloading:emissionsChange.exloading,
  loading: emissionsChange.loading,
  total: emissionsChange.total,
  tableDatas: emissionsChange.tableDatas,
  queryPar: emissionsChange.queryPar,
  regionList: autoForm.regionList,
  attentionList:emissionsChange.attentionList,
  pointName:emissionsChange.pointName,
  chartExport:emissionsChange.chartExport,
  chartImport:emissionsChange.chartImport,
  chartTime:emissionsChange.chartTime,
  entName:emissionsChange.entName,
  pollutantList:emissionsChange.pollutantList
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {


    };
    

  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location } = this.props;
    
     sessionStorage.setItem("pointName", 'COD')
     sessionStorage.setItem("entName", '')

     dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

 
     dispatch({ type: 'emissionsChange/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
     this.child.onDataTypeChange('hour')
     this.updateQueryState({
      beginTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:00:00'),
      endTime: moment().format('YYYY-MM-DD HH:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      dataType:'HourData',
      PollutantCode:['011','060','101','065','007'],
    });
    setTimeout(() => {
      this.getTableData();
    });
  

  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = () => { 
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...queryPar },
    });
  };



  children = () => { //企业列表
    const { priseList } = this.props;

    const selectList = [];
    if (priseList.length > 0) {
      priseList.map(item => {
        selectList.push(
          <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
            {item.EntName}
          </Option>,
        );
      });
      return selectList;
    }
  };

  typeChange = value => {
    this.updateQueryState({
      PollutantType: value,
    });
  };

  changeRegion = (value) => { //行政区事件
    
    this.updateQueryState({
      RegionCode: value,
    });
  };
  changeAttent=(value)=>{
    this.updateQueryState({
      AttentionCode: value,
    });
  }
  changeEnt=(value,data)=>{ //企业事件
    this.updateQueryState({
      EntCode: value,
    });
    data&&data.props? sessionStorage.setItem("entName", data.props.title) : null;

  }

  changePoll=(value)=>{ //污染物改变事件
    this.updateQueryState({
      PollutantCode: value,
    });
  }
  changePoint=(value)=>{ //监测点名称
    this.updateQueryState({
      PollutantCode: value,
    });
  }
  changeImportant=(value)=>{ //重点类型
    this.updateQueryState({
      ImportantType: value,
    });
  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'emissionsChange/exportSewageHistoryList',
      payload: { ...queryPar },
      callback: data => {
          downloadFile(`/upload${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {
  

    const { pointName, dispatch,queryPar:{EntCode} } = this.props;

    if(EntCode){
      this.getTableData();
      dispatch({
        type: pageUrl.updateState,
        payload: { pointName: sessionStorage.getItem("pointName"),entName:sessionStorage.getItem("entName")},
      });
    }else{
      message.warning('监测点厂名称不能为空')
    }

  };


  regchildren=()=>{
    const { regionList } = this.props;
    const selectList = [];
    if (regionList.length > 0) {
      regionList[0].children.map(item => {
        selectList.push(
          <Option key={item.key} value={item.value}>
            {item.title}
          </Option>,
        );
      });
      return selectList;
    }
  }
  attentchildren=()=>{
    const { attentionList } = this.props;
    const selectList = [];
    if (attentionList.length > 0) {
       attentionList.map(item => {
        selectList.push(
          <Option key={item.AttentionCode} value={item.AttentionCode}>
            {item.AttentionName}
          </Option>,
        );
      });
      return selectList;
    }
  }
  
      /** 数据类型切换 */
 _handleDateTypeChange = value => {
    this.child.onDataTypeChange(value)
    }
  dateChange=(date,dataType)=>{
      this.updateQueryState({
        dataType:GetDataType(dataType),
        beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    dateOk=()=>{ 

   }
   getChartData=()=>{

    const { queryPar:{PollutantCode},chartExport,chartImport,chartTime,entName,pollutantList} = this.props;

   let pollSelect = [],pollName=[]
   pollutantList.map(item=>{
    PollutantCode.map(items=>{
      if(item.value===items){
        pollSelect.push({ name: `${item.name}(${item.unit})`, type: 'line', data: chartImport,})
        pollName.push( `${item.name}(${item.unit})`)
      }
    })
   }) 
    return {
      color:[blue[5],red[5],green[5],gold[5],grey[5]],
      title:{
        // text:entName,//图表标题文本内
        textStyle:{//标题内容的样式
          fontSize:14//主题文字字体大小，默认为18px
        },
        left:'center',
        top:30
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: pollName,
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top:80,
          containLabel: true
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: chartTime
      },
      yAxis: [
        {
            name: '浓度值（mg/L）',
            type: 'value',
        }
    ],
      series: pollSelect
  };
   }

   onRef1 = (ref) => {
    this.child = ref;
  }
  onChange3=(e)=>{
   console.log(e)
  }

  render() {
    const {
      exloading,
      loading,
      queryPar: { RegionCode,EntCode, DGIMN,ImportantType,PollutantType,AttentionCode, beginTime,endTime, DataType,PollutantCode},
    } = this.props;
    const { TabPane } = Tabs;

    let columns = [
      {
        title: '监测时间',
        dataIndex: 'MonitorTime',
        key: 'MonitorTime',
        align: 'center',
        render: (text, record) => {
          return <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>;
        },
      },
      {
        title: '监测点名称',
        dataIndex: 'pointName',
        key: 'pointName',
        align: 'center',
        render: (text, record) => {
          return text? text : '-';
        },
      },
    ]
    return (
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
            
              <Row>
              <Form.Item label='行政区'>
               <RegionList changeRegion={this.changeRegion} RegionCode={RegionCode}/>
              </Form.Item>
              
              <Form.Item label='关注程度'>
               <AttentList changeAttent={this.changeAttent}  AttentionCode={AttentionCode} />
              </Form.Item>
              <Form.Item label='企业类型'>
               <EntType typeChange={this.typeChange}  PollutantType={PollutantType} />
              </Form.Item>

                <Form.Item label='重点类型'>
                  <Select
                    allowClear
                    placeholder="重点类型"
                    onChange={this.changeImportant}
                    value={ImportantType ? ImportantType : undefined}
                    style={{ width: 150 }}
                  >
                 <Option key='011' value='011'>1</Option>
                 <Option key='060' value='060'>2</Option>
                  </Select>
                </Form.Item> 

                <Form.Item label='企业列表'>
                 <Select
                 allowClear
                 showSearch
                 optionFilterProp="children"
                 placeholder="企业列表"
                 onChange={this.changeEnt}
                 value={EntCode ? EntCode : undefined}
                 style={{width:'200px'}}
                >
                 {this.children()}
                  </Select>
                </Form.Item>
                </Row>
                <Row>
                <Form.Item label='监测点'>
                 <Select
                    placeholder="监测点名称"
                    onChange={this.changePoint}
                    value={PollutantCode}
                    style={{ width: 150  }}
                  >
                 <Option key='011' value='011'>监测点1</Option>
                 <Option key='060' value='060'>监测点2</Option>
                  </Select> 
                </Form.Item>
                <Form.Item label='趋势类型'>
                <Select
                    placeholder="趋势类型"
                    onChange={this._handleDateTypeChange}
                    value={DataType}
                    style={{ width: 150  }}
                  >  
                 <Option key='0' value='HourData'>小时</Option>
                 <Option key='1' value='DayData'> 日均</Option>

                  </Select>
              </Form.Item>
                <Form.Item label='查询日期'>
               <RangePicker_ allowClear={false}  onRef={this.onRef1} dataType={DataType}  style={{minWidth: '200px', marginRight: '10px'}} dateValue={[moment(beginTime),moment(endTime)]} 
              callback={(dates, dataType)=>this.dateChange(dates, dataType)}/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.queryClick}>
                    查询
                  </Button>
                  <Button
                    style={{ margin: '0 5px' }}
                    icon="export"
                    onClick={this.template}
                    loading={exloading}
                  >
                    导出
                  </Button>
                </Form.Item>
                </Row>
                <Row>
                <Form.Item label='监测因子'>
                  <Checkbox.Group  onChange={this.changePoll} defaultValue={PollutantCode}>
                     <Checkbox value='011'>COD</Checkbox>
                     <Checkbox value='060'>氨氮</Checkbox>
                     <Checkbox value='101'>总磷</Checkbox>
                     <Checkbox value='065'>总氮</Checkbox>
                     <Checkbox value='007'>流量</Checkbox>
                 </Checkbox.Group>
                 </Form.Item>
                </Row>
              </Form>
            </>
          }
        >
          <div id='emissionsChange'>
              <Tabs>
            <TabPane tab="变化趋势" key="1"   >
            {loading?
             <PageLoading/>
              :
              <ReactEcharts
                        option={this.getChartData()}
                        className="echarts-for-echarts"
                        theme="my_theme"
                        style ={{height:"calc(100vh - 300px)"}}
                      />

            }
            </TabPane>
            <TabPane tab="数据详情" key="2">
             <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={loading}
              columns={columns}
              // bordered={false}
              dataSource={this.props.tableDatas}
              // style ={{height:"calc(100vh - 300px)"}} 
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                // sorter: true,
                total: this.props.total,
                defaultPageSize:20
                // pageSize: PageSize,
                // current: PageIndex,
                // pageSizeOptions: ['10', '20', '30', '40', '50'],
              }}
            />
              </TabPane>
           </Tabs>
          </div>
        </Card>
    );
  }
}
