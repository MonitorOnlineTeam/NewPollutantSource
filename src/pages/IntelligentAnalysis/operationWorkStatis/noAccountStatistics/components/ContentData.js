/**
 * 功  能：无台账工单统计
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

import Region from './Region'
import EntNum from './EntNum'
import WorkNum from './WorkNum'



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
  pollutantList:noAccountStatistics.pollutantList,
  RegionName:noAccountStatistics.RegionName
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regionVisible:false,
      entNumVisible:false,
      workNumVisible:false
    };
    
    this.columns = [
      {
        title: '行政区',
        dataIndex: 'Region',
        key: 'Region',
        align: 'center',
        render: (text, record) => {
          return <a onClick={()=>{this.regionDetail(record)}}>{text}</a>;
        },
      },
      {
        title: '运维企业',
        width:250,
        children: [
          {
            title:'企业数',
            dataIndex: 'EntNum',
            key: 'EntNum',
            align: 'center',
            width:100,

            
          },
          {
            title:'缺失台账企业数',
            dataIndex: 'EntNotNum',
            key: 'EntNotNum',
            align: 'center',
            width:150,
            render: (text, record) => {
              return <a onClick={()=>{this.entNumDetail(record)}}>{text}</a>;
            },
          },        
      ]
      },
      {
        title: '运维监测点',
        width:250,
        children: [
          {
            title:'监测点数',
            dataIndex: 'PointNum',
            key: 'PointNum',
            align: 'center',
            width:100,
          },
          {
            title:'缺失台账监测点数',
            dataIndex: 'PointNotNum',
            key: 'PointNotNum',
            align: 'center',
            width:150
          },        
      ]
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
            render: (text, record) => {
              return <a onClick={()=>{this.workNumDetail(record,"0")}}>{text}</a>;
            },
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
            render: (text, record) => {
              return <a onClick={()=>{this.workNumDetail(record,"1")}}>{text}</a>;
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


    //  dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

 
     dispatch({ type: 'noAccountStatistics/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
    //  this.updateQueryState({
    //   beginTime: moment().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'),
    //   endTime: moment().format('YYYY-MM-DD 23:59:59'),
    //   AttentionCode: '',
    //   EntCode: '',
    //   RegionCode: '',
    //   PollutantTypeCode:"1",
    //   ModelType: "All"
    // });
    setTimeout(() => {
      this.getTableData();
    });
    // this.child.onDataValueChange([moment().subtract(1, 'month').startOf('day'),moment()])

  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = () => { 

    const { dispatch, queryPar,level } = this.props;

    dispatch({
      type: pageUrl.getData,
      payload: { ...queryPar,...{regionLevel:level} },
      callback:res=>{

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
      PollutantTypeCode: value,
    });
  };

  changeRegion = (value) => { //行政区事件
    
    this.updateQueryState({
      RegionCode: value? value : '',
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
      type: 'noAccountStatistics/exportTaskFormBookSta',
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
  

  dateChange=(date)=>{
      this.updateQueryState({
        beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    dateOk=()=>{ 

   }


  onChange3=(e)=>{
   console.log(e)
  }
  regionDetail=(row)=>{
    const { dispatch,queryPar } = this.props;

     router.push({pathname:'/Intelligentanalysis/operationWorkStatis/noAccountStatistics/ent/cityLevel',query:{RegionCode:row.RegionCode}})

  }

  entNumDetail=(row)=>{
    const { dispatch,queryPar} = this.props;
    dispatch({
      type: pageUrl.updateState,
      payload: { entNumQueryPar: { ...queryPar,ModelType:"EntNum", RegionCode:row.RegionCode },
      RegionName:row.Region,
     },
    });
    setTimeout(()=>{
      this.setState({entNumVisible:true})
    })
  }

  workNumDetail=(row,type)=>{
    const { dispatch,queryPar } = this.props;
    dispatch({
      type: pageUrl.updateState,
      payload: { workNumQueryPar: { ...queryPar,ModelType:"TaskNums", RegionCode:row.RegionCode,TaskType: type },
      RegionName:row.Region,
    },
    });
    setTimeout(()=>{
      this.setState({workNumVisible:true})
    })
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
            {regionVisible?  <Region   regionVisible={regionVisible}  regionCancel={()=>{this.setState({regionVisible:false})}}/> : null}
            {entNumVisible?  <EntNum   entNumVisible={entNumVisible}   entNumCancel={()=>{this.setState({entNumVisible:false})}}/> : null}         
            {workNumVisible? <WorkNum   workNumVisible={workNumVisible}  workNumCancel={()=>{this.setState({workNumVisible:false})}}/> : null}

            <Form.Item label=''>
             <RangePicker_ allowClear={false}   style={{minWidth: '200px'}} dateValue={[moment(beginTime),moment(endTime)]} 
            callback={(dates, dataType)=>this.dateChange(dates, dataType)}
            onRef={(ref) => {
              this.child = ref;
            }} 
            />
              </Form.Item>
            <Form.Item label=''>
             <RegionList changeRegion={this.changeRegion} RegionCode={RegionCode}/>
            </Form.Item>
            
            <Form.Item label=''>
             <AttentList changeAttent={this.changeAttent}  AttentionCode={AttentionCode} />
            </Form.Item>
            <Form.Item label=''>
             <EntType allowClear={false} typeChange={this.typeChange}  PollutantType={PollutantTypeCode} />
            </Form.Item>

              {/* <Form.Item label='企业列表'>
               <EntAtmoList changeEnt={this.changeEnt} EntCode={EntCode}/>
              </Form.Item> */}

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
        <div id='noAccountStatistics'>
           <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={loading}
            columns={this.columns}
            // bordered={false}
            dataSource={this.props.tableDatas}
            // style ={{height:"calc(100vh - 300px)"}} 
            // pagination={{
              // showSizeChanger: true,
              // showQuickJumper: true,
              // sorter: true,
              // total: this.props.total,
              //defaultPageSize:20
              // pageSize: PageSize,
              // current: PageIndex,
              // pageSizeOptions: ['10', '20', '30', '40', '50'],
            // }}
          />
        </div>
       
      </Card>
    );
  }
}
