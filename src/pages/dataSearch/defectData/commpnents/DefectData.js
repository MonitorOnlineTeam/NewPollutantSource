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
import styles from '../style.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'defectData/updateState',
  getData: 'defectData/getDefectModel',
};
const content = <div>当有效传输率未到达90%时判定为未达标</div>;
@connect(({ loading, defectData,autoForm,common}) => ({
  priseList: defectData.priseList,
  exloading:defectData.exloading,
  loading: loading.effects[pageUrl.getData],
  total: defectData.total,
  tableDatas: defectData.tableDatas,
  queryPar: defectData.queryPar,
  regionList: autoForm.regionList,
  attentionList:defectData.attentionList,
  atmoStationList:common.atmoStationList
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
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>{this.props.Atmosphere? '大气站名称': '企业名称'}</span>,
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
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
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
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      Atmosphere:Atmosphere
    });
     dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

      //获取企业列表 or  大气站列表

      Atmosphere? dispatch({ type: 'common/getStationByRegion', payload: { RegionCode: '' },  }) : dispatch({ type: 'defectData/getEntByRegion', payload: { RegionCode: '' },  });  
 
     dispatch({ type: 'defectData/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
  

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



  children = () => { //企业列表 or 大气站列表
    const { priseList,atmoStationList,Atmosphere } = this.props;

    const selectList = [];
    if(!Atmosphere){
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
  changeEnt=(value,data)=>{ //企业事件
    this.updateQueryState({
      EntCode: value,
    });
  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'defectData/exportGetAlarmDataList',
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
  onRef1 = (ref) => {
    this.child = ref;
  }
      /** 数据类型切换 */
 _handleDateTypeChange = value => {
   this.child.onDataTypeChange(value)
    // if( value === 'HourData'){
    //   this.updateQueryState({
    //     dataType: value,
    //     beginTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    //     endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
       
    //     });
    //   }else{
    //     this.updateQueryState({
    //       dataType: value,
    //       beginTime: moment().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
    //       endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          
    //       });
    //   }
    }
  dateChange=(date,dataType)=>{
    
      this.updateQueryState({
        dataType:dataType,
        beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
      });
    }
   btnComponents=()=>{
    const { exloading } = this.props
     return <Form.Item>
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
   }
  render() {
    const {
      Atmosphere,
      exloading,
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantType },
    } = this.props;
    const BtnComponents = this.btnComponents;
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
                    style={{ width: Atmosphere? 100 : 200}}
                  >  
                 <Option key='0' value='HourData'>小时数据</Option>
                 <Option key='1' value='DayData'> 日数据</Option>

                  </Select>
              </Form.Item>
                <Form.Item>
                  日期查询：
                      {/* <RangePicker
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={['开始时间', '结束时间']}
                        value={[moment(beginTime),moment(endTime)]}
                        onChange={this.dateChange}
                        onOk={this.dateOk}
                        allowClear={false}
                   /> */}
                <RangePicker_  onRef={this.onRef1} dataType={dataType}  style={{minWidth: '200px', marginRight: '10px'}} dateValue={[moment(beginTime),moment(endTime)]} 
                  callback={(dates, dataType)=>this.dateChange(dates, dataType)}/>
                </Form.Item>
                <Form.Item label='行政区'>
                  <Select
                    allowClear
                    placeholder="行政区"
                    onChange={this.changeRegion}
                    value={RegionCode ? RegionCode : undefined}
                    style={{ width:  Atmosphere? 100 : 150}}
                  >
                    {this.regchildren()}
                  </Select>
                </Form.Item>
                {Atmosphere?
                  <Form.Item label='大气站列表'>
              <Select
              showSearch
              optionFilterProp="children"
              allowClear
              placeholder="大气站列表"
              onChange={this.changeEnt}
              value={EntCode ? EntCode : undefined}
              style={{ width: 200  }}
            >
              {this.children()}
            </Select>
            </Form.Item>
                 :
                <Form.Item label='关注程度'>
                  <Select
                    placeholder="关注程度"
                    onChange={this.changeAttent}
                    value={AttentionCode}
                    style={{ width: 150 }}
                  >
                    <Option value="">全部</Option>
                    {this.attentchildren()}
                  </Select>
                </Form.Item>
                  } 
                 { Atmosphere?  <BtnComponents /> : null}
                </Row>
                
                {!Atmosphere?  <Row>

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
              <Form.Item label='企业列表'>
              <Select
                showSearch
                optionFilterProp="children"
                allowClear
                placeholder="企业列表"
                onChange={this.changeEnt}
                value={EntCode ? EntCode : undefined}
                style={{ width: 350  }}
              >
                {this.children()}
              </Select>
            </Form.Item>
                 <BtnComponents />
                </Row>
                :
                null
           }
              </Form>
            </>
          }
        >
          <>
            <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={this.props.loading}
              columns={this.columns}
              // bordered={false}
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
