/**
 * 功  能：有效传输率
 * 创建人：吴建伟
 * 创建时间：2019.08.12
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
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'missingData/updateState',
  getData: 'missingData/getDefectModel',
};
@connect(({ loading, missingData,autoForm }) => ({
  priseList: missingData.priseList,
  exloading:missingData.exloading,
  loading: loading.effects[pageUrl.getData],
  total: missingData.total,
  tableDatas: missingData.tableDatas,
  queryPar: missingData.queryPar,
  regionList: autoForm.regionList,
  attentionList:missingData.attentionList
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    
    this.columns = [
      {
        title: <span>行政区</span>,
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
        render: (text, record) => { 
          return <Link to={{  pathname: '/Intelligentanalysis/transmissionefficiency/qutDetail',query:  record.RegionCode }} >
                   {text}
               </Link>
                 
       },
      },
      {
        title: <span>企业名称</span>,
        dataIndex: 'entName',
        key: 'entName',
        align: 'center',
        render: (text, record) => text,
      },
      {
        title: <span>监测点名称</span>,
        dataIndex: 'pointName',
        key: 'pointName',
        // width: '10%',
        align: 'center',
      
      },
      // {
      //   title: <span>缺失监测因子</span>,
      //   dataIndex: 'TransmissionRate',
      //   key: 'TransmissionRate',
      //   align: 'center',
      // },
      {
        title: <span>缺失时间段</span>,
        dataIndex: 'firstAlarmTime',
        key: 'firstAlarmTime',
        align: 'center',
        render:(text,row)=>{
          return `${row.firstAlarmTime}~${row.alarmTime}`
        }
      },
      {
        title: <span>缺失小时数</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
      },
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location,Atmosphere } = this.props;

    this.updateQueryState({
      beginTime: moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      Atmosphere:Atmosphere
    });
     dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

     dispatch({ type: 'missingData/getEntByRegion', payload: { RegionCode: '' },  });//获取企业列表
 
     dispatch({ type: 'missingData/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
  

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
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'missingData/exportGetAlarmDataList',
      payload: { ...queryPar },
      callback: data => {
         downloadFile(`/upload${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {
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
  
      /** 数据类型切换 */
 _handleDateTypeChange = value => {
   
    if( value === 'HourData'){
      this.updateQueryState({
        dataType: value,
        beginTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
       
        });
      }else{
        this.updateQueryState({
          dataType: value,
          beginTime: moment().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          
          });
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
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantType },
    } = this.props;

    return (
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
            
              <Row>
              <Form.Item label='数据类型'>
              <Select
                    placeholder="数据类型"
                    onChange={this._handleDateTypeChange}
                    value={dataType}
                    style={{ width: 200 }}
                  >  
                 <Option key='0' value='HourData'>小时数据</Option>
                 <Option key='1' value='DayData'> 日数据</Option>

                  </Select>
              </Form.Item>
                <Form.Item>
                  日期查询：
                      <RangePicker
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={['开始时间', '结束时间']}
                        value={[moment(beginTime),moment(endTime)]}
                        onChange={this.dateChange}
                        onOk={this.dateOk}
                   />
                </Form.Item>
                <Form.Item label='行政区'>
                  <Select
                    allowClear
                    placeholder="行政区"
                    onChange={this.changeRegion}
                    value={RegionCode ? RegionCode : undefined}
                    style={{ width: 200 }}
                  >
                    {this.regchildren()}
                  </Select>
                </Form.Item>

                </Row>
                <Row>

                <Form.Item label='企业类型'>
                  <Select
                    placeholder="企业类型"
                    onChange={this.typeChange}
                    value={PollutantType}
                    style={{ width: 200 }}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">废水</Option>
                    <Option value="2">废气</Option>
                  </Select>
                </Form.Item> 
                <Form.Item label='关注程度'>
                  <Select
                    placeholder="关注程度"
                    onChange={this.changeAttent}
                    value={AttentionCode}
                    style={{ width: 200 }}
                  >
                    <Option value="">全部</Option>
                    {this.attentchildren()}
                  </Select>
                </Form.Item>
                 <Form.Item label='响应状态'>
                  <Select
                    placeholder="响应状态"
                    onChange={this.changeEnt}
                    value={EntCode}
                    style={{ width: 205  }}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">已响应</Option>
                    <Option value="2">待响应</Option>
                  </Select>
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
              </Form>
            </>
          }
        >
          <>
            <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={this.props.loading}
              columns={this.columns}
              bordered={false}
              dataSource={this.props.tableDatas}
              pagination={{
                // showSizeChanger: true,
                // showQuickJumper: true,
                // sorter: true,
                total: this.props.total,
                defaultPageSize:20
                // pageSize: PageSize,
                // current: PageIndex,
                // pageSizeOptions: ['10', '20', '30', '40', '50'],
              }}
            />
          </>
        </Card>
    );
  }
}
