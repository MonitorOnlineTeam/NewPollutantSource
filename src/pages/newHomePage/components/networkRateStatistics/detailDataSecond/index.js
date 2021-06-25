/**
 * 功  能：联网率
 * 创建人：贾安波
 * 创建时间：2021.06.22
 */
import React, { Component } from 'react';
import { ExportOutlined,RollbackOutlined,GlobalOutlined} from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import { green,grey,blue,red } from '@ant-design/colors';
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
  Radio,
  Spin
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
import { routerRedux } from 'dva/router';
import RegionList from '@/components/RegionList'
import PageLoading from '@/components/PageLoading'

// import { DualAxes } from '@ant-design/charts';
import ReactEcharts from 'echarts-for-react';

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'networkRateStatistics/updateState',
  getData: 'networkRateStatistics/getNetworkingRateForCity',
  exportData: 'networkRateStatistics/exportNetworkingRateForCity',
  getPointData: 'networkRateStatistics/getNetworkingRateForPoint',
  exportPointData: 'networkRateStatistics/exportNetworkingRateForPoint',
};
@connect(({ loading, networkRateStatistics,autoForm,common,global }) => ({
  exloading:networkRateStatistics.exloading,
  loading: loading.effects[pageUrl.getData],
  total: networkRateStatistics.total,
  tableDatil: networkRateStatistics.tableDatil,
  queryPar: networkRateStatistics.queryPar,
  exloading:loading.effects[pageUrl.exportData],
  clientHeight: global.clientHeight,
  pointList:networkRateStatistics.pointList,
  pointLoading: loading.effects[pageUrl.getPointData],
  exPointLoading: loading.effects[pageUrl.exportPointData],
  CityArr: networkRateStatistics.CityArr,
  CityNetArr: networkRateStatistics.CityNetArr,
  CityNoNetArr: networkRateStatistics.CityNoNetArr,
  CityRate: networkRateStatistics.CityRate
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      pointTitle:''
    };
    
    this.columns = [
      {
        title: <span>序号</span>,
        dataIndex: 'x',
        key: 'x',
        align: 'center',
        width:50,
        render:(text, record, index) => {
          return index + 1
        }
      },
      {
        title: <span>省区</span>,
        dataIndex: 'ProviceName',
        key: 'ProviceName',
        align: 'center'
      },
      {
        title: <span>城市</span>,
        dataIndex: 'CityName',
        key: 'CityName',
        align: 'center',
      },
      {
        title: <span>监测点类型</span>,
        dataIndex: 'PollutantType',
        key: 'PollutantType',
        align: 'center',
      },
      {
        title: <span>监测点总计(个)</span>,
        dataIndex: 'PointCount',
        key: 'PointCount',
        align: 'center',
        sorter: (a, b) => a.PointCount- b.PointCount,
      //   sorter: (a, b) => {
      //     const result = a.CountVisit - b.CountVisit;
      //     setTimeout(() => {
      //         if (a.ProviceName === '全部合计') {
      //             a.CountVisit = 0 - a.CountVisit;
      //         }
      //         if (b.ProviceName === '全部合计') {
      //             b.CountVisit = 0 - b.CountVisit;
      //         }
      //     });
      //     return result;
      // }
      render: (text, record) => { 
        return <Link onClick={()=>{this.totalPoint(record)}}>
                 {text}
             </Link>      
     },
      },
      {
        title: <span>联网监测点(个)</span>,
        dataIndex: 'NetworkingCount',
        key: 'NetworkingCount',
        align: 'center',
        sorter: (a, b) => a.NetworkingCount- b.NetworkingCount,
        render: (text, record) => { 
          return <Link onClick={()=>{this.netWorkPoint(record)}}>
                   {text}
               </Link>      
       },
      },
      {
        title: <span>未联网监测点(个)</span>,
        dataIndex: 'OffLineCount',
        key: 'OffLineCount',
        align: 'center',
        sorter: (a, b) => a.OffLineCount- b.OffLineCount,
        render: (text, record) => { 
          return <Link onClick={()=>{this.noNetWorkPoint(record)}}>
                   {text}
               </Link>      
       },
      },
      {
        title: <span>联网率</span>,
        dataIndex: 'NetworkingRate',
        key: 'NetworkingRate',
        align: 'center',
        sorter: (a, b) => a.NetworkingRate.replace("%","")- b.NetworkingRate.replace("%",""),
        render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text.replace("%","")}
                  size="small"
                  style={{width:'90%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text}</span>}
                />
              </div>
            );
          }

    }
    ];


    this.pointCol = [
      {
        title: <span>序号</span>,
        dataIndex: 'x',
        key: 'x',
        align: 'center',
        width:50,
        render:(text, record, index) => {
          return index + 1
        }
      },
      {
        title: <span>省区</span>,
        dataIndex: 'ProviceName',
        key: 'ProviceName',
        align: 'center'
      },
      {
        title: <span>城市</span>,
        dataIndex: 'CityName',
        key: 'CityName',
        align: 'center',
      },
      {
        title: <span>企业</span>,
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'center',
        render: (text, record) => { 
          return <span style={{textAlign:'left'}}> {text}</span>      
       },   
      },
      {
        title: <span>监测点</span>,
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center'
      },
      {
        title: <span>监测点类型</span>,
        dataIndex: 'PollutantType',
        key: 'PollutantType',
        align: 'center',
      },
      {
        title: <span>联网状态</span>,
        dataIndex: 'Status',
        key: 'Status',
        align: 'center',
        render: (text, record) => {
            return text ==1?     <GlobalOutlined style={{color:blue[5],fontSize:16}}/> :   <GlobalOutlined style={{fontSize:16}}/>
          }

    }

    
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch } = this.props;
   this.typeChange();
  };
 loadChart=()=>{

 return <ReactEcharts
  option={this.getOption()}
  style={{ height: '300px',width:'100%' }}
  className="echarts-for-echarts"
  theme="my_theme"
 />
 }

 getOption=()=>{

  const { CityArr,CityNetArr,CityNoNetArr,CityRate,location:{query:{p}}} = this.props;
  var option;
  option = {
      // color: [green[5],"#d9d9d9",blue[5]],
      color: ['#64b0fd', '#d9d9d9', '#42dab8'],
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow',
          },
          formatter: function (params, ticket, callback) {
            //x轴名称 params[0].name
            let name = params[0].name;
            //值
              let value = ''
  
              params.map(item=>{
              value += `${item.marker} ${item.seriesName}: ${item.value}${item.seriesName==='联网率'?'%':''}<br />`
            })
            
            return  name + '<br />' + value
        }
      },
      legend: {
          data: ['联网监测点', '未联网监测点','联网率']
      },
      grid: {
        left: 40,
        right: 50,
        bottom:40
    },
    splitLine:{
      show:false //去掉网格线
     },
      xAxis: [{
              type: 'category',
              data: CityArr,
              axisTick: { //x轴
                show:false
              },
          }],
      yAxis: [
          {
              type: 'value',
              name: '监测点(个)',
              min: 0,
              // max: 100,
              // interval: 20,
              axisLine: { show: false }, //y轴
              axisTick: { show: false },
              splitLine: {  //x轴分割线
                lineStyle: {
                  type: 'dashed',
                  color: '#e9e9e9',
                  width: 1
                }
              }
          },
          {
              type: 'value',
              name: '联网率',
              min: 0,
              max: 100,
              // interval: 20,
              axisLabel: {
                  formatter: '{value} %'
              },
              axisLine: { show: false }, //y轴
              axisTick: { show: false },
              splitLine: {  //x轴分割线
                show: false 
                // lineStyle: {
                //   type: 'dashed',
                //   color: '#e9e9e9',
                //   width: 1
                // }
              }
          }
      ],
      series: [
        {
          name: '联网监测点',
          type: 'bar',
          stack: 'overlap',//堆叠效果(字符需要统一)
          // label: {
            // show: true,
            // position: 'insideRight'
        // },
          data: CityNetArr
      },
      {
          name: '未联网监测点',
          type: 'bar',
          stack: 'overlap',//堆叠效果(字符需要统一)
          data: CityNoNetArr
      },
      {
             name: '联网率',
              type: 'line',
              yAxisIndex: 1,
              data: CityRate
          }
      ],
  };
  return option;
 }
  //创建并获取模板   导出
  template = () => {
    const { dispatch,location:{query:{p,networkType}}}  = this.props;
    dispatch({
      type: pageUrl.exportData,
      payload: { 
        PollutantType: networkType,
        ProviceCode:p,
      },
        callback: data => {
         downloadFile(data);
        },
    });
  };
  pointTemplate = () => {  //弹框  监测点列表导出
    const { dispatch,location:{query:{p,networkType}} } = this.props;
    const { CityCode } = this.state;
    dispatch({
      type: pageUrl.exportPointData,
      payload: { 
        PollutantType: networkType,
        ProviceCode:p,
        CityCode:CityCode,
        NetworkingRateType:this.state.networkingRateType
      },
      callback: data => {
         downloadFile(data);
        },
    });
  }
    typeChange=(e)=>{
      const { dispatch,location:{query:{p,networkType}}} = this.props;
      dispatch({
        type: pageUrl.getData,
        payload: { 
          PollutantType: networkType,
          ProviceCode: p,
        }
      });
    }
    getPointDataFun = (row,type) =>{
      const {location:{query:{p,networkType}} }= this.props;
      this.setState({CityCode:row.CityCode, networkingRateType:type})

      this.props.dispatch({
        type:pageUrl.getPointData,
        payload:{
          PollutantType: networkType,
          ProviceCode: p,
          CityCode: row.CityCode,
          NetworkingRateType: type
       }
      })
    }

    totalPoint=(row)=>{
      const {location:{query:{p}} }= this.props;
      this.setState({visible:true,pointTitle:`监测点总计-${row.CityName}`},()=>{
         this.getPointDataFun(row,1)
      })
    }
    netWorkPoint=(row)=>{
      const {location:{query:{p}} }= this.props;
      this.setState({visible:true,pointTitle:`联网监测点-${row.CityName}`},()=>{
        this.getPointDataFun(row,2)
     })
    }
    noNetWorkPoint=(row)=>{
      const {location:{query:{p}} }= this.props;
      this.setState({visible:true,pointTitle:`未联网监测点-${row.CityName}`},()=>{
        this.getPointDataFun(row,3)
     })
    }
  render() {
    const {
      exloading,
      tableDatil,
      clientHeight,
      exPointLoading,
      pointLoading,
      pointList,
      location:{
        query:{n}
      }
    } = this.props;


    return (
      <Card
        bordered={false}
        style={{height:'100%'}}
        title={
          <>
            <Form layout="inline">
            <Row>

             <Form.Item  style={{ marginRight: 0}}>
                <Button         
                  icon={<ExportOutlined />}
                  onClick={this.template}
                  loading={exloading}
                >
                  导出
                </Button>
              </Form.Item>
              <Form.Item>
              <Button style={{ marginLeft: 10 }} onClick={() => {
                    this.props.networkDetailCancel()
                    }}><RollbackOutlined />返回</Button>
              </Form.Item>
              </Row>
           
            </Form>
          </>
        }
      >
        <div>
          {this.props.loading? <Spin style={{width:'100%',padding:'60px 0', textAlign: 'center'}} size="large" />: this.loadChart()}
          <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={this.props.loading}
            columns={this.columns}
            dataSource={this.props.tableDatil}
            pagination={false}
            scroll={{ y: clientHeight - 750}}
          />
        </div>

        <Modal
        title={this.state.pointTitle}
        visible={this.state.visible}
        width={'90%'}
        onCancel={() => {
          this.setState({
            visible: false,
          });
        }}
        footer={null}
      >
        <>
            <Row justify='space-between' style={{paddingBottom:10}}>
             <Form.Item style={{marginBottom:0}}>
                <Button
                  icon={<ExportOutlined />}
                  onClick={this.pointTemplate}
                  loading={exPointLoading}
                >
                  导出
                </Button>
              </Form.Item>

              <Form.Item  style={{marginBottom:0}}>
               <div style={{display:'inline-block'}}> <GlobalOutlined style={{color:blue[5],paddingRight:5,fontSize:16}}/>已联网 </div>
               <div style={{display:'inline-block',paddingLeft:8}}> <GlobalOutlined style={{paddingRight:5,fontSize:16}}/>未联网 </div>
              </Form.Item>
              </Row>
         <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={pointLoading}
            columns={this.pointCol}
            dataSource={pointList}
            pagination={false}
            scroll={{ y: clientHeight - 400}}
          />
          </>
      </Modal>
      </Card>
    );
  }
}
