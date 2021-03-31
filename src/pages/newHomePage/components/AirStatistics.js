
/**
 * 功  能：首页
 * 创建人：贾安波
 * 创建时间：2020.10
 */
import React, { Component } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
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
import ScrollTable from './ScrollTable'
import FlowModal from '@/pages/IntelligentAnalysis/sewageDisposal/flow/flowModal'

const { Meta } = Card;
const { TabPane } = Tabs;
const pageUrl = {
  updateState: 'home/updateState',
  getData: 'home/getOverDataRate',
};
@connect(({ loading, home, autoForm,removalFlowRate }) => ({
  airDayReportData: home.airDayReportData,
  getAQIList:home.getAQIList,
  getAQILoading: home.getAQILoading,
  airDayReportloading:home.airDayReportloading,
  priseList: home.priseList,
  getSewageFlowList: home.getSewageFlowList,
  getSewageFlowLoading: home.getSewageFlowLoading,
  waterType:home.waterType
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      EntCode:'',
      dataTypes:'HourData',
      airTime:moment().add('hour',-1).format('YYYY-MM-DD HH:00:00'),
      airDate:moment().add('day',-1).format("YYYY-MM-DD"),
      flowVisible:false
    }

  }

  componentDidMount() {
    this.initData()
  }
  componentDidUpdate() {

  }

  initData = () => {
    this.getAirDayReportData();
    this.props.dispatch({
      type: 'home/getEntByRegion',
      payload: { RegionCode: '' },
      callback: (code) => {
        this.setState({EntCode:code},()=>{
          this.getLineData(code);
        })
      }

    });//获取企业列表
    //  let _this = this;
    //   this.timer=setInterval(()=>{
    //       _this.setState({
    //         airTime:moment().add('hour',-2).format('YYYY-MM-DD HH:mm:ss')
    //       })
    // },1000)
  }
 componentWillUnmount(){
   clearInterval(this.timer)
 }
  // 获取空气日报统计数据
  getAirDayReportData = () => {
    this.props.dispatch({
      type: "home/getAirDayReportData",
      payload: {
        MonitorTime: moment().add('day',-1).format("YYYY-MM-DD 00:00:00")
      }
    })

    let time = moment().add('hour',-1).format("YYYY-MM-DD HH:00:00");
    // let time = "2020-11-01 00:00:00";
    let dataType ='HourData'
    this.getAQIList(time,dataType);
   
  }
  getAQIList=(time,type)=>{
    this.props.dispatch({
      type: "home/getAQIList",
      payload: {
        MonitorTime: time,
        DataType:type
      }
    })
  }
  getLineData=(data)=>{
    let parData ={
      BeginTime:moment().add('day',-30).format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD 23:59:59'),
      DataType:'DayData',
    };
    this.props.dispatch({
      type: "home/getSewageFlowList",
      payload: {  ...parData,EntCode:data}
    })
  }
  /**
 * @introduction 把数组中key值相同的那一项提取出来，组成一个对象
 * @description 详细描述
 * @param {参数类型} array 传入的数组 [{a:"1",b:"2"},{a:"2",b:"3"}]
 * @param {参数类型} key  属性名 a
 * @return {返回类型说明}
 * @exception [违例类型] [违例类型说明]
 */
  array2obj = (array, key) => {
    var resObj = {}
    for (var i = 0; i < array.length; i++) {
      resObj[array[i][key]] = array[i]
    }
    return resObj
  }



  cardTitle1 = () => {
    return <Row type='flex' justify='space-between'>
      <span style={{ color: '#fff' }}>空气日报统计</span>
      <span style={{ color: '#fff', fontWeight: 'bold' }}>{moment().add(-1,'days').format("YYYY-MM-DD")}</span>
    </Row>
  }

  cardTitle2 = () => {
    const ButtonGroup = Button.Group;
    const {dataTypes,airTime,airDate} = this.state;
    return <Row type='flex' align="middle" justify='space-between'>
      <span>{dataTypes=='HourData'? '空气质量实时数据' :'空气质量日数据'}</span>
      <Row type='flex' align="middle" >
      <span style={{color:'#666',paddingRight:20}}>{dataTypes=='HourData'? airTime:airDate}</span>
      <Tabs defaultActiveKey="1" onChange={this.tabCallback}>
        <TabPane tab="实时" key="HourData">
        </TabPane>
        <TabPane tab="日报" key="DayData">
        </TabPane>
      </Tabs>
      </Row>

    </Row>
  }

  cardTitle3 = () => {
    return (
      <Row type='flex' align="middle" justify='space-between'>
        <span style={{cursor:'pointer'}} onClick={this.flow}>
          污水处理厂流量分析
          <CaretRightOutlined style={{fontSize:14,paddingLeft:3}} />
          </span>
        <Tabs defaultActiveKey="1">
          <TabPane tab="近30天" key="1">
          </TabPane>
        </Tabs>

      </Row>
    );
  }
  flow=()=>{
    this.setState({
      flowVisible:true
    })
  }
  tabCallback = (value) => {
  let time = value == 'HourData'? moment().add('hour',-1).format("YYYY-MM-DD HH:00:00") : moment().add('day',-1).format("YYYY-MM-DD 00:00:00")
   
  if(value == 'HourData'){
   this.setState({dataTypes:'HourData'})
  }else{
    this.setState({dataTypes:'DayData'})

  }
   
  this.props.dispatch({
      type: "home/getAQIList",
      payload: {
        MonitorTime: time,
        DataType:value
      }
    })
  }

  getLineChartData = () => {

    let { getSewageFlowList,waterType } = this.props;
   
    let backValue ='',exportValue='', importValue=''
    waterType&&waterType.length>0&&getSewageFlowList&&getSewageFlowList.length>0?waterType.map(item=>{
      if(item=='回水口'){
        backValue = getSewageFlowList.map(item=>{
          return item.backValue
       }) 
      }
      if(item=='出水口'){
        exportValue = getSewageFlowList.map(item=>{
          return item.exportValue
         })
      }

      if(item=='进水口'){
        importValue = getSewageFlowList.map(item=>{
          return item.importValue
         })
      }
    }):null;
     
  

     let MonitorTime = getSewageFlowList.map(item=>{
      return moment(item.MonitorTime).format("MM.DD")
     }) 
    let color = ['#64b0fd', '#9d6ff1', '#42dab8']
    let option = {
      color: ['#64b0fd', '#9d6ff1', '#42dab8'],
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: waterType&&waterType.length>=0? waterType:[],
        left: 'center',
        bottom: 10,
        icon: 'rect',
        itemWidth: 20,//图例的宽度
        itemHeight: 10,//图例的高度
        textStyle: {//图例文字的样式
          color: '#333',
        }
      },
      grid: {
        top: 30,
        left: 60,
        right: 20,
        bottom: 60,
        // containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: MonitorTime,
        axisLine: { //x轴
          lineStyle: {
            color: '#d9d9d9',   
            
            width: 1
          },
        },
        axisLabel: {
          textStyle: {
            color: '#999',
          },
        },
      },
      yAxis: {
        name: '(m³)          ',
        nameTextStyle: {
          color: '#999',
        },
        type: 'value',
        axisLine: { show: false, }, //y轴
        axisTick: { show: false },
        axisLabel: {
          formatter: '{value}',
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
      series: [

        {
          name: '进水口',
          type: 'line',
          data: importValue,
          showSymbol: false,//隐藏所有数据点
          // smooth: true,
        },
        {
          name: '回水口',
          type: 'line',
          data: backValue,
          showSymbol: false,
          // smooth: true,
        },
        {
          name: '出水口',
          type: 'line',
          data: exportValue,
          showSymbol: false,
          // smooth: true,
        },
      ]
    };
    return option;
  }

  getPancakeChartData = () => {
    let objData = this.array2obj(this.props.airDayReportData.datas, 'name')
    // console.log("objData-", objData)
    let option = {
      color: ["#4bd075", "#fdd22b", "#f39d16", "#f17170", "#d15695", "#a14458", "#000000"],
      grid: {
        // top: 20,
        top: '-20%',
        left: '-20%',
        // right: '24%',
        bottom: '-20%',
        // containLabel: true
      },
      title: [{
        text: this.props.airDayReportData.allCount,
        x: '26%',
        y: '30%',
        textStyle: {
          fontWeight: 'normal',
          color: '#000',
          fontSize: '36',
          lineHeight: 60
        }
      },
      {
        text: "空气站(个)",
        x: '21%',
        y: '46%',
        textStyle: {
          fontWeight: 'normal',
          color: '#333',
          fontSize: '16',
          lineHeight: 60
        }
      },],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        itemWidth: 18,
        itemHeight: 10,
        borderRadius: 0,
        icon: 'rect',
        right: 5,
        itemGap: 13.5,
        y:'center',
        data: ['优', '良', '轻度', '中度', '重度', '严重', '爆表'],
        formatter: function (name) {
          return `{title|${name}}{shu||}{rate|${objData[name].rate}%}{value|${objData[name].value}个}`
        },
        textStyle: {
          rich: {
            shu: {   
              color: '#d2d2d2',
              padding: [0, 1, 0, 2]
            },
            title: {
              width: 30,
              fontSize: 14,
            },
            rate: {
              color: '#666',
              fontSize: 14,
              width: 30,
              padding: [0, 25, 0, 2]
            },
            value: {
              color: '#000',
              fontSize: 14,
              // fontWeight: 600,
              // fontFamily: 'HuaKang',
              // padding: [0, 50, 0, 0]
            },
          }
        }
      },
      series: [
        {
          name: '空气日报统计',
          type: 'pie',
          radius: ['60%', '75%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false,
              fontSize: '30',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.props.airDayReportData.datas
        }
      ]
    };
    return option;
  }


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
  
  changeEnt=(value)=>{
    this.setState({EntCode:value},()=>{
      this.getLineData(value)
    })
   
  }

  render() {
    const { realTimeAlarmLoading,getAQIList,getAQILoading,airDayReportloading,getSewageFlowLoading} = this.props;
    const {EntCode,flowVisible } = this.state;
    return (
      <div style={{ width: '100%' }} className={styles.airStatistics}  >
        <Row type='flex' justify='space-between' >
          <Col span={6}>
            <Card title={this.cardTitle1()} className={styles.airCard} bordered={false} >
              <Skeleton loading={airDayReportloading} paragraph={{ rows: 5   }} active>
                <ReactEcharts
                  option={this.getPancakeChartData()}
                  className="echarts-for-echarts"
                  theme="my_theme"
                  style={{ height: 235}}
                />
              </Skeleton>
            </Card>
          </Col>
          <Col span={12} className={styles.airTableCard}>
            <Card title={this.cardTitle2()} bordered={false} >
              <Skeleton loading={getAQILoading} paragraph={{ rows: 5   }} active>
                <ScrollTable type='airStatistics' data={getAQIList}  column={['大气站','监测点','首要污染物','等级','AQI']}/>
              </Skeleton>
            </Card>
          </Col>
          <Col span={6}>
            <Card title={this.cardTitle3()} bordered={false} className={styles.airLineCard}>
              <Skeleton loading={getSewageFlowLoading} paragraph={{ rows: 5   }}  active>
               <Row type='flex' justify='end'>
                  <Select
                    size={'small'} 
                    showSearch
                    optionFilterProp="children"
                    placeholder="污水处理厂名称"
                    onChange={this.changeEnt}
                    value={EntCode ? EntCode : undefined}
                    style={{ width: 200 }}
                  >
                    {this.children()}
                  </Select>
               </Row>
                <ReactEcharts
                  option={this.getLineChartData()}
                  className="echarts-for-echarts"
                  theme="my_theme"
                  style={{ height: 210 }}
                />
              </Skeleton>
            </Card>
          </Col>
        </Row>
        {flowVisible ? <FlowModal flowTime={[moment().add(-30, "day").startOf(), moment()]} flowEntCode={EntCode} flowVisible={flowVisible} flowCancle={() => {
              this.setState({ flowVisible: false });
            }} /> : null}
      </div>
    );
  }
}
