// 时间钻取维度组件 ['realtime', 'minutes', 'hour', 'day']

import React, { Component } from 'react';
import { Radio } from 'antd';
import PropTypes from 'prop-types';
class Index extends Component {
    static propTypes = {
        defaultValue: PropTypes.string,
        style: PropTypes.object,
        options: PropTypes.array,
        changeCallback:PropTypes.func
    }
    static defaultProps = {
        style: {},
        options: [],
        defaultValue:"hour"
    }
    constructor(props) {
        super(props);
        this.state = {
            options: [
             { label: '小时', value: 'hour' },
             { label: '日均', value: 'day' }
          ]};
    }
    onChange(value){
        const { changeCallback } = this.props;

         return changeCallback(value)
    }
      componentDidMount(){
        const { defaultValue,changeCallback } = this.props;

          changeCallback(defaultValue)
      }
    render() {
        const { options } = this.state;
        const { defaultValue } = this.props;
        return (
          <>
            <Radio.Group  style={this.props.style} options={[...options,...this.props.options]} defaultValue={defaultValue} onChange={(e)=>{this.onChange(e.target.value)}}   optionType="button"/>
          </>
        );
      }
    }
export default Index;
