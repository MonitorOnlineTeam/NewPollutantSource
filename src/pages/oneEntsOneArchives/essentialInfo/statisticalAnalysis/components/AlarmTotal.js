import React, { Component } from 'react';
import { connect } from 'dva';
import styles  from '../index.less';
import Marquee from '@/components/Marquee';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Statistic, Row, Col, Divider,Radio  } from 'antd';
import moment from 'moment';
@connect(({ loading, home }) => ({
    taxInfo: home.taxInfo,
  }))
class AlarmTotal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            options : [
                { label: '小时数据', value: 'hour' },
                { label: '日均数据', value: 'day' },
              ]
         };
    }

    componentDidMount()
    {
         this.getData();
    }
    componentWillReceiveProps(nextProps)
    {
      if (this.props.DGIMN !== nextProps.DGIMN || this.props.entCode !== nextProps.entCode) {
         this.getData(nextProps.entCode,nextProps.DGIMN);
        }
    }
    getData=(entCode,DGIMN)=>{
     const{dispatch}=this.props;
    // 获取所有企业排污税
    if (!entCode && !DGIMN) {
      dispatch({
        type: "home/getAllTax",
      })
    }

    // 获取单个企业排污税
    if (entCode && !DGIMN) {
      dispatch({
        type: "home/getEntTax",
        payload: {
          targetId: entCode
        }
      })
    }

    // 获取单个排口排污税
    if (entCode && DGIMN) {
      dispatch({
        type: "home/getPointTax",
        payload: {
          DGIMN
        }
      })
    }
       
    }

    onAlarmChange=(e)=>{

    }

    render() {
        const {taxInfo}=this.props;
        const { options } = this.state;
        return <>
          <div className={styles.title}>
            <p>报警统计</p>
          </div>
          <div className={styles.content}>
            <p style={{paddingTop:20 }}> 

            <Radio.Group
             options={options}
             onChange={this.onAlarmChange}
             value={'hour'}
             optionType="button"
            />
            </p>

            <Divider style={{ background: "#1c324c" }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#d5d9e2" }}>
              {moment(taxInfo.Date).format('MM') * 1}月超标报警统计：   
                  </div>
                  <Statistic
                    valueStyle={{  color: '#fff', fontSize: 22, color: "#FF4E4E", textAlign: "center",  fontWeight: 600 }}
                    value={taxInfo.ThisQuarter}
                  />
            </div>
          </div>
          </>;
    }
}

export default AlarmTotal;