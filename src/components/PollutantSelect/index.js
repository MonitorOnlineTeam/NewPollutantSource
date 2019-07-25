// 污染物下拉框组件

import React, { Component } from 'react';
import { Select } from 'antd';

const { Option } = Select;
class Index extends Component {
    getoption=() => {
        const { optionDatas, allpollutant } = this.props;
        if (optionDatas) {
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
            return res;
        }
    }

    render() {
        const { mode, onChange, allowClear, style, placeholder, defaultValue, allpollutant } = this.props;
        console.log('---------------------------------------------', defaultValue);
        return (
            <Select
                mode={mode}
                onChange={onChange}
                allowClear={allowClear}
                style={{ width: 200, ...style }}
                placeholder={placeholder}
                defaultValue={defaultValue || (allpollutant ? -1 : null)}
            >
                {
                     this.getoption()
                }
            </Select>
        );
    }
}
export default Index;
