
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
           <span style={{color:'#fff'}}>废气监测点</span>
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

getChartData=(type)=>{
    let color1 = ["#42dab8","#7ef1d7"],
        color2 = ["#fdcb31",'#fde290'],
        color3 = ['#3b4b85','#56659c']
    let option = {
        tooltip: {
            show:false,
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color:type==1? color1 : type==2? color2 : color3 ,
        title:{
            text:"80%",
            left:"center",
            top:"45%",
            textStyle:{
                color: type==1? color1[1] : type==2? color2[1] : color3[1],
                fontSize:16,
                align:"center"
            }
        },
        // graphic:{
        //     type:"text",
        //     left:"center",
        //     top:"20%",
        //     style:{
        //         text:"运动达标率",
        //         textAlign:"center",
        //         fill:"#333",
        //         fontSize:20,
        //         fontWeight:700
        //     }
        // },
        series: [
            {
                name: type==1?'数据超标报警核实率':type==2? '数据异常报警响应率' : '数据缺失报警响应率',
                type: 'pie',
                // center: ['50%', '50%'],
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                   
                },
                
                data: [
                    { value: 80, name: '已完成' },
                    { value: 20, name: '未完成' },
                   
                ]
            }
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
        <div style={{width:'100%'}}  className={`${styles.wasteWaterPoint} ${styles.wasteGasPoint}`}  >
         <Row type='flex' justify='space-between' >

         <Col span={6}>  
         <Card  title={this.cardTitle1()} className={`${styles.wasteWateCard} ${styles.wasteGasCard}`} bordered={false} >
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
         <Card title={this.cardTitle3()} className={styles.alarmCard}  bordered={false} >
          <Skeleton loading={realTimeAlarmLoading} avatar active>
        
             <Row type='flex' align='middle' justify='space-between'>
              <Col span={8} align='middle'>
               <ReactEcharts
                  option={this.getChartData(1)}
                        className="echarts-for-echarts"
                        theme="my_theme"
                        style ={{width:'100%',height:120}}
                      />
                 <div>
                <div className={styles.title1}>核实率</div>
                <div className={styles.title2}>数据超标报警</div>
                </div>
                </Col>
                <Col span={8} align='middle'>
               <ReactEcharts
                  option={this.getChartData(2)}
                        className="echarts-for-echarts"
                        theme="my_theme"
                        style ={{width:'100%',height:120}}
                      />
                 <div>
                <div className={styles.title1}>核实率</div>
                <div className={styles.title2}>数据超标报警</div>
                </div>
                </Col>
                <Col span={8} align='middle'>
               <ReactEcharts
                  option={this.getChartData(3)}
                        className="echarts-for-echarts"
                        theme="my_theme"
                        style ={{width:'100%',height:120}}
                      />
                 <div>
                <div className={styles.title1}>核实率</div>
                <div className={styles.title2}>数据超标报警</div>
                </div>
                </Col>
            </Row>
          </Skeleton>
        </Card>
        </Col>
        </Row>
       </div>
    );
  }
}
