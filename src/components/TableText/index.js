import React, { PureComponent } from 'react'

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <a
        {...this.props}
        title={this.props.content && this.props.content.length > 20 ? this.props.content : ''}>
        {this.props.content && this.props.content.length > 20 ? this.props.content.slice(0, 20) + '...' : this.props.content}
      </a>
    );
  }
}

export default index;