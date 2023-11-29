/**
 * 功  能：无台账工单统计
 * 创建人：jab
 * 创建时间：2019.10.26
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Badge,
  Modal,
  Input,
  Button,
  Select,
  Tabs,
  Radio,
  Checkbox,
  message,
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
const { TabPane } = Tabs;

const pageUrl = {
  updateState: 'entAbnormalRecord/updateState',
  getData: 'entAbnormalRecord/getExceptionReportedView',
};
@connect(({ loading, entAbnormalRecord,autoForm }) => ({
  priseList: entAbnormalRecord.priseList,
  exloading:entAbnormalRecord.exloading,
  Entloading: entAbnormalRecord.Entloading,
  total: entAbnormalRecord.total,
  tableDatas: entAbnormalRecord.tableDatas,
  queryPar: entAbnormalRecord.queryPar,
  regionList: autoForm.regionList,
  attentionList:entAbnormalRecord.attentionList,
  pointName:entAbnormalRecord.pointName,
  chartExport:entAbnormalRecord.chartExport,
  chartImport:entAbnormalRecord.chartImport,
  chartTime:entAbnormalRecord.chartTime,
  entName:entAbnormalRecord.entName,
  pollutantList:entAbnormalRecord.pollutantList,
  entQueryPar:entAbnormalRecord.entQueryPar,
  entTableDatas:entAbnormalRecord.entTableDatas,
  nextData:entAbnormalRecord.nextData
}))

@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableDatas:[]

    };
    

  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    // const { dispatch, location } = this.props;


       this.getTableData();

  

  };
  updateQueryState = payload => {
    const { entQueryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { entQueryPar: { ...entQueryPar, ...payload } },
    });
  };

  getTableData = () => { 
    const { dispatch, entQueryPar } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...entQueryPar },
      callback:res=>{
        this.setState({tableDatas:res})
      }
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

    setTimeout(()=>{
      this.getTableData();
    })

  }

  changePoll=(value)=>{ //污染物改变事件
    this.updateQueryState({
      PollutantCode: value,
    });

  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, entQueryPar } = this.props;
    dispatch({
      type: 'entAbnormalRecord/exportTaskFormBookSta',
      payload: { ...entQueryPar },
      callback: data => {
          downloadFile(`/wwwroot${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {
  

    const { pointName, dispatch,entQueryPar:{EntCode} } = this.props;

      this.getTableData();

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
  

  dateChange=(date,dataType)=>{
      this.updateQueryState({
        dataType:GetDataType(dataType),
        beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    dateOk=()=>{ 

   }


   tabChange=(e)=>{
   console.log(e)
  }

  render() {
    const {
      exloading,
      Entloading,
      entQueryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantCode,PollutantType },
      nextData:{startTime,endTimes,msg},
      entTableDatas,
      entVisible,
      entCancel,
      entName
    } = this.props;
    const { TabPane } = Tabs;
    let columns = [{
      title: `监测时间`,
      dataIndex: 'DateTime',
      key: 'DateTime',
      align: 'center',
    }];
    
    if(entTableDatas.cloumn&&entTableDatas.cloumn.length>0){
      entTableDatas.cloumn.map(item=>{
       columns.push({
        title: `${item.PollutantName}(${item.Unit})`,
        dataIndex: `${item.PollutantCode}_DischargeVolume`,
        key: `${item.PollutantCode}_DischargeVolume`,
        align: 'center',
      })
    })
  }

    return (
        <Modal
          title={entName}
          footer={null}
          width='95%'
          visible={entVisible}  
          onCancel={entCancel}
        >          
          <div id='entAbnormalRecord'>
         <Row> <span>异常开始时间：{startTime}</span> <span style={{paddingLeft:50}}>异常结束时间：{endTimes}</span></Row>
         <Row style={{paddingTop:10}}> <span>异常描述：{msg}</span></Row>
          <Tabs defaultActiveKey="HourData" onChange={this.tabChange}>
          <TabPane tab="小时数据" key="HourData">
          <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={Entloading}
              columns={columns.length>1?columns:[]}
              dataSource={entTableDatas.hourList}
              // pagination={{
              //   showSizeChanger: true,
              //   showQuickJumper: true,
              //   total: this.props.total,
                //defaultPageSize:20
              // }}
              style={{paddingTop:10}}
            />
        </TabPane>
       <TabPane tab="日均数据" key="DayData">
        <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={Entloading}
              columns={columns.length>1?columns:[]}
              dataSource={entTableDatas.dayList}
              // pagination={{
              //   showSizeChanger: true,
              //   showQuickJumper: true,
              //   total: this.props.total,
                //defaultPageSize:20
              // }}
              style={{paddingTop:10}}
            />
        </TabPane>
      </Tabs>
          </div>
        </Modal>
    );
  }
}
