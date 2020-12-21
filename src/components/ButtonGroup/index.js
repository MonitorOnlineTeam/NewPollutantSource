// 时间钻取维度组件 ['realtime', 'minutes', 'hour', 'day']

import React, { Component } from 'react';
import { Radio } from 'antd';

class Index extends Component {
  render() {
    let { showOtherTypes, ifShowOther } = this.props;
    return (
      <Radio.Group
        defaultValue={this.props.checked}
        value={this.props.checked}
        onChange={this.props.onChange}
        style={this.props.style}
      >
        <Radio.Button key={1} value="realtime">
          实时
        </Radio.Button>
        <Radio.Button key={2} value="minute">
          分钟
        </Radio.Button>
        <Radio.Button key={3} value="hour">
          小时
        </Radio.Button>
        <Radio.Button key={4} value="day">
          日均
        </Radio.Button>
        {ifShowOther ?
          <span>
            <Radio.Button key={5} style={{ display: showOtherTypes,marginLeft:-1, borderRadius:0 }} value="month">
              月均
        </Radio.Button>
            <Radio.Button key={6} style={{ display: showOtherTypes }} value="quarter">
              季均
        </Radio.Button>
            <Radio.Button key={7} style={{ display: showOtherTypes }} value="year">
              年均
        </Radio.Button>
          </span>
          :
          null
        }

      </Radio.Group>
    );
  }
}
export default Index;
