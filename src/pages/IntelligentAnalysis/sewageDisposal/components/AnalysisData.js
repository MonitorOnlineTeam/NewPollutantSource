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
  Tabs
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
import ReactEcharts from 'echarts-for-react';
import { blue,red } from '@ant-design/colors';
import PageLoading from '@/components/PageLoading'
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'removalFlowRate/updateState',
  getData: 'removalFlowRate/getSewageHistoryList',
};
@connect(({ loading, removalFlowRate,autoForm }) => ({
  priseList: removalFlowRate.priseList,
  exloading:removalFlowRate.exloading,
  loading: removalFlowRate.loading,
  total: removalFlowRate.total,
  tableDatas: removalFlowRate.tableDatas,
  queryPar: removalFlowRate.queryPar,
  regionList: autoForm.regionList,
  attentionList:removalFlowRate.attentionList,
  pointName:removalFlowRate.pointName,
  chartExport:removalFlowRate.chartExport,
  chartImport:removalFlowRate.chartImport,
  chartTime:removalFlowRate.chartTime
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    
    this.columns = [
      {
        title: '监测时间',
        dataIndex: 'MonitorTime',
        key: 'MonitorTime',
        align: 'center',
        render: (text, record) => {
          return <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>;
        },
      },
      {
        title: '监测点名称',
        dataIndex: 'pointName',
        key: 'pointName',
        align: 'center',
        render: (text, record) => {
          return <span>{this.props.pointName}</span>;
        },
      },
      {
        title: '进水口',
        width:400,
        children: [
          {
            title: '浓度(mg/L)',
            dataIndex: 'importValue',
            key: 'importValue',
            width:200,
            align:'center',
          },
          {
            title: '是否停运',
            dataIndex: 'importStop',
            key: 'importStop',
            align:'center',
            render: (text, record) => {
              return text==0? "否":'是';
            },
            width:200,
           
          },
        ],
      },
      {
        title: '出水口',
        width:400,
        children: [
          {
            title: '浓度(mg/L)',
            dataIndex: 'exportValue',
            key: 'exportValue',
            width:200,
            align:'center',
          },
          {
            title: '是否停运',
            dataIndex: 'exportStop',
            key: 'exportStop',
            width:200,
            align:'center',
            render: (text, record) => {
              return text==0? <span>否</span>:<span>是</span>;
            },
          },
        ],
      },
    ]
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location } = this.props;
    
     sessionStorage.setItem("pointName", 'COD')

     dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

 
     dispatch({ type: 'removalFlowRate/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表

     dispatch({ 
           type: 'removalFlowRate/getEntByRegion',
           payload: { RegionCode: '' }, 
           callback:(code)=>{
            this.updateQueryState({
              beginTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
              endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              AttentionCode: '',
              EntCode: code,
              RegionCode: '',
              PollutantType:'011',
            });
            setTimeout(() => {
              this.getTableData();
            });
           }
    
    });//获取企业列表
  

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
    sessionStorage.setItem("pointName", data.props.children)



  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'removalFlowRate/exportSewageHistoryList',
      payload: { ...queryPar },
      callback: data => {
          downloadFile(`/upload${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();

    const { pointName, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { pointName: sessionStorage.getItem("pointName")},
    });
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
   getChartData=()=>{

    const { pointName,chartExport,chartImport,chartTime} = this.props;
    return {
      color:[blue[5],red[5]],
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data: [`进水口-${pointName}`, `出水口-${pointName}`],
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: chartTime
      },
      yAxis: [
        {
            name: '浓度值（mg/L）',
            type: 'value',
        }
    ],
      series: [
          {
              name: `进水口-${pointName}`,
              type: 'line',
              stack: '总量',
              data: chartImport,
          },
          {
              name: `出水口-${pointName}`,
              type: 'line',
              stack: '总量',
              data: chartExport,
          },
      ]
  };
   }
  render() {
    const {
      exloading,
      loading,
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantType },
    } = this.props;
    const { TabPane } = Tabs;
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
                    style={{ width: 170 }}
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
                    style={{ width: 170 }}
                  >
                    {this.regchildren()}
                  </Select>
                </Form.Item>

                <Form.Item label='污水处理厂名称'>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="污染物名称"
                    onChange={this.changeEnt}
                    value={EntCode}
                    style={{ width: 170  }}
                  >
                    {this.children()}
                  </Select>
                </Form.Item>
                </Row>
                <Row>
                <Form.Item label='关注程度'>
                  <Select
                    placeholder="关注程度"
                    onChange={this.changeAttent}
                    value={AttentionCode}
                    style={{ width: 170 }}
                  >
                    <Option value="">全部</Option>
                    {this.attentchildren()}
                  </Select>
                </Form.Item>
                <Form.Item label='污染物名称'>
                <Select
                    placeholder="污染物名称"
                    onChange={this.changePoll}
                    value={PollutantType}
                    style={{ width: 170  }}
                  >
                 <Option key='011' value='011'>COD</Option>
                 <Option key='060' value='060'>氨氮</Option>
                 <Option key='101' value='101'>总磷</Option>
                 <Option key='065' value='065'>总氮</Option>
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
          <div id='removalFlowRate'>
              <Tabs type="card">
            <TabPane tab="变化趋势" key="1"   >
            {loading?
             <PageLoading/>
              :
              <ReactEcharts
                        option={this.getChartData()}
                        className="echarts-for-echarts"
                        theme="my_theme"
                        style ={{height:"calc(100vh - 300px)"}}
                      />

            }
            </TabPane>
            <TabPane tab="数据详情" key="2">
             <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={loading}
              columns={this.columns}
              bordered={false}
              dataSource={this.props.tableDatas}
              // style ={{height:"calc(100vh - 300px)"}} 
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
              </TabPane>
           </Tabs>
          </div>
        </Card>
    );
  }
}