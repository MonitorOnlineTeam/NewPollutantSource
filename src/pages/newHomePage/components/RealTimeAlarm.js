
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

const { Meta } = Card;
const pageUrl = {
  updateState: 'home/updateState',
  getData: 'home/getOverDataRate',
};
let myMar = null;
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
  this.scrollImgLeft()
}
  // 横向滚动
 scrollImgLeft() {
    let _this = this;
    let speed = 50; //滚动速度

    let scroll_begin = document.getElementById("scroll_begin");
    let scroll_end = document.getElementById("scroll_end");
    let scroll_div = document.getElementById("scroll_div");
    scroll_end.innerHTML = scroll_begin.innerHTML;


    myMar = setInterval(_this.marquee.bind(_this,scroll_end,scroll_div,scroll_begin), speed);
    scroll_div.onmouseover = function() {
        clearInterval(myMar);
    }
    scroll_div.onmouseout = function() {
        myMar = setInterval(_this.marquee.bind(_this,scroll_end,scroll_div,scroll_begin), speed);
    }
 
}
componentWillUnmount(){
  clearInterval(myMar);
}
marquee(scroll_end,scroll_div,scroll_begin) {
  if (scroll_end.offsetWidth - scroll_div.scrollLeft <= 0){ //当滚动至scroll_begin与scroll_end交界时 
    scroll_div.scrollLeft -= scroll_begin.offsetWidth; //scroll_div 跳到最左端 
  }else{
    scroll_div.scrollLeft ++;
  }
}
  render() {
    const {
        realTimeAlarmLoading
    } = this.props;

  const { list } = this.state;
    return (
        <div style={{width:'100%'}} className={styles.realTimeAlarm}>
         
        <Card title="实时报警" style={{ width:'100%' }} bordered={false} >
          <Skeleton loading={realTimeAlarmLoading} avatar active>
        <Row id='scroll_div' type="flex" style={{overflowX:'hidden',flexFlow:'row nowrap', flexShrink: 0}}>
        
               <div  id='scroll_begin' >
                     <Row  type="flex" style={{width:'calc(100vw - 80px)',flexFlow:'row nowrap'}}>
                       {list.map((item,index)=>{
                         return <Row type="flex" align='middle' className={styles.alarmTotal}>
                                <Avatar size={64} src={'/overalarm.png'} />
                          <div className={styles.alarmContent}>{item.content}</div>
                         <img src='/verify.png' style={{padding:'0 0 10px 5px'}}/>
                         { index==0 || index ==1 ? <div className={styles.hr}></div> : null}
                       </Row>
                       })}
                      </Row>
                 </div>
                  
                   <div id='scroll_end'>
                  </div> 
                   

                </Row>
          </Skeleton>
        </Card>

       </div>
    );
  }
}
