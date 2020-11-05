
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
@connect(({ loading, home,autoForm }) => ({
 realTimeAlarmLoading: home.realTimeAlarmLoading
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list:[
        {url:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',content:'Ant Design, a design language for background applications, is refined by Ant UED Team'},
        {url:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',content:'Ant Design, a design language for background applications, is refined by Ant UED Team'},
        {url:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',content:'Ant Design, a design language for background applications, is refined by Ant UED Team'},
        {url:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',content:'Ant Design, a design language for background applications, is refined by Ant UED Team'},

      ]
    }
    
}

componentDidMount () {

  this.initData()



}
componentDidUpdate() {

}
initData=()=>{

}
btnChange=(e)=>{
  console.log(e.target.value)
}
 cardTitle1=()=>{
   return <Row type='flex' justify='space-between'> 
           <span style={{color:'#fff'}}>废水监测点</span>
            <span style={{color:'#fff',fontWeight:'bold'}}>{`${15}个`}</span>
         </Row>
 }
cardTitle2=()=>{
    const ButtonGroup = Button.Group;
  return  <Row type='flex' align="middle" justify='space-between'> 
           <span>近七日超标废水监测点</span>
           <Radio.Group value={"large"} onChange={this.btnChange}>
          <Radio.Button value="large">小时</Radio.Button>
          <Radio.Button value="default">日均</Radio.Button>
        </Radio.Group>
          <Tabs defaultActiveKey="1" onChange={this.tabCallback}>
             <TabPane tab="废水" key="1">
             </TabPane>
             <TabPane tab="废气" key="2">
            </TabPane>
            <TabPane tab="空气站" key="3">
            </TabPane>
            </Tabs>
            
          </Row>
}
cardTitle3=()=>{

    return  <Row type='flex' align="middle" justify='space-between'> 
               <span>运维工单统计</span>
            <Tabs defaultActiveKey="1" onChange={this.tabCallback}>
            <TabPane tab="废水" key="1">
             </TabPane>
             <TabPane tab="废气" key="2">
            </TabPane>
            <TabPane tab="空气站" key="3">
            </TabPane>
              </Tabs>
              
            </Row>
  }
tabCallback=(value)=>{
  console.log(value)
}

getChartData=()=>{
 let  color = ['#64b0fd','#9d6ff1','#42dab8']
  let option = {
    color:['#64b0fd','#9d6ff1','#42dab8'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: ['已完成', '未完成'],
        right:0,
        bottom:0,
        icon:'rect',
        itemWidth:20,//图例的宽度
        itemHeight:10,//图例的高度
        textStyle:{//图例文字的样式
            color:'#333',
        }
    },
    grid: {
      top:20,
      left: 0,
      right: 20,
      bottom: 30,
      containLabel: true,
  },
    xAxis: {
        type: 'value',
        show:false,//不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
    },
    yAxis: {
        type: 'category',
        data: ['巡检', '校准', '维修维护', '校验测试'],
        // show:false,//不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
        axisTick:{
              show:false//不显示坐标轴刻度线
        },
        axisLine: {
              show: false,//不显示坐标轴线
        },
        // boundaryGap: true,
        axisLabel: {
              // show: false,//不显示坐标轴上的文字
              margin: 50, //刻度与轴线之间的距离
        },
    },
    series: [
        {
            name: '已完成',
            type: 'bar',
            stack: '总量',
            barWidth : 25,//柱子宽度
            label: {
                show: true,
                position: 'left',
                textStyle:{
                  color:color[0],
              },
              formatter: (params) => {
                if (params.value === 0) { return "" } else { return params.value }
              }
            },
            data: [320, 302, 301, 334, 390, 330, 320],
        },
        {
            name: '未完成',
            type: 'bar',
            stack: '总量',
            barWidth : 25,//柱子宽度
            label: {
                show: true,
                position: 'right',
                textStyle:{
                  color:color[1],
              },
              formatter: (params) => {
                if (params.value === 0) { return "" } else { return params.value }
              }
            },
            
            position:'right',
            data: [120, 132, 101, 134, 90, 230, 210]
        },

    ]
};
 
return option;
}
  render() {
    const {
        realTimeAlarmLoading
    } = this.props;

  const { list } = this.state;

    return (
        <div style={{width:'100%'}} className={styles.wasteWaterPoint}  >
         <Row type='flex' justify='space-between' >

         <Col span={6}>  
         <Card  title={this.cardTitle1()} className={styles.wasteWateCard} bordered={false} >
          <Skeleton loading={realTimeAlarmLoading} avatar active>
            <ul className={styles.listSty}>
              <li><Row type='flex' justify='space-between'><div><img src='/chaobiaobaojing.png' />超标报警</div> <span style={{background:'#f25fc7'}} className={styles.colorBlock}>40</span></Row></li>
              <li><Row type='flex' justify='space-between'><div><img src='/chaobiao.png' />超标</div> <span style={{background:'#f0565d'}} className={styles.colorBlock}>40</span></Row></li>

              <li><Row type='flex' justify='space-between'><div><img src='/lixian.png' />离线</div> <span style={{background:'#f5a86a'}} className={styles.colorBlock}>40</span></Row></li>

              <li><Row type='flex' justify='space-between'><div><img src='/guzhang.png' />故障</div> <span style={{background:'#bdc4cc'}} className={styles.colorBlock}>40</span></Row></li>
              <li><Row type='flex' justify='space-between'><div><img src='/tingyun.png' />停运</div> <span style={{background:'#40474e'}} className={styles.colorBlock}>40</span></Row></li>

            </ul>
          </Skeleton>
        </Card>
        </Col>
        <Col span={12}  className={styles.sevenCard}>  
         <Card title={this.cardTitle2()} bordered={false} >
          <Skeleton loading={realTimeAlarmLoading} avatar active>
           <ScrollTable  data={[1,2,3,4,6,6,7,7,8,89]}/>
          </Skeleton>
        </Card>
        </Col>
        <Col span={6}>  
         <Card title={this.cardTitle3()}  bordered={false} >
          <Skeleton loading={realTimeAlarmLoading} avatar active>
             <ReactEcharts
                 option={this.getChartData()}
                        className="echarts-for-echarts"
                        theme="my_theme"
                        style ={{height:215}}
                      />
          </Skeleton>
        </Card>
        </Col>
        </Row>
       </div>
    );
  }
}
