// 时间钻取维度组件 ['realtime', 'minutes', 'hour', 'day']

import React, { Component } from 'react';
import { Radio } from 'antd';

class Index extends Component {
    render() {
        let showOtherTypes = this.props.showOtherTypes;
        let pollutantType = this.props.pollutantType;
        console.log("checked=",this.props.checked)
        return (
            <Radio.Group defaultValue={this.props.checked} onChange={this.props.onChange} style={this.props.style}>
                {pollutantType != 10 && <Radio.Button key={1} value="realtime">实时</Radio.Button>}
                {pollutantType != 10 && <Radio.Button key={2} value="minute">分钟</Radio.Button>}
                <Radio.Button key={3} value="hour">小时</Radio.Button>
                {pollutantType != 10 && <Radio.Button key={4} value="day">日均</Radio.Button>}
                <Radio.Button key={5} style={{ display: showOtherTypes }} value="month">月</Radio.Button>
                <Radio.Button key={6} style={{ display: showOtherTypes }} value="quarter">季</Radio.Button>
                <Radio.Button key={7} style={{ display: showOtherTypes }} value="year">年</Radio.Button>
            </Radio.Group>
        );
    }
}
export default Index;
