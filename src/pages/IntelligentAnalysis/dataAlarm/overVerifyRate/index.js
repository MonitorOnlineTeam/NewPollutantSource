import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import OverVerifyLst from './components/OverVerifyLst';

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}
  render() {
    return (
      <BreadcrumbWrapper>
        <OverVerifyLst />
      </BreadcrumbWrapper>
    );
  }
}
