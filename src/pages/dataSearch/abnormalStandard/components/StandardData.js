
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
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';

import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import { blue,red } from '@ant-design/colors';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'abnormalStandard/updateState',
  getData: 'abnormalStandard/getExceptionStandValue',
};
@connect(({ loading, abnormalStandard,autoForm }) => ({
  priseList: abnormalStandard.priseList,
  exloading:abnormalStandard.exloading,
  loading: abnormalStandard.loading,
  total: abnormalStandard.total,
  tableDatas: abnormalStandard.tableDatas,
  queryPar: abnormalStandard.queryPar,
  regionList: autoForm.regionList,
  attentionList:abnormalStandard.attentionList,
  pointName:abnormalStandard.pointName,
  chartExport:abnormalStandard.chartExport,
  chartImport:abnormalStandard.chartImport,
  chartTime:abnormalStandard.chartTime,
  column:abnormalStandard.column,
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    
    this.columns = [
      {
        title: '行政区',
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
        width:100,
      },
      {
        title: '企业名称',
        dataIndex: 'entName',
        key: 'entName',
        align: 'center',
        width:200,
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: '监测点名称',
        dataIndex: 'pointName',
        key: 'pointName',
        align: 'center',
        width:150,
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
    ]
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location } = this.props;
    

     dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

 
     dispatch({ type: 'abnormalStandard/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表

     dispatch({   type: 'abnormalStandard/getEntByRegion',payload: { RegionCode: '' },  });//获取企业列表

     this.updateQueryState({
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      PollutantCode:'',
      PollutantType:'1',
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
  }
  changePoll=(value,data)=>{ //污染物改变事件
    this.updateQueryState({
      PollutantType: value,
    });



  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'abnormalStandard/exportExceptionStandValue',
      payload: { ...queryPar },
      callback: data => {
          downloadFile(`/upload${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();

    const {  queryPar:{ PollutantType } } = this.props;
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
      loading,
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,PollutantType },
      column,
      tableDatas
    } = this.props;
    const { TabPane } = Tabs;
    let columns = this.columns;

    if(column.length>0){
      let  addCol=[];
      column.map(item=>{
        addCol.push({
           title:`${item.PollutantName}${item.Unit? `(${item.Unit})` : ''  }`,
           width:400, 
           children: [
          {
            // width: 100, 
           title: '零值异常',
           children: [{  title: '零值计数',   dataIndex: `${item.PollutantCode}_zero`,  key:`${item.PollutantCode}_zero`,  width: 100, align:'center' }]
          },
          {
            // width: 300, 
           title: '超量程异常',
            children: [{
            title: '检出上限',
            dataIndex: `${item.PollutantCode}_overrunup`,
            key: `${item.PollutantCode}_overrunup`,
            width: 100, align:'center' 
          },
          {
           title: '检出下限',
           dataIndex: `${item.PollutantCode}_overrunlow`,
           key: `${item.PollutantCode}_overrunlow`,
           width: 100, align:'center' 
        },
        {
         title: '超量程计数',
         dataIndex: `${item.PollutantCode}_overrun`,
         key: `${item.PollutantCode}_overrun`,
         width: 100, align:'center' 
        }]
          }],

        })
    })

    columns = [...this.columns,...addCol]
  }
    return (
      <Card
        bordered={false}
        title={
          <>
            <Form layout="inline">
             <Form.Item label='行政区' >
                <Select
                  allowClear
                  placeholder="行政区"
                  onChange={this.changeRegion}
                  value={RegionCode ? RegionCode : undefined}
                  style={{ width: 170 }}
                >
                  {this.regchildren()}
                </Select>
              </Form.Item>
              <Form.Item label='关注程度'>
                <Select
                   allowClear
                  placeholder="关注程度"
                  onChange={this.changeAttent}
                  value={AttentionCode?AttentionCode:undefined} 
                  style={{ width: 170 }}
                >
                  {this.attentchildren()}
                </Select>
              </Form.Item>
              <Form.Item label='企业类型'>
                <Select
                  placeholder="企业类型"
                  onChange={this.typeChange}
                  value={PollutantType}
                  style={{ width: 170 }}
                >
                  <Option value="1">废水</Option>
                  <Option value="2">废气</Option>
                </Select>
              </Form.Item>
              <Form.Item>
              <Form.Item label='企业列表'>
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  placeholder="企业名称"
                  onChange={this.changeEnt}
                  value={EntCode? EntCode : undefined }
                  style={{ width: 170  }}
                >
                  {this.children()}
                </Select>
              </Form.Item>

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
        <div id=''>

           <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={loading}
            columns={columns}
            bordered={true}
            dataSource={tableDatas}
            // pagination={{
            //   showSizeChanger: true,
            //   showQuickJumper: true,
            //   total: this.props.total,
            //   defaultPageSize:20
            // }}
          />
        </div>
      </Card>
    );
  }
}
