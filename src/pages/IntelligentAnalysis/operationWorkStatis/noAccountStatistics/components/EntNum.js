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

import Ent from './Ent'


const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'noAccountStatistics/updateState',
  getData: 'noAccountStatistics/getSewageHistoryList',
};
@connect(({ loading, noAccountStatistics,autoForm }) => ({
  priseList: noAccountStatistics.priseList,
  exloading:noAccountStatistics.exloading,
  loading: noAccountStatistics.loading,
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
  pollutantList:noAccountStatistics.pollutantList
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entVisible:false

    };
    
    this.columns = [
      {
        title: '行政区',
        dataIndex: 'MonitorTime',
        key: 'MonitorTime',
        align: 'center',
        render: (text, record) => {
          return <a onClick={()=>{this.regionDetail(text)}}>{moment(text).format('YYYY-MM-DD HH:mm')}</a>;
        },
      },
      {
        title: '缺失台账企业名称',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',
            render: (text, record) => {
                return  <a style={{textAlign:'left',width:'100%'}}  onClick={()=>{this.entDetail(text)}}>{text}</a>;
              },

      },
      {
        title: '缺失台账监测点名称',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',
            render: (text, record) => {
                return  <div style={{textAlign:'left',width:'100%'}} >{text}</div>;
            },

      },
      {
        title: '巡检工单',
        children: [
          {
            title:'完成工单数',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',
            render: (text, record) => {
              return text? text : '-';
            },
          },
          {
            title:'缺失台账工单数',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',
            render: (text, record) => {
              return text? text : '-';
            },
          },        
      ]
      },   
      {
        title: '校准工单',
        children: [
          {
            title:'完成工单数',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',
            render: (text, record) => {
              return text? text : '-';
            },
          },
          {
            title:'缺失台账工单数',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',
            render: (text, record) => {
              return text? text : '-';
            },
          },        
      ]
      },             
    ]
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location } = this.props;


     dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

 
     dispatch({ type: 'noAccountStatistics/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
     this.updateQueryState({
      beginTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:00:00'),
      endTime: moment().format('YYYY-MM-DD HH:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      dataType:'HourData',
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

  }

  changePoll=(value)=>{ //污染物改变事件
    this.updateQueryState({
      PollutantCode: value,
    });

  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'noAccountStatistics/exportSewageHistoryList',
      payload: { ...queryPar },
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
  entDetail=()=>{
    const { dispatch } = this.props;
    setTimeout(()=>{
      this.setState({entVisible:true})
    })
  }
  render() {
    const {
      exloading,
      loading,
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantCode,PollutantType },
      entNumVisible,
      entNumCancel
    } = this.props;
    const { TabPane } = Tabs;
   const { entVisible } = this.state;

    return (
        <Modal
          title="这是企业"
          footer={null}
          width='95%'
          visible={entNumVisible}  
          onCancel={entNumCancel}
        >
           <a href='javascript:;' onClick={this.entDetail}>企业数下级页面</a>
          <Ent  entVisible={entVisible}  entCancel={()=>{this.setState({entVisible:false})}} />
              <Form layout="inline" style={{paddingBottom:10}}>
            
                 <Form.Item label='企业列表'>
                 <EntAtmoList changeEnt={this.changeEnt} EntCode={EntCode}/>
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
              loading={loading}
              columns={this.columns}
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
          </div>
        </Modal>
    );
  }
}
