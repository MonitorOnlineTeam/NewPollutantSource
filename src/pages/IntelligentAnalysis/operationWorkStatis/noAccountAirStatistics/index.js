
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import AirMissing from './components/airMissing';


export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {

  }
  render() {
    return (
      <BreadcrumbWrapper title="缺失台账工单统计">
      <AirMissing></AirMissing>
      </BreadcrumbWrapper>
    );
  }
}
