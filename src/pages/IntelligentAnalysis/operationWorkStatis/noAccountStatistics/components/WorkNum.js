/**
 * 功  能：无台账工单统计
 * 创建人：贾安波
 * 创建时间：2019.10.26
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
  TaskNumsloading: noAccountStatistics.TaskNumsloading,
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
  workNumQueryPar:noAccountStatistics.workNumQueryPar,
  RegionName:noAccountStatistics.RegionName
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {


    };
    
    this.columns = [
      {
        title: '行政区',
        dataIndex: 'Region',
        key: 'Region',
        align: 'center',
      },
      {
        title: '缺失台账企业名称',
            dataIndex: 'EntName',
            key: 'EntName',
            align: 'center',
            render: (text, record) => {
                return  <div style={{textAlign:'left',width:'100%'}} >{text}</div>;
              },

      },
      {
        title: '缺失台账监测点名称',
            dataIndex: 'PointName',
            key: 'PointName',
            align: 'center',
            render: (text, record) => {
                return  <div style={{textAlign:'left',width:'100%'}} >{text}</div>;
            },

      },
      {
        title: '工单类型',
            dataIndex: 'TaskTypeName',
            key: 'TaskTypeName',
            align: 'center',
            render: (text, record) => {
              return text? text : '-';
            },

      },   
      {
        title: '工单号',
            dataIndex: 'TaskCode',
            key: 'TaskCode',
            align: 'center',
            render: (text, record) => {
              return text? text : '-';
            },

      },  
      {
        title: '运维人',
            dataIndex: 'UserName',
            key: 'UserName',
            align: 'center',
            render: (text, record) => {
              return text? text : '-';
            },

      }, 
      {
        title: '完成时间',
            dataIndex: 'CompleteTime',
            key: 'CompleteTime',
            align: 'center',
            render: (text, record) => {
              return text? text : '-';
            },

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
    const { workNumQueryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { workNumQueryPar: { ...workNumQueryPar, ...payload } },
    });
  };

  getTableData = () => { 
    const { dispatch, workNumQueryPar } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...workNumQueryPar },
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
      this.getTableData()
    })
  }

  changePoll=(value)=>{ //污染物改变事件
    this.updateQueryState({
      PollutantCode: value,
    });

  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, workNumQueryPar } = this.props;
    dispatch({
      type: 'noAccountStatistics/exportTaskFormBookSta',
      payload: { ...workNumQueryPar },
      callback: data => {
          downloadFile(`/upload${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {
  

    const { pointName, dispatch,queryPar:{EntCode} } = this.props;

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
      TaskNumsloading,
      workNumQueryPar: {  RegionCode,EntCode,beginTime,endTime},
      workNumVisible,
      workNumCancel,
      RegionName
    } = this.props;
    const { TabPane } = Tabs;


    return (
        <Modal
         title={`${RegionName=='全部合计'?'所有行政区':RegionName}${moment(beginTime).format('YYYY/MM/DD')}-${moment(endTime).format('YYYY/MM/DD')}缺失台账照片工单记录`}
          footer={null}
          width='95%'
          visible={workNumVisible}  
          onCancel={workNumCancel}
        >
              <Form layout="inline" style={{paddingBottom:10}}>
            
                 <Form.Item label='企业列表'>
                 <EntAtmoList regionCode={RegionCode} changeEnt={this.changeEnt} EntCode={EntCode}/>
                </Form.Item> 

                <Form.Item>
                  <Button
                    style={{ margin: '0 5px' }}
                    icon="export"
                    onClick={this.template}
                    loading={exloading}
                  >
                    导出
                  </Button>
                </Form.Item>
              </Form>
          <div id='noAccountStatistics'>
             <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={TaskNumsloading}
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
