/**
 * 功  能：运维区域账户访问率
 * 创建人：贾安波
 * 创建时间：2021.06.18
 */
import React, { Component } from 'react';
import { ExportOutlined,RollbackOutlined,UserOutlined} from '@ant-design/icons';
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
  updateState: 'regionalAccountStatistics/updateState',
  getData: 'regionalAccountStatistics/getFuWuQuUserActivity',
  exportData: 'regionalAccountStatistics/exportFuWuQuUserActivity',
  getUserData: 'regionalAccountStatistics/getUserActivity',
  exportUserData: 'regionalAccountStatistics/exportUserActivity',
};
@connect(({ loading, regionalAccountStatistics,autoForm,common,global }) => ({
  exloading:regionalAccountStatistics.exloading,
  loading: loading.effects[pageUrl.getData],
  total: regionalAccountStatistics.total,
  tableDatil: regionalAccountStatistics.tableDatil,
  queryPar: regionalAccountStatistics.queryPar,
  exloading:loading.effects[pageUrl.exportData],
  clientHeight: global.clientHeight,
  userList:regionalAccountStatistics.userList,
  userLoading: loading.effects[pageUrl.getUserData],
  exUserLoading: loading.effects[pageUrl.exportUserData],
  FuWuArr: regionalAccountStatistics.FuWuArr,
  FuviArr: regionalAccountStatistics.FuviArr,
  FuNoVisitArr: regionalAccountStatistics.FuNoVisitArr,
  FuRate: regionalAccountStatistics.FuRate
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      accountTitle:''
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
      },
      {
        title: <span>服务区名称</span>,
        dataIndex: 'FuWuQuName',
        key: 'FuWuQuName',
        align: 'center',
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
        return <a href='#' onClick={()=>{this.totalAccount(record)}}>
                 {text}
             </a>      
     },
      },
      {
        title: <span>访问账户数</span>,
        dataIndex: 'Visited',
        key: 'Visited',
        align: 'center',
        sorter: (a, b) => a.Visited- b.Visited,
        render: (text, record) => { 
          return <a href='#'  onClick={()=>{this.visitAccount(record)}}>
                   {text}
               </a>      
       },
      },
      {
        title: <span>未访问账户数</span>,
        dataIndex: 'NoVisit',
        key: 'NoVisit',
        align: 'center',
        sorter: (a, b) => a.NoVisit- b.NoVisit,
        render: (text, record) => { 
          return <a href='#' onClick={()=>{this.novisitAccount(record)}}>
                   {text}
               </a>      
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
            return text ==1?     <UserOutlined style={{color:blue[5],fontSize:16}}/> :   <UserOutlined style={{fontSize:16}}/>
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

  const { FuWuArr,FuviArr,FuNoVisitArr,FuRate,location:{query:{p,day}}} = this.props;
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

            //x轴名称 params[0]
            let name = `近${day}内`
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
              data: FuWuArr,
              axisTick: { //x轴
                show:false
              },
          }],
      yAxis: [
          {
              type: 'value',
              name: '账户数',
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
          name: '访问账户数',
          type: 'bar',
          stack: 'overlap',//堆叠效果(字符需要统一)
          // label: {
            // show: true,
            // position: 'insideRight'
        // },
          data: FuviArr
      },
      {
          name: '未访问账户数',
          type: 'bar',
          stack: 'overlap',//堆叠效果(字符需要统一)
          data: FuNoVisitArr
      },
      {
             name: '系统访问率',
              type: 'line',
              yAxisIndex: 1,
              data: FuRate
          }
      ],
    //   noDataLoadingOption: {
    //     text: '暂无数据',
    //     textStyle: {
    //         fontSize: '20',
    //     },
    //     effect: 'bubble',
    //     effectOption: {
    //         effect: {
    //             n: 0
    //         }
    //     }
    // }
  };
  return option;
 }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar,location:{query:{p,day}}}  = this.props;
    dispatch({
      type: pageUrl.exportData,
      payload: { 
        beginTime: moment().subtract(day, 'day').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'), 
        DaQuId:p,
      },
        callback: data => {
         downloadFile(data);
        },
    });
  };
  userTemplate = () => {  //弹框  用户列表导出
    const { dispatch, queryPar,location:{query:{p,day}} } = this.props;
    const { FuWuQuId } = this.state;
    dispatch({
      type: pageUrl.exportUserData,
      payload: { 
        beginTime: moment().subtract(day, 'day').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'), 
        DaQuId:p,
        FuWuQuId:FuWuQuId,
        ActivetyType:this.state.activetyType
      },
      callback: data => {
         downloadFile(data);
        },
    });
  }
    dayChange=(e)=>{
      const { dispatch, queryPar,location:{query:{p,day}}} = this.props;
      dispatch({
        type: pageUrl.getData,
        payload: { 
          beginTime: moment().subtract(day, 'day').format('YYYY-MM-DD 00:00:00'),
          endTime: moment().format('YYYY-MM-DD 23:59:59'), 
          DaQuId:p
        }
      });
    }
    getUserDataFun = (row,type) =>{
      const {location:{query:{p,day}} }= this.props;
      this.setState({FuWuQuId:row.FuWuQuId,activetyType:type})
      this.props.dispatch({
        type:pageUrl.getUserData,
        payload:{
         beginTime: moment().subtract(day, 'day').format('YYYY-MM-DD 00:00:00'),
         endTime: moment().format('YYYY-MM-DD 23:59:59'),
         DaQuId: row.DaQuId,
         FuWuQuId:row.FuWuQuId,
         ActivetyType:type
       }
      })
    }

    totalAccount=(row)=>{
      const {location:{query:{p,day}} }= this.props;
      this.setState({visible:true,accountTitle:`总账户-${row.DaQuName}(近${day}日内)`},()=>{
         this.getUserDataFun(row,1)
      })
    }
    visitAccount=(row)=>{
      const {location:{query:{p,day}} }= this.props;
      this.setState({visible:true,accountTitle:`访问账户-${row.DaQuName}(近${day}日内)`},()=>{
        this.getUserDataFun(row,2)
     })
    }
    novisitAccount=(row)=>{
      const {location:{query:{p,day}} }= this.props;
      this.setState({visible:true,accountTitle:`未访问账户-${row.DaQuName}(近${day}日内)`},()=>{
        this.getUserDataFun(row,3)
     })
    }
  render() {
    const {
      exloading,
      tableDatil,
      clientHeight,
      exUserLoading,
      userLoading,
      userList,
      location:{
        query:{day,n}
      }
    } = this.props;


    return (
      <BreadcrumbWrapper title="运维区域账户访问率">
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
                        router.push(`/Intelligentanalysis/accessStatistics`);
                    }}><RollbackOutlined />返回</Button>
              </Form.Item>
              <Form.Item><span style={{color:red[5]}}>{n}(近{day}日内) </span> </Form.Item>
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
            scroll={{ y: clientHeight - 630}}
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
               <div style={{display:'inline-block'}}> <UserOutlined style={{color:blue[5],paddingRight:5,fontSize:16}}/>已访问 </div>
               <div style={{display:'inline-block',paddingLeft:8}}> <UserOutlined style={{paddingRight:5,fontSize:16}}/>已访问 </div>
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
      </Card>
      </BreadcrumbWrapper>
    );
  }
}
