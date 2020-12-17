import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntWorkOrderStatistics from './components/EntWorkOrderStatistics';
class index extends PureComponent {
  render() {
    return (
      <BreadcrumbWrapper>
          <EntWorkOrderStatistics></EntWorkOrderStatistics>
      </BreadcrumbWrapper>
    );
  }
}

export default index;
