/*
 * @desc: 动态时间组件
 * @Author: Jiaqi 
 * @Date: 2019-09-20 11:42:53 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-09-20 16:23:15
 */
import React, { PureComponent } from 'react';
import moment from 'moment';

let timer;
class Time extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };
  }
  componentDidMount() {
    timer = setInterval(() => {
      this.setState({ date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') });
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(timer)
  }

  render() {
    return (
      <span {...this.props}>{this.state.date}</span>
    );
  }
}

export default Time;