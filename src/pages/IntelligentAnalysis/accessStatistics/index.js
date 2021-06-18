
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import ContentPage from './components/ContentPage'
import { connect } from 'dva';
export default class RegionalAccountStatistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }

  componentDidMount() {
    const { dispatch } = this.props;
   }
  render() {
    return (
        <BreadcrumbWrapper title="运维区域账户访问率">
           <ContentPage {...this.props}/>
        </BreadcrumbWrapper>
    );
  }
}
                                                                                             