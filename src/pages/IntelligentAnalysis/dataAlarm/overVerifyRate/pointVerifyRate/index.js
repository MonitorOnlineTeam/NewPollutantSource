import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import PointVerifyLst from './components/PointVerifyLst';

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}
  render() {
    return (
      <BreadcrumbWrapper>
        <PointVerifyLst RegionCode={this.props.location.query.regionCode} />
      </BreadcrumbWrapper>
    );
  }
}
