import React, { PureComponent } from 'react';
import {
  DatePicker
} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class SdlDatePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };

    this._renderJsx = this._renderJsx.bind(this);
  }

  _renderJsx() {
    console.log("props=",this.props)
    const { format, value } = this.props;
    // value = this.state.value;
    const _format = format.toUpperCase();
    if (_format === "YYYY-MM" || _format === "MM") {
      // 年月 、 月
      return <MonthPicker style={{ width: "100%" }} {...this.props} format={_format} />
    } else if (_format === "YYYY") {
      // 年
      return <DatePicker format={_format} />
    } else {
      // 年-月-日 时:分:秒
      return <DatePicker showTime format={format} style={{ width: "100%" }} {...this.props} />
    }
  }

  render() {
    return this._renderJsx();
  }
}

SdlDatePicker.propTypes = {
  format: PropTypes.string
}

SdlDatePicker.defaultProps = {
  format: "YYYY-MM-DD HH:mm:ss"
}


export default SdlDatePicker;