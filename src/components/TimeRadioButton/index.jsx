// 时间钻取维度组件 ['realtime', 'minutes', 'hour', 'day']

import React, { Component } from 'react';
import { Radio } from 'antd';
import PropTypes from 'prop-types';
class Index extends Component {
    static propTypes = {
        defaultValue: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        options: PropTypes.array,
        changeCallback:PropTypes.func
    }
    static defaultProps = {
        style: {},
        options: [ { label: '小时', value: 'hour' }, { label: '日均', value: 'day' }],
        defaultValue:"hour"
    }
    constructor(props) {
        super(props);
        this.state = {
            options: [
            
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
        const { defaultValue,options,style,className } = this.props;
        return (
          <>
            <Radio.Group className={className}  style={{...style}} options={[...this.props.options]} defaultValue={defaultValue} onChange={(e)=>{this.onChange(e.target.value)}}   optionType="button"/>
          </>
        );
      }
    }
export default Index;
