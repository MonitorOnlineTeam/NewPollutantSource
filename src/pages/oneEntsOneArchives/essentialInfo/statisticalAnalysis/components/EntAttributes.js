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
class EntAttributes extends Component {
    constructor(props) {
        super(props);
        this.state = { 
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
        return <>
          <div className={styles.title}>
            <p>企业属性</p>
          </div>
          <div className={styles.content}>
            这是企业属性
          </div>
          </>;
    }
}

export default EntAttributes;