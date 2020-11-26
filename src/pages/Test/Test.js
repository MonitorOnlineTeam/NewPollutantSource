import React, { PureComponent } from 'react';
import moment from 'moment';
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker

class Test extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <RangePicker
        // disabledDate={disabledDate}
        // disabledTime={disabledRangeTime}
        showTime={{
          hideDisabledOptions: true,
          // defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
        }}
        format={["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD HH"]}
      />
    );
  }
}

export default Test;