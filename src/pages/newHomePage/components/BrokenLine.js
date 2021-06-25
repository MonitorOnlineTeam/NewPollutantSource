
/**
 * 功  能：首页
 * 创建人：贾安波
 * 创建时间：2020.11
 */
import React, { Component } from 'react';
import { CaretDownOutlined,CaretRightOutlined } from '@ant-design/icons';
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
  Skeleton,
  Avatar,
  Dropdown,
  Menu,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../style.less'
import ReactEcharts from 'echarts-for-react';
import TransmissionefficiencyModal from '@/pages/IntelligentAnalysis/newTransmissionefficiency/EntIndexModal'


import Region from '../components/jumpPage/faultOverWorkRate/Region'
import 'echarts-liquidfill'

import NetworkRateStatisticsModal from './networkRateStatistics'
const { Meta } = Card;
const { TabPane } = Tabs;
const pageUrl = {
  updateState: 'home/updateState',
  getData: 'home/getOverDataRate',
};
@connect(({ loading, home, autoForm }) => ({
  realTimeAlarmLoading: home.realTimeAlarmLoading,
  GZRateDataList: home.GZRateDataList,
  GZRateX: home.GZRateX,
  CBRateDataList: home.CBRateDataList,
  CBRateX: home.CBRateX,
  YZRateDataList: home.YZRateDataList,
  YZRateX: home.YZRateX,
  CSYXRateDataList: home.CSYXRateDataList,
  CSYXRateX: home.CSYXRateX,
  CSYXLoading: loading.effects["home/getCSYXRateList"],
  YZLoading: loading.effects["home/getYZRateList"],
  CBLoading: loading.effects["home/getCBRateList"],
  GZLoading: loading.effects["home/getGZRateList"],
  LwLoading: loading.effects["networkRateStatistics/getHomePageNetworkingRate"],
  queryPar:home.queryPar
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GZRateTime: [moment().subtract(7, "days"), moment().subtract(1, "days")],
      CBRateTime: [moment().subtract(7, "days"), moment().subtract(1, "days")],
      YZRateTime: [moment().subtract(7, "days"), moment().subtract(1, "days")],
      CSYXRateTime: [moment().subtract(7, "days"), moment().subtract(1, "days")],
      TVisible:false,
      TBpollutantType:"1",
      regionVisible:false,
      title:'',
      networkVisible:false,
      networkType:'1',
      networkingRate:0,
      networkingCount: '',
      offLineCount:  '',
      pointCount:  '',
    }
  }

  componentDidMount() {
    this.initData()
  }

  initData = () => {
    // 获取故障率
    this.getGZRateList();
    // 获取超标率
    this.getCBRateList();
    // 获取运转率
    // this.getYZRateList();
    // 获取传输有效率
    this.getCSYXRateList();
    
    //获取联网率
    this.getNetworkingRate();
  }

  // 获取故障率
  getGZRateList = () => {
    const { GZRateTime } = this.state;
    this.props.dispatch({
      type: "home/getGZRateList",
      payload: {
        BeginTime: moment(GZRateTime[0]).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(GZRateTime[1]).format("YYYY-MM-DD 23:59:59"),
      }
    })
  }

  // 获取超标率
  getCBRateList = () => {
    const { CBRateTime } = this.state;
    this.props.dispatch({
      type: "home/getCBRateList",
      payload: {
        BeginTime: moment(CBRateTime[0]).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(CBRateTime[1]).format("YYYY-MM-DD 23:59:59"),
      }
    })
  }

  // 获取运转率
  getYZRateList = () => {
    const { YZRateTime } = this.state;
    this.props.dispatch({
      type: "home/getYZRateList",
      payload: {
        BeginTime: moment(YZRateTime[0]).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(YZRateTime[1]).format("YYYY-MM-DD 23:59:59"),
      }
    })
  }

  // 获取传输有效率
  getCSYXRateList = () => {
    const { CSYXRateTime } = this.state;
    this.props.dispatch({
      type: "home/getCSYXRateList",
      payload: {
        BeginTime: moment(CSYXRateTime[0]).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(CSYXRateTime[1]).format("YYYY-MM-DD 23:59:59"),
      }
    })
  }
  // 获取联网率
  getNetworkingRate = () => {
    

    this.props.dispatch({
      type: "networkRateStatistics/getHomePageNetworkingRate",
      payload: {
          PollutantType: this.state.networkType,
      },
      callback:res=>{
        if(res.length>0){
          let data = res[0];
          this.setState({
            networkingRate: data.NetworkingRate,
            networkingCount: data.NetworkingCount,
            offLineCount:  data.OffLineCount,
            pointCount:  data.PointCount,
          })
        }

      }
    })
  }

  
  transmission=(type)=>{
    this.setState({
      TBpollutantType:type
    },()=>{
      this.setState({
        TVisible: true,
      })
    })

  }
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };
  work=(type)=>{
    const { dispatch } = this.props;
    const { YZRateTime } = this.state;
    this.updateQueryState({
      BeginTime:  moment(YZRateTime[0]).format('YYYY-MM-DD 00:00:00'),
      EndTime:  moment(YZRateTime[1]).format('YYYY-MM-DD 23:59:59'),
      EntCode: "",
      RegionCode: "",
      PollutantTypeCode: [type],
      ModelType: "All"
    });
    dispatch({
      type: pageUrl.updateState,
      payload: { isWorkRate: true,Atmosphere:type=='5'?true:false,ModelType:'All'},
    });
    setTimeout(()=>{
      this.setState({regionVisible:true})
      
    })
  }
  over=(type)=>{


    const { dispatch } = this.props;
    const { CBRateTime } = this.state;
    this.updateQueryState({
      BeginTime: moment(CBRateTime[0]).format('YYYY-MM-DD 00:00:00'),
      EndTime: moment(CBRateTime[1]).format('YYYY-MM-DD 23:59:59'),
      EntCode: "",
      RegionCode: "",
      PollutantTypeCode: [type],
      ModelType: "All"
    });
    dispatch({
      type: pageUrl.updateState,
      payload: { isOverRate: true,Atmosphere:type=='5'?true:false,ModelType:'All'},
    });
    setTimeout(()=>{
      this.setState({regionVisible:true})
      
    })
  }
  fault=(type)=>{
    const { dispatch } = this.props;
    const { GZRateTime } = this.state;
    this.updateQueryState({
      BeginTime: moment(GZRateTime[0]).format('YYYY-MM-DD 00:00:00'),
      EndTime: moment(GZRateTime[1]).format('YYYY-MM-DD 23:59:59'),
      EntCode: "",
      RegionCode: "",
      PollutantTypeCode: [type],
      ModelType: "All"
    });
    dispatch({
      type: pageUrl.updateState,
      payload: { isFaultRate: true,Atmosphere:type=='5'?true:false,ModelType:'All'},
    });
    setTimeout(()=>{
      this.setState({regionVisible:true})
      
    })
  }
  regionCancel=()=>{ //行政区页面
    const { dispatch } = this.props;
    dispatch({
      type: pageUrl.updateState,
      payload: { isWorkRate: false,isFaultRate:false,isOverRate:false},
    });
     this.setState({regionVisible:false})
   }
  menu = (title) => {
    if(title=='有效传输率'){
      return <Menu>
      <Menu.Item onClick={this.transmission.bind(this,'1') }>有效传输率(废水)</Menu.Item>
      <Menu.Item  onClick={this.transmission.bind(this,'2') }>有效传输率(废气)</Menu.Item>
    </Menu>
    }
    if(title=='运转率'){
      return <Menu>
      <Menu.Item onClick={this.work.bind(this,'1')} >运转率(废水)</Menu.Item>
      <Menu.Item  onClick={this.work.bind(this,'2')} >运转率(废气)</Menu.Item>
      <Menu.Item  onClick={this.work.bind(this,'5')}>运转率(空气站)</Menu.Item>
    </Menu>
    }
    if(title=='超标率'){
      return <Menu>
      <Menu.Item  onClick={this.over.bind(this,'1')}>超标率(废水)</Menu.Item>
      <Menu.Item onClick={this.over.bind(this,'2')}>超标率(废气)</Menu.Item>
    </Menu>
    }
    if(title=='故障率'){
      return <Menu>
      <Menu.Item onClick={this.fault.bind(this,'1')}>故障率(废水)</Menu.Item>
      <Menu.Item onClick={this.fault.bind(this,'2')}>故障率(废气)</Menu.Item>
      <Menu.Item onClick={this.fault.bind(this,'5')}>故障率(空气站)</Menu.Item>
    </Menu>
    }
  }

  cardTitle = (title, type) => {
    return (
      <Row type='flex' align="middle" justify='space-between'>
        <Dropdown overlay={this.menu(title)} trigger={['click']}>
          <span onClick={e => e.preventDefault()}>
            {title} <CaretDownOutlined style={{ color: '#cbcbcb' }} />
          </span>
        </Dropdown>
        <Tabs defaultActiveKey="7" onChange={(value) => this.tabCallback(value, type)}>
          <TabPane tab="近7天" key="7">
          </TabPane>
          <TabPane tab="近30天" key="30">
          </TabPane>
        </Tabs>
      </Row>
    );
  }
  cardLwTitle= (title, type) => {
    return (
      <Row type='flex' align="middle" justify='space-between'>
          <span onClick={()=>{this.setState({networkVisible:true})}} style={{cursor:'pointer'}}>
            {title} <CaretRightOutlined style={{ color: '#cbcbcb' }} />
          </span>
        <Tabs defaultActiveKey="1" onChange={(value) => this.tabLWCallback(value, type)}>
          <TabPane tab="废水" key="1">
          </TabPane>
          <TabPane tab="废气" key="2">
          </TabPane>
        </Tabs>
      </Row>
    );
  }
  tabLWCallback=(value)=>{
    this.setState({networkType:value},()=>{
      this.getNetworkingRate();
    })
  }
  tabCallback = (value, type) => {
    // GZRateTime: [moment().subtract(7, "days"), moment()],
    //   CBRateTime: [moment().subtract(7, "days"), moment()],
    //   YZRateTime: [moment().subtract(7, "days"), moment()],
    //   CSYXRateTime: [moment().subtract(7, "days"), moment()],
    switch (type) {
      case "GZ": // 故障
        this.setState({
          GZRateTime: [moment().subtract(value, "days"), moment().subtract(1, "days")]
        }, () => {
          this.getGZRateList();
        })
        break;
      case "CB": // 超标
        this.setState({
          CBRateTime: [moment().subtract(value, "days"), moment().subtract(1, "days")],
        }, () => {
          this.getCBRateList();
        })
        break;
      case "YZ": // 运转
        this.setState({
          YZRateTime: [moment().subtract(value, "days"), moment().subtract(1, "days")],
        }, () => {
          this.getYZRateList();
        })
        break;
      case "CSYX": // 传输有效
        this.setState({
          CSYXRateTime: [moment().subtract(value, "days"),moment().subtract(1, "days")],
        }, () => {
          this.getCSYXRateList();
        })
        break;
    }
  }

  getChartData = (type) => {
    const { GZRateDataList, GZRateX, CBRateDataList, CBRateX, YZRateDataList, YZRateX, CSYXRateDataList, CSYXRateX } = this.props;
    let xAxis = [];
    let series = [];
    switch (type) {
      case "GZ": // 故障
        xAxis = GZRateX;
        series = GZRateDataList;
        break;
      case "CB": // 超标
        xAxis = CBRateX;
        series = CBRateDataList;
        break;
      case "YZ": // 运转
        xAxis = YZRateX;
        series = YZRateDataList;
        break;
      case "CSYX": // 传输有效
        xAxis = CSYXRateX;
        series = CSYXRateDataList;
        break;
    }


    let color = ['#64b0fd', '#9d6ff1', '#42dab8']
    let option = {
      color: ['#64b0fd', '#9d6ff1', '#42dab8'],
      tooltip: {
        trigger: 'axis', 
        formatter: function (params, ticket, callback) {

          //x轴名称
          let name = params[0].name
          //值
            let value = ''

            params.map(item=>{
            value += item.marker + item.seriesName+": "+item.value+'%' + '<br />'
          })
          
          return  name + '<br />' + value
      }
  
      },
      legend: {
        // data: ['邮件营销', '联盟广告', '视频广告'],
        left: 'center',
        bottom: 0,
        icon: 'rect',
        itemWidth: 20,//图例的宽度
        itemHeight: 10,//图例的高度
        textStyle: {//图例文字的样式
          color: '#333',
        }
      },
      grid: {
        top: 20,
        left: 0,
        right: 20,
        bottom: 30,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis,
        axisLine: { //x轴
          lineStyle: {
            color: '#d9d9d9',
            width: 1
          },
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        },
      },
      yAxis: {
        type: 'value',
        // max: 100,
        // min: 0,
        axisLine: { show: false, }, //y轴
        axisTick: { show: false },
        axisLabel: {
          formatter: '{value}%',
          textStyle: {
            color: '#999'
          }
        },
        splitLine: {  //x轴分割线
          lineStyle: {
            type: 'dashed',
            color: '#e9e9e9',
            width: 1
          }
        }
      },
      series: series
    };
    return option;
  }
  getLwChartData=(data)=>{

    let rate = data?  data.replace('%','')/100 : data;
    var option = {
      series: [{
          type: 'liquidFill',
          data: [rate],
          color:['#64b0fd'],
          radius: "95%", //水球的半径
          itemStyle : { 
            shadowBlur : 0
          }, 
          // center: [50,50],
          outline: {
            borderDistance: 0,
            color: 'none',
            itemStyle: {
                borderWidth: 2,
                borderColor: 'rgb(131, 147, 255)'
            }
          },
          backgroundStyle: {
            borderWidth: 0,
            borderColor: 'none',
            color: 'none'
        },
        label: {
          normal: {
            formatter: function (name) {

              let val = name.value? name.value*100 : '0.00';
              return `{title|联网率}{n|\n}{val|${ val}%}`
            },
              textStyle: {
                  color:'rgba(0,0,0,.65)',
                  padding:[0,0,40,0],
              },
              rich: {
                  //富文本 对字体进一步设置样式。title对应的运转率,val对应的 value
                  title: {
                      fontSize: 14,
                      fontWeight: "400",
                      lineHeight:30,
                  },
                  val: {
                      fontSize: 18,
                      fontWeight: "bold"
                  }
              }
          }
       },
      },
      ]

};

  return option;
  }
  render() {
    const {
      CSYXLoading,
      YZLoading, CBLoading, GZLoading,
      LwLoading
    } = this.props;
    const {CSYXRateTime,TVisible,TBpollutantType,regionVisible,networkVisible,networkType, networkingRate, networkingCount, offLineCount,pointCount} = this.state;
    return (
      <div style={{ width: '100%' }} className={styles.brokenLine}  >
           {
              TVisible ?
                <TransmissionefficiencyModal 
                 beginTime={moment(CSYXRateTime[0]).format("YYYY-MM-DD 00:00:00")}
                 endTime={moment(CSYXRateTime[1]).format("YYYY-MM-DD 23:59:59")}
                 TVisible={TVisible} 
                 TCancle={() => {
                  this.setState({ TVisible: false });
                }} 
                pollutantType={TBpollutantType}
                /> : null}
              {regionVisible?  <Region  regionVisible={regionVisible} regionCancel={this.regionCancel}/> : null}
        <Row type='flex' justify='space-between'>
          <Col span={6}>
            <Card  title={this.cardTitle("有效传输率", "CSYX")} className={styles.lineCard} bodyStyle={{ background: "#fff", height: 244 }} bordered={false} >
              <Skeleton loading={CSYXLoading} active paragraph={{ rows: 5 }}>
                <ReactEcharts
                  option={this.getChartData("CSYX")}
                  className="echarts-for-echarts"
                  theme="my_theme"
                  style={{ height: 220 }}
                />
              </Skeleton>
            </Card>
          </Col>
           {/* <Col span={6} style={{ padding: '0 10px' }}>
            <Card title={this.cardTitle("运转率", "YZ")} className={styles.lineCard} bodyStyle={{ background: "#fff", height: 244 }} bordered={false} >
              <Skeleton loading={YZLoading} active paragraph={{ rows: 5 }}>
                <ReactEcharts
                  option={this.getChartData("YZ")}
                  className="echarts-for-echarts"
                  theme="my_theme"
                  style={{ height: 220 }}
                />
              </Skeleton>
            </Card>
          </Col>  */}
          {/* <Col   style={{ paddingRight: '10px' }} span={6}> */}
          <Col  style={{ padding: '0 10px' }}  span={6}>
            <Card title={this.cardTitle("超标率", "CB")} className={styles.lineCard} bodyStyle={{ background: "#fff", height: 244 }} bordered={false} >
              <Skeleton loading={CBLoading} paragraph={{ rows: 5 }} active>
                <ReactEcharts
                  option={this.getChartData("CB")}
                  className="echarts-for-echarts"
                  theme="my_theme"
                  style={{ height: 220 }}
                />
              </Skeleton>
            </Card>
          </Col>
          <Col   style={{ paddingRight: '10px' }} span={6}>
          {/* <Col  span={6}> */}
            <Card title={this.cardTitle("故障率", "GZ")} className={styles.lineCard} bodyStyle={{ background: "#fff", height: 244 }} bordered={false} >
              <Skeleton loading={GZLoading} paragraph={{ rows: 5 }} active>
                <ReactEcharts
                  option={this.getChartData("GZ", "GZ")}
                  className="echarts-for-echarts"
                  theme="my_theme"
                  style={{ height: 220 }}
                />
              </Skeleton>
            </Card>
          </Col>
            <Col span={6}>
            <Card title={this.cardLwTitle("实时联网率", "LW")} className={styles.lineCard} bodyStyle={{ background: "#fff", height: 244 }} bordered={false} >
              <Skeleton loading={LwLoading} paragraph={{ rows: 5 }} active>
                <Row style={{height:'100%'}} align='middle'>
                <Col span={12}  style={{height:'100%'}}>
                <ReactEcharts
                  option={this.getLwChartData(networkingRate)}
                  className="echarts-for-echarts"
                  theme="my_theme"
                  style={{ height: '100%',width:'100%' }}
                />
                 </Col>
                 
                 <Col span={12} className={styles.networkSty} style={{fontSize:15}}>
                   <div style={{fontWeight:'bold',paddingBottom:15}}>{networkType==="1"? '废水统计':'废气统计'}</div>
                  <div style={{paddingBottom:10}}>监测点统计：<span style={{display:'inline-block',width:'35px'}}>{pointCount}</span>个</div>
                   <div style={{paddingBottom:10}}>联网监测点：<span style={{display:'inline-block',width:'35px'}}>{networkingCount}</span>个</div>
                   <div style={{paddingBottom:10}}>未联网测点：<span style={{display:'inline-block',width:'35px'}}>{offLineCount}</span>个</div>
                  </Col>
                </Row>
              </Skeleton>
            </Card>
          </Col>  
        </Row>
        {  //联网率
                networkVisible &&
                <NetworkRateStatisticsModal 
                networkRateVisible={networkVisible} 
                networkType={networkType}
                networkRateCancel={() => {
                  this.setState({ networkVisible: false });
                }} 
                />}
      </div>
    );
  }
}
