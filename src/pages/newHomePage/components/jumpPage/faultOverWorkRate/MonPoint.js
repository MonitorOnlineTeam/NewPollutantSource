
/**
 * 功  能：首页弹框
 * 创建人：贾安波
 * 创建时间：2020.10
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



const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'home/updateState',
  getOverDataRate: 'home/getOverDataRate',
  getDeviceDataRate: 'home/getDeviceDataRate',
  getExceptionDataRate: 'home/getExceptionDataRate',
};
@connect(({ loading, home,autoForm }) => ({
  priseList: home.priseList,
  exloading:home.exloading,
  loading: home.pointLoading,
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
  isFaultRate:home.isFaultRate,
  isOverRate:home.isOverRate,
  Atmosphere:home.Atmosphere,
  entQuery:home.entQuery,
  pointQuery:home.pointQuery,
  pointTableDatas:home.pointTableDatas,
  entCode:home.entCode
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {


    };
    
    this.columns = [
      {
        title: <span>监测点类型</span>,
        dataIndex: 'PointType',
        key: 'PointType',
        align: 'center',
      },
      {
        title: <span>监测点名称</span>,
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        render:(text,row)=>{
              return <div style={{textAlign:'left'}}>{text}</div>
        }
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
            return <div>
            <Progress  successPercent={0}   percent={percent}  status="exception"   size="small"
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
    let { dispatch, location,queryPar,pointQuery,entCode } = this.props;
    

    pointQuery = {...queryPar,ModelType:'EntName',EntCode:entCode}

    dispatch({
      type: pageUrl.updateState,
      payload: { pointQuery: { ...pointQuery} },
    });
    setTimeout(() => {
      this.getTableData(pointQuery);
    });
  

  };
  updateQueryState = payload => {
    const { pointQuery, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { pointQuery: { ...pointQuery, ...payload } },
    });
  };

  getTableData = (pointQuery) => { 
    const { dispatch,isWorkRate,isFaultRate,isOverRate } = this.props;

    dispatch({
      type: isWorkRate? pageUrl.getDeviceDataRate : isOverRate ? pageUrl.getOverDataRate : pageUrl.getExceptionDataRate,
      payload: { ...pointQuery },
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
  


  render() {
    const {
      exloading,
      loading,
      queryPar: {  BeginTime, EndTime, EntCode, RegionCode,  PollutantTypeCode,  ModelType },
      Atmosphere,
      pointVisible,
      isWorkRate,
      pointCancel,
      entName
    } = this.props;
    const { TabPane } = Tabs;

    return (
        <Modal
          title={
            <Row type="flex" justify="space-between">
         <div>{entName}</div>  
         {isWorkRate?
         <div style={{paddingRight:30}}>
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
            </Row>
          }
          width='95%'
          footer={null}
          visible={pointVisible}  
          onCancel={pointCancel}
        >

          <div id=''>

             <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={loading}
              columns={this.columns}
              // bordered={false}
              dataSource={this.props.pointTableDatas}
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
          </Modal>
    );
  }
}
