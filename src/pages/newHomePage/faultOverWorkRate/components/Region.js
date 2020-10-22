
/**
 * 功  能：首页弹框
 * 创建人：贾安波
 * 创建时间：2020.10
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
import { downloadFile,GetDataType,toDecimal3,interceptTwo} from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import ReactEcharts from 'echarts-for-react';
import { blue,red,green,gold,grey} from '@ant-design/colors';
import PageLoading from '@/components/PageLoading'
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import EntType from '@/components/EntType'
import AttentList from '@/components/AttentList'
import { EnumPropellingAlarmSourceType } from '@/utils/enum';

import EntData from './Ent'
import { getAllEnterprise } from '@/pages/Test/service';

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'home/updateState',
  getData: 'home/getSewageHistoryList',
};
@connect(({ loading, home,autoForm }) => ({
  priseList: home.priseList,
  exloading:home.exloading,
  loading: home.loading,
  total: home.total,
  tableDatas: home.tableDatas,
  queryPar: home.queryPar,
  regionList: autoForm.regionList,
  attentionList:home.attentionList,
  pointName:home.pointName,
  chartExport:home.chartExport,
  chartImport:home.chartImport,
  chartTime:home.chartTime,
  entName:home.entName,
  pollutantList:home.pollutantList,
  isWorkRate:home.isWorkRate,
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
        title: <span>行政区</span>,
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
      },
      {
        title: <span>企业数</span>,
        dataIndex: 'entName',
        key: 'entName',
        align: 'center',
      },
      {
        title: <span>{this.props.Atmosphere? '监测点数': '空气监测点数'}</span>,
        dataIndex: 'pointName',
        key: 'pointName',
        align: 'center',
      },
      {
        title: <span>排口类型</span>,
        dataIndex: 'firstAlarmTime',
        key: 'firstAlarmTime',
        align: 'center',
        render:(text,row)=>{
          return `${row.firstAlarmTime}~${row.alarmTime}`
        }
      },
      {
        title: <span>运转率</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
        render: (text, record) => {
          if (record.ShouldNumber==0) {
            return <span>停运</span>;
          }
          // 红色：#f5222d 绿色：#52c41a
          const percent = interceptTwo(Number(text) * 100);
          if (percent >= 90) {
            return (
              <div>
                <Progress
                  successPercent={percent}
                  percent={percent}
                  size="small"
                  style={{width:'90%'}}
                  format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
                />
              </div>
            );
          }
          return (
            <div>
              <Progress
                successPercent={0}
                percent={percent}
                status="exception"
                size="small"
                style={{width:'90%'}}
                format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
              />
            </div>
          );
        },
      },
      {
        title: <span>低于90%的监测点个数</span>,
        dataIndex: 'LowerTransmissionEffectiveRateCount',
        key: 'LowerTransmissionEffectiveRateCount',
        width: 145,
        align: 'center',
        render: (text, record) => {
          if (record.ShouldNumber==0) {
            return <span>停运</span>;
          }else{
          return <span>{text}</span>
          }
        },
      },
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location,isWorkRate } = this.props;
    
    console.log("111111")
    console.log(isWorkRate)

     dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

 
     dispatch({ type: 'home/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
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

  workNextPage=()=>{
    const { isWorkRate,dispatch } = this.props;
    setTimeout(()=>{
      this.setState({entVisible:true})
    })
  }

  entCancel=()=>{
    this.setState({entVisible:false})
  }

  render() {
    const {
      exloading,
      loading,
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantCode,PollutantType },
      Atmosphere,
      regionVisible,
      regionCancel,
    } = this.props;
    const { TabPane } = Tabs;
   
    const { entVisible } = this.state;
    return (
       <div>
        <Modal
          title="这是标题"
          footer={null}
          visible={regionVisible}  
          onCancel={regionCancel}
        >
            <>
              <Form layout="inline">
            
              <Row>
              <Form.Item label='行政区'>
               <RegionList changeRegion={this.changeRegion} RegionCode={RegionCode}/>
              </Form.Item>
              
              <Form.Item label='关注程度'>
               <AttentList changeAttent={this.changeAttent}  AttentionCode={AttentionCode} />
              </Form.Item>
              {/* <Form.Item label='企业类型'>
               <EntType typeChange={this.typeChange}  PollutantType={PollutantType} />
              </Form.Item> */}
                <Form.Item label={Atmosphere?'大气站列表':'企业列表'}>
                 <EntAtmoList changeEnt={this.changeEnt} EntCode={EntCode} type={Atmosphere?2:1}/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.queryClick}>
                    查询
                  </Button>
                </Form.Item>
                <a href='javascript:;' onClick={this.workNextPage}>下级页面</a>
                </Row>
              </Form>
            </>
          <div id=''>

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

          <EntData entVisible={entVisible} entCancel={this.entCancel}/>
          </div>
    );
  }
}
