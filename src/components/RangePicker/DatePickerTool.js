
// 单时间时间框

import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker,Select } from 'antd';
import PropTypes from 'prop-types';
import YearPicker from '@/components/YearPicker'
const { WeekPicker,MonthPicker } = DatePicker;

const dateChildren = [];
const dateYear = moment().get('year');
for (let i = dateYear; i > dateYear - 10; --i) {
    dateChildren.push(<Option key={i}>{i}</Option>);
}


class DatePickerTool extends Component {
    constructor(props) {
        super(props);
        this.state={
            defaultValue:this.props.defaultValue
        }
    }

    getDatePicker=()=>{
       const {picker}=this.props;
       switch(picker)
       {
           case "month":
           case "monthly":
           case "quarter":
                return <MonthPicker value={this.state.defaultValue} {...this.props}  onChange={this.onChange}/>
           case "year":
           case "annals":
               return  <YearPicker  value={this.state.defaultValue} {...this.props}  onPanelChange={this.onChange} />
           //默认是日
           default: return <DatePicker value={this.state.defaultValue} {...this.props}  picker='date'   onChange={this.onChange}/>
       }
    }

    
    onChange=(dates,datesStr)=>{
        const {callback,picker}=this.props;
        let beginTime;
        let endTime;
        switch(picker)
        {
            case "month":
            case "monthly":
                beginTime=dates.format('YYYY-MM-01 00:00:00');
                endTime= moment(beginTime).add(1,'month').add(-1,'second').format('YYYY-MM-DD 23:59:59');
                break;
            case "year":
            case "annals":
                beginTime=dates.format('YYYY-01-01 00:00:00');
                endTime= moment(beginTime).add(1,'year').add(-1,'second').format('YYYY-MM-DD 23:59:59');
                break;
            //小时数据较为特殊从1开始，从0结束
            case "dayanddate":
            case "siteDaily":
                beginTime=dates.format('YYYY-MM-DD 01:00:00');
                endTime= moment(beginTime).add(1,'day').format('YYYY-MM-DD 00:00:00');
                break;
            case "quarter":
                const month=dates.format('MM');
                if(month>=1 && month<=3)
                {
                    beginTime=dates.format('YYYY-01-01 00:00:00');
                    endTime= dates.format('YYYY-03-31 23:59:59')
                }
                else if(month>=4 && month<=6)
                {
                    beginTime=dates.format('YYYY-04-01 00:00:00');
                    endTime= dates.format('YYYY-06-30 23:59:59')
                }
                else if(month>=7 && month<=9)
                {
                    beginTime=dates.format('YYYY-07-01 00:00:00');
                    endTime= dates.format('YYYY-09-30 23:59:59')
                }
                else if(month>=10 && month<=12)
                {
                    beginTime=dates.format('YYYY-10-01 00:00:00');
                    endTime= dates.format('YYYY-12-31 23:59:59')
                }
                break;
            default :
                beginTime=dates.format('YYYY-MM-DD 00:00:00');
                endTime= moment(beginTime).add(1,'day').add(-1,'second').format('YYYY-MM-DD 23:59:59');
                break;
        }
        callback && callback(dates,beginTime,endTime);
        this.setState({
            defaultValue:dates
        })
        return dates;
    }

    render() {
        return (
            <>{this.getDatePicker()}</>
        );
    }
}
 
export default DatePickerTool;
