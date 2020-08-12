


import React from 'react';

import { Card,Row,Col} from 'antd';

import { connect } from 'dva';

import moment from 'moment'


import ReactEcharts from 'echarts-for-react';

import styles from "../index.less";
/**
 * 单图表色块组件
 * jab 2020.07.30
 */


const COLOR = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']


@connect(({ loading, historyData }) => ({
  alreadySelect:historyData.alreadySelect,
  
}))
class SingleChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          selectedIndex:0,
          alreadySelect:[]
        };
    }

    static getDerivedStateFromProps(props, state) {
      if (props.alreadySelect !== state.alreadySelect) {
        return {
          alreadySelect: props.alreadySelect
        };
      
      }
      return null;
    }


componentDidMount(){
}
pollutantSelect=(index,item)=>{ //自定义图例点击事件
    this.setState({selectedIndex:index});
    this.props.pollutantSelect(index,item);
}
  render() {
    const { alreadySelect,selectedIndex } = this.state;

    return (
        <>
   <Row justify="center" gutter={[16,16]}  style={{margin:0}}>
    {alreadySelect.map((item,index)=>{
     const textColor = index  === this.props.selectedIndex ? 'red' : 'black';
     const colorBlockCol = index  === this.state.selectedIndex ?  COLOR[2] : '#e6e6e6';
       return  (<Col onClick={this.pollutantSelect.bind(this,index,item)}>
         <span className={styles.colorBlock} style={{backgroundColor:colorBlockCol}}></span>
        <span style={{  color: textColor  }}>{item.PollutantName}</span>
      </Col>)
     })}
</Row>
        </>
    );
  }
}

export default SingleChart;