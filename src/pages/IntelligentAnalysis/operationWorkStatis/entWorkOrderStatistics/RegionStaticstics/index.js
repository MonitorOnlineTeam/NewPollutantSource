import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RegionStaticstics from '../components/RegionStaticstics'
class index extends PureComponent {
  render() {
    const {location} = this.props;
    return (
      <BreadcrumbWrapper>
          <RegionStaticstics location = {location}></RegionStaticstics>
      </BreadcrumbWrapper>
    );
  }
}

export default index;