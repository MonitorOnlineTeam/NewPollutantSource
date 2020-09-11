// 时间钻取维度组件 ['realtime', 'minutes', 'hour', 'day']

import React, { Component } from 'react';
import { Radio } from 'antd';

class Index extends Component {
    render() {
        return (
            <Radio.Group value={this.props.checked} onChange={this.props.onChange} style={this.props.style}>
                <Radio.Button key={1} value="realtime">实时</Radio.Button>
                <Radio.Button key={2} value="minute">分钟</Radio.Button>
                <Radio.Button key={3} value="hour">小时</Radio.Button>
                <Radio.Button key={4} value="day">日均</Radio.Button>
            </Radio.Group>
        );
    }
}
export default Index;
