
/**
 * 功  能：首页
 * 创建人：贾安波
 * 创建时间：2020.10
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
  Tabs,
  Radio,
  Checkbox,
  message,
  Skeleton,
  Avatar,
  Dropdown,
  Menu
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../style.less'
import ReactEcharts from 'echarts-for-react';
import ScrollTable from './ScrollTable'
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
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      EntCode:''
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
   
  }

  // 获取空气日报统计数据
  getAirDayReportData = () => {
    this.props.dispatch({
      type: "home/getAirDayReportData",
      payload: {
        MonitorTime: moment().format("YYYY-MM-DD HH:mm:ss")
      }
    })
    this.props.dispatch({
      type: "home/getAQIList",
      payload: {
        DataType: 'HourData'
      }
    })
  }

  getLineData=(data)=>{
    let parData ={
      BeginTime:moment().add('day',-30).format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD 23:59:59'),
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
      <span style={{ color: '#fff', fontWeight: 'bold' }}>{moment().format("YYYY-MM-DD")}</span>
    </Row>
  }

  cardTitle2 = () => {
    const ButtonGroup = Button.Group;
    return <Row type='flex' align="middle" justify='space-between'>
      <span>空气质量实时数据</span>
      <Tabs defaultActiveKey="1" onChange={this.tabCallback}>
        <TabPane tab="实时" key="HourData">
        </TabPane>
        <TabPane tab="日报" key="DayData">
        </TabPane>
      </Tabs>

    </Row>
  }

  cardTitle3 = () => {
    return <Row type='flex' align="middle" justify='space-between'>
      <span>污水处理厂流量分析</span>
      <Tabs defaultActiveKey="1">
        <TabPane tab="近30天" key="1">
        </TabPane>
      </Tabs>

    </Row>
  }

  tabCallback = (value) => {
    this.props.dispatch({
      type: "home/getAQIList",
      payload: {
        DataType: value
      }
    })
  }

  getLineChartData = () => {

    const { getSewageFlowList } = this.props;
    let color = ['#64b0fd', '#9d6ff1', '#42dab8']
    let option = {
      color: ['#64b0fd', '#9d6ff1', '#42dab8'],
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['进水口', '回水口', '出水口'],
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
        top: 30,
        left: 0,
        right: 20,
        bottom: 30,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
          data: [120, 132, 101, 134, 90, 230, 210],
          showSymbol: false,//隐藏所有数据点
          // smooth: true,
        },
        {
          name: '回水口',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
          showSymbol: false,
          // smooth: true,
        },
        {
          name: '出水口',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410],
          showSymbol: false,
          // smooth: true,
        },
      ]
    };
    return option;
  }

  getPancakeChartData = () => {
    let objData = this.array2obj(this.props.airDayReportData.datas, 'name')
    console.log("objData-", objData)
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
        right: 10,
        itemGap: 21,
        data: ['优', '良', '轻度', '中度', '重度', '严重', '爆表'],
        formatter: function (name) {
          return `{title|${name}}{shu||}{rate|${objData[name].rate}%}{value|${objData[name].value}个}`
        },
        textStyle: {
          rich: {
            shu: {
              color: '#d2d2d2',
              padding: [0, 4, 0, 4]
            },
            title: {
              width: 30,
              fontSize: 14,
            },
            rate: {
              color: '#666',
              fontSize: 14,
              width: 30,
              padding: [0, 14, 0, 10]
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
    this.setState({EntCode:code},()=>{
      this.getLineData(value)
    })
   
  }

  render() {
    const { realTimeAlarmLoading,getAQIList,getAQILoading,airDayReportloading,getSewageFlowLoading} = this.props;
    const {EntCode } = this.state;
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
                  style={{ height: 235 }}
                />
              </Skeleton>
            </Card>
          </Col>
          <Col span={12} className={styles.airTableCard}>
            <Card title={this.cardTitle2()} bordered={false} >
              <Skeleton loading={getAQILoading} paragraph={{ rows: 5   }} active>
                <ScrollTable type='airStatistics' data={getAQIList}  column={['大气站','检测点','首要污染物','等级','AQI']}/>
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
      </div>
    );
  }
}