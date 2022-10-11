/**
 * 功  能：企业异常记录
 * 创建人：贾安波
 * 创建时间：2019.10.26
 */
import React, { Component } from 'react';
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
import AttachmentView from '../AttachmentView';

import { getAttachmentDataSource } from '../../../AutoFormManager/utils'

import Ent from './Ent'


const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'entAbnormalRecord/updateState',
  getData: 'entAbnormalRecord/getExceptionReportedList',
};
@connect(({ loading,common, entAbnormalRecord,autoForm }) => ({
  priseList: entAbnormalRecord.priseList,
  exloading:entAbnormalRecord.exloading,
  loading: entAbnormalRecord.loading,
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
  EntList: entAbnormalRecord.EntList,
  pointList:common.pointListByEntCode,
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entVisible:false,
      entName:''
    };
    
    this.columns = [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
      },
      {
        title: '企业名称',
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'center',
        render: (text, record) => {
          return <div  style={{textAlign:'left',width:'100%'}}>{text}</div>;
        },
      },  
      {
        title: '监测点名称',
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        render: (text, record) => {
          return <div  style={{textAlign:'left',width:'100%'}}>{text}</div>;
        },
      },  
      {
        title: '排口类型',
        dataIndex: 'PollutantType',
        key: 'PollutantType',
        align: 'center',
      },  
      {
        title: '异常开始时间',
        dataIndex: 'BeginTime',
        key: 'BeginTime',
        align: 'center',
      },  
      {
        title: '异常截止时间',
        dataIndex: 'EndTime',
        key: 'EndTime',
        align: 'center',
      }, 
      {
        title: '异常数据类型',
        dataIndex: 'DataType',
        key: 'DataType',
        align: 'center',
        width:95,
        render: (text, record) => {
          return <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{text}</div>;
        },
      },  
      {
        title: '异常监测因子',
        dataIndex: 'PollutantNames',
        key: 'PollutantNames',
        align: 'center',
      },    
      {
        title: '异常描述',
        dataIndex: 'Msg',
        key: 'Msg',
        align: 'center',
        render: (text, record) => {
          return <div  style={{textAlign:'left',width:'100%'}}>{text}</div>;
        },
      },  
      {
        title: '凭证',
        dataIndex: 'Attachments',
        key: 'Attachments',
        align: 'center',
        render: (text, record) => {
          const attachmentDataSource = this.getAttachmentDataSource(text);
          return  <AttachmentView dataSource={attachmentDataSource} />;
        },
      },  
      {
        title: '上报人',
        dataIndex: 'ReportName',
        key: 'ReportName',
        align: 'center',
      },  
      {
        title: '上报时间',
        dataIndex: 'ReportTime',
        key: 'ReportTime',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'Region',
        key: 'Region',
        align: 'center',
        render: (text, record) => {
          return <a onClick={()=>{this.entDetail(record)}}>查看</a>;
        },
      },
    ]
  }

  componentDidMount() {
    this.initData();
  }
  getAttachmentDataSource(value) {
    const fileInfo = value ? value.split(',') : [];
    let fileList =  fileInfo.map(item => {
      return {
        name: item,
        attach: item
      }
    })
   return fileList;
  }
  initData = () => {
    const { dispatch, location } = this.props;


    //  dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

 
     dispatch({ type: 'entAbnormalRecord/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表

     

     this.updateQueryState({
      ExceptionBBtime: moment().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'),
      ExceptionBEtime: moment().format('YYYY-MM-DD 23:59:59'),
      ExceptionEBtime: '',
      ExceptionEEtime: '',
      DGIMN: "",
      RegionCode: "",
      EntCode: "",
      Status: ""
    });
    this.child.onDataValueChange([moment().subtract(1, 'month').startOf('day'),moment().endOf('day')])

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
      callback:res=>{

      }
    });
  };




  pointChildren=()=>{ //监测点列表
    const { pointList } = this.props;

    const selectList = [];
    if (pointList.length > 0) {
      pointList.map(item => {
        selectList.push(
          <Option key={item.DGIMN} value={item.DGIMN}  title={item.PointName}>
            {item.PointName}
          </Option>,
        );
      });
      return selectList;
    }
  }

  typeChange = value => {
    this.updateQueryState({
      PollutantTypeCode: value,
    });
  };

  changeRegion = (value) => { //行政区事件
      
    const {dispatch } = this.props;
    this.updateQueryState({
      RegionCode: value? value:'',
     
    });
  };

  changeEnt=(value,data)=>{ //企业事件
    const {dispatch } = this.props;
    
    this.updateQueryState({
      EntCode: value? value:'',
      DGIMN:''
    });

    dispatch({  type: 'common/getPointByEntCode',  payload: {  EntCode: value? value:''} });  //获取排口
  }


  changePoint=(value)=>{ //监测点名称
    const {dispatch } = this.props;

    this.updateQueryState({
      DGIMN: value? value:'',
    });

  }

  changePoll=(value)=>{ //污染物改变事件
    this.updateQueryState({
      PollutantCode: value? value:'',
    });

  } 
  statusChange=(value)=>{  //凭证改变事件
    this.updateQueryState({
      Status: value? value:'',
    });
  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'entAbnormalRecord/exportExceptionReported',
      payload: { ...queryPar },
      callback: data => {
          downloadFile(`${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {
  

      const { pointName, dispatch,queryPar:{DGIMN} } = this.props;
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
        ExceptionBBtime: date[0]? date[0].format('YYYY-MM-DD HH:mm:ss') : '',
        ExceptionBEtime: date[1]? date[1].format('YYYY-MM-DD HH:mm:ss') : '',
      });
    }
    dateChange2=(date)=>{
      this.updateQueryState({
        ExceptionEBtime: date[0]? date[0].format('YYYY-MM-DD HH:mm:ss') : '',
        ExceptionEEtime: date[1]? date[1].format('YYYY-MM-DD HH:mm:ss') : '',
      });
    }


  entDetail=(row)=>{
    const { dispatch,queryPar } = this.props;

    
    dispatch({
      type: pageUrl.updateState,
      payload: {entName:row.EntName, entQueryPar: {ID:row.ID},nextData:{startTime:row.BeginTime,endTimes:row.EndTime,msg:row.Msg} },
    });
    setTimeout(()=>{
      this.setState({entVisible:true})
    })
  }

  render() {
    const {
      exloading,
      loading,
      queryPar: {ExceptionBBtime,ExceptionBEtime, ExceptionEBtime, ExceptionEEtime, DGIMN,RegionCode, EntCode,Status},
    } = this.props;

    const { entVisible } = this.state
    const { TabPane } = Tabs;
   
    const {  regionVisible, entNumVisible, workNumVisible} = this.state;



    return (
      <Card
        bordered={false}
        title={
          <>
            <Form layout="inline">
            { entVisible ?  <Ent  entVisible={entVisible}  entCancel={()=>{this.setState({entVisible:false})}} /> :  null}
            <Row style={{paddingBottom:5}}>
            <Form.Item label='异常开始时间'>
             <RangePicker_   style={{width: '368px', marginRight: '10px'}} dateValue={[moment(ExceptionBBtime),moment(ExceptionBEtime)]} 
            callback={(dates, dataType)=>this.dateChange(dates, dataType)}
            onRef={(ref) => {
              this.child = ref;
            }} 
            />
              </Form.Item>
              <Form.Item label='异常截止时间'>
             <RangePicker_    style={{width: '368px', marginRight: '10px'}} dateValue={['','']} 
            callback={(dates, dataType)=>this.dateChange2(dates, dataType)}
            onRef={(ref) => {
              this.child2 = ref;
            }} 
            />
              </Form.Item>
              </Row>
          <Form.Item label='行政区'>
             <RegionList  style={{ width: 165  }} changeRegion={this.changeRegion} RegionCode={RegionCode}/>
            </Form.Item>
              <Form.Item label='企业列表'>
               <EntAtmoList changeEnt={this.changeEnt} EntCode={EntCode} style={{width:185}}/>
              </Form.Item>  
              <Form.Item label='监测点' style={{paddingLeft:10}}>
               <Select
                  placeholder="监测点名称"
                  onChange={this.changePoint}
                  value={DGIMN? DGIMN :undefined }
                  style={{ width: 150  }}
                >
                {this.pointChildren()}
                </Select> 
              </Form.Item>
            <Form.Item label='凭证状态'>
            <Select
               allowClear
               placeholder="凭证状态"
               onChange={this.statusChange}
               value={Status?Status:undefined}
              style={{ width: 150 }}
               >
               <Option value="1">有凭证</Option>
                <Option value="0">缺失凭证</Option>
               </Select>
            </Form.Item>


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
            </Form>
          </>
        }
      >
        <div id='entAbnormalRecord'>
            <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={loading}
            columns={this.columns}
            dataSource={this.props.tableDatas}
            // style ={{height:"calc(100vh - 300px)"}} 
            scroll={{ x: '115%' }} 
            // pagination={{
            //   showSizeChanger: true,
            //   showQuickJumper: true,
            //   total: this.props.total,
              //defaultPageSize:20
            // }}
          /> 
        </div>
       
      </Card>
    );
  }
}
