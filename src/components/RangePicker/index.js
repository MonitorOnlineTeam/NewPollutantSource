
// 时间弹窗组件封装

import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';
const { RangePicker } = DatePicker;

const currentYear = moment().year();// 获取当前年份
const startOfWeek = moment().clone().startOf('isoWeek'); // 获取本周的第一天（周一）
class Index extends Component {
    constructor(props) {
        super(props);
        const defaultOption = {
            searchdate: [],
            showTime: this.props.showTime && { format: this.props.showTime.format || 'HH:mm:ss' },
            dateFormat: this.props.format || 'YYYY-MM-DD HH:mm:ss',
            ranges: {
                今天: [moment().startOf('day'), moment()],
                昨天: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                本周: [startOfWeek.subtract(startOfWeek.isoWeekday() - 1, 'days'), moment().clone().endOf('isoWeek')],
                上周: [startOfWeek.clone().subtract(1, 'week'), startOfWeek.clone().subtract(1, 'day')],
                连续七天: [moment().add(-6, 'd'), moment()],
                本月: [moment().startOf('month'), moment()],
                上月: [moment().add(-1, 'M').startOf('month'), moment().add(-1, 'M').endOf('month')],
                近三月: [moment().subtract(2, 'months').startOf('month'), moment()],
                一季度: [moment(`${currentYear}-01-01`).startOf('quarter'), moment(`${currentYear}-03-31`).endOf('quarter')],
                二季度: [moment(`${currentYear}-04-01`).startOf('quarter'), moment(`${currentYear}-06-30`).endOf('quarter')],
                三季度: [moment(`${currentYear}-07-01`).startOf('quarter'), moment(`${currentYear}-09-30`).endOf('quarter')],
                四季度: [moment(`${currentYear}-10-01`).startOf('quarter'), moment(`${currentYear}-12-31`).endOf('quarter')],
                近半年: [moment().subtract(6, 'months').startOf('month'), moment()],
                今年: [moment().startOf('year'),  moment()],
                去年: [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                前年: [moment().subtract(2, 'years').startOf('year'),  moment().subtract(2, 'years').endOf('year')],
                近一年: [moment().subtract(1, 'year').startOf('year'),moment()],
                近二年: [moment().subtract(2, 'years').startOf('year'),moment()],
                近三年: [ moment().subtract(3, 'years').startOf('year'), moment()],
            },
            // style: {
            //     width: (this.props.style && (this.props.style.width || 300)) || 250,
            //     marginLeft: 5,
            //     marginRight: 5,
            // },
            placeholder: ['开始时间', '结束时间'],
            Form: '',
            To: '',
        };
        this.state = defaultOption;
    }

    onDateChange=(dates, dateStrings) => {
        this.setState({
            searchdate: dates,
            Form: dateStrings[0],
            To: dateStrings[1],
        });
    }

    render() {
        return (
            <RangePicker
                showTime={this.state.showTime}
                value={this.props.dateValue}
                onChange={this.props.onChange}
                onOk={this.props.onOk}
                ranges={this.state.ranges}
                format={this.props.format}
                disabled={this.props.disabled}
                style={{ width: 250, marginLeft: 5, marginRight: 5, ...this.props.style }}
                placeholder={this.state.placeholder}
                allowClear = {
                  this.props.allowClear === undefined ? true : this.props.allowClear
                }
                {...this.props}
            />
        );
    }
}

Index.defaultProps = {
   format: 'YYYY-MM-DD HH:mm:ss',
}

export default Index;
