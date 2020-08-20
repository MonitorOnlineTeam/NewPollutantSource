// 多选下拉框组件

import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
const { Option } = Select;
class Index extends Component {

    static propTypes = {
        // defaultValue: PropTypes.string || PropTypes.array,
        style: PropTypes.object,
        className: PropTypes.string,
        optionDatas: PropTypes.array,
        changeCallback:PropTypes.func,
        maxTagCount:PropTypes.number,
        maxTagTextLength:PropTypes.number,
        ispollutant: PropTypes.number,
    }
    static defaultProps = {
        style: {width:"100%"},
        placeholder:"请选择污染物",
        mode:"-",
        allowClear:false,
        maxTagCount:1,//选择项最大个数
        maxTagTextLength:2,//单个选择项文本长度 超出则是省略号显示
        ispollutant:0
    }
    constructor(props) {
        super(props);
        this.state = {
            defaultValues:""
        };
    }
    getOption=() => {
        const { optiondatas,ispollutant } = this.props;
        const res = [];
        if (optiondatas&&optiondatas.length>0) {
            optiondatas.map((item, key) => {
                ispollutant?   res.push(<Option key={key} value={item.PollutantCode} >{item.PollutantName}</Option>) : res.push(<Option key={key} value={item.value} >{item.name}</Option>);
              })
            }
            return res;
           
    }

     componentDidMount(){
     }
    render() {
        const {
          mode,
          onChange,
          allowClear,
          style,
          placeholder,
          defaultValue,
          className,
          maxTagCount,
          showSearch,
          maxTagPlaceholder,//超出最大选择项最大个数时 其余选择项的展示方式  默认为  " + {未展示选择项数量} ... "
          maxTagTextLength,
          value
        } = this.props;
        // value={value}  maxTagCount={maxTagCount}  maxTagPlaceholder={maxTagPlaceholder} maxTagTextLength={maxTagTextLength} allowClear={allowClear} defaultValue={defaultValue} mode={mode} showSearch={showSearch} className={className} style={{ ...style}} placeholder={placeholder} onChange={onChange}
        return (
            <Select {...this.props}>
            {this.getOption()}
          </Select>
        );
    }
}
export default Index;
