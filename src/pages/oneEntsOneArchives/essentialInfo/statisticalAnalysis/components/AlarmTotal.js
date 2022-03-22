import React, { Component } from 'react';
import { connect } from 'dva';
import styles  from '../index.less';
import Marquee from '@/components/Marquee';
import { CaretDownOutlined, CaretUpOutlined, HomeTwoTone } from '@ant-design/icons';
import { Statistic, Row, Col, Divider,Radio  } from 'antd';
import moment from 'moment';
@connect(({ loading, home }) => ({
    taxInfo: home.taxInfo,
    alarmTotalDataHour:home.alarmTotalDataHour,
    alarmTotalDataDay:home.alarmTotalDataDay
  }))
class AlarmTotal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            dataTypeHour:'HourData',
            dataTypeDay:'DayData',
         };
    }

    componentDidMount(){
         let { entCode } = this.props;
         this.getData(entCode);
    }
    componentWillReceiveProps(nextProps) {
      if ( this.props.entCode !== nextProps.entCode) {
         this.getData(nextProps.entCode);
        }
    }

    getData=(entCode)=>{
     const{dispatch } = this.props;
     const { dataTypeHour,dataTypeDay } = this.state;
    // 获取单个企业月超标报警
    if (entCode) {
      dispatch({
        type: "home/overStandardAlarmStatistics",
        payload: {
          entCode: entCode,
          dataType:dataTypeHour
        }
      })
      dispatch({
        type: "home/overStandardAlarmStatistics",
        payload: {
          entCode: entCode,
          dataType:dataTypeDay
        }
      })
    }


       
    }


    render() {
        const { taxInfo,alarmTotalDataHour,alarmTotalDataDay }=this.props;
        const { options,dataType } = this.state;

         let daates = moment(taxInfo.Date).format('MM') * 1
        return <>
          <div className={styles.title}>
            <p>报警统计</p>
          </div>
          <div className={styles.content}>
              <Row justify='center'> 
                <div style={{margin:'12px 0 20px 0',borderRadius:16, padding:'5px 10px', border:'1px solid #e5e5e5',color: "#333" }}>{daates}月超标报警统计</div>
              </Row>

              <Row  style={{background:"#f5f6f8",borderRadius:18,padding:'20px 0'}}> 
              <Col span={10} className='colCenter'>
              <div style={{fontSize:30,color:"#333"}}>{alarmTotalDataHour}</div>
                 <span>小时数据</span>
              </Col>
              <Col span={2} className='colCenter'><div style={{width:1,height:'100%',background:'#e5e5e5'}}></div></Col> 
              
              <Col span={10} className='colCenter' >
              <div style={{fontSize:30,color:"#333"}}>{alarmTotalDataDay}</div>
              <span>日均数据</span>
              </Col>
              </Row>
          </div>
          </>;
    }
}

export default AlarmTotal;