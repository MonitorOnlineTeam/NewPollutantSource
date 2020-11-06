
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
 pointStatusLoading:home.pointStatusLoading,
 dataQueryPar:home.dataQueryPar,
 wasteGasStatusList:home.wasteGasStatusList,
 overWasteGasLoading:home.overWasteGasLoading,
 overWasteGasList:home.overWasteGasList,
 alarmResponseList:home.alarmResponseList,
 alarmResponseLoading:home.alarmResponseLoading,
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overListPar:{
        PollutantType:2,
        BeginTime:moment().add('day',-7).format('YYYY-MM-DD 00:00:00'),
        EndTime: moment().format('YYYY-MM-DD 23:59:59'),
        pollutantCode:'01',
        DataType:'HourData'
      }
    }
    
}

componentDidMount () {

  this.initData()



}
componentDidUpdate() {

}
initData=()=>{
  const {dataQueryPar,dispatch} = this.props;
  let pointStatusPar ={ ...dataQueryPar,PollutantType:2};
  dispatch({ type: 'home/getPointStatusList', payload: { ...pointStatusPar },  });//监测点状态
  dispatch({ type: 'home/getAlarmResponse', payload: { ...dataQueryPar, BeginTime:moment().add('day',-7).format('YYYY-MM-DD 00:00:00'), EndTime: moment().format('YYYY-MM-DD 23:59:59'),   } });//数据报警响应

  
  const { overListPar } = this.state;
  this.getTableData(overListPar);
}

getTableData=(par)=>{
  const { dispatch } = this.props;
  dispatch({ type: 'home/getOverList', payload: { ...par },  });//超标监测点
}

btnChange=(e)=>{
  btnChange=(e)=>{

    const { overListPar } = this.state;
    
    let parData = {...overListPar,DataType:e.target.value}
    
     this.setState({overListPar:parData},()=>{
       this.getTableData(parData) ;
     })
  }
}
 cardTitle1=()=>{
   const { wasteGasStatusList } = this.props;
   return <Row type='flex' justify='space-between'> 
           <span style={{color:'#fff'}}>废气监测点</span>
            <span style={{color:'#fff',fontWeight:'bold'}}>{`${wasteGasStatusList.totalCount?wasteGasStatusList.totalCount:0}个`}</span>
         </Row>
 }
cardTitle2=()=>{
    const ButtonGroup = Button.Group;
  return  <Row type='flex' align="middle" justify='space-between'> 
           <span>近七日超标废气监测点</span>
           <Radio.Group value={"large"} onChange={this.btnChange} size='small'>
          <Radio.Button value="large">小时</Radio.Button>
          <Radio.Button value="default">日均</Radio.Button>
        </Radio.Group>
          <Tabs defaultActiveKey="01" onChange={this.tabCallback1}>
             <TabPane tab="烟尘" key="01">
             </TabPane>
             <TabPane tab="二氧化硫" key="02">
            </TabPane>
            <TabPane tab="二氧化氮" key="03">
            </TabPane>
            </Tabs>
            
          </Row>
}
cardTitle3=()=>{

    return  <Row type='flex' align="middle" justify='space-between'> 
               <span>数据报警响应统计</span>
            <Tabs defaultActiveKey="1" onChange={this.tabCallback2}>
            <TabPane tab="近7天" key="1">
             </TabPane>
             <TabPane tab="近30天" key="2">
            </TabPane>
              </Tabs>
              
            </Row>
  }
tabCallback1=(value)=>{
  const { overListPar } = this.state;
  
  let parData = {...overListPar,pollutantCode:value}
  
   this.setState({overListPar:parData},()=>{
     this.getTableData(parData);
   })
}
tabCallback2=(value)=>{
  const { dispatch,dataQueryPar } = this.props;
  
  let parData ={ ...dataQueryPar,
    BeginTime:value==1?moment().add('day',-7).format('YYYY-MM-DD 00:00:00'):moment().add('day',-30).format('YYYY-MM-DD 00:00:00'),
    EndTime: moment().format('YYYY-MM-DD 23:59:59'),
  };


  dispatch({ type: 'home/getAlarmResponse', payload: { ...parData } });//数据报警响应

}
percentage=(data)=>{
  return `${data}%`
}
getChartData=(type)=>{
   const { alarmResponseList } = this.props;
    let color1 = ["#42dab8","#7ef1d7"],
        color2 = ["#fdcb31",'#fde290'],
        color3 = ['#5169c5','#889be2']
    let option = {
        tooltip: {
            show:false,
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color:type==1? color1 : type==2? color2 : color3 ,
        title:{
            text: type==1?this.percentage(alarmResponseList.operationRate) : type==2?  this.percentage(alarmResponseList.exceptionRate): this.percentage(alarmResponseList.missRate),
            left:"center",
            top:"42%",
            textStyle:{
                color: type==1? color1[1] : type==2? color2[1] : color3[1],
                fontSize:16,
                align:"center",
                fontWeight:400
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
                    { value: type==1?alarmResponseList.operationRate : type==2?  alarmResponseList.exceptionRate: alarmResponseList.missRate, name: '已完成' },
                    { value: type==1?(100-alarmResponseList.operationRate) : type==2?  (100-alarmResponseList.exceptionRate): (100-alarmResponseList.missRate), name: '未完成' },
                   
                ]
            }
        ]
    };
    return option;
}
  render() {
    const {
      pointStatusLoading,
      wasteGasStatusList,
      overWasteGasLoading,
      overWasteGasList,
      alarmResponseLoading
    } = this.props;

  const { list } = this.state;

    return (
        <div style={{width:'100%'}}  className={`${styles.wasteWaterPoint} ${styles.wasteGasPoint}`}  >
         <Row type='flex' justify='space-between' >

         <Col span={6}>  
         <Card  title={this.cardTitle1()} className={`${styles.wasteWateCard} ${styles.wasteGasCard}`} bordered={false} >
          <Skeleton loading={pointStatusLoading}  active paragraph={{ rows: 5   }}>
            <ul className={styles.listSty}>
    <li><Row type='flex' justify='space-between'><div><img src='/chaobiaobaojing.png' />超标报警</div> <span style={{background:'#f25fc7'}} className={styles.colorBlock}>{wasteGasStatusList.alarmCount}</span></Row></li>
              <li><Row type='flex' justify='space-between'><div><img src='/chaobiao.png' />超标</div> <span style={{background:'#f0565d'}} className={styles.colorBlock}>{wasteGasStatusList.overCount}</span></Row></li>

              <li><Row type='flex' justify='space-between'><div><img src='/lixian.png' />离线</div> <span style={{background:'#f5a86a'}} className={styles.colorBlock}>{wasteGasStatusList.unLine}</span></Row></li>

              <li><Row type='flex' justify='space-between'><div><img src='/guzhang.png' />异常</div> <span style={{background:'#bdc4cc'}} className={styles.colorBlock}>{wasteGasStatusList.exceptionCount}</span></Row></li>
              <li><Row type='flex' justify='space-between'><div><img src='/tingyun.png' />停运</div> <span style={{background:'#40474e'}} className={styles.colorBlock}>{wasteGasStatusList.stopCount}</span></Row></li>

            </ul>
          </Skeleton>
        </Card>
        </Col>
        <Col span={12}  className={styles.sevenCard}>  
         <Card title={this.cardTitle2()} bordered={false} >
          <Skeleton loading={overWasteGasLoading}  active paragraph={{ rows: 5   }}>
           <ScrollTable  type='wasteGas' data={overWasteGasList} column={['市师','企业名称','监测点名称','最大超标倍数']}/>
          </Skeleton>
        </Card>
        </Col>
        <Col span={6}>  
         <Card title={this.cardTitle3()} className={styles.alarmCard}  bordered={false} >
          <Skeleton loading={alarmResponseLoading}  active paragraph={{ rows: 4   }}>
        
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
                <div className={styles.title1}>响应率</div>
                <div className={styles.title2}>数据异常报警</div>
                </div>
                </Col>
                <Col span={8} align='middle'>
               <ReactEcharts
                  option={this.getChartData(3)}
                        className="echarts-for-echarts"
                        theme="my_theme"
                        style ={{width:'100%',height:122}}
                      />
                 <div>
                <div className={styles.title1}>响应率</div>
                <div className={styles.title2}>数据缺失报警</div>
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
