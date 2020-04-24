
// 时间弹窗组件封装

import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker,message } from 'antd';
import PropTypes from 'prop-types';

const { RangePicker } = DatePicker;


class NewRangePicker extends Component {
    constructor(props) {
        super(props);
        const defaultOption = {
            searchdate: [],
            showTime: this.props.showTime && { format: this.props.showTime.format || 'HH:mm:ss' },
            dateFormat: this.props.format || 'YYYY-MM-DD HH:mm:ss',
            dateValue:this.getDefault(),
            ranges: {
                今天: [moment().startOf('day'), moment()],
                本周: [moment().startOf('week'), moment()],
                连续七天: [moment().add(-6, 'd'), moment()],
                本月: [moment().startOf('month'), moment().endOf('month')],
                上月: [moment().add(-1, 'M').startOf('month'), moment().add(-1, 'M').endOf('month')],
                最近三月: [moment().add(-3, 'M').startOf('month'), moment().endOf('month')],
                最近半年: [moment().startOf('years'), moment().endOf('years').add(-6, 'M').endOf('month')],
                最近一年: [moment().startOf('years'), moment().endOf('years')],
                最近三年: [moment().add(-3, 'y').startOf('years'), moment().endOf('years')],
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
    componentWillMount = () => {
        const { onRef } = this.props;
        onRef && onRef(this);
      };

    /**
     * 获取默认
     */
    getDefault=()=>{
       const {dateValue}=this.props;
       if(dateValue)
       {
           return this.getFormatDate(dateValue[0],dateValue[1]);
       }
       else{
           return this.getFormatDate(null,null);
       }
    }
    /**
     * 获取格式化的时间
     */
    getFormatDate=(beginTime,endTime,Type)=>{
        //验证、回调、form中的字段名
        const {isVerification,callback,fieldName}=this.props;
        let dataType=Type || this.props.dataType;
        if(!beginTime || !endTime)
        {
            callback && callback([beginTime,endTime],dataType,fieldName);
            return;
        }
         
       
        switch(dataType)
        {
            case "realtime":
                if(beginTime==1 || !endTime==1)
                {
                    beginTime=moment(new Date()).add(-60, 'minutes');
                    endTime=moment(new Date());
                } 
                if(isVerification)
                {
                    const ranges=moment(endTime.format('YYYY-MM-DD HH:mm:ss')).add(-7, 'day');
                    if (ranges > beginTime) {
                        message.info('实时数据时间间隔不能超过7天');
                        return;
                    }
                }
                break;
            case "minute":
                if(beginTime==1 || !endTime==1)
                {
                    beginTime=moment(moment(new Date()).add(-1, 'day').format("YYYY-MM-DD HH:mm:00"));
                    endTime=moment(moment(new Date()).format("YYYY-MM-DD HH:mm:59"));
                } 
                else
                {
                    beginTime=moment(beginTime.format("YYYY-MM-DD HH:mm:00"));
                    endTime=moment(endTime.format("YYYY-MM-DD HH:mm:59"));
                }
                if(isVerification)
                {
                    const ranges=moment(endTime.format('YYYY-MM-DD HH:mm:ss')).add(-1, 'month');
                    if (ranges > beginTime) {
                        message.info('分钟数据时间间隔不能超过1个月');
                        return;
                    }
                }
                // 
                break;
                case "hour":
                case "Hour":
                    if(beginTime==1 || endTime==1)
                    {
                        beginTime=moment(moment(new Date()).add(-1, 'day').format("YYYY-MM-DD HH:00:00"));
                        endTime=moment(moment(new Date()).format("YYYY-MM-DD HH:59:59"));
                    } 
                    else
                    {
                        beginTime=moment(beginTime.format("YYYY-MM-DD HH:00:00"));
                        endTime=moment(endTime.format("YYYY-MM-DD HH:59:59"));
                    }
                    if(isVerification)
                    {
                        const ranges=moment(endTime.format('YYYY-MM-DD HH:mm:ss')).add(-6, 'month');
                        if (ranges > beginTime) {
                            message.info('小时数据时间间隔不能超过6个月');
                            return;
                        }
                    }
                    break;
                case "day":
                case "Day":
                    if(beginTime==1 || endTime==1)
                    {
                        beginTime=moment(moment(new Date()).add(-1, 'month').format("YYYY-MM-DD 00:00:00"));
                        endTime=moment(moment(new Date()).format("YYYY-MM-DD 23:59:59"));
                    } 
                    else
                    {
                        beginTime=moment(beginTime.format("YYYY-MM-DD 00:00:00"));
                        endTime=moment(endTime.format("YYYY-MM-DD 23:59:59"));
                    }
                    if(isVerification)
                    {
                        const ranges=moment(endTime.format('YYYY-MM-DD HH:mm:ss')).add(-12, 'month');
                        if (ranges > beginTime) {
                            message.info('日数据时间间隔不能超过1年');
                            return;
                        }
                    }
                    break;
                    //较为特殊的一种选择时间控件，由于小时数据统计从1点开始到0点结束
                    case "daySelecthour":
                        if(beginTime==1 || endTime==1)
                        {
                            beginTime=moment(moment(new Date()).add(-1, 'month').format("YYYY-MM-DD 01:00:00"));
                            endTime=moment(moment(new Date()).format("YYYY-MM-DD 00:00:00"));
                        } 
                        else
                        {
                            beginTime=moment(beginTime.format("YYYY-MM-DD 01:00:00"));
                            endTime=moment(endTime.format("YYYY-MM-DD 00:00:00"));
                        }

                        const interval=moment(endTime.format('YYYY-MM-DD HH:mm:ss')).add(-12, 'month');
                       // if()
                        if(isVerification)
                        {
                            const ranges=moment(endTime.format('YYYY-MM-DD HH:mm:ss')).add(-12, 'month');
                            if (ranges > beginTime) {
                                message.info('日数据时间间隔不能超过1年');
                                return;
                            }
                        }
                        break;
                    case "month":
                        if(beginTime==1 || endTime==1)
                        {
                            beginTime=moment(moment(new Date()).add(-3, 'month').format("YYYY-MM-01 01:00:00"));
                            endTime=moment(moment().add(1,'month').format('YYYY-MM-01 00:00:00')).add(-1,'second');
                        }
                        else
                        {
                            beginTime=moment(beginTime.format("YYYY-MM-01 00:00:00"));
                            endTime=moment(endTime.add(1,'month').format('YYYY-MM-01 00:00:00')).add(-1,'second');
                        }

        }
      
        callback && callback([beginTime,endTime],dataType,fieldName);
        return [beginTime,endTime];
    }

    onDateChange=(dates, dateStrings) => {
        var dateValue = this.getFormatDate(dates[0],dates[1]);
        if(dateValue)
        this.setState({
            dateValue,
        });
        else
        {
            this.setState({
                dateValue:[undefined,undefined],
            });
        }
    }


    onPanelChange=(dates, mode)=>{
       var dateValue = this.getFormatDate(dates[0],dates[1]);
       if(dateValue)
       this.setState({
           dateValue,
       });
       else
       {
           this.setState({
               dateValue:[undefined,undefined],
           });
       }
    }

    onDataTypeChange=(dataType)=>{
        
        var dateValue = this.getFormatDate(1,1,dataType);
        this.setState({
            dateValue,
        });
    }

    render() {
        return (
          
            <RangePicker
                showTime={this.state.showTime}
              // value={this.props.dateValue}
                value={this.state.dateValue}
               // onChange={this.props.onChange}
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
                onChange={this.onDateChange}
                onPanelChange={this.onPanelChange}
            />
        );
    }
}

NewRangePicker.defaultProps = {
   format: 'YYYY-MM-DD HH:mm:ss',
}

export default NewRangePicker;