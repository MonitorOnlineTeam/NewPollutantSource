import React, { PureComponent } from 'react'
import { Tooltip } from 'antd';
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Tooltip title={this.props.content}>
        {this.props.content && this.props.content.length > 12 ? this.props.content.slice(0, 12) + '...' : this.props.content}
      </Tooltip>
      // <a
      //   {...this.props}
      //   title={this.props.content && this.props.content.length > 20 ? this.props.content : ''}>
      // </a>
    );
  }
}

export default index;