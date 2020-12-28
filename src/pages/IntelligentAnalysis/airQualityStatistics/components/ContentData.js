/**
 * 功  能：空气质量状况统计
 * 创建人：贾安波
 * 创建时间：2020.12.28
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

import { EnumPropellingAlarmSourceType } from '@/utils/enum';




const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'airQualityStatistics/updateState',
  getData: 'airQualityStatistics/getTaskFormBookSta',
};
@connect(({ loading, airQualityStatistics,autoForm }) => ({
  priseList: airQualityStatistics.priseList,
  exloading:airQualityStatistics.exloading,
  loading: airQualityStatistics.loading,
  total: airQualityStatistics.total,
  tableDatas: airQualityStatistics.tableDatas,
  queryPar: airQualityStatistics.queryPar,
  regionList: autoForm.regionList,
  attentionList:airQualityStatistics.attentionList,
  pointName:airQualityStatistics.pointName,
  chartExport:airQualityStatistics.chartExport,
  chartImport:airQualityStatistics.chartImport,
  chartTime:airQualityStatistics.chartTime,
  entName:airQualityStatistics.entName,
  pollutantList:airQualityStatistics.pollutantList,
  RegionName:airQualityStatistics.RegionName
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regionVisible:false,
      entNumVisible:false,
      workNumVisible:false
    };
    
    this.columns = [
      {
        title: '时间',
        dataIndex: 'Region',
        key: 'Region',
        align: 'center',
        render: (text, record) => {
          return <div>{`${moment(text).format('YYYY-MM-DD')} - ${moment(text).format('YYYY-MM-DD')}` }</div>;
        },
      },
      {
        title: '区域',
        dataIndex: 'Region',
        key: 'Region',
        align: 'center',
      },
      {
        title: '优',
        width:200,
        children: [
          {
            title:'天数',
            dataIndex: 'EntNum',
            key: 'EntNum',
            align: 'center',
            width:100,    
          },
          {
            title:'比率',
            dataIndex: 'EntNotNum',
            key: 'EntNotNum',
            align: 'center',
            width:100,
          },        
      ]
      },
      {
        title: '良',
        width:200,
        children: [
          {
            title:'天数',
            dataIndex: 'EntNum',
            key: 'EntNum',
            align: 'center',
            width:100,    
          },
          {
            title:'比率',
            dataIndex: 'EntNotNum',
            key: 'EntNotNum',
            align: 'center',
            width:100,
          },        
      ]
      },  
      {
        title: '轻度污染',
        width:200,
        children: [
          {
            title:'天数',
            dataIndex: 'EntNum',
            key: 'EntNum',
            align: 'center',
            width:100,    
          },
          {
            title:'比率',
            dataIndex: 'EntNotNum',
            key: 'EntNotNum',
            align: 'center',
            width:100,
          },        
      ]
      },  
      {
        title: '中度污染',
        width:200,
        children: [
          {
            title:'天数',
            dataIndex: 'EntNum',
            key: 'EntNum',
            align: 'center',
            width:100,    
          },
          {
            title:'比率',
            dataIndex: 'EntNotNum',
            key: 'EntNotNum',
            align: 'center',
            width:100,
          },        
      ]
      },
      {
        title: '重度污染',
        width:200,
        children: [
          {
            title:'天数',
            dataIndex: 'EntNum',
            key: 'EntNum',
            align: 'center',
            width:100,    
          },
          {
            title:'比率',
            dataIndex: 'EntNotNum',
            key: 'EntNotNum',
            align: 'center',
            width:100,
          },        
      ]
      }, 
      {
        title: '严重污染',
        width:200,
        children: [
          {
            title:'天数',
            dataIndex: 'EntNum',
            key: 'EntNum',
            align: 'center',
            width:100,    
          },
          {
            title:'比率',
            dataIndex: 'EntNotNum',
            key: 'EntNotNum',
            align: 'center',
            width:100,
          },        
      ]
      },
      {
        title: '总天数',
        dataIndex: 'Region',
        key: 'Region',
        align: 'center',
      },
      {
        title: '优良天数',
        dataIndex: 'Region',
        key: 'Region',
        align: 'center',
      },
      {
        title: '优良率',
        dataIndex: 'Region',
        key: 'Region',
        align: 'center',
        render: (text, record) => {
          return <div>{`${Number(text*100)}%`}</div>;
        },
      },           
    ]
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location } = this.props;


     this.updateQueryState({
      beginTime: moment().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      PollutantTypeCode:"1",
      ModelType: "All"
    });
    setTimeout(() => {
      this.getTableData();
    });
    this.child.onDataValueChange([moment().subtract(1, 'month').startOf('day'),moment()])

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
      callback:res=>{

      }
    });
  };





  typeChange = value => {
    this.updateQueryState({
      PollutantTypeCode: value,
    });
  };




  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'airQualityStatistics/exportTaskFormBookSta',
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

  

  dateChange=(date)=>{
      this.updateQueryState({
        beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    dateOk=()=>{ 

   }



  render() {
    const {
      exloading,
      loading,
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,PollutantCode,PollutantTypeCode },

    } = this.props;
    const { TabPane } = Tabs;
   
    const {  regionVisible, entNumVisible, workNumVisible} = this.state;

    return (
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
             <Form.Item label=''>
               <RangePicker_ allowClear={false}   style={{minWidth: '200px', marginRight: '10px'}} dateValue={[moment(beginTime),moment(endTime)]} 
              callback={(dates, dataType)=>this.dateChange(dates, dataType)}
              onRef={(ref) => {
                this.child = ref;
              }} 
              />
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
              </Form>
            </>
          }
        >
          <div id='airQualityStatistics'>
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
         
        </Card>
    );
  }
}
