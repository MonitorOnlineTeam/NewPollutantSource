import React, { Component } from 'react';
import { Radio } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

@connect()
class AListRadio extends Component {
  constructor(props) {
    super(props);
    const _this = this;
    this.onchange = value => {
      if (value.target.value === 'a') {
        // _this.props.dispatch(routerRedux.push('/overview/mapview'));
      } else if (value.target.value === 'b') {
        _this.props.dispatch(routerRedux.push('/monitoring/datalist'));
      } else {
        //   _this.props.dispatch(routerRedux.push('/statuslist'));
      }
    };
  }
  render() {
    return (
      <Radio.Group
        style={{ padding: '0 2px 2px 50px', ...this.props.style }}
        onChange={this.onchange}
        defaultValue={this.props.dvalue}
      >
        <Radio.Button value="a">地图</Radio.Button>
        <Radio.Button value="b">数据</Radio.Button>
        {/* <Radio.Button value="c">状态</Radio.Button> */}
      </Radio.Group>
    );
  }
}

export default AListRadio;
