// 污染物下拉框组件

import React, { Component } from 'react';
import { Select } from 'antd';

const { Option } = Select;
class Index extends Component {

    getoption=() => {
        const { optionDatas, allpollutant } = this.props;
        if (optionDatas&&optionDatas.length>0) {
            const res = [];
            if (allpollutant) {
                res.push(<Option
                    key={-1}
                    value={-1}
                >全部</Option>)
            }
            optionDatas.map((item, key) => {
                res.push(<Option
                    key={key}
                    value={item.PollutantCode}
                >{item.PollutantName}</Option>);
            })
            console.log(res)
            return res;
        }
    }

    render() {
        const {
          mode,
          onChange,
          allowClear,
          style,
          placeholder,
          defaultValue,
          allpollutant,
          maxTagCount,
          maxTagTextLength,
          maxTagPlaceholder,
          optionDatas,
        } = this.props;
        console.log('------------------默认选中的污染物---------------------------', defaultValue);
        return (
             <Select
                mode={mode}
                onChange={onChange}
                allowClear={allowClear}
                style={{ width: 200, ...style }}
                placeholder={placeholder}
                defaultValue={defaultValue || ((allpollutant && optionDatas.length) ? -1 : [])}
                maxTagCount={maxTagCount}
                maxTagTextLength={maxTagTextLength}
                maxTagPlaceholder={maxTagPlaceholder}
            >
                {
                     this.getoption()
                }
            </Select>
        );
    }
}
export default Index;
