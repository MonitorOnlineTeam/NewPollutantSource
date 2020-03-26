
// 单时间时间框

import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker,Select } from 'antd';
import PropTypes from 'prop-types';

const { YearPicker,WeekPicker,MonthPicker } = DatePicker;

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
        debugger;
       const {picker}=this.props;
       switch(picker)
       {
           case "month": return <MonthPicker value={this.state.defaultValue} {...this.props}  onChange={this.onChange}/>
           case "year":return  <Select
                                    size="default"
                                    defaultValue={dateYear}
                                    onChange={this.handleChangeDate}
                                    style={{ width: 200, marginLeft: 10 }}
                                >
                                    {dateChildren}
                                </Select>

           //默认是日
           default: return <DatePicker value={this.state.defaultValue} {...this.props}   onChange={this.onChange}/>
       }
    }

    handleChangeDate = (value) => {
        // debugger;
        // let Year = moment().get('year');
        // let Month = moment().get('month') + 1;
        // let beginTime = moment(`${value}-01-01 00:00:00`);
        // if (Month < 10) {
        //     Month = '0' + Month
        // }
        // // 本年份
        // if ((+value) === Year) {
        //     this.updateState({
        //         beginTime: beginTime.format('YYYY-MM-01 HH:mm:ss'),
        //         endTime: beginTime.add(1, 'years').format('YYYY-01-01 00:00:00'),
        //         selectedDate: `${Year}-${Month}-01 00:00:00`,
        //         clickDate: `${Year}-${Month}-01 00:00:00`,
        //         enttableDatas: []
        //     });
        // } else {
        //     this.updateState({
        //         beginTime: beginTime.format('YYYY-MM-01 HH:mm:ss'),
        //         endTime: beginTime.add(1, 'years').format('YYYY-01-01 00:00:00'),
        //         selectedDate: `${value}-01-01 00:00:00`,// beginTime.format('YYYY-01-01 HH:mm:ss'),
        //         clickDate: `${value}-01-01 00:00:00`,
        //         enttableDatas: []
        //     });
        // }
        // this.reloadData(true);

    }

    
    
    onChange=(dates,datesStr)=>{
        
        const {callback,picker}=this.props;
        let beginTime;
        let endTime;
     
        const aaaa=moment(dates).format('YYYY-MM-DD HH:mm:ss');
        switch(picker)
        {
            case "month":
                beginTime=dates.format('YYYY-MM-01 00:00:00');
                endTime= moment(beginTime).add(1,'month').add(-1,'second').format('YYYY-MM-DD 23:59:59');
                break;
            case "year":
                beginTime=dates.format('YYYY-01-01 00:00:00');
                endTime= moment(beginTime).add(1,'year').add(-1,'second').format('YYYY-MM-DD 23:59:59');
                break;
            //小时数据较为特殊从1开始，从0结束
            case "dayanddate":
                beginTime=dates.format('YYYY-MM-DD 01:00:00');
                endTime= moment(beginTime).add(1,'day').format('YYYY-MM-DD 00:00:00');
            default :
                beginTime=dates.format('YYYY-MM-DD 00:00:00');
                endTime= moment(beginTime).add(1,'day').add(-1,'second').format('YYYY-MM-DD 23:59:59');
                break;
        }
        callback && callback(dates,beginTime,endTime);
        debugger;
        var year=dates.format('YYYY');
        var res=moment(year);
        this.setState({
            defaultValue:res
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
