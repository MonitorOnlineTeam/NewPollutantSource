import React, { PureComponent } from 'react';
import { TimePicker } from 'antd';
import moment from 'moment';

class SdlTimePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (
      <TimePicker {...this.props}/>
    );
  }
}

export default SdlTimePicker;