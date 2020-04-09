import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isopen: false,
      time: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      time: props.value
    }
  }

  render() {
    const { isopen, time } = this.state;
    return (
      <DatePicker
        // value={time}
        mode="year"
        format="YYYY"
        open={isopen}
        onOpenChange={(status) => {
          if (status) {
            this.setState({ isopen: true })
          } else {
            this.setState({ isopen: false })
          }
        }}
        onPanelChange={(v) => {
          this.setState({
            isopen: false,
          })
          this.props._onPanelChange && this.props._onPanelChange(v)
          // this.props.form.setFieldsValue({ "ReportTime": v })
        }}
        {...this.props}
      />
    );
  }
}

export default index;