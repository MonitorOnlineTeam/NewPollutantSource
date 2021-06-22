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
  getData: 'networkRateStatistics/getDaQuUserActivity',
  exportData: 'networkRateStatistics/exportDaQuUserActivity',
  getUserData: 'networkRateStatistics/getUserActivity',
  exportUserData: 'networkRateStatistics/exportUserActivity',
};
@connect(({ loading, networkRateStatistics,autoForm,common,global }) => ({
  exloading:networkRateStatistics.exloading,
  loading: loading.effects[pageUrl.getData],
  total: networkRateStatistics.total,
  tableDatas: networkRateStatistics.tableDatas,
  queryPar: networkRateStatistics.queryPar,
  exloading:loading.effects[pageUrl.exportData],
  clientHeight: global.clientHeight,
  userList:networkRateStatistics.userList,
  userLoading: loading.effects[pageUrl.getUserData],
  exUserLoading: loading.effects[pageUrl.exportUserData],
  DaQuArr: networkRateStatistics.DaQuArr,
  DaviArr: networkRateStatistics.DaviArr,
  DaNoVisitArr: networkRateStatistics.DaNoVisitArr,
  DaRate: networkRateStatistics.DaRate
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      day:7,
      accountTitle:'',
      passParame:''
    };
    
    this.columns = [
      {
        title: <span>序号</span>,
        dataIndex: 'x',
        key: 'x',
        align: 'center',
        render:(text, record, index) => {
          return index + 1
        }
      },
      {
        title: <span>大区名称</span>,
        dataIndex: 'DaQuName',
        key: 'DaQuName',
        align: 'center',
        render: (text, record) => { 
          return <a  onClick={()=>{
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
        title: <span>总账户数</span>,
        dataIndex: 'CountVisit',
        key: 'CountVisit',
        align: 'center',
        sorter: (a, b) => a.CountVisit- b.CountVisit,
      //   sorter: (a, b) => {
      //     const result = a.CountVisit - b.CountVisit;
      //     setTimeout(() => {
      //         if (a.DaQuName === '全部合计') {
      //             a.CountVisit = 0 - a.CountVisit;
      //         }
      //         if (b.DaQuName === '全部合计') {
      //             b.CountVisit = 0 - b.CountVisit;
      //         }
      //     });
      //     return result;
      // }
      render: (text, record) => { 
        return <Link onClick={()=>{this.totalAccount(record)}}>
                 {text}
             </Link>      
     },
      },
      {
        title: <span>访问账户数</span>,
        dataIndex: 'Visited',
        key: 'Visited',
        align: 'center',
        sorter: (a, b) => a.Visited- b.Visited,
        render: (text, record) => { 
          return <Link onClick={()=>{this.visitAccount(record)}}>
                   {text}
               </Link>      
       },
      },
      {
        title: <span>未访问账户数</span>,
        dataIndex: 'NoVisit',
        key: 'NoVisit',
        align: 'center',
        sorter: (a, b) => a.NoVisit- b.NoVisit,
        render: (text, record) => { 
          return <Link onClick={()=>{this.novisitAccount(record)}}>
                   {text}
               </Link>      
       },
      },
      {
        title: <span>系统访问率</span>,
        dataIndex: 'VisitRate',
        key: 'VisitRate',
        align: 'center',
        sorter: (a, b) => a.VisitRate.replace("%","")- b.VisitRate.replace("%",""),
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


    this.accountCol = [
      {
        title: <span>序号</span>,
        dataIndex: 'x',
        key: 'x',
        align: 'center',
        render:(text, record, index) => {
          return index + 1
        }
      },
      {
        title: <span>大区名称</span>,
        dataIndex: 'DaQuName',
        key: 'DaQuName',
        align: 'center'     
      },
      {
        title: <span>服务区名称</span>,
        dataIndex: 'FuWuQuName',
        key: 'FuWuQuName',
        align: 'center',
    
     },
      {
        title: <span>姓名</span>,
        dataIndex: 'UserName',
        key: 'UserName',
        align: 'center',
      },
      {
        title: <span>登录名</span>,
        dataIndex: 'UserAccount',
        key: 'UserAccount',
        align: 'center',
      },
      {
        title: <span>访问状态</span>,
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
   this.dayChange();
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

  const { DaQuArr,DaviArr,DaNoVisitArr,DaRate} = this.props;
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
              value += `${item.marker} ${item.seriesName}: ${item.value}${item.seriesName==='系统访问率'?'%':''}<br />`
            })
            
            return  name + '<br />' + value
        }
      },
      legend: {
          data: ['访问账户数', '未访问账户数','系统访问率']
      },
      grid: {
        left: 40,
        right: 50,
    },
    splitLine:{
      show:false //去掉网格线
     },
      xAxis: [{
              type: 'category',
              data: DaQuArr,
              axisTick: { //x轴 去掉刻度
                show:false
              },
          }],
      yAxis: [
          {
              type: 'value',
              name: '账户数',
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
              name: '系统访问率',
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
          name: '访问账户数',
          type: 'bar',
          stack: 'overlap',//堆叠效果(字符需要统一)
          // label: {
            // show: true,
            // position: 'insideRight'
        // },
          data: DaviArr
      },
      {
          name: '未访问账户数',
          type: 'bar',
          stack: 'overlap',//堆叠效果(字符需要统一)
          data: DaNoVisitArr
      },
      {
             name: '系统访问率',
              type: 'line',
              yAxisIndex: 1,
              data: DaRate
          }
      ]
  };
  return option;
 }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    const { day } = this.state;
    dispatch({
      type: pageUrl.exportData,
      payload: { 
        beginTime: moment().subtract(day, 'day').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'), },
        callback: data => {
         downloadFile(data);
        },
    });
  };
  userTemplate = () => {  //弹框  用户列表导出
    const { dispatch, queryPar } = this.props;
    const { day,DaQuId } = this.state;
    dispatch({
      type: pageUrl.exportUserData,
      payload: { 
        beginTime: moment().subtract(day, 'day').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'), 
        DaQuId:DaQuId
      },
      callback: data => {
         downloadFile(data);
        },
    });
  }
    dayChange=(e)=>{
      const { dispatch, queryPar } = this.props;
      this.setState({day:e?e.target.value : 7})
      dispatch({
        type: pageUrl.getData,
        payload: { 
          beginTime: moment().subtract(e?e.target.value : 7, 'day').format('YYYY-MM-DD 00:00:00'),
          endTime: moment().format('YYYY-MM-DD 23:59:59'), 
        }
      });
    }
    getUserDataFun = (row,type) =>{
      const { day } = this.state;
      this.props.dispatch({
        type:pageUrl.getUserData,
        payload:{
         beginTime: moment().subtract(day, 'day').format('YYYY-MM-DD 00:00:00'),
         endTime: moment().format('YYYY-MM-DD 23:59:59'),
         DaQuId: row.DaQuId,
         ActivetyType:type
       }
      })
    }

    totalAccount=(row)=>{
      const { day } = this.state;
      this.setState({visible:true,accountTitle:`总账户-${row.DaQuName}(近${day}日内)`,DaQuId:row.DaQuId},()=>{
         this.getUserDataFun(row,1)
      })
    }
    visitAccount=(row)=>{
      const { day } = this.state;
      this.setState({visible:true,accountTitle:`访问账户-${row.DaQuName}(近${day}日内)`,DaQuId:row.DaQuId},()=>{
        this.getUserDataFun(row,2)
     })
    }
    novisitAccount=(row)=>{
      const { day } = this.state;
      this.setState({visible:true,accountTitle:`未访问账户-${row.DaQuName}(近${day}日内)`,DaQuId:row.DaQuId},()=>{
        this.getUserDataFun(row,3)
     })
    }
  render() {
    const {
      exloading,
      tableDatas,
      clientHeight,
      exUserLoading,
      userLoading,
      userList,
      networkRateVisible,
      networkRateCancel
    } = this.props;
    const { detailVisible,passParame,day} = this.state;
    return (
      <Modal
      title={'实时联网率'}
      width={'90%'}
      visible={networkRateVisible}
      onCancel={networkRateCancel}
      footer={null}
  >

  {detailVisible&&<DetailDataSecond  networkDetailCancel={()=>{this.setState({detailVisible:false})}} location ={ {query : {p:passParame.DaQuId,n:passParame.DaQuName, day:day}}}/>}
     {!detailVisible&&networkRateVisible&&<Card
        bordered={false}
        style={{height:'100%'}}
        title={
          <>
            <Form layout="inline">
            <Row>
            <Form.Item>
            <Radio.Group onChange={this.dayChange} defaultValue={7}>
               <Radio.Button value={7}>近7日内</Radio.Button>
               <Radio.Button value={14}>近14日内</Radio.Button>
               <Radio.Button value={30}>近30日内</Radio.Button>
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
              停运时段内的监测点不参与联网率的计算
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
        title={this.state.accountTitle}
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
                  onClick={this.userTemplate}
                  loading={exUserLoading}
                >
                  导出
                </Button>
              </Form.Item>

              <Form.Item  style={{marginBottom:0}}>
               <div style={{display:'inline-block'}}> <GlobalOutlined style={{color:blue[5],paddingRight:5,fontSize:16}}/>已访问 </div>
               <div style={{display:'inline-block',paddingLeft:8}}> <GlobalOutlined style={{paddingRight:5,fontSize:16}}/>已访问 </div>
              </Form.Item>
              </Row>
         <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={userLoading}
            columns={this.accountCol}
            dataSource={userList}
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
