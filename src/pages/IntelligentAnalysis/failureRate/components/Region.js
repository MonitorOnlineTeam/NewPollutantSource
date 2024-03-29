
/**
 * 功  能：首页弹框
 * 创建人：贾安波
 * 创建时间：2020.10
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { ExportOutlined } from '@ant-design/icons';
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

import EntData from './Ent'
import { getAllEnterprise } from '@/pages/Test/service';

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
  loading: loading.effects['failureRate/getExceptionDataRate'],
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
  pollutantList:failureRate.pollutantList,
  isWorkRate:failureRate.isWorkRate,
  isFaultRate:failureRate.isFaultRate,
  isOverRate:failureRate.isOverRate,
  Atmosphere:failureRate.Atmosphere,
  regionCodeName:failureRate.regionCodeName
  
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      GZRateTime: [moment().subtract(7, "days"), moment().subtract(1, "days")],
      entVisible:false

    };
    
    this.columns = [
      {
        title: <span>行政区</span>,
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
        render:(text,row)=>{
        return <a href='#' onClick={()=>{this.nextPage(row)}}>{text}</a>
        }
      },
      {
        title: <span>企业数</span>,
        dataIndex: 'EntNum',
        key: 'EntNum',
        align: 'center',
      },
      {
        title: <span>{this.props.types=='ent'? '监测点数': '空气监测点数'}</span>,
        dataIndex: 'PointNum',
        key: 'PointNum',
        align: 'center',
        render: (text, record) => {
           return text? text : ''
        }
      },
      {
        title: <span>{'故障率'}</span>,
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


        }
      },
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location,isWorkRate,Atmosphere,types } = this.props;

    types==='ent'? null: this.columns.splice(1,1);

    const { GZRateTime } = this.state;
    this.updateQueryState({
      BeginTime: moment(GZRateTime[0]).format('YYYY-MM-DD 00:00:00'),
      EndTime: moment(GZRateTime[1]).format('YYYY-MM-DD 23:59:59'),
      EntCode: "",
      RegionCode: "",
      PollutantTypeCode: [1],
      ModelType: "All",
      Atmosphere:types==='ent'? false:true
    });
    // this.columns
     dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

 
     dispatch({ type: 'failureRate/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
    //  this.updateQueryState({
    //   BeginTime: moment().subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
    //   EndTime: moment().format('YYYY-MM-DD HH:59:59'),
    //   EntCode: "",
    //   RegionCode: "",
    //   PollutantTypeCode: [],
    //   ModelType: "All"
    // });
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
    const { dispatch, queryPar,isWorkRate,isFaultRate,isOverRate } = this.props;
    console.log(isWorkRate,isOverRate)
    dispatch({
      type: isWorkRate? pageUrl.getDeviceDataRate : isOverRate ? pageUrl.getOverDataRate : pageUrl.getExceptionDataRate,
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
      PollutantTypeCode: [value],
    });
  };

  changeRegion = (value) => { //行政区事件
    
    this.updateQueryState({
      RegionCode: value? value:'',
    });
  };
  changeAttent=(value)=>{
    this.updateQueryState({
      AttentionCode: value? value:'',
    });
  }
  changeEnt=(value,data)=>{ //企业事件
    this.updateQueryState({
      EntCode: value? value:'',
    });

  }
  //查询事件
  queryClick = () => {
  

    const { pointName, dispatch} = this.props;
    dispatch({
      type: pageUrl.updateState,
      payload: { ModelType:'All'},
    });
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
  dateChange=(date)=>{
    this.updateQueryState({
      BeginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      EndTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  nextPage=(row)=>{
    const { isWorkRate,dispatch } = this.props;
    const { queryPar: { RegionCode} } = this.props;
   
     dispatch({
       type: pageUrl.updateState,
       payload: { ModelType: 'Region', regionName:row.RegionName,regionCode:row.RegionCode },
    });
    
    setTimeout(()=>{
      this.setState({entVisible:true})
    })
  }

  entCancel=()=>{
    this.setState({entVisible:false})
  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar,isWorkRate,isOverRate } = this.props;
    dispatch({
      type:  isWorkRate? 'failureRate/exportDeviceDataRate':isOverRate?'failureRate/exportOverDataRate'
                       :'failureRate/exportExceptionDataRate',
      payload: { ...queryPar },
      callback: data => {
          downloadFile(`/upload${data}`);
        },
    });
  };

  render() {
    const {
      exloading,
      loading,
      types,
      queryPar: { BeginTime, EndTime, EntCode, RegionCode,  PollutantTypeCode,  ModelType},
      Atmosphere, regionVisible,regionCancel, isWorkRate,isOverRate
    } = this.props;
    const { TabPane } = Tabs;
   
    const { entVisible } = this.state;
    return (
      // <BreadcrumbWrapper title={`故障率${types==='ent'?'(企业)':'(空气站)'}`}>
      <BreadcrumbWrapper>
    <Card
          bordered={false}
          title={
          <div>
         { entVisible?
          <EntData entVisible={entVisible} onBack={this.entCancel}/>
           : 
            <>
              <Form layout="inline">
              <Row>
              <Form.Item label='查询日期'>
              <RangePicker_  format = 'YYYY-MM-DD' allowClear={false} onRef={this.onRef1}  style={{minWidth: '200px', marginRight: '10px'}} dateValue={[moment(BeginTime),moment(EndTime)]} 
                  callback={(dates, dataType)=>this.dateChange(dates, dataType)}/>
                   </Form.Item>     
              <Form.Item label='行政区'>
               <RegionList changeRegion={this.changeRegion} RegionCode={RegionCode}/>
              </Form.Item>
              {types==='ent'?
                <Form.Item label={'企业类型'}>
                 <EntType allowClear={false} typeChange={this.typeChange}  PollutantType={PollutantTypeCode.join()} />
                </Form.Item>
                :
                null
              }
                <Form.Item>
                  <Button type="primary" onClick={this.queryClick}>
                    查询
                  </Button>
                    <Button
                    style={{ margin: '0 5px' }}
                    icon={<ExportOutlined />}
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
            </div>
         }>
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
                // total: this.props.total,
                defaultPageSize:20
                // pageSize: PageSize,
                // current: PageIndex,
                // pageSizeOptions: ['10', '20', '30', '40', '50'],
              }}
            />

       </Card>
     </BreadcrumbWrapper>
    );
  }
}
