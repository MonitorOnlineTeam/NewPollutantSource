import React, { Component } from 'react';
import { connect } from 'dva';
import styles  from '@/pages/home/index.less';
import Marquee from '@/components/Marquee';
import {Statistic,Icon,Row,Col,Divider} from 'antd';
import moment from 'moment';
@connect(({ loading, home }) => ({
    taxInfo: home.taxInfo,
  }))
class EmissionTax extends Component {
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

 

    render() {
        const {taxInfo}=this.props;
        return (
            <>
              <div className={styles.title}>
                <p>排污税</p>
              </div>
              <div className={styles.content}>
                <p className={styles.yjTax}><span style={{ textAlign: "left", fontSize: "16px", fontWeight: 600, color: "#d5d9e2" }}>{moment(taxInfo.Date).format('MM') * 1}月应交环保税：</span><Statistic valueStyle={{ color: '#fff', textAlign: 'center', fontSize: 22 }} value={taxInfo.LastQuarter} prefix="￥" /></p>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title={<span style={{ color: "#d5d9e2" }}>环保税：</span>} valueStyle={{ color: '#fff', fontSize: 18 }} value={taxInfo.EffluentFeeValue} prefix="￥" />
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Statistic title={<span style={{ color: "#d5d9e2" }}>超低排放奖励：</span>} valueStyle={{ color: '#fff', fontSize: 18 }} value={taxInfo.UltralowEmissionIncentives} prefix="￥" />
                  </Col>
                </Row>
                <Divider style={{ background: "#1c324c" }} />
                <div className={styles.quarterTax}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#d5d9e2" }}>本季度应缴环保税：</div>
                  {
                    (taxInfo.ThisQuarter > taxInfo.LastQuarter) ?
                      <Statistic
                        valueStyle={{ color: '#fff', fontSize: 22, color: "#FF4E4E" }}
                        value={taxInfo.ThisQuarter}
                        prefix={
                          <><Icon style={{ color: "#FF4E4E", fontSize: "18px" }} type="caret-up" /> ￥ </>
                        }
                      />
                      : <Statistic
                        valueStyle={{ color: '#fff', fontSize: 22, color: "rgb(91, 242, 135)" }}
                        value={taxInfo.ThisQuarter}
                        prefix={
                          <><Icon style={{ color: "rgb(91, 242, 135)", fontSize: "18px" }} type="caret-down" /> ￥ </>
                        }
                      />
                  }
                </div>
              </div>
              </>
        );
    }
}

export default EmissionTax;