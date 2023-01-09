/**
 * 功  能：缺失数据报警响应率
 * 创建人：贾安波
 * 创建时间：2020.11
 */
import React, { Component,PureComponent } from 'react';
import { ExportOutlined,RollbackOutlined  } from '@ant-design/icons';
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
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile,interceptTwo } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import MissingDataRateModelDetail from './MissingDataRateModelDetail'
import EntType from '@/components/EntType'
import RegionList from '@/components/RegionList'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'MissingRateDataModal/updateState',
  getData: 'MissingRateDataModal/getDefectModel',
};
@connect(({ loading, MissingRateDataModal,autoForm,common}) => ({
  priseList: MissingRateDataModal.priseList,
  exloading:MissingRateDataModal.exloading,
  loading: loading.effects[pageUrl.getData],
  total: MissingRateDataModal.total,
  tableDatas: MissingRateDataModal.tableDatas,
  queryPar: MissingRateDataModal.queryPar,
  regionList: autoForm.regionList,
  attentionList:MissingRateDataModal.attentionList,
  atmoStationList:common.atmoStationList,
  type:MissingRateDataModal.type
}))
@Form.create()
export default class Index extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      entVisible:false,
      location:{
        query:{}
      },
      level:'',
      goback:false
     
    };
    
    this.columns = [
      {
        title: <span>行政区</span>,
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
        render:(text, record) => { 
            return <a href='javascript:;' onClick={()=>{this.detail(text,record)}} >{text} </a>
          }
      },
      {
        title: <span>{this.props.types==='ent'? '缺失数据报警检测点数': '缺失数据报警空气检测点数'}</span>,
        dataIndex: 'pointCount',
        key: 'pointCount',
        align: 'center'
      },
      {
        title: <span>缺失数据报警次数</span>,
        dataIndex: 'exceptionCount',
        key: 'exceptionCount',
        // width: '10%',
        align: 'center',
      
      },
      {
        title: <span>已响应报警次数</span>,
        dataIndex: 'xiangyingCount',
        key: 'xiangyingCount',
        align: 'center',
      },
      {
        title: <span>待响应报警次数</span>,
        dataIndex: 'weixiangyingCount',
        key: 'weixiangyingCount',
        align: 'center'
      },
      {
        title: <span>响应率</span>,
        dataIndex: 'responseRate',
        key: 'responseRate',
        align: 'center',
        render:(text,row)=>{
          return <span>{`${interceptTwo(Number(text))}%`}</span>
        }
      
      },
    ];
  }

  componentDidMount() {
    this.initData();
  }
  detail=(text,record)=>{

     if(this.state.level){
      this.setState({
        location:{ query: {regionCode :record.regionCode,queryPar:JSON.stringify(this.props.queryPar)}}
       },()=>{
        this.setState({entVisible:true})
       })
      }else{

        const { dispatch,types,time } = this.props;
        this.setState({level:2},()=>{

          this.setState({regionCode:record.regionCode,level:2},()=>{ 
            setTimeout(() => {
              this.getTableData(record.regionCode);
            });   
          })

        })

      }
  }
  initData = () => {
    const { dispatch, location,Atmosphere,types,time,defaultPollutantType, } = this.props;
    this.updateQueryState({
      RegionCode: '',
      EntType: types==='ent'? "1":"2",
      beginTime: time[0].format('YYYY-MM-DD 00:00:00'),
      endTime: time[1].format('YYYY-MM-DD 23:59:59'),
      PollutantType:defaultPollutantType
      // OperationPersonnel:'',
    });
    console.log('首次加载')
    let  entObj =  {title: <span>缺失数据报警企业数</span>,dataIndex: 'entCount', key: 'entCount',align: 'center', }

    types ==='ent'? this.columns.splice(1,0,entObj) : null;

    //  dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

     dispatch({ type: 'MissingRateDataModal/getEntByRegion', payload: { RegionCode: '' },  });//获取企业列表
 
     dispatch({ type: 'MissingRateDataModal/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
  

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
      payload: this.state.level? { ...queryPar,RegionCode:this.state.regionCode,regionLevel:this.state.level } :{ ...queryPar },
    });
  };


  children = () => { //企业列表 or 大气站列表
    const { priseList,atmoStationList,type } = this.props;

    const selectList = [];
    if(type==='ent'){
     if (priseList.length > 0) {
      priseList.map(item => {
        selectList.push(
          <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
            {item.EntName}
          </Option>,
        );
      });
     }else{
       if(atmoStationList.length > 0){
        atmoStationList.map(item => {
          selectList.push(
            <Option key={item.StationCode} value={item.StationCode} title={item.StationName}>
              {item.StationName}
            </Option>,
          );
        }); 
       }
     }
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
  changePperation=(value)=>{
    this.updateQueryState({
      OperationPersonnel: value?value:'',
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
      type: 'MissingRateDataModal/exportDefectDataSummary',
      payload: this.state.level? { ...queryPar,RegionCode:this.state.regionCode,regionLevel:this.state.level,Rate:1, } :{ ...queryPar,Rate:1, },
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
  
      onRef1 = (ref) => {
        this.child = ref;
      }
          /** 数据类型切换 */
     _handleDateTypeChange = value => {
       this.child.onDataTypeChange(value)
        }
      dateChange=(date,dataType)=>{
          this.updateQueryState({
            // dataType:dataType,
            beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
          });
        }

  render() {
    const {
      exloading,
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantType,OperationPersonnel },
       time,
      types
    } = this.props;
    const { entVisible,location,level } = this.state;
    return <>
    {entVisible? 
      <MissingDataRateModelDetail location={location} detailBack={()=>{this.setState({
        entVisible:false
      })}}/>
      :
    <div>
            <Form layout="inline"> 
            <Row style={{paddingBottom:15}}>
              {!level&&<><Form.Item>
                日期查询：
                <RangePicker_ allowClear={false}  onRef={this.onRef1} dataType={''}  style={{minWidth: '200px', marginRight: '10px'}} dateValue={[moment(time[0]),moment(time[1])]} 
                callback={(dates, dataType)=>this.dateChange(dates, dataType)}/>
              </Form.Item>
              <Form.Item label='关注程度'>
                <Select
                  allowClear
                  placeholder="关注程度"
                  onChange={this.changeAttent}
                  value={AttentionCode?AttentionCode:undefined} 
                  style={{ width: 110 }}
                >
                  {this.attentchildren()}
                </Select>
              </Form.Item>
              
              {/* <Form.Item label='运维状态'>
              <Select
                allowClear
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="运维状态"
                maxTagCount={2}
                value={OperationPersonnel?OperationPersonnel:undefined}
                onChange={this.changePperation}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
                >
                <Option value="1">已设置运维人员</Option>
                <Option value="2">未设置运维人员</Option>
              </Select>
              </Form.Item>  */}
              <Form.Item label='行政区'>
                {/* <Select
                  allowClear
                  placeholder="行政区"
                  onChange={this.changeRegion}
                  value={RegionCode ? RegionCode : undefined}
                  style={{ width: 100 }}
                >
                  {this.regchildren()}
                </Select> */}
              <RegionList   style={{ width: 165 }} changeRegion={this.changeRegion} RegionCode={RegionCode}/>

              </Form.Item>
             {types==='ent'? <Form.Item label='企业类型'>
                <Select
                  allowClear
                  placeholder="企业类型"
                  onChange={this.typeChange}
                  value={PollutantType?PollutantType:undefined}
                  style={{ width: 100 }}
                >
                  <Option value="2">废气</Option>
                  <Option value="1">废水</Option>
                </Select>
              </Form.Item> : null }
              </>}
              <Form.Item>
              {!level&& <Button type="primary" onClick={this.queryClick}>
                  查询
                </Button>}
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  onClick={this.template}
                  loading={exloading}
                >
                  导出
                </Button>
                {level&& <Button onClick={() => {
                  this.setState({level:'',regionCode:'',goback:true},()=>{
                    this.getTableData();
                  })
             }} ><RollbackOutlined />返回</Button>}
              </Form.Item>
              </Row>
            </Form>
          <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={this.props.loading}
            columns={this.columns}
            bordered={false}
            dataSource={this.props.tableDatas}
            pagination={false}
          />
      </div>
    }
    </>;
  }
}
