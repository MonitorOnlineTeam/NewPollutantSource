// 时间钻取维度组件 ['realtime', 'minutes', 'hour', 'day']

import React, { Component } from 'react';
import { Radio } from 'antd';
import PropTypes from 'prop-types';
class Index extends Component {
    static propTypes = {
        defaultValue: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        getOptions: PropTypes.array,
        changeCallback:PropTypes.func,
        isTime:PropTypes.bool
    }
    static defaultProps = {
        style: {},
        defaultValue:"hour",
        getOptions:[],
        isTime:true
    }
    constructor(props) {
        super(props);
        this.state = {
            defaultOptions: [
              { label: '小时', value: 'hour' }, { label: '日均', value: 'day' }
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
        const { defaultValue,getOptions,style,className,isTime } = this.props;
        const { defaultOptions } = this.state;
        const options = isTime?  [...defaultOptions, ...getOptions] : [...getOptions]
        return (
          <>
            <Radio.Group className={className}  style={{...style}} options={options} defaultValue={defaultValue} onChange={(e)=>{this.onChange(e.target.value)}}   optionType="button"/>
          </>
        );
      }
    }
export default Index;
