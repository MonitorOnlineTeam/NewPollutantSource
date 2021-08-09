
/**
 * 功  能：首页弹框
 * 创建人：贾安波
 * 创建时间：2020.10
 */
import React, { Component } from 'react';
import { RollbackOutlined } from '@ant-design/icons';
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
import { downloadFile,GetDataType,toDecimal3,interceptTwo} from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import ReactEcharts from 'echarts-for-react';
import { blue,red,green,gold,grey} from '@ant-design/colors';
import PageLoading from '@/components/PageLoading'
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import EntType from '@/components/EntType'
import AttentList from '@/components/AttentList'
import { EnumPropellingAlarmSourceType } from '@/utils/enum'

import MonPoint from './MonPoint'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'failureRate/updateState',
  getOverDataRate: 'failureRate/getOverDataRate',
  getDeviceDataRate: 'failureRate/getDeviceDataRate',
  getExceptionDataRate: 'failureRate/getExceptionDataRate',
};
@connect(({ loading, failureRate,autoForm }) => ({
  priseList: failureRate.priseList,
  exloading:failureRate.exloading,
  loading: failureRate.regionLoading,
  total: failureRate.total,
  tableDatas: failureRate.tableDatas,
  queryPar: failureRate.queryPar,
  regionList: autoForm.regionList,
  attentionList:failureRate.attentionList,
  pointName:failureRate.pointName,
  chartExport:failureRate.chartExport,
  chartImport:failureRate.chartImport,
  chartTime:failureRate.chartTime,
  entName:failureRate.entName,
  isWorkRate:failureRate.isWorkRate,
  isFaultRate:failureRate.isFaultRate,
  isOverRate:failureRate.isOverRate,
  Atmosphere:failureRate.Atmosphere,
  entQuery:failureRate.entQuery,
  entTableDatas:failureRate.entTableDatas,
  regionName:failureRate.regionName,
  regionCode:failureRate.regionCode
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pointVisible:false

    };
    
    this.columns = [
      {
        title: <span>行政区</span>,
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
      },
      {
        title: <span>{this.props.Atmosphere? '大气站名称': '企业名称'}</span>,
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'center',
        render: (text, record) => {     
          return  <div  style={{textAlign:'left'}}> 
            <a href='#'  onClick={()=>{this.nextPage(record)}} >{text}</a>
          </div>
       },
      },
      {
        title: <span>监测点数</span>,
        dataIndex: 'PointNum',
        key: 'PointNum',
        align: 'center',
      },
      {
        title: <span>{this.props.isWorkRate? '运转率' : this.props.isOverRate ? '超标率' : '故障率'}</span>,
        dataIndex: 'Rate',
        key: 'Rate',
        align: 'center',
        sorter: (a, b) => a.Rate - b.Rate,
        render: (text, record) => {
          // const percent = interceptTwo(Number(text) * 100);
          const percent = interceptTwo(text);
          if(this.props.isWorkRate){ // 运转率 
            if (percent >= 90) {
              return <div>
                  <Progress successPercent={percent}  percent={percent}   size="small"  style={{width:'90%'}}
                    format={percent => <span style={{ color: 'black' }}>{percent}%</span>}  />
                </div>
            }else{
            return  <div>
                <Progress  successPercent={0}   percent={percent}  status="exception"   size="small"
                  style={{width:'90%'}}  format={percent => <span style={{ color: 'black' }}>{percent==0?'0.00':percent}%</span>} />
              </div>
            }
  
           }else{

            return  <div>
            <Progress successPercent={0}   percent={percent}  status="exception"   size="small"
              style={{width:'90%'}}  format={percent => <span style={{ color: 'black' }}>{percent}%</span>} />
          </div>
           }
         },
      }
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    let { dispatch, location,queryPar,entQuery,regionCode} = this.props;
    

    //  dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

 
    //  dispatch({ type: 'failureRate/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
    //  this.updateQueryState({
    //   BeginTime: moment().subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
    //   EndTime: moment().format('YYYY-MM-DD HH:59:59'),
    //   EntCode: "",
    //   RegionCode: "",
    //   PollutantTypeCode: [],
    //   ModelType: "All"
    // });
    entQuery = {...queryPar,ModelType:'Region',RegionCode:regionCode}


    setTimeout(() => {
      this.getTableData(entQuery);
    });
  

  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;


    dispatch({
      type: pageUrl.updateState,
      payload: { entQuery: { ...entQuery, ...payload } },
    });
  };

  getTableData = (entQuery) => { 
    const { dispatch,isWorkRate,isFaultRate,isOverRate } = this.props;

    dispatch({
      type: isWorkRate? pageUrl.getDeviceDataRate : isOverRate ? pageUrl.getOverDataRate : pageUrl.getExceptionDataRate,
      payload: { ...entQuery },
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

  // typeChange = value => {
  //   this.updateQueryState({
  //     PollutantType: value,
  //   });
  // };

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
  

  nextPage=(row)=>{
    const { dispatch } = this.props;
    dispatch({
      type: pageUrl.updateState,
      payload: { ModelType: 'EntName',entName:row.EntName,entCode:row.EntCode },
   });
   setTimeout(()=>{
    this.setState({pointVisible:true}) 
   })
  }

  
  pointCancel=()=>{
    this.setState({pointVisible:false})
  }
  render() {
    const {
      exloading,
      loading,
      queryPar: {BeginTime, EndTime, EntCode, RegionCode,  PollutantTypeCode,  ModelType },
      Atmosphere,
      entVisible,
      isWorkRate,
      entCancel,
      regionName
    } = this.props;

    const { pointVisible }  = this.state;
    return (
      <div>
      {/* <Modal
        title={regionName}
        footer={null}
        width='95%'
        visible={entVisible}  
        onCancel={entCancel}
      > */}
         <Row type='flex' align='middle'>
         {isWorkRate?
         <div style={{ paddingBottom: 10 }}>
              <div style={{ width: 20, height: 9, backgroundColor: '#52c41a', display: 'inline-block', borderRadius: '20%',cursor: 'pointer', marginRight: 3,  }}/>
              <span style={{ cursor: 'pointer', fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}>
                ≥90%达标
              </span>
              <div  style={{ width: 20, height: 9, backgroundColor: '#f5222d', display: 'inline-block', borderRadius: '20%', cursor: 'pointer',  marginLeft: 10, marginRight: 3, }} />
              <span style={{ cursor: 'pointer', fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}>
              {`<90%未达标`}
              </span>
            </div>
            :
            null
         }
           <Button
                style={{ marginBottom: 10,marginLeft:isWorkRate?10 : 0 }}
                  onClick={() => {
                    this.props.onBack()
                   } }
                >
                  <RollbackOutlined />
                  返回
                </Button>
                </Row>
        <div id=''>

           <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={loading}
            columns={this.columns}
            // bordered={false}
            dataSource={this.props.entTableDatas}
            // style ={{height:"calc(100vh - 300px)"}} 
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              // sorter: true,
              // total: this.props.total,
              defaultPageSize:20
              // pageSize: PageSize,
              // current: PageIndex,
              // pageSizeOptions: ['10', '20', '30', '40', '50'],
            }}
          />
        </div>
        {/* </Modal> */}
     {pointVisible ?  <MonPoint pointVisible={pointVisible} pointCancel={this.pointCancel}/> : null}
     </div>
    );
  }
}
