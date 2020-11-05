
/**
 * 功  能：首页
 * 创建人：贾安波
 * 创建时间：2020.11
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
 menu = ()=>{
   return  <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a>
      </Menu.Item>
    </Menu>
 }
cardTitle=()=>{

  return  <Row type='flex' align="middle" justify='space-between'> 
            <Dropdown overlay={this.menu()} trigger={['click']}>
            <span  onClick={e => e.preventDefault()}>
              点击我 <Icon type="caret-down" style={{color:'#cbcbcb'}}/>
             </span>
          </Dropdown>
          <Tabs defaultActiveKey="1" onChange={this.tabCallback}>
             <TabPane tab="近7天" key="1">
             </TabPane>
             <TabPane tab="近30天" key="2">
                </TabPane>
            </Tabs>
            
          </Row>
}

tabCallback=(value)=>{
  console.log(value)
}
getChartData=()=>{

    let color=['#64b0fd','#9d6ff1','#42dab8']
 let  option = {
       color:['#64b0fd','#9d6ff1','#42dab8'],
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['邮件营销', '联盟广告', '视频广告'],
            left:'center',
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
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine:{ //x轴
                 lineStyle:{
                 color:'#d9d9d9',
                  width: 1
                 },
             },
             axisLabel : {
                textStyle: {
                    color: '#999'
                }
            },
        },
        yAxis: {
            type: 'value',
            axisLine: {show:false, }, //y轴
            axisTick: {show:false}, 
            axisLabel : {
                formatter: '{value}',
                textStyle: {
                    color: '#999'
                }
            },
            splitLine:{  //x轴分割线
                 lineStyle:{
                 type: 'dashed' ,
                 color:'#e9e9e9',
                  width: 1
                 }
             }
        },
        series: [

            {
                name: '邮件营销',
                type: 'line',
                data: [120, 132, 101, 134, 90, 230, 210],
                showSymbol: false,//隐藏所有数据点
                smooth: true,
            },
            {
                name: '联盟广告',
                type: 'line',
                data: [220, 182, 191, 234, 290, 330, 310],
                showSymbol: false,
                smooth: true,
            },
            {
                name: '视频广告',
                type: 'line',
                data: [150, 232, 201, 154, 190, 330, 410],
                showSymbol: false,
                smooth: true,
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
        <div style={{width:'100%'}} className={styles.brokenLine}  >
         <Row type='flex' justify='space-between'>
         <Col span={6}>  
         <Card title={this.cardTitle()} className={styles.lineCard} bordered={false} >
          <Skeleton loading={realTimeAlarmLoading} avatar active>
             <ReactEcharts
                 option={this.getChartData()}
                        className="echarts-for-echarts"
                        theme="my_theme"
                        style ={{height:220}}
                      />
          </Skeleton>
        </Card>
        </Col>
        <Col span={6}  style={{padding:'0 10px'}}>  
        <Card title={this.cardTitle() } className={styles.lineCard} bordered={false} >
          <Skeleton loading={realTimeAlarmLoading} avatar active>
          </Skeleton>
        </Card>
        </Col>
        <Col style={{paddingRight:'10px'}} span={6}>  
        <Card title={this.cardTitle() } className={styles.lineCard} bordered={false} >
          <Skeleton loading={realTimeAlarmLoading} avatar active>
          </Skeleton>
        </Card>
        </Col>
        <Col span={6}>  
        <Card title={this.cardTitle() } className={styles.lineCard}  bordered={false} >
          <Skeleton loading={realTimeAlarmLoading} avatar active>
          </Skeleton>
        </Card>
        </Col>
        </Row>
       </div>
    );
  }
}
