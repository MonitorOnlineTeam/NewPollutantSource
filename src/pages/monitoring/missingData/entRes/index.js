
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import MissingResData from '../components/MissingResData'
import { connect } from 'dva';


@connect(({  missingData }) => ({
  type: missingData.type,
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
      type: 'missingData/updateState',
      payload: {type:'ent' },
    });
  
   }
  render() {
    return (
        <BreadcrumbWrapper title="数据缺失报警响应(企业)">
           <MissingResData types='ent'/>
        </BreadcrumbWrapper>
    );
  }
}
                                                                                             