/**
 * 功  能：联网率
 * 创建人：贾安波
 * 创建时间：2021.06.22
 */
import React, { Component } from 'react';
import { ExportOutlined,RollbackOutlined,GlobalOutlined } from '@ant-design/icons';
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
import DetailDataSecond from './detailDataSecond'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'networkRateStatistics/updateState',
  getData: 'networkRateStatistics/getNetworkingRateForProvice',
  exportData: 'networkRateStatistics/exportNetworkingRateForProvice',
  getPointData: 'networkRateStatistics/getNetworkingRateForPoint',
  exportPointData: 'networkRateStatistics/exportNetworkingRateForPoint',
};
@connect(({ loading, networkRateStatistics,autoForm,common,global }) => ({
  exloading:networkRateStatistics.exloading,
  loading: loading.effects[pageUrl.getData],
  total: networkRateStatistics.total,
  tableDatas: networkRateStatistics.tableDatas,
  queryPar: networkRateStatistics.queryPar,
  exloading:loading.effects[pageUrl.exportData],
  clientHeight: global.clientHeight,
  pointList:networkRateStatistics.pointList,
  pointLoading: loading.effects[pageUrl.getPointData],
  exPointLoading: loading.effects[pageUrl.exportPointData],
  ProviceArr: networkRateStatistics.ProviceArr,
  ProviceNetArr: networkRateStatistics.ProviceNetArr,
  ProviceNoNetArr: networkRateStatistics.ProviceNoNetArr,
  ProviceRate: networkRateStatistics.ProviceRate
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      day:7,
      pointTitle:'',
      passParame:''
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
        align: 'center',
        render: (text, record) => { 
          return text==='全部合计'? text : <a  onClick={()=>{
                     this.setState({
                       detailVisible:true,
                       passParame:record
                     })

                    }}>
                   {text}
               </a>      
       },
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
                  percent={text&&text.replace("%","")}
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
        align: 'center',
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
    // this.initData();
  }
  componentDidUpdate(props){
   if(props.networkRateVisible!==this.props.networkRateVisible&&this.props.networkRateVisible){
    this.initData();
   }
  }
  initData = () => {

    const { dispatch, networkType } = this.props;
   this.typeChange(networkType);
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

  const { ProviceArr,ProviceNetArr,ProviceNoNetArr,ProviceRate} = this.props;
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
        bottom:70,
    },
    splitLine:{
      show:false //去掉网格线
     },
      xAxis: [{
              type: 'category',
              data: ProviceArr,
              axisTick: { //x轴 去掉刻度
                show:false
              },
              axisLabel: {
                interval:0,
                rotate:30
             }
          }],
      yAxis: [
          {
              type: 'value',
              name: '监测点数(个)',
              min: 0,
              // max: 200,
              // interval: 40,
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
                show: false,
                // lineStyle: {
                //   type: 'dashed',
                //   color: '#e9e9e9',
                //   width: 1
                // }
              }
          },
          
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
          data: ProviceNetArr
      },
      {
          name: '未联网监测点',
          type: 'bar',
          stack: 'overlap',//堆叠效果(字符需要统一)
          data: ProviceNoNetArr
      },
      {
             name: '联网率',
              type: 'line',
              yAxisIndex: 1,
              data: ProviceRate
          }
      ]
  };
  return option;
 }
  //创建并获取模板   导出
  template = () => {
    const { dispatch } = this.props;

    dispatch({
      type: pageUrl.exportData,
      payload: { 
        PollutantType: this.state.pollutantType
      },
        callback: data => {
         downloadFile(data);
        },
    });
  };
  pointTemplate = () => {  //弹框  监测点列表导出
    const { dispatch } = this.props;
    const { ProviceCode} = this.state;
    dispatch({
      type: pageUrl.exportPointData,
      payload: { 
        PollutantType: this.state.pollutantType,
        ProviceCode: ProviceCode,
        NetworkingRateType:this.state.networkingRateType
      },
      callback: data => {
         downloadFile(data);
        },
    });
  }
    typeChange=(e)=>{
      const { dispatch } = this.props;
      this.setState({
        pollutantType: e.target ? e.target.value : e
      },()=>{
        dispatch({
          type: pageUrl.getData,
          payload: { 
            PollutantType:this.state.pollutantType
          }
        });
      })

    }
    getPointDataFun = (row,type) =>{
      const { dispatch } = this.props;
       this.setState({
        networkingRateType:type
       })
        dispatch({
        type:pageUrl.getPointData,
        payload:{
         PollutantType: this.state.pollutantType,
         ProviceCode: row.ProviceCode,
         NetworkingRateType:type
       }
      })
    }

    totalPoint=(row)=>{
      this.setState({visible:true,pointTitle:`监测点总计-${row.ProviceName}`,ProviceCode:row.ProviceCode},()=>{
         this.getPointDataFun(row,1)
      })
    }
    netWorkPoint=(row)=>{
      this.setState({visible:true,pointTitle:`联网监测点-${row.ProviceName}`,ProviceCode:row.ProviceCode},()=>{
        this.getPointDataFun(row,2)
     })
    }
    noNetWorkPoint=(row)=>{
      this.setState({visible:true,pointTitle:`未联网监测点-${row.ProviceName}`,ProviceCode:row.ProviceCode},()=>{
        this.getPointDataFun(row,3)
     })
    }
  render() {
    const {
      exloading,
      tableDatas,
      clientHeight,
      exPointLoading,
      pointLoading,
      pointList,
      networkRateVisible,
      networkRateCancel,
    } = this.props;
    const { detailVisible,passParame} = this.state;
    return (
      <Modal
      title={`实时联网率 ${ passParame.ProviceName? `-${passParame.ProviceName}` : ''}`}
      wrapClassName='spreadOverModal'
      visible={networkRateVisible}
      onCancel={networkRateCancel}
      footer={null}
  >

  {detailVisible&&<DetailDataSecond  networkDetailCancel={()=>{this.setState({detailVisible:false,passParame:''})}} location ={ {query : {p:passParame.ProviceCode,n:passParame.ProviceName,networkType:this.state.pollutantType}}}/>}
     {!detailVisible&&networkRateVisible&&<Card
        bordered={false}
        style={{height:'100%'}}
        title={
          <>
            <Form layout="inline">
            <Row>
            <Form.Item>
            <Radio.Group onChange={this.typeChange} value={this.state.pollutantType}>
               <Radio.Button value={''}>全部</Radio.Button>
               <Radio.Button value={'2'}>废气</Radio.Button>
               <Radio.Button value={'1'}>废水</Radio.Button>
             </Radio.Group>

            </Form.Item>
             <Form.Item>
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
              <Row style={{paddingTop:5}}>
              <span style={{color:red[5]}}>
              停运时段内的监测点不参与联网率的计算。联网率 = 联网监测点/总监测点数*100%
              </span>
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
            dataSource={this.props.tableDatas}
            pagination={false}
            scroll={{ y: clientHeight - 800}}
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
               <div style={{display:'inline-block'}}> <GlobalOutlined style={{color:blue[5],paddingRight:5,fontSize:16}}/>已联网</div>
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
      </Card>}
      </Modal>
    );
  }
}
