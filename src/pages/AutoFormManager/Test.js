import React, { PureComponent } from 'react';

import { connect } from 'dva'
@connect()
class Test extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  componentDidMount() {
    
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId:'AEnterpriseTest',
      },
    });
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId:'AEnterpriseTest',
      },
    });
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId:'AEnterpriseTest',
      },
    });
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId:'AEnterpriseTest',
      },
    });
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId:'AEnterpriseTest',
      },
    });
  }
  
  render() {
    return (
      111
    );
  }
}

export default Test;