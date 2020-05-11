import React, { Component } from 'react';
import { Select } from 'antd';
import moment from 'moment';

const Option = Select.Option

let yearList = [], monthList = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"], hoursList = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

class SelectTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startFormat: "00:00",
      endFormat: "59:59",
      startTimeObj: {
        year: moment().format("YYYY"),
        month: moment().format("MM") + 1 > 10 ? moment().format("MM") : "0" + moment().format("MM") + 1,
        day: moment().format("DD"),
        hour: moment().format("HH"),
        daysInMonthList: []
      },
      endTimeObj: {
        year: moment().format("YYYY"),
        month: moment().format("MM") + 1 > 10 ? moment().format("MM") : "0" + moment().format("MM") + 1,
        day: moment().format("DD"),
        hour: moment().format("HH"),
        daysInMonthList: []
      }
    };
    let currentYear = moment().get('year') + 1;
    // 年
    for (let i = 1; i <= 20; i++) {
      yearList.push(--currentYear)
    }
  }

  // 初始化时间
  initTime = (mode = this.props.mode, reload) => {
    let startFormat = "00:00";
    let endFormat = "59:59";
    let startTimeObj = {};
    let endTimeObj = {};
    let day = moment().format("DD") - 1;
    switch (mode) {
      case "realtime":
        startFormat = "00:00";
        endFormat = "59:59";
        break;
      case "minute":
        startFormat = "00:00";
        endFormat = "59:59";
        startTimeObj = {
          day: day >= 10 ? day : "0" + day,
        }
        break;
      case "hour":
        startFormat = "00:00";
        endFormat = "59:59";
        startTimeObj = {
          day: day >= 10 ? day : "0" + day,
        }
        break;
      case "day":
        startFormat = "00:00:00";
        endFormat = "59:59:59";
        startTimeObj = {
          month: moment().format("MM") >= 10 ? moment().format("MM") : moment().format("MM"),
        }
        break;
    }
    this.setState({
      startFormat, endFormat,
      startTimeObj: {
        year: moment().format("YYYY"),
        month: moment().format("MM") + 1 >= 10 ? moment().format("MM") : "0" + moment().format("MM") + 1,
        day: moment().format("DD"),
        hour: moment().format("HH"),
        daysInMonthList: [],
        ...startTimeObj
      },
      endTimeObj: {
        year: moment().format("YYYY"),
        month: moment().format("MM") + 1 > 10 ? moment().format("MM") : "0" + moment().format("MM") + 1,
        day: moment().format("DD"),
        hour: moment().format("HH"),
        daysInMonthList: [],
      }
    }, () => {
      this.onMonthChange(this.state.startTimeObj.month, 1)
      this.onMonthChange(this.state.startTimeObj.month, 0, reload)
    })
  }

  componentWillMount() {
    // let currentYear = moment().get('year') + 1;
    // 年
    // for (let i = 1; i <= 20; i++) {
    //   yearList.push(--currentYear)
    // }
    // 月
    // for (let i = 1; i <= 12; i++) {
    //   monthList.push(i >= 10 ? i : "0" + i)
    // }
    // // 小时
    // for (let i = 1; i < 24; i++) {
    //   hoursList.push(i >= 10 ? i : "0" + i)
    // }

    this.initTime()
  }


  componentDidMount() {
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.mode !== nextProps.mode || this.props.dgimn !== nextProps.dgimn) {
      this.initTime(nextProps.mode, true)
    }
  }


  // 获取当前月的天数
  onMonthChange = (value, type, reload) => {
    let time = type === 1 ? this.state.startTimeObj.year + "-" + value : this.state.endTimeObj.year + "-" + value
    let days = moment(time, "YYYY-MM").daysInMonth();
    let dayList = [];
    for (let i = 1; i <= days; i++) {
      dayList.push(i >= 10 ? i : "0" + i)
    }

    let key = type === 1 ? "startTimeObj" : "endTimeObj";
    let day = this.state.startTimeObj.day;
    if (type === 0) {
      day = this.state.endTimeObj.day;
    }
    if (day > days) {
      day = days
    }

    this.setState({
      [key]: {
        ...this.state[key],
        month: value,
        day: day,
        daysInMonthList: dayList
      }
    }, () => {
      this.onChange(reload)
    })
  }


  onChange = (reload) => {
    const { startTimeObj, endTimeObj } = this.state;
    let startTime = `${startTimeObj.year}-${startTimeObj.month}-${startTimeObj.day} ${startTimeObj.hour}:00:00`
    let endTime = `${endTimeObj.year}-${endTimeObj.month}-${endTimeObj.day} ${endTimeObj.hour}:59:59`
    if (this.props.mode === "day") {
      startTime = `${startTimeObj.year}-${startTimeObj.month}-${startTimeObj.day} 00:00:00`
      endTime = `${endTimeObj.year}-${endTimeObj.month}-${endTimeObj.day} 59:59:59`
    }
    !reload && this.props.onChange && this.props.onChange(startTime, endTime)
    reload && this.props.reload(startTime, endTime)
  }


  // 开始时间change事件
  onStartTimeSelectChange = (value, key) => {
    this.setState({
      startTimeObj: {
        ...this.state.startTimeObj,
        [key]: value
      }
    }, () => {
      this.onChange()
    })
  }

  // 结束时间change事件
  onEndTimeSelectChange = (value, key) => {
    this.setState({
      endTimeObj: {
        ...this.state.endTimeObj,
        [key]: value
      }
    }, () => {
      this.onChange()
    })
  }


  render() {
    const { startTimeObj, endTimeObj } = this.state;
    const { size, style } = this.props;
    return (
      <div style={{ fontSize: 14, fontWeight: 'normal', display: 'inline-block', ...style }}>
        <Select size={size} style={{ width: 80 }} value={startTimeObj.year + ""} onChange={(value) => { this.onStartTimeSelectChange(value, "year") }}>
          {
            yearList.map(item => {
              return <Option disabled={this.state.endTimeObj.year < item} key={item}>{item}</Option>
            })
          }
        </Select>
        <span style={{ margin: "0 2px" }}>年</span>
        <Select size={size} style={{ width: 60 }} value={startTimeObj.month + ""} onChange={value => {
          this.onMonthChange(value, 1)
        }}>
          {
            monthList.map(item => {
              return <Option key={item}>{item}</Option>
            })
          }
        </Select>
        <span style={{ margin: "0 2px" }}>月</span>
        <Select size={size} value={startTimeObj.day + ""} style={{ width: 60 }} onChange={(value) => { this.onStartTimeSelectChange(value, "day") }}>
          {
            startTimeObj.daysInMonthList.map(item => {
              return <Option key={item}>{item}</Option>
            })
          }
        </Select>
        <span style={{ margin: "0 2px" }}>日</span>
        {
          this.props.mode !== 'day' &&
          <>
            <Select size={size} value={startTimeObj.hour + ""} style={{ width: 60 }} onChange={(value) => { this.onStartTimeSelectChange(value, "hour") }}>
              {
                hoursList.map(item => {
                  return <Option key={item}>{item}</Option>
                })
              }
            </Select>
            <span style={{ margin: "0 2px" }}>时</span>
          </>
        }

        <span style={{ margin: "0 10px" }}>-</span>

        <Select size={size} style={{ width: 80 }} value={endTimeObj.year + ""} onChange={(value) => { this.onEndTimeSelectChange(value, "year") }}>
          {
            yearList.map(item => {
              return <Option disabled={this.state.startTimeObj.year > item} key={item}>{item}</Option>
            })
          }
        </Select>
        <span style={{ margin: "0 2px" }}>年</span>
        <Select size={size} style={{ width: 60 }} value={endTimeObj.month + ""} onChange={value => {
          this.onMonthChange(value, 0)
        }}>
          {
            monthList.map(item => {
              return <Option key={item}>{item}</Option>
            })
          }
        </Select>
        <span style={{ margin: "0 2px" }}>月</span>
        <Select size={size} value={endTimeObj.day + ""} style={{ width: 60 }} onChange={(value) => { this.onEndTimeSelectChange(value, "day") }}>
          {
            endTimeObj.daysInMonthList.map(item => {
              return <Option key={item}>{item}</Option>
            })
          }
        </Select>
        <span style={{ margin: "0 2px" }}>日</span>
        {
          this.props.mode !== 'day' &&
          <>
            <Select size={size} value={endTimeObj.hour + ""} style={{ width: 60 }} onChange={(value) => { this.onEndTimeSelectChange(value, "hour") }}>
              {
                hoursList.map(item => {
                  return <Option key={item}>{item}</Option>
                })
              }
            </Select>
            <span style={{ margin: "0 2px" }}>时</span>
          </>
        }

      </div>
    );
  }
}

SelectTime.defaultProps = {
  size: "small",
}


export default SelectTime;
