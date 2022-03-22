/**
 * 功  能：无台账工单统计
 * 创建人：贾安波
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

const pageUrl = {
  updateState: 'noAccountStatistics/updateState',
  getData: 'noAccountStatistics/getTaskFormBookSta',
};
@connect(({ loading, noAccountStatistics,autoForm }) => ({
  priseList: noAccountStatistics.priseList,
  exloading:noAccountStatistics.exloading,
  Entloading: noAccountStatistics.Entloading,
  total: noAccountStatistics.total,
  tableDatas: noAccountStatistics.tableDatas,
  queryPar: noAccountStatistics.queryPar,
  regionList: autoForm.regionList,
  attentionList:noAccountStatistics.attentionList,
  pointName:noAccountStatistics.pointName,
  chartExport:noAccountStatistics.chartExport,
  chartImport:noAccountStatistics.chartImport,
  chartTime:noAccountStatistics.chartTime,
  entName:noAccountStatistics.entName,
  pollutantList:noAccountStatistics.pollutantList,
  entQueryPar:noAccountStatistics.entQueryPar,
  EntName:noAccountStatistics.EntName
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableDatas:[]

    };
    
    this.columns = [
      {
        title: '排口类型',
        dataIndex: 'PointType',
        key: 'PointType',
        align: 'center',
      },
      {
        title: '监测点名称',
            dataIndex: 'PointName',
            key: 'PointName',
            align: 'center',
            render:(text,record)=>{
                return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>;
            }
      },
      {
        title: '巡检工单',
        width:300,
        children: [
          {
            title:'完成工单数',
            dataIndex: 'InspectionNum',
            key: 'InspectionNum',
            align: 'center',
            width:150,
          },
          {
            title:'缺失台账工单数',
            dataIndex: 'InspectionNotNum',
            key: 'InspectionNotNum',
            align: 'center',
            width:150,
          },        
      ]
      },   
      {
        title: '校准工单',
        width:300,
        children: [
          {
            title:'完成工单数',
            dataIndex: 'CalibrationNum',
            key: 'CalibrationNum',
            align: 'center',
            width:150,
          },
          {
            title:'缺失台账工单数',
            dataIndex: 'CalibrationNotNum',
            key: 'CalibrationNotNum',
            align: 'center',
            width:150,
          },        
      ]
      },             
    ]
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
      type: 'noAccountStatistics/exportTaskFormBookSta',
      payload: { ...entQueryPar },
      callback: data => {
          downloadFile(`/upload${data}`);
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


  onChange3=(e)=>{
   console.log(e)
  }

  render() {
    const {
      exloading,
      Entloading,
      entQueryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantCode,PollutantType },
      entVisible,
      EntName,
      entCancel
    } = this.props;
    const { TabPane } = Tabs;


    return (
        <Modal
          title={`${EntName}${moment(beginTime).format('YYYY/MM/DD')}-${moment(endTime).format('YYYY/MM/DD')}缺失台账照片统计信息`}
          footer={null}
          width='95%'
          visible={entVisible}  
          onCancel={entCancel}
        >          
          <div id='noAccountStatistics'>
             <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={Entloading}
              columns={this.columns}
              // bordered={false}
              dataSource={this.state.tableDatas}
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
          </div>
        </Modal>
    );
  }
}
