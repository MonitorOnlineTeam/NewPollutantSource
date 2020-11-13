
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
  Avatar
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../style.less'
import ExceedDataAlarm from '@/pages/dataSearch/exceedDataAlarmRecord/exceedDataAlarmModal'

const { Meta } = Card;
const pageUrl = {
  updateState: 'home/updateState',
  getData: 'home/getOverDataRate',
};
let myMar = null;
@connect(({ loading, home, autoForm }) => ({
  alarmDataList: home.alarmDataList,
  loading: loading.effects["home/getAlarmDataList"]
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alarmVisible:false
    }
  }

  componentDidMount() {
    this.initData()
  }

  componentDidUpdate() {

  }

  // 获取实时报警数据
  getAlarmDataList = () => {
    this.props.dispatch({
      type: "home/getAlarmDataList",
      payload: {
        BeginTime: moment().subtract(1, "day").format("YYYY-MM-DD 00:00:00"),
        EndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      }
    })
  }

  initData = () => {
    this.getAlarmDataList();
    this.scrollImgLeft()
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.loading === false && prevProps.loading === true && this.props.alarmDataList.length>3) {
      this.scrollImgLeft()
    }
  }

  // 横向滚动
  scrollImgLeft() {
    let _this = this;
    let speed = 30; //滚动速度

    let scroll_begin = document.getElementById("scroll_begin");
    let scroll_end = document.getElementById("scroll_end");
    let scroll_div = document.getElementById("scroll_div");
    if(scroll_begin){
      scroll_end.innerHTML = scroll_begin.innerHTML;

      myMar = setInterval(_this.marquee.bind(_this, scroll_end, scroll_div, scroll_begin), speed);
      scroll_div.onmouseover = function () {
        clearInterval(myMar);
      }
      scroll_div.onmouseout = function () {
        myMar = setInterval(_this.marquee.bind(_this, scroll_end, scroll_div, scroll_begin), speed);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(myMar);
  }

  marquee(scroll_end, scroll_div, scroll_begin) {
     //滚动的长度大于div的长度
    //  console.log(scroll_end.offsetWidth,scroll_end.offsetWidth)
    if (scroll_end.offsetWidth - scroll_div.scrollLeft <= 0) { //当滚动至scroll_begin与scroll_end交界时
      // scroll_div.scrollLeft = 0; //scroll_div 跳到最左端
      scroll_div.scrollLeft = scroll_div.scrollLeft - scroll_end.offsetWidth
    } else {
      scroll_div.scrollLeft = scroll_div.scrollLeft + 1;
    }
  }
  overAlarm=()=>{
    this.setState({alarmVisible:true})
  }
  realTime=()=>{
    return <span style={{cursor:'pointer'}}  onClick={this.overAlarm}>当日超标报警</span>
    
  }
  render() {
    const {
      alarmDataList,
      loading
    } = this.props;
    const {alarmVisible} = this.state;
    return (
      <div style={{ width: '100%' }} className={styles.realTimeAlarm}>

        <Card title={this.realTime()}  style={{ width: '100%' }} bordered={false} >
          <Skeleton loading={loading} avatar active>
             {/* <Row id='scroll_div' type="flex" style={{ overflowX: 'auto', flexFlow: 'row nowrap', flexShrink: 0 }}>
              <div id='scroll_begin'>
                <Row type="flex" style={{flexFlow: 'row nowrap', flexShrink: 0, width: 'calc(100vw - 80px)'}}>
                  {alarmDataList.map((item, index) => {
                    return <Row type="flex" align='middle' className={styles.alarmTotal}>
                      <Avatar size={64} src={'/overalarm.png'} />
                      <div className={styles.alarmContent}>{item.content}</div>
                      {
                        item.verify ? <img src='/verify.png' style={{ padding: '0 0 10px 5px' }} />
                        : <img src='/daiheshi.png' style={{ padding: '0 0 10px 5px' }} />
                      }
                      { index+1 < alarmDataList.length? <div className={styles.hr}></div> : null}
                    </Row>
                  })}
                </Row>
              </div>
              <div id='scroll_end'> 
              </div>
            </Row>  */}
            <Row id='scroll_div'  style={{position:'static',whiteSpace: "nowrap", overflowX:'hidden'}}>
            <div id='scroll_begin' style={{display:'inline-block'}}>
              {alarmDataList.map((item, index) => {
                    return <div style={{display:'inline-block',padding:'10px 0 6px 0',position:'relative',width: 'calc(100vw / 3)'}}>
                       <div style={{
                          display:'inline-block'}}>  
                          <Avatar size={64} src={'/overalarm.png'} /> 
                           </div>  
                       <div style={{
                          display:'inline-block',
                         	whiteSpace: 'pre-wrap',
                           wordBreak: 'break-all',
                           verticalAlign: 'middle',
                           width:'58%',
                           paddingLeft:23
                       }}>{item.content}</div>
                        {
                        item.verify ? <img src='/verify.png' style={{ padding: '0 0 10px 5px' }} />
                        : <img src='/daiheshi.png' style={{ padding: '0 0 10px 5px' }} />
                      }
                       { index+1 < alarmDataList.length ||alarmDataList.length>3 ? <div
                       style={{display:'inline-block'}}
                        className={styles.hr}></div> : null}
                       </div>
                  })}
              </div>
              <div id='scroll_end' style={{display:'inline-block'}}>
              </div>
            </Row>  
          </Skeleton>      
          {alarmVisible? <ExceedDataAlarm
           dateTime={[moment().startOf('day'),
               moment()]} alarmType={''}  alarmVisible={alarmVisible} alarmCancle={()=>{
                    this.setState({alarmVisible:false});
                }}/>:null}
        </Card>
      </div>
    );
  }
}
