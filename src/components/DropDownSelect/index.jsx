// 多选下拉框组件

import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
const { Option } = Select;
class Index extends Component {

    static propTypes = {
        defaultValue: PropTypes.string || PropTypes.array,
        style: PropTypes.object,
        className: PropTypes.string,
        optionDatas: PropTypes.array,
        changeCallback:PropTypes.func,
        maxTagCount:PropTypes.number,
        maxTagTextLength:PropTypes.number
    }
    static defaultProps = {
        style: {width:"100%"},
        placeholder:"请选择污染物",
        mode:"multiple",
        allowClear:false,
        maxTagCount:5,//选择项最大个数
        maxTagTextLength:10,//单个选择项文本长度 超出则是省略号显示
    }
    constructor(props) {
        super(props);
        this.state = {};
    }

    getOption=() => {
        const { optionDatas } = this.props;
        const res = [];
        if (optionDatas.length>0) {
            optionDatas.map((item, key) => {
                res.push(<Option key={key} value={item.PollutantCode} >{item.PollutantName}</Option>);
              })
            }else{
               res.push(<Option key={-1} value={-1} >全部</Option>)
           }
            return res;
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
       //   allpollutant,
        } = this.props;
        
        return (
            <Select maxTagCount={maxTagCount}  maxTagPlaceholder={maxTagPlaceholder} maxTagTextLength={maxTagTextLength} allowClear={allowClear} defaultValue={defaultValue} mode={mode} showSearch={showSearch} className={className} style={{ ...style }} placeholder={placeholder} onChange={onChange}>
            {this.getOption()}
          </Select>
        );
    }
}
export default Index;
