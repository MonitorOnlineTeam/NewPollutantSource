
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import MissingRateData from '../components/MissingRateData'

import { connect } from 'dva';

@connect(({  MissingRateData }) => ({
  type: MissingRateData.type,
}))
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'MissingRateData/updateState',
      payload: {type:'ent' },
    });
  
   }
  render() {
    return (
        <BreadcrumbWrapper>
           <MissingRateData types='ent' />
        </BreadcrumbWrapper>
    );
  }
}
                                                                                             