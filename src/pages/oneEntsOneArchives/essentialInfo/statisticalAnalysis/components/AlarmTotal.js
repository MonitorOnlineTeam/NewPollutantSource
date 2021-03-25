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
            dataType:'HourData',
            options : [
                { label: '小时数据', value: 'HourData' },
                { label: '日均数据', value: 'DayData' },
              ]
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
     const { dataType } = this.state;
    // 获取单个企业月超标报警
    if (entCode && dataType) {
      dispatch({
        type: "home/overStandardAlarmStatistics",
        payload: {
          entCode: entCode,
          dataType:dataType
        }
      })
    }


       
    }

    onAlarmChange=(e)=>{
      let { entCode } = this.props;
      this.setState({dataType:e.target.value},()=>{
          this.getData(entCode)
      })
    }

    render() {
        const {taxInfo}=this.props;
        const { options,dataType } = this.state;
        return <>
          <div className={styles.title}>
            <p>报警统计</p>
          </div>
          <div className={styles.content}>
            <p style={{paddingTop:20 }}> 

            <Radio.Group
             options={options}
             onChange={this.onAlarmChange}
             value={dataType}
             optionType="button"
             buttonStyle="solid"
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